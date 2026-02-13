import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import '../../styles/Home.css';

// Simple Tailwind Skeleton for Overview Cards
const OverviewSkeleton = () => (
  <div className="overview-card animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="overview-stats">
      {[1, 2, 3].map(i => (
        <div key={i} className="stat-item">
          <div className="stat-icon">
            <div className="w-7 h-7 bg-gray-200 rounded"></div>
          </div>
          <div className="stat-content">
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function DriverOverviewCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getHomeOverview();
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Home Overview API Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return <OverviewSkeleton />;
  }

  // Error state - show default values
  if (error || !data) {
    console.warn('Using fallback data due to error:', error);
  }

  // Use API data or fallback to default values
  const displayData = data;

  return (
    <div className="overview-card">
      <h3 className="card-title">DRIVER'S OVERVIEW</h3>
      <div className="overview-stats">
        <div className="stat-item stat-orange">
          <div className="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FA7501">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h2 className="stat-number">{displayData.totalDrivers.toLocaleString()}</h2>
            <span className="stat-label">Drivers</span>
          </div>
        </div>
        
        <div className="stat-item stat-yellow">
          <div className="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFD425">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H18V0h-2v2H8V0H6v2H4.5C3.12 2 2 3.12 2 4.5v15C2 20.88 3.12 22 4.5 22h15c1.38 0 2.5-1.12 2.5-2.5v-15C22 3.12 20.88 2 19.5 2z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h2 className="stat-number">{displayData.emiOnTime}</h2>
            <span className="stat-label">EMI On Time</span>
          </div>
        </div>
        
        <div className="stat-item stat-green">
          <div className="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#119549">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h2 className="stat-number">{displayData.assetLoss}</h2>
            <span className="stat-label">Asset loss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
