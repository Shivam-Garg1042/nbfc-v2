import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';

const router = express.Router();

// Get actionable insights with filters
router.get('/', async (req, res) => {
  try {
    const { 
      actionable = 'last7DaysRunKm',
      actionableInsights = '',
      offset = 0,
      limit = 6
    } = req.query;

    console.log('🎯 Actionable Insights API - Params:', {
      actionable, actionableInsights, offset, limit
    });

    // Map frontend filter names to backend actionable types
    const actionableMap = {
      'Likely To Default': 'last7DaysRunKm',
      'Payment On Time': 'paymentOnTime', 
      'Payment Delay': 'paymentDelay',
      'Bottom Drivers(Karma)': 'bottomDrivers',
      'Top Drivers(Karma)': 'topDrivers'
    };

    const mappedActionable = actionableMap[actionable] || actionable;

    // Call GraphQL resolver
    const graphqlData = await resolvers.Query.actionableInsights(
      null,
      {
        input: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          actionable: mappedActionable,
          actionableInsights: actionableInsights
        }
      },
      { req }
    );

    if (graphqlData?.error) {
      console.log('❌ GraphQL error in actionable insights:', graphqlData.error);
      return res.status(500).json({ 
        success: false,
        error: graphqlData.error.message 
      });
    }

    if (!graphqlData.data) {
      return res.status(404).json({ 
        success: false,
        error: 'No data available' 
      });
    }

    // Transform response for frontend
    const response = {
      total: parseInt(graphqlData.data.total),
      drivers: graphqlData.data.drivers.map(driver => ({
        driverId: driver.driverID,
        name: driver.name,
        phone: driver.mobile,
        batteryId: driver.batteryID,
        productId: driver.product,
        avgRunKm: driver.avgRunKm,
        status: driver.status,
        action: driver.action,
        driverRoute: 'active', // Default value, can be mapped from actual data
      })),
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        hasMore: graphqlData.data.drivers.length === parseInt(limit)
      },
      filter: actionable
    };

    console.log(`📊 Returning ${response.drivers.length} drivers out of ${response.total} total`);
    res.json({ success: true, data: response });

  } catch (error) {
    console.error('Actionable Insights API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

// Get actionable insights summary for cards
router.get('/summary', async (req, res) => {
  try {
    const { actionableInsights = '' } = req.query;

    console.log('📊 Actionable Summary API - NBFC Filter:', actionableInsights);

    // Single efficient GraphQL call instead of 5 separate calls
    const graphqlData = await resolvers.Query.actionableInsightsSummary(
      null,
      { input: { actionableInsights } },
      { req }
    );

    if (graphqlData?.error) {
      console.log('❌ GraphQL error in actionable summary:', graphqlData.error);
      return res.status(500).json({ 
        success: false,
        error: graphqlData.error.message 
      });
    }

    if (!graphqlData.data) {
      return res.status(404).json({ 
        success: false,
        error: 'No summary data available' 
      });
    }

    console.log('📈 Summary Data:', graphqlData.data);
    res.json({ success: true, data: graphqlData.data });

  } catch (error) {
    console.error('Actionable Summary API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

export default router;