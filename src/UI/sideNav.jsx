import React, { useState } from 'react'
import './../styles/sideNav.css'
import { CgProfile } from "react-icons/cg";
import { useAuth } from '../contexts/AuthContext';
import { useNbfcFilter } from './NBFCFilter/NbfcFilterContext';
import { useLocation } from 'react-router-dom';
import Dashboard from '../svg/Dashboard';
import Home from '../svg/Home';
import DriverAnalytics from '../svg/DriverAnalytics';
import ActionableInsights from '../svg/ActionableInsights';
import Favorites from '../svg/Favorites';
import chargeupLogo from '/images/Chargeup Logo_white jpg.jpg'
import { MdOutlineVerified } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";


function sideNav() {
    const [navWidth, setNavWidth] = useState('50px');
    const [rightPadding, setRightPadding] = useState('60px');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { user, logout } = useAuth();
    const { selectedNbfc } = useNbfcFilter();
    const location = useLocation();
    const isUsersSection = location.pathname.startsWith('/users');
    const canManageUsers = user?.role !== 'employee';
    const canViewVerification = user?.verificationAccess !== false;

    // Helper function to determine if Home and Verification should be shown
    const shouldShowAllNbfcTabs = () => {
        // For ChargeUp users (admin/employee), ALWAYS show all tabs regardless of filter
        if (user?.role === 'admin' || user?.role === 'employee') {
            return true;
        }
        // For NBFC users, only show if their organization is 'chargeup'
        if (user?.role === 'nbfc') {
            return user?.organization?.toLowerCase() === 'chargeup';
        }
        // Default to showing for any other case
        return true;
    };

    const openNav = () => {
        setNavWidth("256px");
        setRightPadding('0px');
    }
    const closeNav = () => {
        setNavWidth("50px");
        setRightPadding('60px');
        setShowProfileDropdown(false);
    }

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    }

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    }

    const confirmLogout = async () => {
        await logout();
        setShowLogoutModal(false);
    }

    const cancelLogout = () => {
        setShowLogoutModal(false);
    }
    return (
        <>
            <div id="mySidenav" className="sidenav" onMouseEnter={openNav} onMouseLeave={closeNav} style={{ width: navWidth, paddingRight: rightPadding }}>
                {/* <a href="javascript:void(0)" className="closebtn" onMouseEnter={closeNav}>&times;</a> */}
                {!isUsersSection && (
                    <div className="profile" onClick={toggleProfileDropdown}>
                        <CgProfile style={{width: '24px', height: '24px'}}/>
                        <p>Profile</p>
                        <span style={{ marginLeft: 'auto', fontSize: '12px' }}>▼</span>
                    </div>
                )}
                
                {/* Profile Dropdown */}
                {!isUsersSection && showProfileDropdown && navWidth === "256px" && (
                    <div className="profile-dropdown">
                        <div className="dropdown-item organization">
                            {user?.organization || 'ChargeUp'}
                        </div>
                        <div className="dropdown-item logout-btn" onClick={handleLogoutClick}>
                            Logout
                        </div>
                    </div>
                )}
                {isUsersSection ? (
                    <>
                        <a href="/users/myProfile">
                            <div className="wrapping">
                                <CgProfile style={{width: '22px', height: '22px'}}/>
                                <p>My Profile</p>
                            </div>
                        </a>
                        {canManageUsers && (
                            <a href="/users/allUsers">
                                <div className="wrapping">
                                    <FaUsers style={{width: '22px', height: '22px', color: 'inherit'}}/>
                                    <p>All Users</p>
                                </div>
                            </a>
                        )}
                        {canManageUsers && (
                            <a href="/users/createUser">
                                <div className="wrapping">
                                    <FaUser style={{width: '22px', height: '18px', color: 'inherit'}}/>
                                    <p>Create User</p>
                                </div>
                            </a>
                        )}
                        <a href={canViewVerification ? "/verification" : "/home"}>
                            <div className="wrapping">
                                <IoMdArrowBack style={{width: '22px', height: '22px', color: 'inherit'}}/>
                                <p>Back</p>
                            </div>
                        </a>
                        <div className="wrapping" onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>
                            <IoLogOutOutline style={{width: '22px', height: '22px'}}/>
                            <p>Logout</p>
                        </div>
                    </>
                ) : (
                    <>
                        {shouldShowAllNbfcTabs() && (
                            <a href="/">
                                <div className="wrapping">
                                    <Home/>
                                    <p>Home</p>
                                </div>
                            </a>
                        )}
                        <a href="/home">
                            <div className="wrapping">
                                <Dashboard/>
                                <p>Dashboard</p>
                            </div>
                        </a>
                       
                        <a href="/productView">
                            <div className="wrapping">
                                <DriverAnalytics/>
                                <p>Driver Analytics</p>
                            </div>
                        </a>
                        <a href="/actionable">
                            <div className="wrapping">
                                <ActionableInsights/>
                                <p>Actionable Insights</p>
                            </div>
                        </a>
                        <a href="https://assets.batterypulse.echargeup.com/" target="_blank" rel="noreferrer">
                            <div className="wrapping">
                                <Favorites/>
                                <p>Assets</p>
                            </div>
                        </a>
                        
                        {shouldShowAllNbfcTabs() && canViewVerification && (
                            <a href="/verification" >
                                <div className="wrapping">
                                    <MdOutlineVerified style={{width: '24px', height: '24px', color: 'inherit'}}/>
                                    <p>Verification</p>
                                </div>
                            </a>
                        )}
                        <a href="/users/myProfile">
                            <div className="wrapping">
                                <FaUsers style={{width: '22px', height: '22px', color: 'inherit'}}/>
                                <p>Users</p>
                            </div>
                        </a>
                    </>
                )}
               
                <div className=" ml-4 mt-24  relative bottom-4 ">
                        <img src={chargeupLogo} alt="chargeup" className='logo'/>
                      </div>
            </div>
            
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                // <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 h-screen">
                    <div className="logout-modal">
                        <div className="modal-header">
                            <span className="warning-icon">⚠️</span>
                            <h3>Confirm Logout</h3>
                            <button className="close-btn" onClick={cancelLogout}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to logout? You will need to sign in again to access your account.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={cancelLogout}>Cancel</button>
                            <button className="logout-confirm-btn" onClick={confirmLogout}>
                             Logout
                            </button>
                        </div>
                    </div>
                </div>
                // </div>
            )}
            
            {/* <span onMouseEnter={openNav}>&#9776;</span> */}
    
        </>
    )
}

export default sideNav