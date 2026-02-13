import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Filters from '../../Helper/Filters'
import DetailCard from './DetailCard'
import '../../styles/Customer.css'
import IconCard from './IconCard'
import GridLayout from './GridLayout'
import DetailedInfo from './DetailedInfo'
import ApiService from '../../services/api.js'

function Customer() {
  const { driverId } = useParams();
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails();
    }
  }, [driverId]);

  const fetchDriverDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching driver details for ID:', driverId);
      const response = await ApiService.getDriverDetails(driverId);
      
      if (response.success && response.data) {
        setDriverData(response.data.driver);
        console.log('✅ Driver data loaded:', response.data.driver);
      } else {
        throw new Error(response.error || 'Failed to fetch driver details');
      }
    } catch (err) {
      console.error('❌ Error fetching driver details:', err);
      setError(err.message || 'Failed to load driver details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='area'>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          Loading driver details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='area'>
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className='area'>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          Driver not found
        </div>
      </div>
    );
  }

  return (
    <div className='area'>
      <DetailCard driverData={driverData} />
      <IconCard driverData={driverData} />
      <GridLayout driverData={driverData} />
      <DetailedInfo driverData={driverData} />
    </div>
  )
}

export default Customer