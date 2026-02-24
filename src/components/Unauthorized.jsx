import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/users.css';

const Unauthorized = () => {
  return (
    <div className="users-view">
      <div className="users-shell">
        <div className="users-content" style={{ gridColumn: '1 / -1' }}>
          <div className="users-content-header">
            <div>
              <h1>Access Restricted</h1>
              <p className="users-subtitle">
                You do not have permission to view this page.
              </p>
            </div>
          </div>
          <div className="users-card">
            <p className="users-subtitle">
              Return to your profile or contact an administrator for access.
            </p>
            <div style={{ marginTop: '16px' }}>
              <Link className="users-primary-btn" to="/users/myProfile">
                Go to My Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;