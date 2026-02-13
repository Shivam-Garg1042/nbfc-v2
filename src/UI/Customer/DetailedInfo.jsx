import React, { useState } from 'react';
import '../../styles/DetailedInfo.css'

const DetailedInfo = ({ driverData }) => {
  const [activeTab, setActiveTab] = useState('Personal Details');
  
  if (!driverData) {
    return <div className="app-container">Loading...</div>;
  }
  
  const tabs = [
    'Personal Details',
    'Vehicle Details',
    'Contact Details',
    'Financial Details'
  ];

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} Yrs`;
  };

  return (
    <div className="app-container">
      <h2>Customer Detailed Information</h2>
      <div className="tabs-container">
        {tabs.map(tab => (
          <div 
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      
      <div className="content-container">
        {activeTab === 'Personal Details' && (
          <div className="grid-details-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{driverData.personalInfo?.fullName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth</span>
                <span className="detail-value">{driverData.personalInfo?.dob || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age</span>
                <span className="detail-value">{calculateAge(driverData.personalInfo?.dob)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Gender</span>
                <span className="detail-value">{driverData.personalInfo?.gender || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Marital Status</span>
                <span className="detail-value">{driverData.personalInfo?.maritalStatus || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">No of Children</span>
                <span className="detail-value">{driverData.personalInfo?.noOfChildren || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Aadhaar Number</span>
                <span className="detail-value">{driverData.contactInfo?.aadhaar || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">PAN Number</span>
                <span className="detail-value">{driverData.contactInfo?.pan || 'N/A'}</span>
              </div>
              
            </div>
          </div>
        )}

        {activeTab === 'Vehicle Details' && (
          <div className="grid-details-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Vehicle Type</span>
                <span className="detail-value">{driverData.vehicleInfo?.vehicleType || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Registration Number</span>
                <span className="detail-value">{driverData.vehicleInfo?.registrationNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Model</span>
                <span className="detail-value">{driverData.vehicleInfo?.model || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Service Type</span>
                <span className="detail-value">{driverData.vehicleInfo?.serviceType || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Registration Date</span>
                <span className="detail-value">{driverData.vehicleInfo?.registrationDate || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Age</span>
                <span className="detail-value">{driverData.vehicleInfo?.ageInMonths || 0} months</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Financed</span>
                <span className="detail-value">{driverData.vehicleInfo?.vehicleFinanced || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Contact Details' && (
          <div className="grid-details-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Mobile Number</span>
                <span className="detail-value">{driverData.contactInfo?.mobile || 'N/A'}</span>
              </div>
              
              
              <div className="detail-item">
                <span className="detail-label">Permanent Address</span>
                <span className="detail-value">{driverData.personalInfo?.permanentAddress || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">City</span>
                <span className="detail-value">{driverData.personalInfo?.city || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">State</span>
                <span className="detail-value">{driverData.personalInfo?.state || 'N/A'}</span>
              </div>
              {/* <div className="detail-item">
                <span className="detail-label">Phone FootPrint</span>
                <span className="detail-value">{driverData.footprintsAndRisk?.phoneFootPrint || 'N/A'}</span>
              </div> */}
            </div>
          </div>
        )}

        {activeTab === 'Financial Details' && (
          <div className="grid-details-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Bank Account Number</span>
                <span className="detail-value">{driverData.financialInfo?.bankAccountNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">IFSC Code</span>
                <span className="detail-value">{driverData.financialInfo?.ifscCode || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">VPA</span>
                <span className="detail-value">{driverData.contactInfo?.vpa || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Down Payment</span>
                <span className="detail-value">₹{(driverData.financialInfo?.downPayment || 0).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tenure</span>
                <span className="detail-value">{driverData.financialInfo?.tenure || 0} months</span>
              </div>
              
              {/* <div className="detail-item">
                <span className="detail-label">EMI Amount</span>
                <span className="detail-value">₹{(driverData.financialInfo?.emi || 0).toLocaleString()}</span>
              </div> */}
              
              <div className="detail-item">
                <span className="detail-label">Social Score</span>
                <span className="detail-value">{driverData.riskInfo?.socialScore || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Identity Confidence</span>
                <span className="detail-value">{driverData.riskInfo?.identityConfidence || 0} </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Telecom Risk</span>
                <span className="detail-value">{driverData.riskInfo?.telecomRisk || 0} </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedInfo;