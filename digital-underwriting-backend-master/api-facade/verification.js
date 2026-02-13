import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';
import { chargeCredits, CREDIT_COSTS } from '../Helper/creditUtils.js';

const router = express.Router();

// Risk score verification endpoint
router.post('/risk', async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    
    if (!name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone number are required'
      });
    }

    const creditCheck = await chargeCredits({
      req,
      action: 'risk',
      cost: CREDIT_COSTS.risk,
    });

    if (!creditCheck.ok) {
      return res.status(creditCheck.status).json({
        success: false,
        error: creditCheck.error,
        errorCode: creditCheck.status,
        credits: creditCheck.credits,
      });
    }

    // Call GraphQL resolver
    const graphqlData = await resolvers.Query.risk(
      null,
      { 
        input: { 
          name: name.trim(),
          phoneNumber: phoneNumber.trim()
        }
      },
      { req }
    );

    // Handle error scenarios
    if (graphqlData?.error || (graphqlData?.statusCode && graphqlData.statusCode !== 200)) {
      const statusCode = graphqlData.error?.status || graphqlData.statusCode || 500;
      const errorMessage = graphqlData.error?.message || 'Risk score verification failed';
      
      return res.status(statusCode).json({
        success: false,
        error: errorMessage,
        errorCode: statusCode
      });
    }

    if (!graphqlData?.data) {
      return res.status(404).json({
        success: false,
        error: 'No risk data found'
      });
    }
    
    // Extract data from GraphQL response
    const data = graphqlData.data;
    
    // Map to frontend format
    const responseData = {
      transactionId: data.transactionId,
      riskScore: data.riskScore,
      status: data.status,
      timestamp: data.timestamp,
      header: {
        name: data.header?.name,
        mobile: data.header?.mobile
      },
      insights: {
        positives: data.insights?.positives || [],
        negatives: data.insights?.negatives || []
      },
      riskAssessment: {
        identity: {
          identityConfidence: data.allFourRisk?.identity?.identityConfidence
        },
        telecom: {
          telecomRisk: data.allFourRisk?.telecom?.telecomRisk,
          isPhoneReachable: data.allFourRisk?.telecom?.isPhoneReachable,
          currentNetworkName: data.allFourRisk?.telecom?.currentNetworkName,
          phoneFootprintStrength: data.allFourRisk?.telecom?.phoneFootprintStrengthOverall
        },
        digital: {
          digitalFootprint: data.allFourRisk?.digital?.digitalFootprint,
          nameMatchScore: data.allFourRisk?.digital?.nameMatchScore,
          phoneDigitalAge: data.allFourRisk?.digital?.phoneDigitalAge
        },
        social: {
          socialFootprintScore: data.allFourRisk?.social?.socialFootprintScore,
          phoneSocialMediaCount: data.allFourRisk?.social?.phoneSocialMediaCount,
          socialMediaScore: data.allFourRisk?.social?.socialMediaScore,
          eCommerceScore: data.allFourRisk?.social?.eCommerceScore,
          workUtilityScore: data.allFourRisk?.social?.workUtilityScore
        }
      },
      detailedAttributes: {
        telecom: data.telecomAttributes,
        digital: data.digitalAttributes,
        social: data.socialAttributes
      }
    };
    
    res.json({
      success: true,
      data: responseData,
      credits: creditCheck.balance,
    });

  } catch (error) {
    console.error('Risk Score Verification API Error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorCode: 401
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      errorCode: 500
    });
  }
});

