import express from 'express';
import last7DaysRunKm from '../APIs/last7DaysRunKm.js';

const router = express.Router();

router.get('/:batteryId', async (req, res) => {
  try {
    const { batteryId } = req.params;
    
    console.log('📊 Last 7 Days KM API called for batteryId:', batteryId);
    
    const last7DaysData = await last7DaysRunKm(batteryId);
    
    if (!last7DaysData || last7DaysData.length === 0) {
      return res.json([]);
    }
    
    console.log('✅ Last 7 Days KM data:', last7DaysData);
    res.json(last7DaysData);
    
  } catch (error) {
    console.error('❌ Error in Last 7 Days KM API:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching last 7 days data',
      error: error.message
    });
  }
});

export default router;
