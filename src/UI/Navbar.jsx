import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './../styles/Navbar.css'
import Notify from '../svg/notifications'
import { useAuth } from '../contexts/AuthContext'
import { useNbfcFilter } from './NBFCFilter/NbfcFilterContext'

// Constants moved outside component to prevent re-creation
const NBFC_LOGOS = {
  'Mega Corp': '/images/nbfc5.png',
  'AMU': '/images/logo.png',
  'Ascend': '/images/nbfc1.png', 
  'Shivakari': '/images/nbfc4.png',
  'SVCL': '/images/nbfc12.jpg',
  'all': '/images/Chargeup Logo_white jpg.jpg'
};

// Organization name mapping (from backend to display names)
const ORGANIZATION_TO_NBFC = {
  'chargeup': 'all',
  'megacorp': 'Mega Corp',
  'ascend': 'Ascend',
  'shivakari': 'Shivakari',
  'svcl': 'SVCL',
  'amu': 'AMU'
};

const NBFC_OPTIONS = [
  { value: 'all', label: 'All NBFCs' },
  { value: 'Mega Corp', label: 'Mega Corp' },
  { value: 'AMU', label: 'AMU' },
  { value: 'Ascend', label: 'Ascend' }, 
  { value: 'Shivakari', label: 'Shivakari' },
  { value: 'SVCL', label: 'SVCL' }
];



// Individual logo styles for better appearance
const getLogoStyle = (logoSrc) => {
  const baseStyle = {
    objectFit: 'contain',
    transition: 'all 0.3s ease',
    
  };

  // Customize based on logo type
  if (logoSrc.includes('nbfc1.png')) { // Ascend
    return { ...baseStyle, height: '65px', width: 'auto' };
  } else if (logoSrc.includes('nbfc4.png')) { // Shivakari
    return { ...baseStyle, height: '70px', width: 'auto' };
  } else if (logoSrc.includes('nbfc5.png')) { // Mega Corp
    return { ...baseStyle, height: '50px', width: 'auto' };
  } else if (logoSrc.includes('nbfc12.jpg')) { // SVCL
    return { ...baseStyle, height: '50px', width: '100px' };
  } else if (logoSrc.includes('logo.png')) { // AMU
    return { ...baseStyle, height: '46px', width: 'auto' };
  } else if (logoSrc.includes('Chargeup Logo_white jpg.jpg')) { // ChargeUp
    return { ...baseStyle, height: '44px', width: 'auto' };
  }
  
  // Default fallback
  return { ...baseStyle, height: '45px', width: 'auto' };
};

function Navbar() {
  const { isChargeUpUser, user } = useAuth();
  const { selectedNbfc, selectNbfc } = useNbfcFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside - memoized for performance
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleNbfcChange = useCallback((nbfcValue) => {
    selectNbfc(nbfcValue);
    setIsFilterOpen(false);
  }, [selectNbfc]);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  // Memoized computed values
  const currentLabel = useMemo(() => {
    const option = NBFC_OPTIONS.find(opt => opt.value === (selectedNbfc || 'all'));
    return option?.label || 'All NBFCs';
  }, [selectedNbfc]);

  // Always show ChargeUp logo
  const logoInfo = useMemo(() => {
    return {
      logoSrc: NBFC_LOGOS['all'],
      logoAlt: 'ChargeUp Logo'
    };
  }, []);

  // NBFC logo info for when NBFC user is logged in
  const nbfcLogoInfo = useMemo(() => {
    if (user?.role === 'nbfc' && user?.organization) {
      const orgKey = user.organization.toLowerCase();
      const nbfcKey = ORGANIZATION_TO_NBFC[orgKey] || 'all';
      const logoSrc = NBFC_LOGOS[nbfcKey] || NBFC_LOGOS['all'];
      const logoAlt = `${nbfcKey === 'all' ? 'ChargeUp' : nbfcKey} Logo`;
      return { logoSrc, logoAlt, nbfcName: nbfcKey };
    }
    return null;
  }, [user?.role, user?.organization]);

  return (
    <nav className='nav sticky'>
      <div className="clubbed">
        {/* Always show ChargeUp logo */}
        <img 
          src={logoInfo.logoSrc} 
          alt={logoInfo.logoAlt} 
          className='logo'
          style={getLogoStyle(logoInfo.logoSrc)}
        />
        
      </div>
      
      <div className="wrapper">
        {/* NBFC Filter for ChargeUp/Admin users only */}
        {isChargeUpUser && (
          <div className="nbfc-filter-navbar" ref={dropdownRef}>
            <button 
              className="nbfc-filter-btn"
              onClick={toggleFilter}
              aria-label="Select NBFC filter"
              aria-expanded={isFilterOpen}
            >
              <span className="filter-icon" aria-hidden="true">🏢</span>
              <span className="filter-text">{currentLabel}</span>
              <span className={`filter-arrow ${isFilterOpen ? 'open' : ''}`} aria-hidden="true">▼</span>
            </button>
            
            {isFilterOpen && (
              <div className="nbfc-dropdown" role="menu">
                {NBFC_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`nbfc-option ${(selectedNbfc || 'all') === option.value ? 'active' : ''}`}
                    onClick={() => handleNbfcChange(option.value)}
                    role="menuitem"
                    aria-current={(selectedNbfc || 'all') === option.value ? 'true' : 'false'}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NBFC Logo for NBFC users only (replaces dropdown position) */}
        {!isChargeUpUser && nbfcLogoInfo && (
          <div className="nbfc-logo-display">
            <img 
              src={nbfcLogoInfo.logoSrc} 
              alt={nbfcLogoInfo.logoAlt} 
              
              style={getLogoStyle(nbfcLogoInfo.logoSrc)}
            />
          </div>
        )}
        
        <div className='icon'>
          <Notify />
        </div>
      </div>
    </nav>
  )
}

export default Navbar