// Vehicle verification endpoint
router.post('/vehicle', async (req, res) => {
  try {
    const { rcNumber } = req.body;
    
    if (!rcNumber) {
      return res.status(400).json({
        success: false,
        error: 'RC number is required'
      });
    }

    const creditCheck = await chargeCredits({
      req,
      action: 'vehicle',
      cost: CREDIT_COSTS.vehicle,
    });

    if (!creditCheck.ok) {
      return res.status(creditCheck.status).json({
        success: false,
        error: creditCheck.error,
        errorCode: creditCheck.status,
        credits: creditCheck.credits,
      });
    }

    // Call GraphQL resolver
    const graphqlData = await resolvers.Query.vehicle(
      null,
      { input: { rcNumber } },
      { req }
    );

    // Handle error scenarios
    if (graphqlData?.error || (graphqlData?.statusCode && graphqlData.statusCode !== 200)) {
      const statusCode = graphqlData.error?.status || graphqlData.statusCode || 500;
      const errorMessage = graphqlData.error?.message || 'Vehicle verification failed';
      
      return res.status(statusCode).json({
        success: false,
        error: errorMessage,
        errorCode: statusCode
      });
    }

    if (!graphqlData?.data && !graphqlData?.headerData) {
      return res.status(404).json({
        success: false,
        error: 'No vehicle data found'
      });
    }
    
    // Extract data from GraphQL response
    const data = graphqlData.data;
    
    // Map to frontend format
    const responseData = {
      registrationNumber: data.headerData?.registrationNumber,
      maker: data.headerData?.maker,
      model: data.vehicleInformation?.makerModel,
      financer: data.headerData?.financer,
      ownerName: data.owner?.name,
      fatherName: data.owner?.fatherName,
      mobileNumber: data.owner?.rcMobileNo,
      presentAddress: data.owner?.presentAddress,
      permanentAddress: data.owner?.permanentAddress,
      chassisNumber: data.vehicleInformation?.chassisNumber,
      engineNumber: data.vehicleInformation?.engineNumber,
      manufacturingYear: data.vehicleInformation?.manufacturedMonthYear,
      registrationDate: data.registration?.registrationDate,
      rto: data.registration?.registeredAt,
      rcStatus: 'ACTIVE', // Default status
      insuranceCompany: data.insurance?.insuranceCompany,
      insurancePolicyNumber: data.insurance?.insurancePolicyNumber,
      insuranceExpiryDate: data.insurance?.insuranceValidity,
      vehicleClass: data.vehicleInformation?.makerDescription,
      fuelType: data.additionalInformation?.fuelType,
      seatingCapacity: data.additionalInformation?.seatingCapacity,
      color: data.additionalInformation?.color,
      fitnessUpto: data.registration?.fitnessUpto
    };
    
    res.json({
      success: true,
      data: responseData,
      credits: creditCheck.balance,
    });

  } catch (error) {
    console.error('Vehicle Verification API Error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorCode: 401
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      errorCode: 500
    });
  }
});

// Credit score verification endpoint
router.post('/credit', async (req, res) => {
  try {
    const { firstName, lastName, mobile, pan } = req.body;
    
    if (!firstName || !lastName || !mobile || !pan) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, mobile, and PAN are required'
      });
    }

    const creditCheck = await chargeCredits({
      req,
      action: 'credit',
      cost: CREDIT_COSTS.credit,
    });

    if (!creditCheck.ok) {
      return res.status(creditCheck.status).json({
        success: false,
        error: creditCheck.error,
        errorCode: creditCheck.status,
        credits: creditCheck.credits,
      });
    }

    // Call GraphQL resolver
    const graphqlData = await resolvers.Query.credit(
      null,
      { 
        input: { 
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          mobile: mobile.trim(),
          pan: pan.trim().toUpperCase()
        }
      },
      { req }
    );

    // Handle error scenarios
    if (graphqlData?.error || (graphqlData?.statusCode && graphqlData.statusCode !== 200)) {
      const statusCode = graphqlData.error?.status || graphqlData.statusCode || 500;
      const errorMessage = graphqlData.error?.message || 'Credit report generation failed';
      
      return res.status(statusCode).json({
        success: false,
        error: errorMessage,
        errorCode: statusCode
      });
    }

    if (!graphqlData?.data) {
      return res.status(404).json({
        success: false,
        error: 'No credit data found'
      });
    }
    
    // Extract data from GraphQL response
    const data = graphqlData.data;
    
    // Map to frontend format
    const responseData = {
      transactionId: data.transactionId,
      status: data.status,
      timestamp: data.timestamp,
      header: {
        firstName: data.header?.firstName,
        lastName: data.header?.lastName,
        mobile: data.header?.mobile,
        pan: data.header?.pan
      },
      creditScore: data.data?.creditScore,
      creditReportLink: data.data?.creditReportLink,
      clientId: data.data?.clientId
    };
    
    res.json({
      success: true,
      data: responseData,
      credits: creditCheck.balance,
    });

  } catch (error) {
    console.error('Credit Score Verification API Error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorCode: 401
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      errorCode: 500
    });
  }
});

export default router;