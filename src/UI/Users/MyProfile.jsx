import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UsersShell from './UsersShell';

const MyProfile = () => {
  const { user } = useAuth();

  const credits = user?.credits ?? '-';
  const batteries = user?.batteries ?? '-';

  return (
    <UsersShell flat>
      <div className="profile-card">
        <div className="profile-visual">
          <img src="/images/myProfile.png" alt="Profile" />
        </div>
        <div className="profile-info">
         
          <div className="profile-details">
            <div className="profile-item">
              <span className="profile-label">Name</span>
              <span className="profile-value">{user?.name || '-'}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user?.email || '-'}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Organization</span>
              <span className="profile-value">{user?.organization || '-'}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Role</span>
              <span className="profile-value">{user?.role || '-'}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Batteries</span>
              <span className="profile-value">{batteries}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Credits</span>
              <span className="profile-value">{credits}</span>
            </div>
          </div>
        </div>
      </div>
    </UsersShell>
  );
};

export default MyProfile;
