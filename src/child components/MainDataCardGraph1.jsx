import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useNbfcFilter } from '../UI/NBFCFilter/NbfcFilterContext';
import ApiService from '../services/api';

// Simple Tailwind Skeleton
const ChartSkeleton = () => (
  <div className="w-full h-60 p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="flex h-40 gap-2">
      <div className="w-8 bg-gray-200 rounded"></div>
      <div className="flex-1 bg-gray-100 rounded relative">
        <div className="absolute top-8 left-4 right-4 h-0.5 bg-purple-200 rounded"></div>
        <div className="absolute top-16 left-8 right-8 h-0.5 bg-purple-200 rounded"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded mt-2"></div>
  </div>
);

const MainDataCardGraph1 = () => {
  const { selectedNbfc } = useNbfcFilter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simple state management
        if (!data) {
          setLoading(true);
        } else {
          setUpdating(true);
        }
        
        const response = await ApiService.getChartData('login-overview', selectedNbfc);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load chart');
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    };

    fetchData();
  }, [selectedNbfc]);

  // Simple Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-md text-xs border">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
          <p className="text-gray-600">{`Disbursed: ${payload[0].payload.disbursed}`}</p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return <ChartSkeleton />;
  }

  // Error state
  if (error || !data) {
    return (
      <div className="w-full h-60 flex items-center justify-center text-gray-500 border border-gray-200 rounded-lg">
        <p>Unable to load chart</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-60 rounded-lg p-2 relative ${updating ? 'opacity-70' : ''}`}>
      {updating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg z-10">
          <div className="text-sm text-gray-600">Updating...</div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
            domain={[0, 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            strokeWidth={2}
            fill="url(#colorGradient)" 
            dot={false}
            activeDot={{ r: 6, fill: "white", stroke: "#8884d8", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainDataCardGraph1;