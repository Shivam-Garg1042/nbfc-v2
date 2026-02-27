import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UsersShell from './UsersShell';
import ApiService from '../../services/api';

const ORGANIZATION_OPTIONS = [
  { value: 'chargeup', label: 'Chargeup' },
  { value: 'mega corp', label: 'Mega Corp' },
  { value: 'amu', label: 'AMU' },
  { value: 'ascend', label: 'Ascend' },
  { value: 'shivakari', label: 'Shivakari' },
  { value: 'svcl', label: 'SVCL' }
];

const CHARGEUP_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'employee', label: 'Employee' }
];

const NBFC_ROLE_OPTIONS = [
  { value: 'nbfc', label: 'NBFC Admin' },
  { value: 'employee', label: 'Employee' }
];

const CreateUser = () => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';
  const isNbfcUser = user?.role === 'nbfc';

  const defaultOrganization = useMemo(() => {
    if (isNbfcUser && user?.organization) {
      return user.organization.toLowerCase();
    }
    return 'chargeup';
  }, [isNbfcUser, user?.organization]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: defaultOrganization,
    role: 'employee',
    verificationAccess: 'yes'
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizationOptions = useMemo(() => {
    if (!isNbfcUser) {
      return ORGANIZATION_OPTIONS;
    }

    const match = ORGANIZATION_OPTIONS.find(
      (option) => option.value === defaultOrganization
    );

    if (match) {
      return [match];
    }

    return [
      {
        value: defaultOrganization,
        label: user?.organization || defaultOrganization
      }
    ];
  }, [defaultOrganization, isNbfcUser, user?.organization]);

  const roleOptions = useMemo(() => {
    if (isNbfcUser) {
      return [{ value: 'employee', label: 'Employee' }];
    }

    if (formData.organization === 'chargeup') {
      return CHARGEUP_ROLE_OPTIONS;
    }

    return NBFC_ROLE_OPTIONS;
  }, [formData.organization, isNbfcUser]);

  useEffect(() => {
    if (!roleOptions.find((option) => option.value === formData.role)) {
      setFormData((prev) => ({ ...prev, role: roleOptions[0].value }));
    }
  }, [formData.role, roleOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setIsSuccess(false);

    if (isEmployee) {
      setStatusMessage('Employees cannot create users.');
      setIsSuccess(false);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setStatusMessage('Name, email, and password are required.');
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await ApiService.createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        organization: formData.organization,
        role: formData.role,
        verificationAccess: formData.verificationAccess === 'yes'
      });

      if (response.success) {
        setStatusMessage('User created successfully.');
        setIsSuccess(true);
        setFormData((prev) => ({
          ...prev,
          name: '',
          email: '',
          password: ''
        }));
      } else {
        setStatusMessage(response.error || 'Unable to create user.');
        setIsSuccess(false);
      }
    } catch (error) {
      const apiError = error?.data?.error;
      setStatusMessage(apiError || 'Connect backend to create users.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UsersShell
      
    >
      {statusMessage ? (
        <div className={`users-banner${isSuccess ? ' users-success' : ''}`}>
          {statusMessage}
        </div>
      ) : null}
      <div className="profile-card create-user-card">
        <div className="profile-visual">
          <img src="/images/createUser.png" alt="Create user" />
        </div>
        <div className="profile-info">
          <div className="profile-details">
            <form className="users-form users-form-rows" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label htmlFor="password">Password:</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label htmlFor="organization">Organization:</label>
                <select
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  disabled={isNbfcUser}
                >
                  {organizationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="role">Role:</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="verificationAccess">Verification Access:</label>
                <select
                  id="verificationAccess"
                  name="verificationAccess"
                  value={formData.verificationAccess}
                  onChange={handleChange}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="users-primary-btn create-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </UsersShell>
  );
};

export default CreateUser;
