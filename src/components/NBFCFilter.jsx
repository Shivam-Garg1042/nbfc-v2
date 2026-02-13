import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/NBFCFilter.css';

const NBFCFilter = ({ selectedNBFC, onNBFCChange }) => {
  const { isChargeUpUser, user } = useAuth();

  // Don't show filter for NBFC users
  if (!isChargeUpUser) {
    return null;
  }

  const nbfcOptions = [
    { value: 'all', label: 'All NBFCs' },
    { value: 'amu', label: 'AMU' },
    { value: 'ascend', label: 'Ascend' },
    { value: 'megacorp', label: 'Mega Corp' },
    { value: 'shivakari', label: 'Shivakari' },
    { value: 'svcl', label: 'SVCL' }
  ];

  return (
    <div className="nbfc-filter-container">
      <div className="filter-header">
        <span className="filter-label">Filter by NBFC:</span>
        <span className="user-info">
          Logged in as: {user?.email} ({user?.role})
        </span>
      </div>
      
      <select 
        value={selectedNBFC} 
        onChange={(e) => onNBFCChange(e.target.value)}
        className="nbfc-filter-select"
      >
        {nbfcOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NBFCFilter;