import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsersShell from './UsersShell';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'admin', label: 'Admins' },
  { key: 'employee', label: 'Employees' }
];

const AllUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await ApiService.getUsers();
        if (isMounted) {
          setUsers(response.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage('Connect backend to load users.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const roleTabs = useMemo(() => {
    if (user?.role === 'nbfc') {
      return ROLE_TABS.filter((tab) => tab.key !== 'admin');
    }
    return ROLE_TABS;
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === 'nbfc' && activeRole === 'admin') {
      setActiveRole('all');
    }
  }, [activeRole, user?.role]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        activeRole === 'all' ||
        (user.role || '').toLowerCase() === activeRole;

      const matchesSearch =
        !normalizedSearch ||
        [user.name, user.email, user.organization, user.userId]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesRole && matchesSearch;
    });
  }, [users, activeRole, searchTerm]);

  return (
    <UsersShell
      title="All Users"
      subtitle="Search and manage every user under your organization."
    >
      {errorMessage ? <div className="users-banner">{errorMessage}</div> : null}
      <div className="users-toolbar">
        <div className="users-tabs">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`users-tab${activeRole === tab.key ? ' active' : ''}`}
              onClick={() => setActiveRole(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="users-search">
          <span>Search:</span>
          <input
            type="text"
            placeholder="Search name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="users-empty">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="users-empty">No users to display.</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Role</th>
              <th>Batteries</th>
              
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.userId || user.email}
                className="users-row-clickable"
                onClick={() => navigate(`/users/${encodeURIComponent(user.userId || user.email)}/mapping`)}
              >
                <td>{user.userId || '-'}</td>
                <td>{user.name || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{user.organization || '-'}</td>
                <td>{user.role || '-'}</td>
                <td>{user.batteries ?? 0}</td>
                
                <td>
                  <button
                    type="button"
                    className="users-secondary-btn"
                    onClick={async (event) => {
                      event.stopPropagation();
                      if (!window.confirm('Delete this user?')) {
                        return;
                      }
                      try {
                        setIsDeleting(user.userId || user.email);
                        setErrorMessage('');
                        await ApiService.deleteUser(user.userId || user.email);
                        setUsers((prev) => prev.filter((item) => (item.userId || item.email) !== (user.userId || user.email)));
                      } catch (error) {
                        const apiError = error?.data?.error || 'Unable to delete user.';
                        setErrorMessage(apiError);
                      } finally {
                        setIsDeleting(null);
                      }
                    }}
                    disabled={isDeleting === (user.userId || user.email)}
                  >
                    {isDeleting === (user.userId || user.email) ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </UsersShell>
  );
};

export default AllUsers;
