import React from 'react';
// import { DownloadIcon2 } from '../svg/DownloadIcon2';

export default function ActivitiesByLocations() {
  const vehicleData = [
    {
      type: "Two wheelers",
      count: 3650,
      activePayers: 3540,
      irregularPayers: 110,
      color: "#10b981"
    },
    {
      type: "Three wheelers", 
      count: 3650,
      activePayers: 3540,
      irregularPayers: 110,
      color: "#10b981"
    },
    {
      type: "Batteries",
      count: 250,
      activePayers: 3540,
      irregularPayers: 110,
      color: "#10b981"
    }
  ];

  const mapMarkers = [
    { id: 1, lat: 28.7041, lng: 77.1025, type: 'red' },
    { id: 2, lat: 28.6139, lng: 77.2090, type: 'red' },
    { id: 3, lat: 28.5355, lng: 77.3910, type: 'red' },
    { id: 4, lat: 28.4595, lng: 77.0266, type: 'red' },
    { id: 5, lat: 28.6692, lng: 77.4538, type: 'red' },
    { id: 6, lat: 28.7041, lng: 76.9063, type: 'red' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Activities By Locations
        </h3>
        <button className="p-2 hover:bg-gray-100 rounded">
          {/* <DownloadIcon2 /> */}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Map Section */}
        <div className="flex-1 relative">
          <div className="w-full h-64 bg-gray-100 rounded-lg relative overflow-hidden">
            {/* Map Background - You can replace this with actual map integration */}
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23e8f5e8'/%3E%3Cpath d='M50 50 Q100 20 150 50 T250 50 Q300 80 350 50' stroke='%23d1d5db' stroke-width='2' fill='none'/%3E%3Cpath d='M30 80 Q80 110 130 80 T230 80 Q280 110 330 80' stroke='%23d1d5db' stroke-width='2' fill='none'/%3E%3Cpath d='M70 120 Q120 150 170 120 T270 120 Q320 150 370 120' stroke='%23d1d5db' stroke-width='2' fill='none'/%3E%3C/svg%3E")`
              }}
            >
              {/* Location Markers */}
              {mapMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 70 + 15}%`
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ))}
              
              {/* Compass */}
              <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600">N</span>
                  <div className="absolute w-6 h-6 border border-gray-300 rounded-full">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-gray-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="w-80 space-y-4">
          {vehicleData.map((vehicle, index) => (
            <div key={index} className="border-l-4 pl-4" style={{ borderColor: vehicle.color }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg" style={{ color: vehicle.color }}>
                  {vehicle.count} {vehicle.type}
                </h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Payers</span>
                  <span className="font-semibold text-gray-800">{vehicle.activePayers}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Irregular Payers</span>
                  <span className="font-semibold text-gray-800">{vehicle.irregularPayers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
