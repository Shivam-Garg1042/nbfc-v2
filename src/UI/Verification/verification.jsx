import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/verification.css';

function Verification() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const actionLabels = {
    risk: 'Risk verification',
    vehicle: 'Vehicle verification',
    credit: 'Credit verification',
    admin_recharge: 'Admin recharge',
  };
  const creditCosts = {
    risk: 10,
    vehicle: 20,
    credit: 50,
  };
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [riskFormData, setRiskFormData] = useState({ name: '', phone: '' });
  const [vehicleFormData, setVehicleFormData] = useState({ rcNumber: '' });
  const [creditFormData, setCreditFormData] = useState({ firstName: '', lastName: '', mobile: '', pan: '' });
  const [isVerifyingVehicle, setIsVerifyingVehicle] = useState(false);
  const [isVerifyingRisk, setIsVerifyingRisk] = useState(false);
  const [isVerifyingCredit, setIsVerifyingCredit] = useState(false);
  const [vehicleError, setVehicleError] = useState('');
  const [riskError, setRiskError] = useState('');
  const [creditError, setCreditError] = useState('');
  const [creditsHistory, setCreditsHistory] = useState([]);
  const [creditsBalance, setCreditsBalance] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [rechargeForm, setRechargeForm] = useState({ email: '', amount: '' });
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [rechargeMessage, setRechargeMessage] = useState('');

  const handleRiskImageClick = () => {
    setShowRiskModal(true);
  };

  const handleVehicleImageClick = () => {
    setShowVehicleModal(true);
  };

  const handleCreditImageClick = () => {
    setShowCreditModal(true);
  };

  const openCreditsModal = async () => {
    setShowCreditsModal(true);
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const response = await ApiService.getCreditsHistory({ limit: 20, offset: 0 });
      if (response.success) {
        setCreditsHistory(response.data.items || []);
        setCreditsBalance(response.data.credits ?? null);
      } else {
        setHistoryError(response.error || 'Unable to load credits history');
      }
    } catch (error) {
      setHistoryError(error.message || 'Unable to load credits history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();
    setRechargeMessage('');

    if (!rechargeForm.email.trim() || !rechargeForm.amount) {
      setRechargeMessage('Email and amount are required');
      return;
    }

    setRechargeLoading(true);

    try {
      const response = await ApiService.rechargeCredits(
        rechargeForm.email.trim(),
        Number(rechargeForm.amount)
      );

      if (response.success) {
        setRechargeMessage(`Credits updated. New balance: ${response.data.credits}`);
        setRechargeForm({ email: '', amount: '' });
        if (response.data?.credits !== undefined && response.data?.credits !== null) {
          setCreditsBalance(response.data.credits);
        }
        if (showCreditsModal) {
          openCreditsModal();
        }
      } else {
        setRechargeMessage(response.error || 'Unable to recharge credits');
      }
    } catch (error) {
      setRechargeMessage(error.message || 'Unable to recharge credits');
    } finally {
      setRechargeLoading(false);
    }
  };

  const handleRiskFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!riskFormData.name.trim() || !riskFormData.phone.trim()) {
      setRiskError('Please enter both name and phone number');
      return;
    }

    setIsVerifyingRisk(true);
    setRiskError('');

    try {
      const response = await ApiService.verifyRisk(riskFormData.name.trim(), riskFormData.phone.trim());
      
      if (response.success) {
        if (response.credits !== undefined && response.credits !== null) {
          setCreditsBalance(response.credits);
        }
        // Navigate to risk details page with data
        navigate('/risk-details', { 
          state: { riskData: response.data }
        });
        
        // Close modal and reset form
        setShowRiskModal(false);
        setRiskFormData({ name: '', phone: '' });
      } else {
        setRiskError(response.error || 'Risk score verification failed');
      }
    } catch (error) {
      console.error('Risk verification error:', error);
      
      // Handle different error types
      if (error?.data?.credits !== undefined && error?.data?.credits !== null) {
        setCreditsBalance(error.data.credits);
      }

      if (error.message.toLowerCase().includes('low credits')) {
        const currentCredits = error?.data?.credits;
        setRiskError(
          currentCredits !== undefined && currentCredits !== null
            ? `Low credits (${currentCredits}). Please recharge.`
            : 'Low credits. Please recharge.'
        );
      } else if (error.message.includes('401')) {
        setRiskError('Authentication required. Please login again.');
      } else if (error.message.includes('404')) {
        setRiskError('User not found. Please check the details.');
      } else if (error.message.includes('504')) {
        setRiskError('Service temporarily unavailable. Please try again later.');
      } else {
        setRiskError('Unable to verify risk score. Please try again.');
      }
    } finally {
      setIsVerifyingRisk(false);
    }
  };

  const handleVehicleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!vehicleFormData.rcNumber.trim()) {
      setVehicleError('Please enter a valid RC number');
      return;
    }

    setIsVerifyingVehicle(true);
    setVehicleError('');

    try {
      const response = await ApiService.verifyVehicle(vehicleFormData.rcNumber.trim());
      
      if (response.success) {
        if (response.credits !== undefined && response.credits !== null) {
          setCreditsBalance(response.credits);
        }
        // Navigate to vehicle details page with data
        navigate('/vehicle-details', { 
          state: { vehicleData: response.data }
        });
        
        // Close modal and reset form
        setShowVehicleModal(false);
        setVehicleFormData({ rcNumber: '' });
      } else {
        setVehicleError(response.error || 'Vehicle verification failed');
      }
    } catch (error) {
      console.error('Vehicle verification error:', error);
      
      // Handle different error types
      if (error?.data?.credits !== undefined && error?.data?.credits !== null) {
        setCreditsBalance(error.data.credits);
      }

      if (error.message.toLowerCase().includes('low credits')) {
        const currentCredits = error?.data?.credits;
        setVehicleError(
          currentCredits !== undefined && currentCredits !== null
            ? `Low credits (${currentCredits}). Please recharge.`
            : 'Low credits. Please recharge.'
        );
      } else if (error.message.includes('401')) {
        setVehicleError('Authentication required. Please login again.');
      } else if (error.message.includes('404')) {
        setVehicleError('Vehicle not found. Please check the RC number.');
      } else if (error.message.includes('504')) {
        setVehicleError('Service temporarily unavailable. Please try again later.');
      } else {
        setVehicleError('Unable to verify vehicle. Please try again.');
      }
    } finally {
      setIsVerifyingVehicle(false);
    }
  };

  const handleCreditFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!creditFormData.firstName.trim() || !creditFormData.lastName.trim() || 
        !creditFormData.mobile.trim() || !creditFormData.pan.trim()) {
      setCreditError('Please fill all required fields');
      return;
    }

    setIsVerifyingCredit(true);
    setCreditError('');

    try {
      const response = await ApiService.verifyCredit(
        creditFormData.firstName.trim(),
        creditFormData.lastName.trim(),
        creditFormData.mobile.trim(),
        creditFormData.pan.trim()
      );
      
      if (response.success) {
        if (response.credits !== undefined && response.credits !== null) {
          setCreditsBalance(response.credits);
        }
        // Navigate to credit details page with data
        navigate('/credit-details', { 
          state: { creditData: response.data }
        });
        
        // Close modal and reset form
        setShowCreditModal(false);
        setCreditFormData({ firstName: '', lastName: '', mobile: '', pan: '' });
      } else {
        setCreditError(response.error || 'Credit score verification failed');
      }
    } catch (error) {
      console.error('Credit verification error:', error);
      
      // Handle different error types
      if (error?.data?.credits !== undefined && error?.data?.credits !== null) {
        setCreditsBalance(error.data.credits);
      }

      if (error.message.toLowerCase().includes('low credits')) {
        const currentCredits = error?.data?.credits;
        setCreditError(
          currentCredits !== undefined && currentCredits !== null
            ? `Low credits (${currentCredits}). Please recharge.`
            : 'Low credits. Please recharge.'
        );
      } else if (error.message.includes('401')) {
        setCreditError('Authentication required. Please login again.');
      } else if (error.message.includes('404')) {
        setCreditError('Credit data not found. Please check the details.');
      } else if (error.message.includes('504')) {
        setCreditError('Service temporarily unavailable. Please try again later.');
      } else {
        setCreditError('Unable to verify credit score. Please try again.');
      }
    } finally {
      setIsVerifyingCredit(false);
    }
  };

  const closeModals = () => {
    setShowRiskModal(false);
    setShowVehicleModal(false);
    setShowCreditModal(false);
    setShowCreditsModal(false);
    setShowRechargeModal(false);
    setRiskFormData({ name: '', phone: '' });
    setVehicleFormData({ rcNumber: '' });
    setCreditFormData({ firstName: '', lastName: '', mobile: '', pan: '' });
    setRiskError('');
    setVehicleError('');
    setCreditError('');
    setHistoryError('');
    setRechargeMessage('');
  };

  return (
    <section className="verification-view">
        <div className="verification-content">
          <div className="verification-grid">
            {/* Risk Score Card - Clickable */}
            <div className="verification-card clickable" onClick={handleRiskImageClick}>
              <img 
                src="/images/RiskVerify.png" 
                alt="Risk Score" 
                className="verification-image"
              />
              <div className="card-overlay">
                <h3>Risk Score Verification</h3>
                <p>Click to verify user details</p>
              </div>
            </div>

            {/* Vehicle Details Card - Clickable */}
            <div className="verification-card clickable" onClick={handleVehicleImageClick}>
              <img 
                src="/images/VehicleVerify.png" 
                alt="Vehicle Details" 
                className="verification-image"
              />
              <div className="card-overlay">
                <h3>Vehicle Details Verification</h3>
                <p>Click to verify RC details</p>
              </div>
            </div>
            
            {/* Credit Score Card - Clickable */}
            <div className="verification-card clickable" onClick={handleCreditImageClick}>
              <img 
                src="/images/credit.png" 
                alt="Credit Score" 
                className="verification-image"
              />
              <div className="card-overlay">
                <h3>Credit Score Verification</h3>
                <p>Click to verify credit score details</p>
              </div>
            </div>
          </div>

          {/* Credit vs Karma Display Card */}
          <div className="credit-karma-section">
            <div className="verification-toolbar">
              <div className="credits-summary">
                <span className="credits-label">Credits</span>
                <span className="credits-value">{creditsBalance ?? user?.credits ?? 0}</span>
              </div>
              <div className="credits-actions">
                <button className="credits-btn" onClick={openCreditsModal}>View History</button>
                {isAdmin() && (
                  <button className="credits-btn secondary" onClick={() => setShowRechargeModal(true)}>
                    Recharge
                  </button>
                )}
              </div>
            </div>
            <img 
              src="/images/creditKarmaChart.png" 
              alt="Credit vs Karma Chart" 
              className="credit-karma-image"
            />
          </div>
        </div>

        {showCreditsModal && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content credits-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Credits History</h2>
                <button className="close-btn" onClick={closeModals}>×</button>
              </div>
              <div className="credits-modal-body">
                <div className="credits-balance">Current Balance: {creditsBalance ?? user?.credits ?? 0}</div>
                {historyLoading && (
                  <div className="credits-loading">Loading history...</div>
                )}
                {!historyLoading && historyError && (
                  <div className="credits-error">{historyError}</div>
                )}
                {!historyLoading && !historyError && (
                  <div className="credits-list">
                    {creditsHistory.length === 0 && (
                      <div className="credits-empty">No transactions in the last 90 days.</div>
                    )}
                    {creditsHistory.map((entry) => (
                      <div key={entry._id} className="credits-row">
                        <div className="credits-row-main">
                          <div className="credits-action">{actionLabels[entry.action] || entry.action}</div>
                          <div className="credits-time">
                            {new Date(entry.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className={`credits-delta ${entry.delta < 0 ? 'negative' : 'positive'}`}>
                          {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                        </div>
                        <div className="credits-balance-after">Balance: {entry.balanceAfter}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showRechargeModal && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Recharge Credits</h2>
                <button className="close-btn" onClick={closeModals}>×</button>
              </div>
              <form className="verification-form" onSubmit={handleRechargeSubmit}>
                <div className="form-group">
                  <label htmlFor="recharge-email">User Email</label>
                  <input
                    type="email"
                    id="recharge-email"
                    value={rechargeForm.email}
                    onChange={(e) => setRechargeForm({ ...rechargeForm, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recharge-amount">Credits</label>
                  <input
                    type="number"
                    id="recharge-amount"
                    min="1"
                    value={rechargeForm.amount}
                    onChange={(e) => setRechargeForm({ ...rechargeForm, amount: e.target.value })}
                    placeholder="Enter credit amount"
                    required
                  />
                </div>
                {rechargeMessage && (
                  <div className="credits-message">{rechargeMessage}</div>
                )}
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeModals}>
                    Cancel
                  </button>
                  <button type="submit" className="verify-btn" disabled={rechargeLoading}>
                    {rechargeLoading ? 'Recharging...' : 'Recharge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Risk Score Modal */}
        {showRiskModal && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Risk Score Verification</h2>
                <button className="close-btn" onClick={closeModals}>×</button>
              </div>
              <form onSubmit={handleRiskFormSubmit} className="verification-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={riskFormData.name}
                    onChange={(e) => {
                      setRiskFormData({...riskFormData, name: e.target.value});
                      setRiskError(''); // Clear error when user types
                    }}
                    placeholder="Enter full name"
                    required
                    disabled={isVerifyingRisk}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={riskFormData.phone}
                    onChange={(e) => {
                      setRiskFormData({...riskFormData, phone: e.target.value});
                      setRiskError(''); // Clear error when user types
                    }}
                    placeholder="Enter phone number (10 digits)"
                    required
                    disabled={isVerifyingRisk}
                  />
                  {riskError && (
                    <div className="error-message" style={{ 
                      color: '#ef4444', 
                      fontSize: '14px', 
                      marginTop: '5px',
                      padding: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px'
                    }}>
                      {riskError}
                    </div>
                  )}
                </div>
                <div className="credits-note">
                  Cost: {creditCosts.risk} credits. Minimum balance: 200.
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={closeModals}
                    disabled={isVerifyingRisk}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="verify-btn"
                    disabled={isVerifyingRisk}
                    style={{
                      backgroundColor: isVerifyingRisk ? '#9ca3af' : '',
                      cursor: isVerifyingRisk ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isVerifyingRisk ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vehicle Details Modal */}
        {showVehicleModal && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Vehicle Details Verification</h2>
                <button className="close-btn" onClick={closeModals}>×</button>
              </div>
              <form onSubmit={handleVehicleFormSubmit} className="verification-form">
                <div className="form-group">
                  <label htmlFor="rcNumber">RC Number</label>
                  <input
                    type="text"
                    id="rcNumber"
                    value={vehicleFormData.rcNumber}
                    onChange={(e) => {
                      setVehicleFormData({...vehicleFormData, rcNumber: e.target.value});
                      setVehicleError(''); // Clear error when user types
                    }}
                    placeholder="Enter RC number (e.g., DL01AB1234)"
                    required
                    disabled={isVerifyingVehicle}
                  />
                  {vehicleError && (
                    <div className="error-message" style={{ 
                      color: '#ef4444', 
                      fontSize: '14px', 
                      marginTop: '5px',
                      padding: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px'
                    }}>
                      {vehicleError}
                    </div>
                  )}
                </div>
                <div className="credits-note">
                  Cost: {creditCosts.vehicle} credits. Minimum balance: 200.
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={closeModals}
                    disabled={isVerifyingVehicle}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="verify-btn"
                    disabled={isVerifyingVehicle}
                    style={{
                      backgroundColor: isVerifyingVehicle ? '#9ca3af' : '',
                      cursor: isVerifyingVehicle ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isVerifyingVehicle ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Credit Score Modal */}
        {showCreditModal && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Credit Score Verification</h2>
                <button className="close-btn" onClick={closeModals}>×</button>
              </div>
              <form onSubmit={handleCreditFormSubmit} className="verification-form">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={creditFormData.firstName}
                    onChange={(e) => {
                      setCreditFormData({...creditFormData, firstName: e.target.value});
                      setCreditError(''); // Clear error when user types
                    }}
                    placeholder="Enter first name"
                    required
                    disabled={isVerifyingCredit}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={creditFormData.lastName}
                    onChange={(e) => {
                      setCreditFormData({...creditFormData, lastName: e.target.value});
                      setCreditError(''); // Clear error when user types
                    }}
                    placeholder="Enter last name"
                    required
                    disabled={isVerifyingCredit}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="creditMobile">Mobile Number</label>
                  <input
                    type="tel"
                    id="creditMobile"
                    value={creditFormData.mobile}
                    onChange={(e) => {
                      setCreditFormData({...creditFormData, mobile: e.target.value});
                      setCreditError(''); // Clear error when user types
                    }}
                    placeholder="Enter mobile number (10 digits)"
                    required
                    disabled={isVerifyingCredit}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pan">PAN Number</label>
                  <input
                    type="text"
                    id="pan"
                    value={creditFormData.pan}
                    onChange={(e) => {
                      setCreditFormData({...creditFormData, pan: e.target.value.toUpperCase()});
                      setCreditError(''); // Clear error when user types
                    }}
                    placeholder="Enter PAN number (e.g., ABCDE1234F)"
                    required
                    disabled={isVerifyingCredit}
                    maxLength="10"
                  />
                  {creditError && (
                    <div className="error-message" style={{ 
                      color: '#ef4444', 
                      fontSize: '14px', 
                      marginTop: '5px',
                      padding: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px'
                    }}>
                      {creditError}
                    </div>
                  )}
                </div>
                <div className="credits-note">
                  Cost: {creditCosts.credit} credits. Minimum balance: 200.
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={closeModals}
                    disabled={isVerifyingCredit}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="verify-btn"
                    disabled={isVerifyingCredit}
                    style={{
                      backgroundColor: isVerifyingCredit ? '#9ca3af' : '',
                      cursor: isVerifyingCredit ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isVerifyingCredit ? 'Generating Report...' : 'Verify Credit Score'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      
    </section>
  );
}

export default Verification;