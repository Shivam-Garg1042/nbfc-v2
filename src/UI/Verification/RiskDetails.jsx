import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaAmazon, 
  FaPaypal,
} from 'react-icons/fa';
import { 
  SiFlipkart, 
  SiSwiggy, 
  SiPaytm,
  SiByjus
} from 'react-icons/si';
import { 
  MdHome, 
  MdBusiness, 
  MdSportsEsports,
  MdFlight
} from 'react-icons/md';
import { IoGameController } from 'react-icons/io5';
import { GiCommercialAirplane } from 'react-icons/gi';
import '../../styles/RiskDetails.css';

function RiskDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const riskData = state?.riskData;

  if (!riskData) {
    return (
      <section className="risk-details-view">
        <div className="risk-details-container">
          <div className="error-state">
            <h2>No Risk Data Available</h2>
            <p>Please go back and try the verification again.</p>
            <button onClick={() => navigate('/verification')} className="back-btn">
              Back to Verification
            </button>
          </div>
        </div>
      </section>
    );
  }

  const getRiskScoreColor = (score) => {
    if (score >= 751) return '#ef4444'; // 751-999 - Red
    if (score >= 601) return '#f97316'; // 601-750 - Orange  
    if (score >= 501) return '#eab308'; // 501-600 - Yellow
    if (score >= 401) return '#22c55e'; // 401-500 - Green
    return '#22c55e'; // 0-400 - Green
  };

  const getRiskLevel = (score) => {
    if (score >= 751) return 'Very High Risk';
    if (score >= 601) return 'High Risk';
    if (score >= 501) return 'Medium Risk';
    if (score >= 401) return 'Low Risk';
    return 'Very Low Risk';
  };

  const getConfidenceColor = (confidence) => {
    const conf = confidence?.toLowerCase();
    if (conf === 'high' || conf === 'very high') return '#10b981';
    if (conf === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.startsWith('91') ? phone.substring(2) : phone;
  };

  const formatAttribute = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
      return value.toLowerCase() === 'true' ? 'Yes' : 'No';
    }
    return value;
  };

  // Social media icon mapping
  const getSocialMediaIcon = (platform) => {
    const iconMap = {
      whatsapp: <FaWhatsapp className="social-icon whatsapp" />,
      instagram: <FaInstagram className="social-icon instagram" />,
      amazon: <FaAmazon className="social-icon amazon" />,
      flipkart: <SiFlipkart className="social-icon flipkart" />,
      swiggy: <SiSwiggy className="social-icon swiggy" />,
      paytm: <SiPaytm className="social-icon paytm" />,
      byjus: <SiByjus className="social-icon byjus" />,
      housing: <MdHome className="social-icon housing" />,
      indiamart: <MdBusiness className="social-icon indiamart" />,
      a23games: <IoGameController className="social-icon a23games" />,
      my11: <MdSportsEsports className="social-icon my11" />,
      rummycircle: <IoGameController className="social-icon rummycircle" />,
      yatra: <GiCommercialAirplane className="social-icon yatra" />,
      jeevansaathi: <MdBusiness className="social-icon jeevansaathi" />,
      shaadi: <MdBusiness className="social-icon shaadi" />,
      jiomart: <MdBusiness className="social-icon jiomart" />,
      ajio: <MdBusiness className="social-icon ajio" />
    };
    return iconMap[platform.toLowerCase()] || <MdBusiness className="social-icon default" />;
  };

  // Filter social media platforms where user is present
  const getActiveSocialPlatforms = (socialData) => {
    if (!socialData) {
      return [];
    }
    
    return Object.entries(socialData).filter(([platform, presence]) => {
      return presence === 'Account Found';
    });
  };

  return (
    <section className="risk-details-view">
      <div className="risk-details-container">
        <div className="risk-header">
          <h1>Risk Score Analysis</h1>
          <button onClick={() => navigate('/verification')} className="back-button">
            ← Back to Verification
          </button>
        </div>

        <div className="risk-content">
          {/* Main Risk Score Card */}
          <div className="risk-score-card">
            <div className="score-section">
              <div className="score-circle" style={{ borderColor: getRiskScoreColor(riskData.riskScore) }}>
                <span className="score-value" style={{ color: getRiskScoreColor(riskData.riskScore) }}>
                  {riskData.riskScore || 'N/A'}
                </span>
                <span className="score-label">Risk Score</span>
              </div>
              <div className="score-details">
                <h3 style={{ color: getRiskScoreColor(riskData.riskScore) }}>
                  {getRiskLevel(riskData.riskScore)}
                </h3>
                <div className="user-info">
                  <p><strong>Name:</strong> {riskData.header?.name || 'N/A'}</p>
                  <p><strong>Phone:</strong> {formatPhoneNumber(riskData.header?.mobile)}</p>
                  
                </div>
              </div>
            </div>
          </div>

        {/* Insights Section */}
        <div className="insights-section">
          <div className="insight-card positive">
            <h3>✅ Positive Indicators</h3>
            <div className="insight-list">
              {riskData.insights?.positives?.length > 0 ? (
                riskData.insights.positives.map((insight, index) => (
                  <div key={index} className="insight-item">{insight}</div>
                ))
              ) : (
                <div className="no-data">No positive indicators found</div>
              )}
            </div>
          </div>

          <div className="insight-card negative">
            <h3>⚠️ Risk Indicators</h3>
            <div className="insight-list">
              {riskData.insights?.negatives?.length > 0 ? (
                riskData.insights.negatives.map((insight, index) => (
                  <div key={index} className="insight-item">{insight}</div>
                ))
              ) : (
                <div className="no-data">No risk indicators found</div>
              )}
            </div>
          </div>
        </div>

        {/* Risk Assessment Grid */}
        <div className="risk-assessment-grid">
          {/* Identity Assessment */}
          <div className="assessment-card">
            <h3>🆔 Identity Assessment</h3>
            <div className="assessment-content">
              <div className="confidence-indicator">
                <span className="label">Identity Confidence:</span>
                <span 
                  className="confidence-badge"
                  style={{ 
                    backgroundColor: getConfidenceColor(riskData.riskAssessment?.identity?.identityConfidence),
                    color: 'white'
                  }}
                >
                  {formatAttribute(riskData.riskAssessment?.identity?.identityConfidence)}
                </span>
              </div>
            </div>
          </div>

          {/* Telecom Assessment */}
          <div className="assessment-card">
            <h3>📱 Telecom Assessment</h3>
            <div className="assessment-content">
              <div className="attribute-row">
                <span>Phone Reachable:</span>
                <span>{formatAttribute(riskData.riskAssessment?.telecom?.isPhoneReachable)}</span>
              </div>
              <div className="attribute-row">
                <span>Network:</span>
                <span>{formatAttribute(riskData.riskAssessment?.telecom?.currentNetworkName)}</span>
              </div>
              <div className="attribute-row">
                <span>Telecom Risk:</span>
                <span>{formatAttribute(riskData.riskAssessment?.telecom?.telecomRisk)}</span>
              </div>
              <div className="attribute-row">
                <span>Phone Footprint:</span>
                <span>{formatAttribute(riskData.riskAssessment?.telecom?.phoneFootprintStrength)}</span>
              </div>
            </div>
          </div>

          {/* Digital Assessment */}
          <div className="assessment-card">
            <h3>💻 Digital Footprint</h3>
            <div className="assessment-content">
              <div className="attribute-row">
                <span>Digital Footprint:</span>
                <span>{formatAttribute(riskData.riskAssessment?.digital?.digitalFootprint)}</span>
              </div>
              <div className="attribute-row">
                <span>Name Match Score:</span>
                <span>{formatAttribute(riskData.riskAssessment?.digital?.nameMatchScore)}</span>
              </div>
              <div className="attribute-row">
                <span>Phone Digital Age:</span>
                <span>{formatAttribute(riskData.riskAssessment?.digital?.phoneDigitalAge)}</span>
              </div>
            </div>
          </div>

          {/* Social Assessment */}
          <div className="assessment-card">
            <h3>🌐 Social Footprint</h3>
            <div className="assessment-content">
              <div className="attribute-row">
                <span>Social Score:</span>
                <span>{formatAttribute(riskData.riskAssessment?.social?.socialFootprintScore)}</span>
              </div>
              <div className="attribute-row">
                <span>Social Media Count:</span>
                <span>{formatAttribute(riskData.riskAssessment?.social?.phoneSocialMediaCount)}</span>
              </div>
              <div className="attribute-row">
                <span>E-Commerce Score:</span>
                <span>{formatAttribute(riskData.riskAssessment?.social?.eCommerceScore)}</span>
              </div>
              <div className="attribute-row">
                <span>Work Utility Score:</span>
                <span>{formatAttribute(riskData.riskAssessment?.social?.workUtilityScore)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Attributes */}
        <div className="detailed-attributes">
          <h2>Detailed Analysis</h2>
          
          {/* Telecom Details */}
          <div className="detail-section">
            <h3>Telecom Details</h3>
            <div className="detail-grid">
              {Object.entries(riskData.detailedAttributes?.telecom || {}).map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-key">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span className="detail-value">{formatAttribute(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Details */}
          <div className="detail-section">
            <h3>Digital Details</h3>
            <div className="detail-grid">
              {Object.entries(riskData.detailedAttributes?.digital || {}).map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-key">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span className="detail-value">{formatAttribute(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Presence */}
          <div className="detail-section">
            <h3>Social Media Presence</h3>
            <div className="social-media-icons">
              {getActiveSocialPlatforms(riskData.detailedAttributes?.social).length > 0 ? (
                getActiveSocialPlatforms(riskData.detailedAttributes?.social).map(([platform, presence]) => (
                  <div key={platform} className="social-platform">
                    {getSocialMediaIcon(platform)}
                    <span className="platform-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                  </div>
                ))
              ) : (
                <div className="no-social-data">No active social media accounts found</div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default RiskDetails;