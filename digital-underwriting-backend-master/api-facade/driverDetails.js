import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';

const router = express.Router();

// Get individual driver details by ID
router.get('/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    console.log('👤 Driver Details API - ID:', driverId);

    if (!driverId) {
      return res.status(400).json({ 
        success: false,
        error: 'Driver ID is required' 
      });
    }

    // Call the existing driver GraphQL resolver
    const graphqlData = await resolvers.Query.driver(
      null,
      { input: driverId },
      { req }
    );

    if (graphqlData?.error) {
      console.log('❌ GraphQL error in driver details:', graphqlData.error);
      return res.status(500).json({ 
        success: false,
        error: graphqlData.error.message 
      });
    }

    if (!graphqlData.data) {
      return res.status(404).json({ 
        success: false,
        error: 'Driver not found' 
      });
    }

    // Transform response for frontend
    const response = {
      driver: {
        id: graphqlData.data.id,
        status: graphqlData.data.status,
        onboardedDate: graphqlData.data.onboardedDate,
        
        // Card data for header
        cardData: {
          service: graphqlData.data.cardData.service,
          runKm: parseFloat(graphqlData.data.cardData.runKm) || 0,
          lossDays: parseInt(graphqlData.data.cardData.lossDays) || 0,
          karmaScore: parseInt(graphqlData.data.cardData.karmaScore) || 0,
          nps: graphqlData.data.cardData.nps === '-' ? null : parseInt(graphqlData.data.cardData.nps),
          avgDpd: graphqlData.data.cardData.avgDpd === '-' ? null : parseFloat(graphqlData.data.cardData.avgDpd),
          aon: parseInt(graphqlData.data.cardData.aon) || 0
        },

        // Personal information
        personalInfo: {
          firstName: graphqlData.data.personalInformation.firstName,
          lastName: graphqlData.data.personalInformation.lastName,
          fullName: `${graphqlData.data.personalInformation.firstName} ${graphqlData.data.personalInformation.lastName}`,
          dob: graphqlData.data.personalInformation.dob,
          gender: graphqlData.data.personalInformation.gender,
          maritalStatus: graphqlData.data.personalInformation.maritalStatus,
          noOfChildren: graphqlData.data.personalInformation.noOfChildren,
          permanentAddress: graphqlData.data.personalInformation.permanentAddress,
          city: graphqlData.data.personalInformation.city,
          state: graphqlData.data.personalInformation.state,
            assetHandoverDay : graphqlData.data.personalInformation.assetHandoverDay
        },

        // Contact information
        contactInfo: {
          mobile: graphqlData.data.contactInformation.mobile,
          aadhaar: graphqlData.data.contactInformation.aadhaar,
          pan: graphqlData.data.contactInformation.pan,
          vpa: graphqlData.data.contactInformation.vpa,
          source: graphqlData.data.contactInformation.source
        },

        // Vehicle information
        vehicleInfo: {
          vehicleFinanced: graphqlData.data.vehicleInformation.vehicleFinanced,
          vehicleType: graphqlData.data.vehicleInformation.vehicleType,
          registrationNumber: graphqlData.data.vehicleInformation.vehicleRegistrationNumber,
          model: graphqlData.data.vehicleInformation.vehicleModel,
          serviceType: graphqlData.data.vehicleInformation.serviceType,
          registrationDate: graphqlData.data.vehicleInformation.registrationDate,
          ageInMonths: parseInt(graphqlData.data.vehicleInformation.vehicleAgeInMonths) || 0
        },

        // Financial information
        financialInfo: {
          bankAccountNumber: graphqlData.data.financialInformation.bankAccountNumber,
          ifscCode: graphqlData.data.financialInformation.IFSCCode,
          downPayment: parseFloat(graphqlData.data.financialInformation.downPayment) || 0,
          tenure: parseInt(graphqlData.data.financialInformation.tenure) || 0,
          creditScore: parseInt(graphqlData.data.financialInformation.creditScore) || 0,
          avgDpd: parseFloat(graphqlData.data.financialInformation.avgDpd) || 0,
          emiDpd: graphqlData.data.financialInformation.emiDpd || 0,
          
          emi: graphqlData.data.financialInformation.emiAmount || 0
        },

        // Risk and footprints
        riskInfo: {
          riskScore: parseInt(graphqlData.data.footprintsAndRisk.riskScore) || 0,
          socialFootPrint: parseInt(graphqlData.data.footprintsAndRisk.socialFootPrint) || 0,
          digitalFootPrint: parseInt(graphqlData.data.footprintsAndRisk.digitalFootPrint) || 0,
          phoneFootPrint: graphqlData.data.footprintsAndRisk.phoneFootPrint ,
          telecomRisk: graphqlData.data.footprintsAndRisk.telecomRisk,
          socialScore: parseInt(graphqlData.data.footprintsAndRisk.socialScore) || 0,
          identityConfidence: graphqlData.data.footprintsAndRisk.identityConfidence
        },

        // Business information
        businessInfo: {
          businessSegment: graphqlData.data.businessInformation.businessSegment,
          serviceType: graphqlData.data.businessInformation.serviceType
        },

        // Social media information
        socialMediaInfo: {
          amazon: graphqlData.data.socialMediaInformation.amazon,
          flipkart: graphqlData.data.socialMediaInformation.flipkart,
          instagram: graphqlData.data.socialMediaInformation.instagram,
          waBusiness: graphqlData.data.socialMediaInformation.waBusiness,
          paytm: graphqlData.data.socialMediaInformation.paytm,
          whatsapp: graphqlData.data.socialMediaInformation.whatsapp
        },

        // Run km trends
        runKmInfo: {
          thirdLast: parseFloat(graphqlData.data.runKmInformation.thirdLastRunKm) || 0,
          secondLast: parseFloat(graphqlData.data.runKmInformation.secondLastRunKm) || 0,
          last: parseFloat(graphqlData.data.runKmInformation.lastRunKm) || 0
        },

        // Earning vs expense
        earningExpense: {
          earnings: {
            thirdLast: parseFloat(graphqlData.data.earningVsExpense.earningInformation.thirdLastEarning) || 0,
            secondLast: parseFloat(graphqlData.data.earningVsExpense.earningInformation.secondLastEarning) || 0,
            last: parseFloat(graphqlData.data.earningVsExpense.earningInformation.lastEarning) || 0
          },
          expenses: {
            thirdLast: parseFloat(graphqlData.data.earningVsExpense.expenseInformation.thirdLastExpense) || 0,
            secondLast: parseFloat(graphqlData.data.earningVsExpense.expenseInformation.secondLastExpense) || 0,
            last: parseFloat(graphqlData.data.earningVsExpense.expenseInformation.lastExpense) || 0
          }
        }
      }
    };

    console.log(`👤 Returning driver details for ID: ${driverId}`);
    res.json({ success: true, data: response });

  } catch (error) {
    console.error('Driver Details API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

export default router;