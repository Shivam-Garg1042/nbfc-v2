import { useState } from 'react';

export default function RiskScoreGauge({ score = 0 }) {
  // Risk score data
  const riskScore = score || 0;
  const maxScore = 900;
  const percentage = (riskScore / maxScore) * 100;
  
  // Color based on risk score (opposite to karma/credit - high risk = red, low risk = green)
  const getColorByScore = (score) => {
    if (score >= 700) return "#EF4444"; // Red for high risk (bad)
    if (score >= 500) return "#FF901A"; // Orange for medium risk
    return "#23BC64"; // Green for low risk (good)
  };
  
  const scoreColor = getColorByScore(riskScore);
  
  // Calculate the angle for the gauge - exactly 3/4 of a circle (270 degrees)
  // Starting from -225 degrees to 45 degrees
  const startAngle = -225;
  const maxAngle = 270; // Total sweep angle of the gauge (3/4 of a circle)
  const currentAngle = (percentage / 100) * maxAngle;
  const endAngle = startAngle + currentAngle;
  
  // Function to describe an arc path for SVG
  const describeArc = (x, y, radius, startAngleArg, endAngleArg) => {
    // Convert angles from degrees to radians
    const start = (startAngleArg * Math.PI) / 180;
    const end = (endAngleArg * Math.PI) / 180;
    
    // Calculate the start and end points
    const startX = x + radius * Math.cos(start);
    const startY = y + radius * Math.sin(start);
    const endX = x + radius * Math.cos(end);
    const endY = y + radius * Math.sin(end);
    
    // Determine if the arc should be drawn in a clockwise or counterclockwise direction
    const largeArcFlag = endAngleArg - startAngleArg <= 180 ? 0 : 1;
    
    // Create the SVG arc command
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: 240, height: 200 }}>
        <svg width="240" height="200" viewBox="0 0 240 200">
          {/* Background arc (light gray) */}
          <path 
            d={describeArc(120, 120, 90, startAngle, startAngle + maxAngle)} 
            fill="none" 
            stroke="#E9ECF1" 
            strokeWidth="16" 
            strokeLinecap="round"
          />
          
          {/* Progress arc (dynamic color based on risk score) */}
          <path 
            d={describeArc(120, 120, 90, startAngle, endAngle)} 
            fill="none" 
            stroke={scoreColor} 
            strokeWidth="16" 
            strokeLinecap="round"
          />
        </svg>

        {/* Center content with user icon and score - positioned slightly below center */}
        <div className="absolute" style={{ top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={scoreColor} stroke={scoreColor} strokeWidth="0.5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-lg font-medium">{riskScore}/900</p>
          </div>
        </div>
      </div>
    </div>
  );
}