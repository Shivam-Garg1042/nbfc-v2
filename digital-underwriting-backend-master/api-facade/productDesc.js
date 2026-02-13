import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';

const router = express.Router();

// Get overview statistics for ProductDesc component
router.get('/', async (req, res) => {
  try {
    const { nbfc } = req.query;
    console.log('📊 ProductDesc Overview API called with NBFC filter:', nbfc);

    // Prepare input for GraphQL resolvers
    const input = {};
    if (nbfc && nbfc !== 'all') {
      // Apply same NBFC mapping logic as other components
      const lowerNbfc = nbfc.toLowerCase();
      if (lowerNbfc === 'mega corp') {
        input.onboarded = 'megaCorp';
      } else if (lowerNbfc === 'svcl') {
        input.onboarded = 'SVCL';
      } else {
        input.onboarded = lowerNbfc;
      }
    }

    // Get dashboard data (contains totalDrivers and other metrics)
    const dashboardData = await resolvers.Query.dashboard(
      null,
      {},
      { req }
    );

    // Get onboarded data with filters to calculate active drivers and newly added
    const onboardedData = await resolvers.Query.onboarded(
      null,
      { 
        input: { 
          limit: 10000, // Large limit to get all drivers
          offset: 0,
          ...input
        } 
      },
      { req }
    );

    if (dashboardData?.error || onboardedData?.error) {
      console.log('❌ GraphQL error in overview data:', dashboardData?.error || onboardedData?.error);
      return res.status(500).json({ 
        success: false,
        error: dashboardData?.error?.message || onboardedData?.error?.message || 'Failed to fetch data'
      });
    }

    // Calculate the 5 required metrics
    const totalDrivers = dashboardData.data?.totalDrivers || 0;
    
    // Get all onboarded drivers data
    const allDrivers = onboardedData.data?.onboardedManipulatedData || [];
    
    // Active drivers = number of drivers in the selected NBFC (filtered drivers count)
    const activeDrivers = allDrivers.length;

    // Calculate newly added drivers (last 30 days)
    // We need to check if we have onboarding date information
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    // For newly added drivers, we'll need to access the raw driver data with onboarding dates
    // Since the onboarded resolver filters data, we need to get raw data to check dates
    let newlyAddedDrivers = 0;
    
    // Get raw driver data to check onboarding dates
    const sheetCallRedis = (await import('../RedisActions/sheetCallRedis.js')).default;
    const rawDriverData = await sheetCallRedis();
    
    if (rawDriverData?.data) {
      let filteredRawDrivers = rawDriverData.data;
      
      // Apply NBFC filtering if specified
      if (input.onboarded) {
        filteredRawDrivers = filteredRawDrivers.filter(driver => {
          if (!driver.NBFC) return false;
          const driverNbfc = driver.NBFC.toLowerCase().split(" ").join("");
          return driverNbfc === input.onboarded.toLowerCase();
        });
      }
      
      // Filter drivers added in last 30 days
      newlyAddedDrivers = filteredRawDrivers.filter(driver => {
        if (!driver.Onboarding_Date) return false;
        const onboardingDate = new Date(driver.Onboarding_Date);
        return onboardingDate >= thirtyDaysAgo && onboardingDate <= currentDate;
      }).length;
    }

    // Calculate average karma score from filtered drivers
    const driversWithKarma = allDrivers.filter(driver => 
      driver.karma && !isNaN(Number(driver.karma))
    );
    const avgKarmaScore = driversWithKarma.length > 0 
      ? Math.round(driversWithKarma.reduce((sum, driver) => sum + Number(driver.karma), 0) / driversWithKarma.length)
      : 0;

    // Calculate average risk score from filtered drivers
    const driversWithRisk = allDrivers.filter(driver => 
      driver.risk && !isNaN(Number(driver.risk))
    );
    const avgRiskScore = driversWithRisk.length > 0 
      ? Math.round(driversWithRisk.reduce((sum, driver) => sum + Number(driver.risk), 0) / driversWithRisk.length)
      : 0;

    const response = {
      totalDrivers,
      activeDrivers,
      newlyAddedDrivers,
      avgKarmaScore,
      avgRiskScore
    };

    console.log('📈 ProductDesc Overview Data:', response);
    res.json({ success: true, data: response });

  } catch (error) {
    console.error('ProductDesc Overview API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

export default router;