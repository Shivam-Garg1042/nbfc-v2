// digital-underwriting-backend-master/api-facade/auth.js
import express from 'express';
import { loginResolvers } from '../SchemaResolvers/login-SR.js';
import userModel from '../MongoDB/userModel.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Use the specific login resolver (login is in Query, not Mutation)
    const loginResult = await loginResolvers.Query.login(
      null,
      { input: { email, password } },
      { res } // Only pass res, not req
    );
    
    if (loginResult.error || loginResult.status !== 200) {
      return res.status(loginResult.status || 401).json({
        success: false,
        error: loginResult.error?.message || loginResult.error || "Login failed"
      });
    }
    
    const user = await userModel.findOne({ email }).select('credits verificationAccess');

    // Login successful
    res.json({
      success: true,
      data: {
        user: loginResult.data.user,
        role: loginResult.data.role?.role || loginResult.data.role,
        organization: loginResult.data.organization,
        email: loginResult.data.email,
        credits: user?.credits ?? 0,
        verificationAccess: user?.verificationAccess !== false,
      }
    });
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});



// Check auth status
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated"
      });
    }

    // Verify JWT token
    const jwt = await import('jsonwebtoken');
    const payload = jwt.default.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({ email: payload.email }).select('credits verificationAccess');

    res.json({
      success: true,
      data: {
        user: payload.user || payload.name,
        role: payload.role?.role || payload.role,
        organization: payload.organization,
        email: payload.email,
        credits: user?.credits ?? 0,
        verificationAccess: user?.verificationAccess !== false,
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({
      success: false,
      error: "Invalid or expired token"
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

export default router;