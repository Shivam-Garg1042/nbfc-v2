import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ApiService from '../../services/api';
import '../../styles/Home.css';

// Simple Tailwind Skeleton for Pie Chart
const PieChartSkeleton = () => (
  <div className="emi-trends-card animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="pie-chart-container">
      <div className="flex items-center justify-center h-52">
        <div className="w-40 h-40 rounded-full border-8 border-gray-200">
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
      <div className="pie-legend">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="pie-legend-item">
            <div className="w-3 h-3 bg-gray-200 rounded pie-legend-color"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
  if (name === '<=7') {
    return (
      <text 
        x={cx} 
        y={cy} 
        fill="#3B82F6" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="24"
        fontWeight="700"
      >
        {/* {value}% */}
      </text>
    );
  }
  return null;
};

export default function EmiTrendsPie() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getHomeChartData('emi-pie');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('EMI Trends Pie API Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return <PieChartSkeleton />;
  }

  

  const displayData = data;

  return (
    <div className="emi-trends-card">
      <h3 className="card-title">EMI TRENDS(DAYS)</h3>
      <div className="pie-chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={84}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} %`, name]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-legend">
          {displayData.map((entry, index) => (
            <div key={index} className="pie-legend-item">
              <div 
                className="pie-legend-color"
                style={{ backgroundColor: entry.color }}
              />
              <span className="pie-legend-text">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
