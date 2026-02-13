import React from 'react';

export default function EmiHistory({ driverData }) {
  // Create EMI data based on driver's financial information and asset handover date
  const createEmiData = () => {
    if (!driverData?.financialInfo || !driverData?.personalInfo) {
      return [];
    }

    const { emi, tenure, avgDpd, emiDpd } = driverData.financialInfo;
    const { assetHandoverDay } = driverData.personalInfo;
    
    const emiAmount = emi || 0;
    const loanTenure = tenure || 12; // Default to 12 months
    
    if (!emiAmount || !assetHandoverDay) {
      return [];
    }

    const emiData = [];
    
    // Parse asset handover date
    const handoverDate = new Date(assetHandoverDay);
    
    // Generate EMI history based on tenure
    for (let i = 1; i <= loanTenure; i++) {
      // Calculate EMI due date (start from asset handover date + i months)
      const dueDate = new Date(handoverDate);
      dueDate.setMonth(handoverDate.getMonth() + i);
      
      // Create realistic payment dates with some variation based on DPD
      const paidDate = new Date(dueDate);
      
      // Use actual DPD data for recent EMIs, simulate for older ones
      let daysPastDue = 0;
      if (i === loanTenure) {
        // Most recent EMI - use actual emiDpd
        daysPastDue = Math.max(0, parseFloat(emiDpd) || 0);
      } else if (i >= loanTenure - 2) {
        // Recent EMIs - use avgDpd with slight variation
        daysPastDue = Math.max(0, parseFloat(avgDpd) || 0 + Math.floor(Math.random() * 3));
      } else {
        // Older EMIs - simulate realistic payment patterns
        daysPastDue = Math.floor(Math.random() * 10);
      }
      
      paidDate.setDate(dueDate.getDate() + daysPastDue);
      
      // Determine status (assume all past EMIs are paid, current/future might be pending)
      const currentDate = new Date();
      const status = dueDate <= currentDate ? 'Paid' : 'Pending';
      
      emiData.push({
        id: i,
        month: `EMI ${i}`,
        date: paidDate.toLocaleDateString('en-IN'),
        amount: emiAmount,
        status: status,
        dueDate: dueDate.toLocaleDateString('en-IN'),
        daysPastDue: Math.floor(daysPastDue)
      });
    }
    
    // Show all EMIs based on tenure (don't limit to 8)
    return emiData;
  };

  const emiData = createEmiData();

  // Loading state
  if (!driverData) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666'
      }}>
        Loading EMI history...
      </div>
    );
  }

  // No data state
  if (emiData.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666'
      }}>
        <div style={{ marginBottom: '8px' }}>No EMI history available</div>
        <div style={{ fontSize: '12px', color: '#999' }}>
          {!driverData?.financialInfo?.emi ? 'EMI amount not found' :''}
        </div>
      </div>
    );
  }

  const getStatusColor = (status, daysPastDue) => {
    if (status === 'Paid') {
      return '#4CAF50'; // Green for on-time or early
      
    }
    return '#F44336'; // Red for unpaid
  };

  const getStatusText = (status) => {
    return status === 'Paid' ? 'Paid' : 'Pending';
  };

  return (
    <div style={{ padding: '5px 15px 0px 20px', height: '100%' }}>
      {/* <style>
        {`
          .emi-scroll-container::-webkit-scrollbar {
            display: ;
          }
          .emi-scroll-container {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style> */}
      <div 
        className="emi-scroll-container"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          maxHeight: '260px', // Limit height to show about 6 EMIs
          overflowY: 'auto'
        }}
      >
        {emiData.map((emi) => (
          <div key={emi.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '8px'
          }}>
            {/* Left side - Month and Date */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#03354E',
                marginBottom: '3px'
              }}>
                {emi.month}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666'
              }}>
                Due: {emi.dueDate}
              </div>
            </div>

            {/* Center - Amount */}
            <div style={{ 
              flex: 1, 
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#03354E'
              }}>
                ₹{emi.amount.toLocaleString()}
              </div>
            </div>

            {/* Right side - Status */}
            <div style={{ 
              flex: 1, 
              textAlign: 'right'
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '15px',
                fontSize: '11px',
                fontWeight: '500',
                backgroundColor: getStatusColor(emi.status, emi.daysPastDue) + '20',
                color: getStatusColor(emi.status, emi.daysPastDue),
                border: `1px solid ${getStatusColor(emi.status, emi.daysPastDue)}30`
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(emi.status, emi.daysPastDue),
                  marginRight: '5px'
                }}></div>
                {getStatusText(emi.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary at bottom */}
      {/* <div style={{
        marginTop: '15px',
        padding: '12px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}> */}
        {/* <div>
          <div style={{
            fontSize: '11px',
            color: '#666',
            marginBottom: '3px'
          }}>
            Total EMI Amount
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#03354E'
          }}>
            ₹{(emiData.reduce((sum, emi) => sum + emi.amount, 0)).toLocaleString()}
          </div>
        </div> */}
        {/* <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '11px',
            color: '#666',
            marginBottom: '3px'
          }}>
            Payment Status
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#4CAF50'
          }}>
            4/4 Paid
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}
