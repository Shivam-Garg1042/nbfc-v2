import { useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
} from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// Mock GPS data for demonstration
const mockGpsData = [
  { lat: 28.6139, lng: 77.2090, activity: 'High' }, // Delhi
  { lat: 28.6304, lng: 77.2177, activity: 'Medium' }, // Connaught Place
  { lat: 28.5355, lng: 77.3910, activity: 'High' }, // Noida
  { lat: 28.4595, lng: 77.0266, activity: 'Low' }, // Gurgaon
  { lat: 28.7041, lng: 77.1025, activity: 'Medium' }, // North Delhi
  { lat: 28.5244, lng: 77.1855, activity: 'High' }, // South Delhi
  { lat: 28.6692, lng: 77.4538, activity: 'Low' }, // Ghaziabad
  { lat: 28.4089, lng: 77.3178, activity: 'Medium' }, // Faridabad
];

export default function ActivitiesByLocationsMap({ width = "100%", height = "300px" }) {
  const [showMarkers, setShowMarkers] = useState(false);

  useEffect(() => {
    // Delay plotting markers by 2 seconds for better UX
    const timer = setTimeout(() => {
      setShowMarkers(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <GoogleMapComponent showMarkers={showMarkers} width={width} height={height} />;
}

function GoogleMapComponent({ showMarkers, width, height }) {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return (
      <div style={{
        width,
        height,
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ color: '#6b7280', fontSize: '14px' }}>Loading map...</div>
      </div>
    );
  }

  const getMarkerColor = (activity) => {
    switch (activity) {
      case 'High': return '#dc2626'; // Red
      case 'Medium': return '#f59e0b'; // Yellow
      case 'Low': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={{
          width,
          height,
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
        }}
        center={{ lat: 28.6139, lng: 77.2090 }}
        zoom={10}
        onLoad={(map) => { mapRef.current = map; }}
        options={options}
      >
        {showMarkers && mockGpsData.map((location, index) => (
          <MarkerF
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            icon={{
              url: `data:image/svg+xml;utf-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" fill="${getMarkerColor(location.activity)}" stroke="#ffffff" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(20, 20),
            }}
            title={`Activity Level: ${location.activity}`}
          />
        ))}
      </GoogleMap>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* <div style={{ fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Activity Levels</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }}></div>
            <span style={{ color: '#6b7280' }}>High</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <span style={{ color: '#6b7280' }}>Medium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            <span style={{ color: '#6b7280' }}>Low</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
