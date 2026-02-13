import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import logo from '../assets/logo-chargeup.png';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect will happen automatically via AuthContext
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="logo-container">
            <img src = {logo} alt="ChargeUp Logo" className='w-58'/>
          </div>
      <div className="login-card">
        
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">User id</label>
            <div className="input-container">
              {/* <span className="input-icon">📧</span> */}
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@chargeup.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              {/* <span className="input-icon">🔒</span> */}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="sign-in-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        
      </div>
      <div className="login-footer">
          <p>© 2025 EV Management System. All rights reserved.</p>
        </div>
    </div>
  );
};

export default Login;