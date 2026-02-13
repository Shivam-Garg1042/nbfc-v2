import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';

const router = express.Router();

// Home Overview - Driver statistics and key metrics
router.get('/overview', async (req, res) => {
  try {
    
    
    // Get NBFC filter from query parameter
    const nbfcFilter = req.query.nbfc || "";
    console.log(`🏢 NBFC Filter: "${nbfcFilter}"`);
    
    // Call dashboard resolver to get driver data
    const graphqlData = await resolvers.Query.dashboard(
      null, 
      {}, 
      { req }
    );
    
    
    if (graphqlData?.error) {
      console.log('❌ GraphQL error:', graphqlData.error);
      return res.status(500).json({ 
        success: false, 
        error: graphqlData.error.message 
      });
    }

    const data = graphqlData.data;
    
    // Simple, clean data structure for home overview
    const homeData = {
      totalDrivers: Math.floor(data.totalDrivers || 0),
      emiOnTime: data.emiTrendsData?.emiOnTime || "0",
      assetLoss: "1.13%", // This would come from actual calculation
      npsScore: data.driverNPS ? (data.driverNPS.reduce((a, b) => a + b, 0) / data.driverNPS.length).toFixed(1) : "8.5"
    };
    
   
    res.json({ success: true, data: homeData });
    
  } catch (error) {
    console.error('Home Overview API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

// Home Chart Data - For charts specific to home page
router.get('/chart-data', async (req, res) => {
  try {
    
    const { chart, nbfc } = req.query;
        
    // Get raw data from GraphQL dashboard
    const graphqlData = await resolvers.Query.dashboard(
      null, 
      {}, 
      { req }
    );
    
    if (graphqlData?.error) {
      console.log('❌ GraphQL error in home chart-data:', graphqlData.error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    const data = graphqlData.data;
    console.log('📊 Available data keys:', Object.keys(data || {}));
    
    // Simple data transformation based on chart type
    let chartData;
    
    switch (chart) {
      case 'driver-growth':
        // Use lastSixMonthDrivers for growth chart
        if (data.lastSixMonthDrivers && data.lastSixMonthDrivers.length > 0) {
          console.log('✅ Using lastSixMonthDrivers data');
          chartData = data.lastSixMonthDrivers.map(item => ({
            name: item.month,
            value: Math.floor(item.count || 0)
          }));
        } else {
          chartData = [];
        }
        break;
        
      case 'monthly-driving':
        // Use real runKmData to create monthly driving trends by distance ranges
        if (data.runKmData && data.runKmData.length > 0) {
          
          
          // Create distance range buckets - this is what should be on X-axis
          const distanceRanges = ['0-20', '21-40', '41-60', '61-80', '>80km'];
          
          // Transform data: each distance range gets data from all months
          chartData = distanceRanges.map((range, rangeIndex) => {
            const chartItem = { name: range };
            
            // For each month, get the percentage for this distance range
            data.runKmData.forEach(monthData => {
              const monthName = monthData.name; 
              const percentageStr = monthData.data[rangeIndex] || "0%";
              const percentage = parseInt(percentageStr.replace('%', '')) || 0;
              chartItem[monthName] = percentage;
            });
            
            return chartItem;
          });
          
          
        } else {
          chartData = [];
        }
        break;
        
      case 'emi-pie':
        // Use real emiTrends data for pie chart
        if (data.emiTrendsData?.emiTrends && data.emiTrendsData.emiTrends.length > 0) {
          console.log('✅ Using real emiTrends for pie chart');
          const colors = ['#3B82F6', '#06b6d4', '#10b981', '#fbbf24', '#f97316'];
          chartData = data.emiTrendsData.emiTrends.map((item, index) => ({
            name: item.name,
            value: Math.floor(item.value || 0),
            color: colors[index % colors.length]
          }));
        } else {
          chartData = [];
        }
        break;
        
      case 'nps-satisfaction':
        // Use real driverNPS data
        if (data.driverNPS && data.driverNPS.length > 0) {
          
          
          // driverNPS is an array of counts for ratings [5, 4, 3, 2, 1]
          const [excellent, good, neutral, poor, terrible] = data.driverNPS;
          const total = excellent + good + neutral + poor + terrible;
          
          if (total > 0) {
            chartData = [
              { 
                emoji: '😍', 
                percent: Math.round((excellent / total) * 100), 
                driverCount: excellent,
                color: '#22c55e',
                rating: 5 
              },
              { 
                emoji: '😊', 
                percent: Math.round((good / total) * 100), 
                driverCount: good,
                color: '#3b82f6',
                rating: 4 
              },
              { 
                emoji: '😐', 
                percent: Math.round((neutral / total) * 100), 
                driverCount: neutral,
                color: '#fbbf24',
                rating: 3 
              },
              { 
                emoji: '😡', 
                percent: Math.round((poor / total) * 100), 
                driverCount: poor,
                color: '#f97316',
                rating: 2 
              },
              { 
                emoji: '🤬', 
                percent: Math.round((terrible / total) * 100), 
                driverCount: terrible,
                color: '#ef4444',
                rating: 1 
              },
            ];
          } else {
            chartData = [];
          }
        } else {
          chartData = [];
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid chart type' });
    }
    
    console.log(`📊 Returning ${Array.isArray(chartData) ? chartData.length : 'complex'} data points for ${chart}`);
    res.json({ data: chartData });
    
  } catch (error) {
    console.error('Home Chart Data API Error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Home Matrix Data - For Credit vs Risk and Credit vs Karma matrices
router.get('/matrix-data', async (req, res) => {
  try {
    
    const { type } = req.query;
    
    
    // Get raw data from GraphQL dashboard
    const graphqlData = await resolvers.Query.dashboard(
      null, 
      {}, 
      { req }
    );
    
    if (graphqlData?.error) {
      console.log('❌ GraphQL error in matrix-data:', graphqlData.error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    const data = graphqlData.data;
    let matrixData;
    
    switch (type) {
      case 'credit-vs-risk':
        if (data.riskCreditkarmaData?.creditVsRisk) {
          console.log('✅ Using real creditVsRisk data');
          const riskData = data.riskCreditkarmaData.creditVsRisk;
          
          matrixData = {
            lowRisk: [
              Math.round(parseFloat(riskData.CreditHighRiskLow) || 0),
              Math.round(parseFloat(riskData.CreditMediumRiskLow) || 0), 
              Math.round(parseFloat(riskData.CreditLowRiskLow) || 0)
            ],
            mediumRisk: [
              Math.round(parseFloat(riskData.CreditHighRiskMedium) || 0),
              Math.round(parseFloat(riskData.CreditMediumRiskMedium) || 0),
              Math.round(parseFloat(riskData.CreditLowRiskMedium) || 0)
            ],
            highRisk: [
              Math.round(parseFloat(riskData.CreditHighRiskHigh) || 0),
              Math.round(parseFloat(riskData.CreditMediumRiskHigh) || 0),
              Math.round(parseFloat(riskData.CreditLowRiskHigh) || 0)
            ]
          };
        } else {
          return res.status(404).json({ error: 'No creditVsRisk data available' });
        }
        break;
        
      case 'credit-vs-karma':
        if (data.riskCreditkarmaData?.creditVsKarma) {
          
          const karmaData = data.riskCreditkarmaData.creditVsKarma;
          
          matrixData = {
            highKarma: [
              Math.round(parseFloat(karmaData.CreditHighKarmaHigh) || 0),
              Math.round(parseFloat(karmaData.CreditMediumKarmaHigh) || 0),
              Math.round(parseFloat(karmaData.CreditLowKarmaHigh) || 0)
            ],
            mediumKarma: [
              Math.round(parseFloat(karmaData.CreditHighKarmaMedium) || 0),
              Math.round(parseFloat(karmaData.CreditMediumKarmaMedium) || 0),
              Math.round(parseFloat(karmaData.CreditLowKarmaMedium) || 0)
            ],
            lowKarma: [
              Math.round(parseFloat(karmaData.CreditHighKarmaLow) || 0),
              Math.round(parseFloat(karmaData.CreditMediumKarmaLow) || 0),
              Math.round(parseFloat(karmaData.CreditLowKarmaLow) || 0)
            ]
          };
        } else {
          return res.status(404).json({ error: 'No creditVsKarma data available' });
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid matrix type' });
    }
    
   
    res.json({ data: matrixData });
    
  } catch (error) {
    console.error('Home Matrix Data API Error:', error);
    res.status(500).json({ error: 'Failed to fetch matrix data' });
  }
});

export default router;