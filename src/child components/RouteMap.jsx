import React from 'react';

export default function RouteMap() {
  const stopPoints = [
    { name: 'Statue Stop', x: 25, y: 15 },
    { name: 'Puri nagar', x: 75, y: 15 },
    { name: 'Patelpur', x: 85, y: 50 },
    { name: 'Govardhan', x: 50, y: 85 },
    { name: 'Bus Stop', x: 15, y: 50 }
  ];

  return (
    <>
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-64 h-64">
        {/* Route lines */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
          {stopPoints.map((point, index) => {
            const nextPoint = stopPoints[(index + 1) % stopPoints.length];
            return (
              <line 
                key={index}
                x1={point.x} 
                y1={point.y} 
                x2={nextPoint.x} 
                y2={nextPoint.y}
                stroke="#22c55e" 
                strokeWidth="0.5" 
                strokeDasharray="2" 
              />
            );
          })}
        </svg>

        {/* Stop points and labels */}
        {stopPoints.map((point, index) => (
          <div key={index} className="absolute" style={{ 
            top: `${point.y}%`, 
            left: `${point.x}%`, 
            transform: 'translate(-50%, -50%)' 
          }}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="absolute text-sm" style={{ 
              top: point.name === 'Patelpur' ? '-8px' : 
                   point.name === 'Govardhan' || point.name === 'Bus Stop' ? '8px' : '0px',
              right: point.name === 'Statue Stop' || point.name === 'Bus Stop' ? '100%' : 'auto',
              left: point.name === 'Puri nagar' || point.name === 'Patelpur' ? '100%' : 'auto',
              marginRight: point.name === 'Statue Stop' || point.name === 'Bus Stop' ? '8px' : '0px',
              marginLeft: point.name === 'Puri nagar' || point.name === 'Patelpur' ? '8px' : '0px',
              textAlign: point.name === 'Govardhan' ? 'center' : 'left',
              whiteSpace: 'nowrap',
              color: '#1e40af'
            }}>
              {point.name}
            </div>
          </div>
        ))}
      </div>

    </div>
      <div className="text-blue-500 cursor-pointer pl-10">View all</div>
    </>
  );
}