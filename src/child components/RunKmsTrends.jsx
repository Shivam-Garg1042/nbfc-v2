import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const RunKmsTrends = ({ driverData }) => {
  // Create data from driver's run km information
  const createRunKmData = () => {
    

    const { thirdLast, secondLast, last } = driverData.runKmInfo;
    
    return [
      { name: 'Month 1', value: Math.round((thirdLast || 0) ) },
      { name: 'Month 2', value: Math.round((secondLast || 0)) },
      { name: 'Month 3', value: Math.round((last || 0) ) },
    ];
  };

  const data = createRunKmData();

  // Custom tooltip component that shows both value and kms amount
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow text-xs">
          <p className="font-medium">{`${payload[0].payload.name} `}</p>
          <p>{`Total Kms: ${payload[0].payload.value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Configure custom dot to display on hover with active dot highlight
  const CustomizedActiveDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={6} 
        fill="white" 
        stroke="#8884d8" 
        strokeWidth={2} 
      />
    );
  };

  return (
    <div className="w-full h-60 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: -12, bottom: -8 }}
          
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => `${value} km`}
            domain={[0, 'dataMax + 10']}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            strokeWidth={2}
            fill="url(#colorGradient)" 
            dot={false}
            activeDot={<CustomizedActiveDot />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RunKmsTrends;