import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoanDriversList.css'
import KarmaScoreChart from '../../Helper/KarmaScoreChart.jsx';
import RiskScoreChart from '../../Helper/RiskScoreChart.jsx';
import Ticksvg from '../../svg/Ticksvg.jsx';
import Crosssvg from '../../svg/Crosssvg.jsx';
import { BiTachometer } from "react-icons/bi";
import { FaMapMarkedAlt } from "react-icons/fa";
import ApiService from '../../services/api.js';
import { useNbfcFilter } from '../NBFCFilter/NbfcFilterContext.jsx';
import RouteModal from '../../components/RouteModal.jsx';
import Last7DaysModal from '../../components/Last7DaysModal.jsx';
import { FaUser } from "react-icons/fa6";

const formatDriverName = (rawName) => {
  if (!rawName) {
    return 'Unknown Driver';
  }

  const words = rawName
    .toString()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return words.length ? words.join(' ') : 'Unknown Driver';
};

export default function  LoanDriverList() {
  const navigate = useNavigate();
  const { selectedNbfc } = useNbfcFilter();
  
  // Component state (like actionable insights)
  const [allDrivers, setAllDrivers] = useState([]); // Store all drivers for search
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [karmaFilter, setKarmaFilter] = useState('all');
  const [creditFilter, setCreditFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all'); // 'all', 'batteries', 'vehicles'
  const [totalDrivers, setTotalDrivers] = useState(0);
  
  // Modal state for driver route
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedDriverForRoute, setSelectedDriverForRoute] = useState(null);
  
  // Modal state for last 7 days KM
  const [isLast7DaysModalOpen, setIsLast7DaysModalOpen] = useState(false);
  const [selectedDriverForLast7Days, setSelectedDriverForLast7Days] = useState(null);
  
  const driversPerPage = 6;

  // Fetch drivers data from API (like actionable insights)
  useEffect(() => {
    fetchDriversData();
  }, [creditFilter, riskFilter, karmaFilter, selectedNbfc, vehicleFilter]); // Add vehicleFilter

  // Handle search and pagination locally (like actionable insights)
  useEffect(() => {
    handleSearchAndPagination();
  }, [allDrivers, searchTerm, currentPage, vehicleFilter]);

  const fetchDriversData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching all loan drivers data for global search...');
      console.log('🏢 NBFC Filter:', selectedNbfc);
      
      // Map frontend filter values to backend expected values
      const mapFilterValue = (value) => {
        if (value === 'mid') return 'medium';
        if (value === 'ntc') return 'NTC';
        return value;
      };

      // Simple NBFC mapping for case sensitivity
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
      const response = await ApiService.getLoanDrivers({
        credit: creditFilter !== 'all' ? mapFilterValue(creditFilter) : '',
        risk: riskFilter !== 'all' ? mapFilterValue(riskFilter) : '',
        karma: karmaFilter !== 'all' ? mapFilterValue(karmaFilter) : '',
        onboarded: nbfcValue,
        vehicleType: vehicleFilter !== 'all' ? vehicleFilter : '',
        limit: 3500, // Large limit to get all data
        offset: 0
      });

      console.log('✅ Loan Drivers API Response:', response);

      if (response.success && response.data) {
        setAllDrivers(response.data.drivers);
        setTotalDrivers(response.data.total);
        setCurrentPage(1); // Reset to first page when filter changes
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('❌ Error fetching loan drivers:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Handle search and pagination locally (exactly like actionable insights)
  const handleSearchAndPagination = () => {
    // Filter drivers based on search term (search across all data)
    let filteredDrivers = allDrivers.filter(driver => 
      driver.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
      // driver.phone?.includes(searchTerm)
    );

    // Note: Vehicle filter is now handled on backend, so no need to filter here

    // Calculate pagination for filtered results
    const startIndex = (currentPage - 1) * driversPerPage;
    const endIndex = startIndex + driversPerPage;
    const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

    // Update state
    setDrivers(paginatedDrivers);
    setTotalDrivers(filteredDrivers.length);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedNbfc, vehicleFilter]);

  // Remove unnecessary functions and simplify
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

  return (
    <div className="container2">
      <div className="dashboard">
        <div className="header">
          {/* Vehicle Type Filters */}
          <div className="actions">
            <label className="checkbox-filter-wrapper">
              <input
                type="checkbox"
                checked={vehicleFilter === 'batteries'}
                onChange={() => setVehicleFilter(vehicleFilter === 'batteries' ? 'all' : 'batteries')}
                className="checkbox-filter-input"
              />
              <span className="checkbox-filter-label">
                <span className="checkbox-filter-custom"></span>
                Batteries
              </span>
            </label>
            <label className="checkbox-filter-wrapper">
              <input
                type="checkbox"
                checked={vehicleFilter === 'vehicles'}
                onChange={() => setVehicleFilter(vehicleFilter === 'vehicles' ? 'all' : 'vehicles')}
                className="checkbox-filter-input"
              />
              <span className="checkbox-filter-label">
                <span className="checkbox-filter-custom"></span>
                Vehicles
              </span>
            </label>
          </div>
          
          {/* Filter button groups */}
              <div >
                <div colSpan={9}>
                  <div  style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Credit', state: creditFilter, setter: setCreditFilter, options: [
                        { key: 'all', text: 'All' },
                        { key: 'high', text: 'High' },
                        { key: 'mid', text: 'Mid' },
                        { key: 'low', text: 'Low' },
                        { key: 'ntc', text: 'NTC' }
                      ]},
                      { label: 'Risk', state: riskFilter, setter: setRiskFilter, options: [
                        { key: 'all', text: 'All' },
                        { key: 'high', text: 'High' },
                        { key: 'mid', text: 'Mid' },
                        { key: 'low', text: 'Low' }
                      ]},
                      { label: 'Karma', state: karmaFilter, setter: setKarmaFilter, options: [
                        { key: 'all', text: 'All' },
                        { key: 'high', text: 'High' },
                        { key: 'mid', text: 'Mid' },
                        { key: 'low', text: 'Low' },
                        { key: 'ntk', text: 'NTK' }
                      ]}
                    ].map(group => (
                      <div key={group.label} style={{ display: 'flex',  gap: '8px', flexDirection: 'column'  }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', width: '60px' }}>{group.label}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {group.options.map(opt => (
                            <button
                              key={opt.key}
                              onClick={(e) => { e.stopPropagation(); group.setter(group.state === opt.key ? 'all' : opt.key); }}
                              style={{
                                border: '1px solid #d1d5db',
                                background: group.state === opt.key ? '#22c55e' : '#ffffff',
                                color: group.state === opt.key ? '#ffffff' : '#374151',
                                fontSize: '13px',
                                padding: '4px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all 0.15s'
                              }}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="search-input"
            />
          </div>
        </div>
        

        <div className="table-container">
          {loading && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              Loading drivers data...
            </div>
          )}
          
          {error && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
              Error: {error}
            </div>
          )}
          
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                {/* <th>
                  <div className="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="selectAll" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="checkbox"
                    />
                    <label htmlFor="selectAll" className="checkbox-label"></label>
                  </div>
                </th> */}
                <th>Driver Details</th>
                <th>Credit</th>
                <th>Risk</th>
                <th>Karma Score</th>
                
                <th>Run Kms</th>
                <th>Last 7 Days Kms</th>
                <th>Driver Route</th>
                <th>NPS</th>
                {/* <th>Repayment Trends</th> */}
                {/* <th>Int Gained</th> */}
                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No drivers found matching your criteria
                  </td>
                </tr>
              )}
              
              {drivers.map((driver) => (
                <tr key={driver.id} onClick={() => handleDriverClick(driver.id)} className="driver-row-clickable">
                  <td>
                    <div className="driver-row gap-2">
                      <div className="avatar">
                        {(driver.name || 'Unknown').charAt(0)}
                      </div>
                      {/* <div className="user-avatar">
                        <FaUser size={24} color="#6B7280" />
                      </div> */}
                      <div className="driver-info">
                        <div className="name">{formatDriverName(driver.name)}</div>
                        <div className="details">{driver.id || ' '} | {driver.phone || ' '} </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="karma-container">
                      <KarmaScoreChart score={driver.creditScore || 0}/>
                    </div>
                  </td>
                  <td>
                    <div className="karma-container">
                      <RiskScoreChart score={driver.riskScore || 0}/>
                    </div>
                  </td>
                  <td>
                    <div className="karma-container">
                      <KarmaScoreChart score={driver.karmaScore || 0}/>
                    </div>
                  </td>
                  <td>
                    <div>
                      {/* <div className="km-value">{driver.kmPerDay || 0} <span className="km-label">Day</span></div> */}
                      <div className=""> {driver.totalRunKms || 0}</div>
                    </div>
                  </td>
                   <td>
                    <div 
                      className="tachometer-container"
                      onClick={(e) => handleLast7DaysClick(e, driver)}
                      style={{ cursor: 'pointer' }}
                      title="View Last 7 Days KM & Battery Control"
                    >
                      <BiTachometer size={24} color="#22c55e" style={{ margin: '0 auto', display: 'block' }} />
                    </div>
                  </td>
                   <td>
                    <div 
                      className="tachometer-container"
                      onClick={(e) => handleRouteClick(e, driver)}
                      style={{ cursor: 'pointer' }}
                      title="View Driver Route"
                    >
                      <FaMapMarkedAlt size={20} color="#3B82F6" />
                    </div>
                  </td>
                   <td>
                    <div>
                      <div className="km-value ml-4">{driver.nps || '-'} </div>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        <div className=" flex flex-row items-between justify-between  mt-4">
          <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Showing {((currentPage - 1) * driversPerPage) + 1} to {Math.min(currentPage * driversPerPage, totalDrivers)} of {totalDrivers} drivers
            {selectedNbfc && selectedNbfc !== 'all' && (
              <span> • Filtered by {selectedNbfc}</span>
            )}
          </div>
          <div className="page-nav">
            <button 
              className="page-button nav-button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              &lt;
            </button>
            
            {/* Dynamic pagination exactly like actionable insights */}
            {(() => {
              const totalPages = Math.ceil(totalDrivers / driversPerPage);
              const maxPagesToShow = 5;
              
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
              
              if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
              }

              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }
              
              return pages.map(pageNum => (
                <button 
                  key={pageNum}
                  className={`page-button ${currentPage === pageNum ? 'active' : ''}`} 
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              ));
            })()}
            
            <button 
              className="page-button nav-button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalDrivers / driversPerPage) || loading}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      
      {/* Driver Route Modal */}
      <RouteModal 
        isOpen={isRouteModalOpen}
        onClose={handleCloseRouteModal}
        batteryId={selectedDriverForRoute?.batteryID}
        driverName={selectedDriverForRoute?.name || 'Unknown Driver'}
      />
      
      {/* Last 7 Days KM Modal */}
      <Last7DaysModal 
        isOpen={isLast7DaysModalOpen}
        onClose={handleCloseLast7DaysModal}
        batteryId={selectedDriverForLast7Days?.batteryID}
        driverName={selectedDriverForLast7Days?.name || 'Unknown Driver'}
      />
     
    </div>
  );
}