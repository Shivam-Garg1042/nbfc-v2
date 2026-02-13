import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/actionableInsights.css';
import { BiTachometer } from 'react-icons/bi';
import { FaMapMarkedAlt } from "react-icons/fa";
import ActionableCard from './ActionableCard';
import ApiService from '../../services/api';
import { useNbfcFilter } from '../NBFCFilter/NbfcFilterContext';
import RouteModal from '../../components/RouteModal.jsx';
import Last7DaysModal from '../../components/Last7DaysModal.jsx';

const formatDriverName = (rawName) => {
  if (!rawName) {
    return 'Unknown';
  }

  const words = rawName
    .toString()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return words.length ? words.join(' ') : 'Unknown';
};
function ActionableInsights() {
  const navigate = useNavigate();
  const { selectedNbfc } = useNbfcFilter();
  const [allDrivers, setAllDrivers] = useState([]); // Store all drivers for search
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Likely To Default');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalDrivers, setTotalDrivers] = useState(0);
  
  // Modal state for driver route
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedDriverForRoute, setSelectedDriverForRoute] = useState(null);
  
  // Modal state for last 7 days KM
  const [isLast7DaysModalOpen, setIsLast7DaysModalOpen] = useState(false);
  const [selectedDriverForLast7Days, setSelectedDriverForLast7Days] = useState(null);
  
  const driversPerPage = 6;

  // Filter options
  const predictiveFilters = [
    'Likely To Default',
    'Payment On Time',
    'Payment Delay'
  ];

  const performanceFilters = [
    'Bottom Drivers(Karma)',
    'Top Drivers(Karma)'
  ];

  // Fetch drivers data from API
  useEffect(() => {
    fetchDriversData();
  }, [activeFilter, selectedNbfc]); // Remove currentPage from dependencies

  // Handle search and pagination locally
  useEffect(() => {
    handleSearchAndPagination();
  }, [allDrivers, searchTerm, currentPage]);

  const fetchDriversData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching all actionable insights data for global search...');
      console.log('🏢 NBFC Filter:', selectedNbfc);
      
      // Simple NBFC mapping for case sensitivity (same as LoanDriversList)
      let nbfcValue = '';
      if (selectedNbfc && selectedNbfc !== 'all') {
        if (selectedNbfc.toLowerCase() === 'mega corp') {
          nbfcValue = 'megaCorp';
        } else if (selectedNbfc.toLowerCase() === 'svcl') {
          nbfcValue = 'SVCL';
        } else {
          nbfcValue = selectedNbfc.toLowerCase();
        }
      }
      
      // Fetch all data (large limit to get everything)
      const response = await ApiService.getActionableInsights({
        actionable: activeFilter,
        actionableInsights: nbfcValue,
        offset: 0,
        limit: 2000 // Large limit to get all data
      });

      console.log('✅ Actionable Insights API Response:', response);

      if (response.success && response.data) {
        setAllDrivers(response.data.drivers);
        setTotalDrivers(response.data.total);
        setCurrentPage(1); // Reset to first page when filter changes
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('❌ Error fetching actionable insights:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination based on filtered data
  const totalPages = Math.ceil(totalDrivers / driversPerPage);
  const currentDrivers = drivers; // Already paginated by handleSearchAndPagination

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSearchTerm(''); // Clear search when changing filter
    // Page will be reset to 1 in fetchDriversData
  };

  // Reset page when NBFC filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedNbfc]);

  // Handle search and pagination locally
  const handleSearchAndPagination = () => {
    // Filter drivers based on search term (search across all data)
    const filteredDrivers = allDrivers.filter(driver => 
      driver.driverId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.productId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.batteryId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone?.includes(searchTerm)
    );

    // Calculate pagination for filtered results
    const startIndex = (currentPage - 1) * driversPerPage;
    const endIndex = startIndex + driversPerPage;
    const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

    // Update state
    setDrivers(paginatedDrivers);
    setTotalDrivers(filteredDrivers.length);
  };

  // Navigation and modal handlers
  const handleDriverClick = (driverId) => {
    navigate(`/customer/${driverId}`);
  };

  const handleRouteClick = (e, driver) => {
    e.stopPropagation(); // Prevent row click navigation
    setSelectedDriverForRoute(driver);
    setIsRouteModalOpen(true);
  };

  const handleCloseRouteModal = () => {
    setIsRouteModalOpen(false);
    setSelectedDriverForRoute(null);
  };

  const handleLast7DaysClick = (e, driver) => {
    e.stopPropagation(); // Prevent row click navigation
    setSelectedDriverForLast7Days(driver);
    setIsLast7DaysModalOpen(true);
  };

  const handleCloseLast7DaysModal = () => {
    setIsLast7DaysModalOpen(false);
    setSelectedDriverForLast7Days(null);
  };


  

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <section className="actionable-insights-view">
        <ActionableCard />
        <div className="actionable-insights-loading-container">
          <div className="actionable-insights-loading-text">Loading drivers data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="actionable-insights-view">
        <ActionableCard />
        <div className="actionable-insights-loading-container">
          <div className="actionable-insights-loading-text" style={{ color: '#ef4444' }}>
            Error: {error}
          </div>
          <button 
            onClick={() => fetchDriversData()} 
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="actionable-insights-view">
      <ActionableCard />
      {/* Header with Search and Filter Buttons */}
      <div className="actionable-insights-main-header">
        

      <div className="header-left-section">
          <div className="filter-groups">
            {/* Predictive Section */}
            <div className="filter-group">
              <span className="filter-group-label">Predictive</span>
              <div className="filter-buttons-row">
                {predictiveFilters.map((filter) => (
                  <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Section */}
            <div className="filter-group">
              <span className="filter-group-label">Performance</span>
              <div className="filter-buttons-row">
                {performanceFilters.map((filter) => (
                  <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="header-right-section ml-30 mt-4">
          
          
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Driver ID, Name or Phone..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
        </div>
      </div>
      

      

        {/* Driver Cards Container */}
        <div className="drivers-container">
          {/* Header Row */}
          <div className="drivers-header">
            <div className="driver-header">Driver Id</div>
            <div className="actionable-name-header">Name</div>
            <div className="product-id-header">Product Type</div>
            <div className="product-id-header">Battery ID</div>
            
            
            <div className="run-kms-header">Mobile</div>
            <div className="avg-dpd-header">Last 7 days Kms</div>
            <div className="service-header">Driver Route</div>
            <div className="nps-header">Status</div>
              <div className="nps-header">Action</div>
          </div>
          
          {/* Driver Cards */}
          {currentDrivers.map((driver, index) => (
            <div 
              key={driver.driverId} 
              className="driver-card"
              onClick={() => handleDriverClick(driver.driverId)}
              style={{ cursor: 'pointer' }}
            >
              <div className="driver-text-cell">{driver.driverId}</div>
              <div className="driver-name-cell">
                {formatDriverName(driver.name)}
              </div>
              <div className="driver-text-cell">
                {driver.productId}
              </div>
              <div className="driver-text-cell">
                {driver.batteryId}
              </div>
              <div className="driver-text-cell">
                <div className="details">{driver.phone}</div>
              </div>
              <div 
                className="score-container"
                onClick={(e) => handleLast7DaysClick(e, driver)}
                style={{ cursor: 'pointer' }}
                title="View Last 7 Days KM & Battery Control"
              >
                <BiTachometer size ={24} color = {"#22c55e"} style={{ margin: '0 auto', display: 'block' ,alignItems:'center',alignContent : 'center'}} />
              </div>
              <div 
                className="score-container"
                onClick={(e) => handleRouteClick(e, driver)}
                style={{ cursor: 'pointer' }}
                title="View Driver Route"
              >
                <FaMapMarkedAlt size ={20} color = {"#3B82F6"} style={{ margin: '0 auto', display: 'block' ,alignItems:'center',alignContent : 'center'}} />  
              </div>
              <div className="driver-text-cell">
                <div className="details">{driver.status}</div>
              </div>
              <div className="driver-text-cell">
                <div className="details">{driver.action}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="actionable-insights-pagination">
          <div className="actionable-insights-pagination-info">
            Showing {((currentPage - 1) * driversPerPage) + 1} to {Math.min(currentPage * driversPerPage, totalDrivers)} of {totalDrivers} results
          </div>
          <div className="actionable-insights-pagination-controls">
            <button 
              className="actionable-insights-pagination-btn nav-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`actionable-insights-pagination-btn page-number ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            
            <button 
              className="actionable-insights-pagination-btn nav-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      
      {/* Driver Route Modal */}
      <RouteModal 
        isOpen={isRouteModalOpen}
        onClose={handleCloseRouteModal}
        batteryId={selectedDriverForRoute?.batteryId}
        driverName={selectedDriverForRoute?.name || 'Unknown Driver'}
      />
      
      {/* Last 7 Days KM Modal */}
      <Last7DaysModal 
        isOpen={isLast7DaysModalOpen}
        onClose={handleCloseLast7DaysModal}
        batteryId={selectedDriverForLast7Days?.batteryId}
        driverName={selectedDriverForLast7Days?.name || 'Unknown Driver'}
      />
    </section>
  );
}

export default ActionableInsights;