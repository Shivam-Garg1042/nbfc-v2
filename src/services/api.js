const API_BASE = import.meta.env.VITE_API_BASE_URL ;

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        credentials: 'include', // Include JWT cookies
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.error || `API Error: ${response.status}`);
        error.data = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Authentication APIs
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  async checkAuth() {
    return this.request('/api/auth/me');
  }

  // Dashboard APIs with NBFC filtering
  getDashboard(nbfcFilter = 'all') {
    console.log('🔄 API call - NBFC Filter:', nbfcFilter);
    const url = nbfcFilter === 'all' 
      ? '/api/dashboard/overview'
      : `/api/dashboard/overview?nbfc=${encodeURIComponent(nbfcFilter)}`;
    console.log('📡 API URL:', url);
    return this.request(url);
  }

  // Simple Chart Data API
  getChartData(chartType, nbfcFilter = 'all') {
    console.log('📈 Chart API call - Type:', chartType, 'Filter:', nbfcFilter);
    const params = new URLSearchParams({
      chart: chartType,
      ...(nbfcFilter !== 'all' && { nbfc: nbfcFilter })
    });
    
    const url = `/api/dashboard/chart-data?${params}`;
    console.log('📡 Chart API URL:', url);
    return this.request(url);
  }

  // NBFC Dashboard Raw Data API (for MyProducts component)
  getNbfcDashboardData(nbfcFilter = 'all') {
    console.log('🏢 NBFC Dashboard Data API call - Filter:', nbfcFilter);
    const url = nbfcFilter === 'all' 
      ? '/api/dashboard/nbfc-data'
      : `/api/dashboard/nbfc-data?nbfc=${encodeURIComponent(nbfcFilter)}`;
    console.log('📡 NBFC Dashboard Data API URL:', url);
    return this.request(url);
  }

  // MyProducts API
  getMyProducts(nbfcFilter = 'all') {
    console.log('🏪 MyProducts API call - Filter:', nbfcFilter);
    const url = nbfcFilter === 'all' 
      ? '/api/dashboard/products'
      : `/api/dashboard/products?nbfc=${encodeURIComponent(nbfcFilter)}`;
    console.log('📡 MyProducts API URL:', url);
    return this.request(url);
  }

  // ProductDesc Overview API
  getProductDescOverview(nbfcFilter = 'all') {
    console.log('📊 ProductDesc API call - NBFC Filter:', nbfcFilter);
    const url = nbfcFilter === 'all' 
      ? '/api/product-desc'
      : `/api/product-desc?nbfc=${encodeURIComponent(nbfcFilter)}`;
    console.log('📡 ProductDesc API URL:', url);
    return this.request(url);
  }

  // Home Page APIs
  getHomeOverview(nbfcFilter = 'all') {
    console.log('🏠 Home API call - NBFC Filter:', nbfcFilter);
    const url = nbfcFilter === 'all' 
      ? '/api/home/overview'
      : `/api/home/overview?nbfc=${encodeURIComponent(nbfcFilter)}`;
    console.log('📡 Home API URL:', url);
    return this.request(url);
  }

  getHomeChartData(chartType, nbfcFilter = 'all') {
    console.log('📈 Home Chart API call - Type:', chartType, 'Filter:', nbfcFilter);
    const params = new URLSearchParams({
      chart: chartType,
      ...(nbfcFilter !== 'all' && { nbfc: nbfcFilter })
    });
    
    const url = `/api/home/chart-data?${params}`;
    console.log('📡 Home Chart API URL:', url);
    return this.request(url);
  }

  getHomeMatrixData(matrixType, nbfcFilter = 'all') {
    console.log('📊 Home Matrix API call - Type:', matrixType, 'Filter:', nbfcFilter);
    const params = new URLSearchParams({
      type: matrixType,
      ...(nbfcFilter !== 'all' && { nbfc: nbfcFilter })
    });
    
    const url = `/api/home/matrix-data?${params}`;
    console.log('📡 Home Matrix API URL:', url);
    return this.request(url);
  }

  // Actionable Insights APIs
  getActionableInsights(filters = {}) {
    console.log('🎯 Actionable Insights API call - Filters:', filters);
    const params = new URLSearchParams();
    
    // Add all filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    const url = `/api/actionable-insights${params.toString() ? `?${params}` : ''}`;
    console.log('📡 Actionable Insights API URL:', url);
    return this.request(url);
  }

  getActionableInsightsSummary(nbfcFilter = 'all') {
    console.log('📊 Actionable Insights Summary API call - NBFC Filter:', nbfcFilter);
    const params = new URLSearchParams();
    
    if (nbfcFilter && nbfcFilter !== 'all') {
      // Apply same NBFC mapping logic as other components
      let mappedNbfc;
      const lowerNbfc = nbfcFilter.toLowerCase();
      
      if (lowerNbfc === 'mega corp') {
        mappedNbfc = 'megaCorp';
      } else if (lowerNbfc === 'svcl') {
        mappedNbfc = 'SVCL';
      } else {
        mappedNbfc = lowerNbfc;
      }
      
      params.append('actionableInsights', mappedNbfc);
    }
    
    const url = `/api/actionable-insights/summary${params.toString() ? `?${params}` : ''}`;
    console.log('📡 Actionable Summary API URL:', url);
    return this.request(url);
  }

  // Loan Drivers API with filtering and search
  getLoanDrivers(filters = {}) {
    console.log('🚗 Loan Drivers API call - Filters:', filters);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.append(key, value);
      }
    });
    
    const url = `/api/loan-drivers${params.toString() ? `?${params}` : ''}`;
    console.log('📡 Loan Drivers API URL:', url);
    return this.request(url);
  }

  // Driver Details API
  getDriverDetails(driverId) {
    console.log('👤 Driver Details API call - ID:', driverId);
    if (!driverId) {
      throw new Error('Driver ID is required');
    }
    return this.request(`/api/driver-details/${driverId}`);
  }

  // Driver Route API
  getDriverRoute(batteryId) {
    return this.request(`/api/driver-route/${batteryId}`);
  }

  // Last 7 Days KM API
  getLast7DaysKm(batteryId) {
    console.log('📊 Last 7 Days KM API call - Battery ID:', batteryId);
    const url = `/api/last-7-days-km/${batteryId}`;
    console.log('📡 Last 7 Days KM API URL:', url);
    return this.request(url);
  }

  // Battery Control API
  batteryControl(action, batteryId) {
    console.log('🔋 Battery Control API call - Action:', action, 'Battery ID:', batteryId);
    const url = `/api/battery-control/${action}`;
    console.log('📡 Battery Control API URL:', url);
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify({ batteryId }),
    });
  }

  // Risk Score Verification API
  verifyRisk(name, phoneNumber) {
    console.log('🎯 Risk Score Verification API call - Name:', name, 'Phone:', phoneNumber);
    if (!name || !phoneNumber) {
      throw new Error('Name and phone number are required');
    }
    
    const url = '/api/verification/risk';
    console.log('📡 Risk Verification API URL:', url);
    
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify({ name, phoneNumber }),
    });
  }

  // Vehicle Verification API
  verifyVehicle(rcNumber) {
    console.log('🚗 Vehicle Verification API call - RC Number:', rcNumber);
    if (!rcNumber) {
      throw new Error('RC number is required');
    }
    
    const url = '/api/verification/vehicle';
    console.log('📡 Vehicle Verification API URL:', url);
    
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify({ rcNumber }),
    });
  }

  // Credit Score Verification API
  verifyCredit(firstName, lastName, mobile, pan) {
    console.log('💳 Credit Score Verification API call - Name:', firstName, lastName, 'Mobile:', mobile, 'PAN:', pan);
    if (!firstName || !lastName || !mobile || !pan) {
      throw new Error('First name, last name, mobile, and PAN are required');
    }
    
    const url = '/api/verification/credit';
    console.log('📡 Credit Verification API URL:', url);
    
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, mobile, pan }),
    });
  }

  // Credits History API
  getCreditsHistory({ limit = 20, offset = 0 } = {}) {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    return this.request(`/api/credits/history?${params.toString()}`);
  }

  // Admin Credits Recharge API
  rechargeCredits(email, amount) {
    return this.request('/api/credits/admin/recharge', {
      method: 'POST',
      body: JSON.stringify({ email, amount }),
    });
  }

}

export default new ApiService();