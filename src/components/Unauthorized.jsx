import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#dc2626', marginBottom: '16px' }}>Access Denied</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        You don't have permission to access this page.
      </p>
      <Link 
        to="/home" 
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600'
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;