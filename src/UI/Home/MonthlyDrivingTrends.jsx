import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ApiService from '../../services/api';
import '../../styles/Home.css';

// Simple Tailwind Skeleton for Bar Chart
const BarChartSkeleton = () => (
  <div className="trends-card animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
    <div className="chart-container">
      <div className="h-60 bg-gray-100 rounded p-4">
        <div className="flex justify-between items-end h-40">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-8 bg-gray-200 rounded h-20"></div>
              <div className="w-8 bg-gray-200 rounded h-16"></div>
              <div className="w-8 bg-gray-200 rounded h-12"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="chart-legend">
      {payload.map((entry, index) => (
        <div key={index} className="legend-item">
          <div 
            className="legend-color" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="legend-text">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MonthlyDrivingTrends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthColumns, setMonthColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getHomeChartData('monthly-driving');
        const chartData = response.data;
        setData(chartData);
        
        // Extract dynamic month columns from the data
        if (chartData && chartData.length > 0) {
          const firstDataPoint = chartData[0];
          const months = Object.keys(firstDataPoint).filter(key => key !== 'name');
          setMonthColumns(months);
          console.log('📅 Dynamic months detected:', months);
        }
        
        setError(null);
      } catch (err) {
        console.error('Monthly Driving Trends API Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return <BarChartSkeleton />;
  }

  // Error state or no data - show error message
  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="trends-card">
        <h3 className="card-title">MONTHLY DRIVING TRENDS(KM/DAY)</h3>
        <div className="chart-container flex items-center justify-center h-64 text-gray-500 border border-gray-200 rounded-lg">
          <p>No driving trends data available</p>
        </div>
      </div>
    );
  }

  // Dynamic colors for bars - cycle through predefined colors
  const barColors = ['#49D07B', '#06B6D4', '#FBBF24', '#F97316', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="trends-card">
      <h3 className="card-title">MONTHLY DRIVING TRENDS(KM/DAY)</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 20, left: 4, bottom: 40 }}
            barCategoryGap="15%"
          >
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              label={{ value: 'Drivers (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name]}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
            <Legend 
              content={<CustomLegend />} 
              
            />
            {/* Dynamic Bar components based on detected months */}
            {monthColumns.map((month, index) => (
              <Bar 
                key={month}
                dataKey={month} 
                fill={barColors[index % barColors.length]} 
                radius={[2, 2, 0, 0]}
                name={month}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
