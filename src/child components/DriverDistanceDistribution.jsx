import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ApiService from '../services/api';
import { useNbfcFilter } from '../UI/NBFCFilter/NbfcFilterContext';

export default function DriverDistanceDistribution() {
  const { selectedNbfc } = useNbfcFilter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const nbfcFilter = selectedNbfc || 'all';
        const response = await ApiService.getChartData('driver-distance', nbfcFilter);
        
        if (response?.data && response.data.length > 0) {
          setData(response.data);
        } 
        
      } catch (error) {
        console.error('Failed to fetch driver distance data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedNbfc]);

  const CustomLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-col space-y-2 text-sm">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-3 rounded-sm mr-3" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };


  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="flex items-center justify-between pl-4">
          <div className="w-58 h-58">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gray-200 animate-pulse relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ml-8 p-4 mr-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg ">
      <div className="mb-0">
        
        {/* <p className="text-sm text-gray-500">
          Drivers categorized by
          their daily driving
          distance.
        </p> */}
      </div>
      
      <div className="flex items-center justify-between pl-4">
        <div className="w-58 h-58">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                innerRadius={70}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="ml-8 p-4 mr-2">
          <CustomLegend payload={data.map(item => ({ value: item.name, color: item.color }))} />
        </div>
      </div>
    </div>
  );
}
