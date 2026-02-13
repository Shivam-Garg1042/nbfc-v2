// digital-underwriting-backend-master/api-facade/users.js
import express from 'express';
import { resolvers } from '../SchemaResolvers/ParentFolder-SRs/Parent-SR.js';

const router = express.Router();

// Create user via REST API
router.post('/create', async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;
    
    const result = await resolvers.Mutation.newUser(
      null,
      { input: { name, email, password, role, organization } },
      { req }
    );
    
    if (result.error) {
      return res.status(result.status || 400).json({
        success: false,
        error: result.error.message
      });
    }
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create user"
    });
  }
});

export default router;