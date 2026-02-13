import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from '@react-google-maps/api';
import ApiService from '../services/api';

// Move API key to environment variable for security
const GOOGLE_MAPS_API_KEY = 'AIzaSyByWS2RlWw3JJyvScuXtITwzxFf9tMlQ18' ;

const RouteModal = ({ isOpen, onClose, batteryId, driverName }) => {
  const [routeData, setRouteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi center

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  }); 

  useEffect(() => {
    if (isOpen && batteryId) {
      console.log('RouteModal opened with batteryId:', batteryId);
      fetchRoute();
    } else if (isOpen && !batteryId) {
      console.log('RouteModal opened but no batteryId provided');
      setError('No battery ID provided to fetch route data');
    }
  }, [isOpen, batteryId]);

  const fetchRoute = useCallback(async () => {
    console.log('🚀 Starting fetchRoute with batteryId:', batteryId);
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Calling API with batteryId:', batteryId);
      const response = await ApiService.getDriverRoute(batteryId);
      console.log('📥 API response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        console.log('✅ Setting route data:', response.data);
        setRouteData(response.data);
        // Set map center to the middle of the route
        const midPoint = Math.floor(response.data.length / 2);
        setMapCenter(response.data[midPoint]);
      } else {
        console.log('⚠️ No GPS data available');
        setError(response.message || 'No GPS data available for this route');
        setRouteData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching route data:', error);
      setError('Failed to load route data. Please check your connection and try again.');
      setRouteData([]);
    } finally {
      console.log('🏁 fetchRoute completed, setting loading to false');
      setLoading(false);
    }
  }, [batteryId]);

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-3xl shadow-4xl w-full max-w-4xl mx-4 max-h-[100vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 px-4 ">
          <h2 className="text-xl font-semibold">
            Driver Route - {driverName}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Map */}
        <div className="">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Route Data Available</h3>
                
              </div>
            </div>
          ) : !isLoaded ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Loading Google Maps...</div>
            </div>
          ) : (
            <div className="h-96 rounded-lg overflow-hidden border">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={routeData.length > 0 ? 14 : 10}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: true,
                  mapTypeId: 'roadmap',
                  styles: [
                    {
                      featureType: 'poi',
                      elementType: 'labels',
                      stylers: [{ visibility: 'on' }]
                    }
                  ]
                }}
              >
                  {/* Route Line */}
                  {routeData.length > 1 && (
                    <PolylineF
                      path={routeData}
                      options={{
                        strokeColor: '#2563eb',
                        strokeOpacity: 0.8,
                        strokeWeight: 3
                      }}
                    />
                  )}

                  {/* Start Marker */}
                  {routeData.length > 0 && (
                    <MarkerF
                      position={routeData[0]}
                      title="Start"
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#10b981',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 8
                      }}
                    />
                  )}

                  {/* End Marker */}
                  {routeData.length > 1 && (
                    <MarkerF
                      position={routeData[routeData.length - 1]}
                      title="End"
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#ef4444',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 8
                      }}
                    />
                  )}
                </GoogleMap>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center space-x-6 p-2  bg-gray-50">
          <span className="text-sm text-gray-600">🟢 Start</span>
          <span className="text-sm text-gray-600">🔵 Route</span>
          <span className="text-sm text-gray-600">🔴 End</span>
          {/* <span className="text-sm text-gray-600">📍 {routeData.length} GPS Points</span> */}
        </div>
      </div>
    </div>
  );
};

export default RouteModal;