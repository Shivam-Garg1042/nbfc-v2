import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import '../../styles/Home.css';

// Simple Tailwind Skeleton for NPS Chart
const NpsSkeleton = () => (
  <div className="nps-card animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="nps-chart">
      <div className="nps-bars">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="nps-bar-container">
            <div className="h-20 bg-gray-200 rounded w-full mb-2"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function NpsSatisfactionCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getHomeChartData('nps-satisfaction');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('NPS Satisfaction API Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return <NpsSkeleton />;
  }

  // Error state or no data - show error message
  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="nps-card">
        <h3 className="card-title">CUSTOMER SATISFACTION(NPS)</h3>
        <div className="nps-chart flex items-center justify-center h-64 text-gray-500 border border-gray-200 rounded-lg">
          <p>No NPS data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nps-card">
      <h3 className="card-title">CUSTOMER SATISFACTION(NPS)</h3>
      <div className="nps-chart">
        <div className="nps-bars">
          {data.map((item, idx) => (
            <div 
              key={idx} 
              className="nps-bar-container"
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{ position: 'relative' }}
            >
              <div 
                className="nps-bar"
                style={{
                  height: `${Math.max(item.percent * 4.2, 30)}px`,
                  background: item.percent > 0 
                    ? `linear-gradient(180deg, ${item.color} 0%, ${item.color}80 100%)`
                    : '#e5e7eb',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  transform: hoveredBar === idx ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredBar === idx ? `0 4px 12px ${item.color}40` : 'none'
                }}
              >
                {item.percent > 0 && (
                  <span className="nps-percentage">{item.percent}%</span>
                )}
              </div>
              <div className="nps-emoji">{item.emoji}</div>
              
              {/* Hover Tooltip */}
              {hoveredBar === idx && (
                <div 
                  className="nps-tooltip"
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    marginBottom: '5px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {item.driverCount} drivers ({item.percent}% - {item.rating || (5 - idx)}-star)
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '4px solid #333'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* <div className="nps-scale">
          <span className="scale-label">Detractors</span>
          <span className="scale-label">Passive</span>
          <span className="scale-label">Promoters</span>
        </div> */}
      </div>
    </div>
  );
}
