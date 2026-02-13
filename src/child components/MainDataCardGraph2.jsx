import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import ApiService from '../services/api';
import { useNbfcFilter } from '../UI/NBFCFilter/NbfcFilterContext';

const MainDataCardGraph2 = () => {
  const { selectedNbfc } = useNbfcFilter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const nbfcFilter = selectedNbfc || 'all';
        const response = await ApiService.getChartData('disbursement-trend', nbfcFilter);
        
        if (response?.data) {
          setData(response.data);
        } 
      } catch (error) {
        console.error('Failed to fetch disbursement chart data:', error);
        // Use fallback data on error
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedNbfc]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow-lg text-xs" style={{ border: "none" }}>
          <p className="font-medium text-gray-600">{`Month: ${label}`}</p>
          <p className="font-medium text-gray-600">{`₹${(payload[0].value/100000).toFixed(2)}L Drivers ${dataPoint.drivers || 0} `}</p>
          
        </div>
      );
    }
    return null;
  };

  // Skeleton component
  const ChartSkeleton = () => (
    <div className="w-full h-60 bg-white rounded-lg p-4">
      <div className="w-full h-full flex flex-col">
        {/* Skeleton chart area */}
        <div className="flex-1 relative">
          {/* Y-axis skeleton */}
          <div className="absolute left-0 top-0 h-full w-8 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-2 w-6 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          
          {/* Chart bars skeleton */}
          <div className="ml-10 mr-6 h-full flex items-end justify-between space-x-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div 
                  className="w-8 bg-gray-200 rounded animate-pulse"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                ></div>
                <div className="h-2 w-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* X-axis skeleton */}
        <div className="flex justify-between mt-2 px-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-2 w-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <div className="w-full h-60 bg-white rounded-lg p-4 ">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 24, left: 0, bottom: 12 }}
        >
          {/* Vertical reference line for November */}
          {/* <ReferenceLine x="Nov" stroke="#e5e7eb" strokeDasharray="3 3" /> */}

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dy={10}
            textAnchor="middle"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => `₹${parseFloat(value/100000).toFixed(0)}L`}
            domain={[0, 28]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
          />
        

          
          <Line
            type="monotone"
            dataKey="totalLoans"
            stroke="#32CD32"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 6,
              fill: "white",
              stroke: "#32CD32",
              strokeWidth: 2
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainDataCardGraph2;