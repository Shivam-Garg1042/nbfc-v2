import express from 'express';
import dashboardFacade from './dashboard.js';
import authFacade from './auth.js';
import homeFacade from './home.js';
import actionableInsightsFacade from './actionableInsights.js';
import loanDriversFacade from './loanDrivers.js';
import driverDetailsFacade from './driverDetails.js';
import driverRouteFacade from './driverRoute.js';
import last7DaysKmFacade from './last7DaysKm.js';
import batteryControlFacade from './batteryControl.js';
import productDescFacade from './productDesc.js';
import verificationFacade from './verification.js';
import creditsFacade from './credits.js';

const router = express.Router();

// Mount all API facades
router.use('/dashboard', dashboardFacade);
router.use('/auth', authFacade);
router.use('/home', homeFacade);
router.use('/actionable-insights', actionableInsightsFacade);
router.use('/loan-drivers', loanDriversFacade);
router.use('/driver-details', driverDetailsFacade);
router.use('/driver-route', driverRouteFacade);
router.use('/last-7-days-km', last7DaysKmFacade);
router.use('/battery-control', batteryControlFacade);
router.use('/product-desc', productDescFacade);
router.use('/verification', verificationFacade);
router.use('/credits', creditsFacade);


// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});



export default router;