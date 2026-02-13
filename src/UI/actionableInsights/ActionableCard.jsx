import React, { useState, useEffect } from 'react';
import '../../styles/ProductDesc.css';
import IncreasigChart from '../../svg/IncreasigChart';
import image1 from '/images/Rectangle 34624487.png';
import genieImage from '/images/genie.png';
import ApiService from '../../services/api';
import { useNbfcFilter } from '../NBFCFilter/NbfcFilterContext';

function ActionableCard() {
  const { selectedNbfc } = useNbfcFilter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummaryData();
  }, [selectedNbfc]);

  const fetchSummaryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Fetching actionable insights summary...');
      console.log('🏢 NBFC Filter:', selectedNbfc);
      
      const response = await ApiService.getActionableInsightsSummary(selectedNbfc);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch summary data');
      }
    } catch (err) {
      console.error('❌ Error fetching summary:', err);
      setError(err.message || 'Failed to load summary data');
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className='product-top-card-actionable'>
        <div className="bottom-card">
          <div className="stats-container-actionable">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="stats-item animate-pulse">
                <div className="icon-container bg-gray-200"></div>
                <div className="text-container">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='product-top-card-actionable'>
        <div className="bottom-card">
          <div className="stats-container-actionable">
            <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
              Error: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use real data or fallback to 0
  const summaryData = data || {
    topDrivers: 0,
    bottomDrivers: 0,
    paymentOnTime: 0,
    paymentDelay: 0,
    likelyToDefault: 0
  };

  return (
    <div className='product-top-card-actionable' style={{ position: 'relative' }}>
      {/* Floating Genie Element */}
      <div style={{
        position: 'absolute',
        top: '78px',
        right: '20px',
       
        borderRadius: '50%',
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: 10,
        // animation: 'float 3s ease-in-out infinite',
        cursor: 'pointer'
      }}>
        <img 
          src={genieImage} 
          alt="PredictaCare AI" 
          style={{
            width: '90px',
            height: '136px',
            objectFit: 'contain'
          }}
          title="AI-Powered Insights"
        />
      </div>
      
      
      {/* Add floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    
    <div className="bottom-card">
    <div className="stats-container-actionable">
      {/* Active Drivers */}
      <div className="stats-item">
        <div className="icon-container green">
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
            <rect width="38" height="38" rx="19" fill="#EDFFF5"/>
            <path d="M8.94141 27.9366C8.94141 24.4094 11.7561 21.55 15.2282 21.55C18.7003 21.55 21.5149 24.4094 21.5149 27.9366H19.9432C19.9432 25.2912 17.8322 23.1467 15.2282 23.1467C12.6241 23.1467 10.5131 25.2912 10.5131 27.9366H8.94141ZM15.2282 20.7517C12.6231 20.7517 10.5131 18.6082 10.5131 15.9618C10.5131 13.3154 12.6231 11.1719 15.2282 11.1719C17.8333 11.1719 19.9432 13.3154 19.9432 15.9618C19.9432 18.6082 17.8333 20.7517 15.2282 20.7517ZM15.2282 19.1551C16.9649 19.1551 18.3716 17.7261 18.3716 15.9618C18.3716 14.1975 16.9649 12.7685 15.2282 12.7685C13.4915 12.7685 12.0848 14.1975 12.0848 15.9618C12.0848 17.7261 13.4915 19.1551 15.2282 19.1551Z" fill="#119549"/>
            <path d="M29.898 18.7146C29.898 19.8262 29.4564 20.8922 28.6704 21.6782C27.8844 22.4642 26.8184 22.9058 25.7068 22.9058C24.5952 22.9058 23.5292 22.4642 22.7432 21.6782C21.9572 20.8922 21.5156 19.8262 21.5156 18.7146C21.5156 17.603 21.9572 16.537 22.7432 15.751C23.5292 14.965 24.5952 14.5234 25.7068 14.5234C26.8184 14.5234 27.8844 14.965 28.6704 15.751C29.4564 16.537 29.898 17.603 29.898 18.7146ZM27.8181 17.1272C27.7807 17.0899 27.7361 17.0606 27.6871 17.0409C27.6381 17.0212 27.5856 17.0116 27.5328 17.0127C27.4799 17.0138 27.4279 17.0255 27.3797 17.0471C27.3315 17.0688 27.2882 17.0999 27.2523 17.1387L25.4328 19.457L24.3363 18.3599C24.2618 18.2905 24.1633 18.2527 24.0615 18.2545C23.9597 18.2563 23.8626 18.2976 23.7906 18.3696C23.7186 18.4416 23.6774 18.5387 23.6756 18.6405C23.6738 18.7423 23.7116 18.8408 23.781 18.9153L25.1672 20.302C25.2045 20.3393 25.249 20.3687 25.2979 20.3884C25.3469 20.4081 25.3993 20.4178 25.4521 20.4168C25.5048 20.4158 25.5568 20.4042 25.605 20.3827C25.6532 20.3612 25.6965 20.3302 25.7325 20.2915L27.8239 17.6773C27.8952 17.6032 27.9346 17.504 27.9336 17.4012C27.9326 17.2983 27.8913 17.2 27.8186 17.1272H27.8181Z" fill="#119549"/>
          </svg>
        </div>
        <div className="text-container">
          <span className="label">Top Drivers (Karma)</span>
          <span className="value">{summaryData.topDrivers.toLocaleString()}</span>
        </div>
      </div>

      {/* Newly Added Drivers */}
      <div className="stats-item">
        <div className="icon-container blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
            <rect width="38" height="38" rx="19" fill="#EFF6FF"/>
            <path d="M8.94141 27.9366C8.94141 24.4094 11.7561 21.55 15.2282 21.55C18.7003 21.55 21.5149 24.4094 21.5149 27.9366H19.9432C19.9432 25.2912 17.8322 23.1467 15.2282 23.1467C12.6241 23.1467 10.5131 25.2912 10.5131 27.9366H8.94141ZM15.2282 20.7517C12.6231 20.7517 10.5131 18.6082 10.5131 15.9618C10.5131 13.3154 12.6231 11.1719 15.2282 11.1719C17.8333 11.1719 19.9432 13.3154 19.9432 15.9618C19.9432 18.6082 17.8333 20.7517 15.2282 20.7517ZM15.2282 19.1551C16.9649 19.1551 18.3716 17.7261 18.3716 15.9618C18.3716 14.1975 16.9649 12.7685 15.2282 12.7685C13.4915 12.7685 12.0848 14.1975 12.0848 15.9618C12.0848 17.7261 13.4915 19.1551 15.2282 19.1551Z" fill="#3B82F6"/>
            <circle cx="25.7068" cy="18.7146" r="4.1912" fill="#3B82F6"/>
            <path d="M25.707 16.0234V21.4058" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23.0156 18.7146H28.3981" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="text-container">
          <span className="label">Bottom Drivers (Karma)</span>
          <span className="value">{summaryData.bottomDrivers.toLocaleString()}</span>
        </div>
      </div>

      {/* On-Time Payers */}
      <div className="stats-item">
        <div className="icon-container blue-light smaller">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" fill="transparent" />
            <path d="M12 6V12L16 14" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-container">
          <span className="label">Payment on time</span>
          <span className="value">{summaryData.paymentOnTime.toLocaleString()}</span>
        </div>
      </div>

      {/* Irregular Payer */}
      <div className="stats-item">
        <div className="icon-container yellow smaller">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2" fill="transparent" />
            <path d="M12 6V12L16 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-container">
          <span className="label">Payment Delay</span>
          <span className="value">{summaryData.paymentDelay.toLocaleString()}</span>
        </div>
      </div>

      {/* Defaulters */}
      <div className="stats-item">
        <div className="icon-container red smaller">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" fill="transparent" />
            <path d="M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-container">
          <span className="label">Likely to Default</span>
          <span className="value">{summaryData.likelyToDefault.toLocaleString()}</span>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default ActionableCard