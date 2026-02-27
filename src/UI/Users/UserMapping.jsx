import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import UsersShell from './UsersShell';

const UserMapping = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchMapping = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await ApiService.getUserDriverMapping(userId);
        const ids = response?.data?.driverIds || [];
        if (isMounted) {
          setSelectedIds(new Set(ids));
          setSelectedDrivers(ids.map((id) => ({ driverId: id })));
        }
      } catch (error) {
        if (isMounted) {
          setStatusMessage('Saved mapping could not be loaded.');
        }
      }
    };

    fetchMapping();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const fetchDrivers = async () => {
      setIsLoading(true);
      setStatusMessage('');

      try {
        const response = await ApiService.getLoanDrivers({});
        const items = response?.data || [];
        if (!isMounted) {
          return;
        }

        let filtered = items;
        if (user?.role === 'nbfc' && user?.organization) {
          const orgKey = user.organization.toLowerCase();
          filtered = items.filter((driver) => {
            const onboarded = (driver.onboarded || '').toLowerCase();
            return onboarded === orgKey;
          });
        }

        setDrivers(filtered);
      } catch (error) {
        if (isMounted) {
          setStatusMessage('Unable to load drivers.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDrivers();

    return () => {
      isMounted = false;
    };
  }, [user?.organization, user?.role]);

  const filteredDrivers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return drivers.filter((driver) => {
      if (!normalizedSearch) {
        return true;
      }

      return [driver.driverId, driver.name, driver.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }, [drivers, searchTerm]);

  const toggleSelected = (driver) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(driver.driverId)) {
        next.delete(driver.driverId);
        setSelectedDrivers((current) =>
          current.filter((item) => item.driverId !== driver.driverId)
        );
      } else {
        next.add(driver.driverId);
        setSelectedDrivers((current) => [...current, driver]);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setStatusMessage('');
      const driverIds = Array.from(selectedIds);
      await ApiService.saveUserDriverMapping(userId, driverIds);
      setStatusMessage('Driver mapping saved successfully.');
    } catch (error) {
      setStatusMessage('Unable to save driver mapping.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UsersShell
      title="Driver Mapping"
      subtitle="Select drivers that this user can access across all tabs."
    >
      {statusMessage ? (
        <div className="users-banner users-success">{statusMessage}</div>
      ) : null}
      <div className="mapping-grid">
        <div className="mapping-panel">
          <div className="mapping-title">Via File Upload</div>
          <div className="mapping-upload">
            <button type="button" className="mapping-upload-btn">
              Upload File
            </button>
            <button type="button" className="mapping-render-btn">
              Render
            </button>
          </div>
          <div className="mapping-meta">
            <div>
              <div className="mapping-meta-label">Supported Format</div>
              <div className="mapping-meta-value">.xlsx .xls .csv</div>
            </div>
            <div>
              <div className="mapping-meta-label">Sample Format</div>
              <button type="button" className="mapping-sample-btn">
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="mapping-panel">
          <div className="mapping-search">
            <input
              type="text"
              placeholder="Search driver"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="mapping-lists">
            <div className="mapping-list">
              <div className="mapping-list-header">Driver Id</div>
              <div className="mapping-list-body">
                {isLoading ? (
                  <div className="mapping-empty">Loading drivers...</div>
                ) : filteredDrivers.length === 0 ? (
                  <div className="mapping-empty">No drivers found.</div>
                ) : (
                  filteredDrivers.map((driver) => (
                    <label key={driver.driverId} className="mapping-row">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(driver.driverId)}
                        onChange={() => toggleSelected(driver)}
                      />
                      <span>{driver.driverId}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <div className="mapping-list">
              <div className="mapping-list-header">Selected</div>
              <div className="mapping-list-body">
                {selectedDrivers.length === 0 ? (
                  <div className="mapping-empty">No drivers selected.</div>
                ) : (
                  selectedDrivers.map((driver) => (
                    <div key={driver.driverId} className="mapping-row selected">
                      <span>{driver.driverId}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <button type="button" className="mapping-submit" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
      <button type="button" className="mapping-back" onClick={() => navigate(-1)}>
        Back to All Users
      </button>
    </UsersShell>
  );
};

export default UserMapping;
