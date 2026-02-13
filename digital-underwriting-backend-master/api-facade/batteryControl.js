import express from 'express';
import batteryControlAPI from '../APIs/batteryControlAPI.js';

const router = express.Router();

router.post('/:action', async (req, res) => {
  try {
    const { action } = req.params;
    const { batteryId } = req.body;
    
    console.log('🔋 Battery Control API called - Action:', action, 'Battery ID:', batteryId);
    
    if (!batteryId) {
      return res.status(400).json({
        success: false,
        error: {
          status: 400,
          message: 'Battery ID is required'
        }
      });
    }
    
    if (!['enable', 'disable'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: {
          status: 400,
          message: 'Invalid action. Must be "enable" or "disable"'
        }
      });
    }
    
    const result = await batteryControlAPI(action, batteryId);
    
    console.log('🔋 Battery Control result:', result);
    
    if (result.error) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    console.error('❌ Error in Battery Control API:', error);
    res.status(500).json({
      success: false,
      error: {
        status: 500,
        message: 'Internal server error'
      }
    });
  }
});

export default router;
