import React from 'react';
import '../../styles/users.css';

const UsersShell = ({ title, subtitle, flat = false, children }) => {
  const shouldShowHeader = Boolean(title || subtitle);
  return (
    <div className="users-view">
      <div
        className={`users-content users-content-standalone${flat ? ' users-content-flat' : ''}`}
      >
        {shouldShowHeader ? (
          <div className="users-content-header">
            <div>
              {title ? <h1>{title}</h1> : null}
              {subtitle ? <p className="users-subtitle">{subtitle}</p> : null}
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default UsersShell;
