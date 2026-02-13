import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ApiService from '../services/api';

const Last7DaysModal = ({ isOpen, onClose, batteryId, driverName }) => {
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [batteryActionLoading, setBatteryActionLoading] = useState(false);
  const [batteryMessage, setBatteryMessage] = useState(null); // For battery control feedback

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Create default zero data for chart
  const createZeroData = () => [
    { name: 'Day 7', value: '0' },
    { name: 'Day 6', value: '0' },
    { name: 'Day 5', value: '0' },
    { name: 'Day 4', value: '0' },
    { name: 'Day 3', value: '0' },
    { name: 'Day 2', value: '0' },
    { name: 'Yesterday', value: '0' }
  ];

  useEffect(() => {
    if (isOpen && batteryId) {
      console.log('Last7DaysModal opened with batteryId:', batteryId);
      fetchLast7DaysData();
    } else if (isOpen && !batteryId) {
      console.log('Last7DaysModal opened but no batteryId provided, showing chart with 0 values');
      // Show chart with 0 values instead of error
      setLast7DaysData(createZeroData());
      setError(null);
    }
  }, [isOpen, batteryId]);

  const fetchLast7DaysData = useCallback(async () => {
    console.log('🚀 Starting fetchLast7DaysData with batteryId:', batteryId);
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Calling Last 7 Days API with batteryId:', batteryId);
      const response = await ApiService.getLast7DaysKm(batteryId);
      console.log('📥 Last 7 Days API response:', response);
      
      if (response && response.length > 0) {
        console.log('✅ Setting last 7 days data:', response);
        setLast7DaysData(response);
      } else {
        console.log('⚠️ No data available, showing chart with 0 values');
        // Create mock data with 0 values for all 7 days
        setLast7DaysData(createZeroData());
        setError(null); // Don't show error, just show chart with 0 values
      }
    } catch (error) {
      console.error('❌ Error fetching last 7 days data:', error);
      // Even on error, show chart with 0 values instead of error message
      console.log('⚠️ Error occurred, showing chart with 0 values');
      setLast7DaysData(createZeroData());
      setError(null); // Don't show error, just show chart with 0 values
    } finally {
      console.log('🏁 fetchLast7DaysData completed');
      setLoading(false);
    }
  }, [batteryId]);

  const handleBatteryAction = (action) => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  const confirmBatteryAction = async () => {
    setBatteryActionLoading(true);
    try {
      console.log(`🔋 ${confirmationAction} battery for batteryId:`, batteryId);
      const response = await ApiService.batteryControl(confirmationAction, batteryId);
      console.log('🔋 Battery control response:', response);
      
      if (response.error) {
        setBatteryMessage({ type: 'error', text: `Failed to ${confirmationAction} battery: ${response.error.message}` });
      } else {
        // Show success message temporarily
        setBatteryMessage({ type: 'success', text: `Battery ${confirmationAction}d successfully!` });
        setTimeout(() => setBatteryMessage(null), 4000); // Clear after 4 seconds
      }
    } catch (error) {
      console.error(`❌ Error ${confirmationAction}ing battery:`, error);
      setBatteryMessage({ type: 'error', text: `Failed to ${confirmationAction} battery. Please try again.` });
      setTimeout(() => setBatteryMessage(null), 5000); // Clear after 5 seconds
    } finally {
      setBatteryActionLoading(false);
      setShowConfirmation(false);
      setConfirmationAction(null);
    }
  };

  const cancelBatteryAction = () => {
    setShowConfirmation(false);
    setConfirmationAction(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Top Screen Messages */}
      {batteryMessage && (
        <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-70 animate-in slide-in-from-top duration-300">
          <div className={`px-6 py-3 rounded-lg shadow-lg border ${
            batteryMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          } flex items-center space-x-2`}>
            <span className="text-lg">
              {batteryMessage.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{batteryMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100"
             onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-4  border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 gap-4    ">
              {driverName} ({batteryId})
             
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className=" bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="">
                {/* Last 7 Days Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Last 7 Days Kilometers</h3>
                 
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={last7DaysData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                            <stop offset="50%" stopColor="#A78BFA" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.1}/>
                          </linearGradient>
                          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#8B5CF6" floodOpacity="0.3"/>
                          </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          tickFormatter={(value) => `${value} km`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value} km`, 'Distance']}
                          labelStyle={{ color: '#374151' }}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorDistance)" 
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                          activeDot={{ 
                            r: 8, 
                            stroke: '#8B5CF6', 
                            strokeWidth: 3, 
                            fill: 'white',
                            filter: 'url(#shadow)'
                          }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Battery Control */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="flex text-lg font-semibold text-gray-800 mb-4 justify-center">Battery Control</h3>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleBatteryAction('enable')}
                      disabled={batteryActionLoading}
                      className="flex-1 px-6 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      {batteryActionLoading && confirmationAction === 'Activate' ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Activating...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-lg">🔋</span>
                          <span>Activate Battery</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleBatteryAction('disable')}
                      disabled={batteryActionLoading}
                      className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      {batteryActionLoading && confirmationAction === 'Deactivate' ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deactivating...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-lg">⚡</span>
                          <span>Deactivate Battery</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        
          
          
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelBatteryAction();
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 ">
              <div className="text-center ">
                <div className="text-5xl mb-4">
                  {confirmationAction === 'enable' ? '🔋' : '⚡'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Are you sure?
                </h3>
                <p className="text-gray-600 mb-6">
                  Do you want to {confirmationAction} the battery for {driverName}?
                  <br />
                  <span className="text-sm text-gray-500 mt-1 block">Battery ID: {batteryId}</span>
                </p>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={cancelBatteryAction}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBatteryAction}
                    className={`px-6 py-3 text-white rounded-2xl transition-colors font-medium ${
                      confirmationAction === 'enable' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    Yes, {confirmationAction}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Last7DaysModal;
