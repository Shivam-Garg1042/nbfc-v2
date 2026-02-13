
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/CreditDetails.css';

function CreditDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const creditData = state?.creditData;

  if (!creditData) {
    return (
      <section className="credit-details-view">
        <div className="credit-details-container">
          <div className="error-state">
            <h2>No Credit Data Available</h2>
            <p>Please go back and try the verification again.</p>
            <button onClick={() => navigate('/verification')} className="back-btn">
              Back to Verification
            </button>
          </div>
        </div>
      </section>
    );
  }

  const getCreditScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 750) return '#22c55e'; // 750+ - Excellent (Green)
    if (numScore >= 650) return '#3b82f6'; // 650-749 - Good (Blue)
    if (numScore >= 550) return '#f59e0b'; // 550-649 - Fair (Yellow)
    if (numScore >= 450) return '#f97316'; // 450-549 - Poor (Orange)
    return '#ef4444'; // Below 450 - Very Poor (Red)
  };

  const getCreditLevel = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 750) return 'Excellent';
    if (numScore >= 650) return 'Good';
    if (numScore >= 550) return 'Fair';
    if (numScore >= 450) return 'Poor';
    return 'Very Poor';
  };

  const formatAttribute = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return value;
  };

  const handleDownloadReport = () => {
    if (creditData.creditReportLink) {
      window.open(creditData.creditReportLink, '_blank');
    }
  };

  return (
    <section className="credit-details-view">
      <div className="credit-details-container">
        <div className="credit-header">
          <h1>Credit Score Analysis</h1>
          <button onClick={() => navigate('/verification')} className="back-button">
            ← Back to Verification
          </button>
        </div>

        <div className="credit-content">
          {/* Main Credit Score Card */}
          <div className="credit-score-card">
            <div className="score-section">
              <div className="score-circle" style={{ borderColor: getCreditScoreColor(creditData.creditScore) }}>
                <span className="score-value" style={{ color: getCreditScoreColor(creditData.creditScore) }}>
                  {creditData.creditScore || 'N/A'}
                </span>
                <span className="score-label">Credit Score</span>
              </div>
              <div className="score-details">
                <h3 style={{ color: getCreditScoreColor(creditData.creditScore) }}>
                  {getCreditLevel(creditData.creditScore)}
                </h3>
                <div className="user-info">
                  <p><strong>Name:</strong> {creditData.header?.firstName} {creditData.header?.lastName}</p>
                  <p><strong>Mobile:</strong> {formatAttribute(creditData.header?.mobile)}</p>
                  <p><strong>PAN:</strong> {formatAttribute(creditData.header?.pan)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Report Actions */}
          <div className="credit-actions">
            <div className="action-card">
              <h3>📄 Credit Report</h3>
              <p>Download your detailed credit report to view complete credit history and analysis.</p>
              {creditData.creditReportLink ? (
                <button 
                  onClick={handleDownloadReport}
                  className="download-btn"
                >
                  Download Credit Report
                </button>
              ) : (
                <div className="no-report">Credit report not available</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CreditDetails;