import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';

const router = express.Router();

// Get loan drivers with filters and search (like actionable insights)
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 3000,  // Fetch all data like actionable insights
      offset = 0,
      credit = '',
      risk = '',
      karma = '',
      searchId = '',
      onboarded = '',
      vehicleType = ''  // Add vehicle type filter
    } = req.query;

    console.log('🚗 Loan Drivers API - Params:', {
      limit, offset, credit, risk, karma, searchId, onboarded, vehicleType
    });

    // Map frontend filter values to backend expected values
    const mapFilterValue = (value) => {
      if (value === 'mid') return 'medium';
      if (value === 'ntc') return 'NTC';
      return value;
    };

    // Call the existing onboarded GraphQL resolver
    const graphqlData = await resolvers.Query.onboarded(
      null,
      {

        input: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          credit: credit ? mapFilterValue(credit) : undefined,
          risk: risk ? mapFilterValue(risk) : undefined,
          karma: karma ? mapFilterValue(karma) : undefined,
          searchId: searchId || undefined,
          onboarded: onboarded || undefined,
          vehicleType: vehicleType || undefined
        }
      },
      { req }
    );

    if (graphqlData?.error) {
      console.log('❌ GraphQL error in loan drivers:', graphqlData.error);
      return res.status(500).json({ 
        success: false,
        error: graphqlData.error.message 
      });
    }

    if (!graphqlData.data) {
      return res.status(404).json({ 
        success: false,
        error: 'No drivers data available' 
      });
    }

    // Helper function to format name
    const formatName = (name) => {
      if (!name) return 'Unknown Driver';
      const words = name.trim().split(' ').filter(word => word.length > 0);
      const twoWords = words.slice(0, 2);
      return twoWords.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    // Helper function to calculate age from DOB
    const calculateAge = (dob) => {
      if (!dob) return " ";
      
      try {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return `${age} Years`;
      } catch (error) {
        return " ";
      }
    };

   

    // Transform response for frontend (like actionable insights)
    const response = {
      total: parseInt(graphqlData.data.length),
      drivers: graphqlData.data.onboardedManipulatedData
        .filter(driver => {
          // Apply vehicle type filter if specified
          if (!vehicleType || vehicleType === 'all') return true;
          
          const driverVehicleType = (driver.product || '').toLowerCase();
          
          if (vehicleType === 'batteries') {
            return driverVehicleType.includes('battery') || driverVehicleType.includes('batteries');
          } else if (vehicleType === 'vehicles') {
            return driverVehicleType.includes('vehicle') ;
          }
          
          return true;
        })
        .map(driver => ({
        id: driver.id,
        name: formatName(driver.name),
        phone: driver.phone || ' ',
        gender: driver.gender || ' ',
        age: calculateAge(driver.dob) || ' ',
        karmaScore: parseInt(driver.karma) || 0,
        creditScore: parseInt(driver.credit) || 0,
        riskScore: parseInt(driver.risk) || 0,
        avgDpd: parseFloat(driver.avgDpd) || 0,
        service: driver.service || 'N/A',
        runKm: parseInt(driver.runKm) || 0,
        nps: driver.nps === '-' ? null : parseInt(driver.nps),
        kmPerDay: Math.round((parseInt(driver.runKm) || 0) / 30),
        totalRunKms: parseInt(driver.runKm) || 0,
        repaymentStatus: (parseFloat(driver.avgDpd) || 0) <= 5 ? 'Prompt Payer' : 'Defaulter',
        status: 'Active',
        vehicleType: driver.product,
        batteryID: driver.batteryID || ' '
      })),
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        hasMore: false // Frontend will handle pagination
      },
      filters: { credit, risk, karma, searchId, onboarded }
    };

    console.log(`🚗 Returning ${response.drivers.length} drivers out of ${response.total} total`);
    res.json({ success: true, data: response });

  } catch (error) {
    console.error('Loan Drivers API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

export default router;
