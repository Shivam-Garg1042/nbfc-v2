import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import '../../styles/Home.css';

// Simple Tailwind Skeleton for Matrix
const MatrixSkeleton = () => (
  <div className="karma-card animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="karma-matrix">
      <div className="matrix-header">
        <span></span>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded w-16"></div>
        ))}
      </div>
      <div className="matrix-content">
        {[1, 2, 3].map(row => (
          <div key={row} className="matrix-row">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            {[1, 2, 3].map(col => (
              <div key={col} className="h-8 bg-gray-200 rounded matrix-value"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function CreditVsKarmaCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getHomeMatrixData('credit-vs-karma');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Credit vs Karma Matrix API Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return <MatrixSkeleton />;
  }

  // Error state - show default values
  if (error || !data) {
    console.warn('Using fallback data due to error:', error);
  }

  // Use API data or fallback to default values
  const displayData = data;

  return (
    <div className="karma-card">
      <h3 className="card-title white">CREDIT VS KARMA</h3>
      <div className="karma-matrix">
        <div className="matrix-header">
          <span></span>
          <span className="header-high">High<br/>Credit(&gt;650)</span>
          <span className="header-medium">Medium<br/>Credit(400-650)</span>
          <span className="header-low">Low<br/>Credit(&lt;400)</span>
        </div>
        <div className="matrix-content">
          <div className="matrix-row">
            <span className="karma-label high-karma">High Karma <br></br>(&gt;700)</span>
            <div className="matrix-value">{displayData.highKarma[0]}%</div>
            <div className="matrix-value">{displayData.highKarma[1]}%</div>
            <div className="matrix-value">{displayData.highKarma[2]}%</div>
          </div>
          <div className="matrix-row">
            <span className="karma-label medium-karma">Medium Karma <br></br>(500-700)</span>
            <div className="matrix-value">{displayData.mediumKarma[0]}%</div>
            <div className="matrix-value">{displayData.mediumKarma[1]}%</div>
            <div className="matrix-value">{displayData.mediumKarma[2]}%</div>
          </div>
          <div className="matrix-row">
            <span className="karma-label low-karma">Low Karma<br></br> (&lt;500)</span>
            <div className="matrix-value">{displayData.lowKarma[0]}%</div>
            <div className="matrix-value">{displayData.lowKarma[1]}%</div>
            <div className="matrix-value">{displayData.lowKarma[2]}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
