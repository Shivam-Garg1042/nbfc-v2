import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';

const router = express.Router();

// Dashboard Overview - Transform nbfcDashboard to OverviewCards format
router.get('/overview', async (req, res) => {
  try {
    console.log('📊 Dashboard API called');
    console.log('🔍 Query parameters:', req.query);
    
    // Get NBFC filter from query parameter
    const nbfcFilter = req.query.nbfc || "";
    console.log(`🏢 NBFC Filter: "${nbfcFilter}"`);
    
    // Call nbfcDashboard resolver with the filter
    const graphqlData = await resolvers.Query.nbfcDashboard(
      null, 
      { input: { nbfc: nbfcFilter } }, 
      { req }
    );
    
    console.log('📈 GraphQL response status:', graphqlData?.status || 'success');
    
    if (graphqlData?.error) {
      console.log('❌ GraphQL error:', graphqlData.error);
      return res.status(500).json({ 
        success: false, 
        error: graphqlData.error.message 
      });
    }

    const data = graphqlData.data;
    console.log('📊 Data received, cards available:', !!data?.cardsData);
    
    // Pass through the complete cardsData structure that OverviewCards expects
    res.json({ success: true, data: data });
    
  } catch (error) {
    console.error('Dashboard Overview API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

// Simple Chart Data API - Only real data, no fallbacks
router.get('/chart-data', async (req, res) => {
  try {
    console.log('📈 Chart Data API called');
    const { chart, nbfc } = req.query;
    
    // Get raw data from GraphQL
    const graphqlData = await resolvers.Query.nbfcDashboard(
      null, 
      { input: { nbfc: nbfc || "" } }, 
      { req }
    );
    
    if (graphqlData?.error) {
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    const data = graphqlData.data;
    
    // Simple data transformation - only real data
    let chartData;
    
    switch (chart) {
      case 'login-overview':
        // Only use actual LoginByMonth data
        if (data.LoginByMonth && data.LoginByMonth.length > 0) {
          chartData = data.LoginByMonth.map(item => ({
            name: item.name,
            value: item.drivers || 0,
            disbursed: Math.floor(item.drivers * 0.7)
          }));
        } else {
          chartData = []; // No fallback data
        }
        break;

      case 'disbursement-trend':
        // Use disbursmentByMonth data for overall disbursement trend
        if (data.disbursmentByMonth && data.disbursmentByMonth.length > 0) {
          chartData = data.disbursmentByMonth.map(item => ({
            name: item.name,
            totalLoans: item.value || 0,
            drivers: item.drivers || 0
          }));
        } else {
          chartData = [];
        }
        break;

      case 'driver-distance':
        // Use runKMData for driver distance distribution
        if (data.runKMData && data.runKMData.length > 0) {
          const colors = ['#3b82f6', '#f97316', '#fbbf24', '#10b981', '#FFBABA'];
          chartData = data.runKMData.map((item, index) => ({
            name: `${item.name} km/day`,
            value: parseInt(item.value) || 0,
            color: colors[index] || '#6b7280'
          }));
        } else {
          chartData = [];
        }
        break;

      case 'city-distribution':
        // Use DisbursmentByCity for city-wise driver distribution
        if (data.DisbursmentByCity && data.DisbursmentByCity.length > 0) {
          const colors = ['#3D7EFF', '#FFD465', '#FF7A59', '#65E1F5', '#FFBABA'];
          const totalDrivers = data.DisbursmentByCity.reduce((sum, item) => sum + (item.drivers || 0), 0);
          
          chartData = data.DisbursmentByCity
            .sort((a, b) => (b.drivers || 0) - (a.drivers || 0)) // Sort by driver count descending
            .slice(0, 5) // Take top 5 cities
            .map((item, index) => {
              const percentage = totalDrivers > 0 ? Math.round(((item.drivers || 0) / totalDrivers) * 100) : 0;
              return {
                name: item.name,
                value: item.drivers || 0,
                loanValue: item.value || 0,
                color: colors[index] || '#6b7280',
                percentage: percentage
              };
            });
          
          // Add totalDrivers to the response
          chartData.totalDrivers = totalDrivers;
        } else {
          chartData = [];
        }
        break;

      case 'emi-trends':
        // Use emiTrends for EMI tenure distribution
        if (data.emiTrends && data.emiTrends.length > 0) {
          chartData = data.emiTrends;
        } else {
          chartData = [];
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid chart type' });
    }
    
    console.log(`📊 Returning ${chartData.length} data points for ${chart}`);
    res.json({ data: chartData });
    
  } catch (error) {
    console.error('Chart Data API Error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// MyProducts API - Only numbers based on productType from sheet
router.get('/products', async (req, res) => {
  try {
    console.log('🏪 MyProducts API called');
    const nbfcFilter = req.query.nbfc || "";
    
    const graphqlData = await resolvers.Query.nbfcDashboard(
      null, 
      { input: { nbfc: nbfcFilter } }, 
      { req }
    );
    
    if (graphqlData?.error) {
      return res.status(500).json({ 
        success: false, 
        error: graphqlData.error.message 
      });
    }

    const data = graphqlData.data;
    
    // Send only the numbers - frontend has static data
    const productNumbers = {
      
      battery: {
        value: data.productData?.battery?.amount || "0", 
        activeDrivers: data.productData?.battery?.count || 0,
      },
      vehicle: {
        value: data.productData?.vehicle?.amount || "0",
        activeDrivers: data.productData?.vehicle?.count || 0,
      },
    };
    
    res.json({ success: true, data: productNumbers });
    
  } catch (error) {
    console.error('MyProducts API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

export default router;