import express from 'express';
import gpsLocationBattery from '../APIs/gpsLocationBattery.js';

const router = express.Router();

router.get('/:batteryId', async (req, res) => {
  try {
    const { batteryId } = req.params;
    
    const gpsResult = await gpsLocationBattery(batteryId);
    
    if (gpsResult.error) {
      return res.json({
        success: false,
        message: 'GPS data not available',
        error: gpsResult.error,
        fallback: true
      });
    }
    
    if (!gpsResult.data || gpsResult.data.length === 0) {
      return res.json({
        success: false,
        message: 'No GPS data found',
        fallback: true
      });
    }
    
    const routePoints = gpsResult.data
      .filter(point => point.latitude && point.longitude)
      .map(point => ({
        lat: parseFloat(point.latitude),
        lng: parseFloat(point.longitude)
      }));
    
    res.json({
      success: true,
      data: routePoints
    });
    
  } catch (error) {
    res.json({
      success: false,
      message: 'Error fetching GPS data',
      fallback: true
    });
  }
});

export default router;