import { useState } from 'react'
import Navbar from './UI/Navbar'
import SideNav from './UI/sideNav'
import Home from './UI/Home'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import ProductView from './UI/ProductView/ProductView'
import Customer from './UI/Customer/Customer'
import ActionableInsights from './UI/actionableInsights/actionableInsights'
import Verification from './UI/Verification/verification.jsx'
import VehicleDetails from './UI/Verification/VehicleDetails'
import RiskDetails from './UI/Verification/RiskDetails'
import CreditDetails from './UI/Verification/CreditDetails'
import MyProfile from './UI/Users/MyProfile'
import AllUsers from './UI/Users/AllUsers'
import CreateUser from './UI/Users/CreateUser'
import UserMapping from './UI/Users/UserMapping'
// import RiskDetails from './UI/Verification/RiskDetails'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './components/Unauthorized'
import { AuthProvider } from './contexts/AuthContext'
import { NbfcFilterProvider } from './UI/NBFCFilter/NbfcFilterContext'

import DashboardOverview from './UI/Home/DashboardOverview'

// Vehicle Details Page Component
function VehicleDetailsPage() {
  const { state } = useLocation();
  return <VehicleDetails vehicleData={state?.vehicleData} />;
}

// Risk Details Page Component
function RiskDetailsPage() {
  const { state } = useLocation();
  return <RiskDetails riskData={state?.riskData} />;
}

// Credit Details Page Component  
function CreditDetailsPage() {
  const { state } = useLocation();
  return <CreditDetails creditData={state?.creditData} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path='/login' element={<Login />} />
          
          {/* Protected routes */}
          <Route path='/' element={
            <ProtectedRoute>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <DashboardOverview /> 
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />
          
          <Route path='/home' element={
            <ProtectedRoute>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <Home />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />
          
          <Route path='/productView' element={
            <ProtectedRoute>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <ProductView />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />
          
          <Route path='/customer/:driverId' element={
            <ProtectedRoute>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <Customer />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />
          
          <Route path='/actionable' element={
            <ProtectedRoute>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <ActionableInsights />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />
          
          <Route path='/verification' element={
            <ProtectedRoute>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <Verification />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />
          
          <Route path='/vehicle-details' element={
            <ProtectedRoute>
              <VehicleDetailsPage />
            </ProtectedRoute>
          } />
          
          <Route path='/risk-details' element={
            <ProtectedRoute>
              <RiskDetailsPage />
            </ProtectedRoute>
          } />
          
          <Route path='/credit-details' element={
            <ProtectedRoute>
              <CreditDetailsPage />
            </ProtectedRoute>
          } />

          <Route path='/users/myProfile' element={
            <ProtectedRoute>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <MyProfile />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />

          <Route path='/users/allUsers' element={
            <ProtectedRoute requiredRoles={['admin', 'nbfc']}>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <AllUsers />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />

          <Route path='/users/createUser' element={
            <ProtectedRoute requiredRoles={['admin', 'nbfc']}>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <CreateUser />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />

          <Route path='/users/:userId/mapping' element={
            <ProtectedRoute requiredRoles={['admin', 'nbfc']}>
              <NbfcFilterProvider initial="all">
                <div className="app-layout">
                  <Navbar />
                  <SideNav />
                  <UserMapping />
                </div>
              </NbfcFilterProvider>
            </ProtectedRoute>
          } />

          <Route path='/unauthorized' element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App