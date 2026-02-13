import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import '../../styles/Home.css';

// Simple Tailwind Skeleton for Matrix
const MatrixSkeleton = () => (
  <div className="risk-card animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="risk-matrix">
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

export default function CreditVsRiskCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getHomeMatrixData('credit-vs-risk');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Credit vs Risk Matrix API Error:', err);
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
  const displayData = data ;

  return (
    <div className="risk-card">
      <h3 className="card-title white">CREDIT VS RISK</h3>
      <div className="risk-matrix">
        <div className="matrix-header">
          <span></span>
          <span className="header-high">High<br/>Credit(&gt;650)</span>
          <span className="header-medium">Medium<br/>Credit(400-650)</span>
          <span className="header-low">Low<br/>Credit(&lt;400)</span>
        </div>
        <div className="matrix-content">
          <div className="matrix-row">
            <span className="risk-label low-risk">Low Risk<br></br> (&lt;450)</span>
            <div className="matrix-value">{displayData.lowRisk[0]}%</div>
            <div className="matrix-value">{displayData.lowRisk[1]}%</div>
            <div className="matrix-value">{displayData.lowRisk[2]}%</div>
          </div>
          <div className="matrix-row">
            <span className="risk-label medium-risk">Medium Risk<br></br> (450-650)</span>
            <div className="matrix-value">{displayData.mediumRisk[0]}%</div>
            <div className="matrix-value">{displayData.mediumRisk[1]}%</div>
            <div className="matrix-value">{displayData.mediumRisk[2]}%</div>
          </div>
          <div className="matrix-row">
            <span className="risk-label high-risk">High Risk <br></br>(&gt;650)</span>
            <div className="matrix-value">{displayData.highRisk[0]}%</div>
            <div className="matrix-value">{displayData.highRisk[1]}%</div>
            <div className="matrix-value">{displayData.highRisk[2]}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
