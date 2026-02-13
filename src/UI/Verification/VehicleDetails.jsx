import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, User, Shield, Calendar, MapPin, CreditCard } from 'lucide-react';

export default function VehicleDetails({ vehicleData }) {
  const navigate = useNavigate();

  if (!vehicleData) {
    return (
      <div className="min-h-screen" style={{ background: '#F4F6FA' }}>
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md w-full">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: '#EFF9FD' }}>
              <Car className="w-10 h-10" style={{ color: '#119549' }} />
            </div>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#03354E', fontFamily: 'Arial, Helvetica, sans-serif' }}>
              No Vehicle Data
            </h2>
            <p className="text-gray-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Vehicle information could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const data = vehicleData.data || vehicleData;

  return (
    <div className="min-h-screen p-6" style={{ background: '#F4F6FA', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-6">
          
          
          <div className="flex-1  flex-row justify-between flex items-center mx-4">
            {/* <h1 className="text-3xl font-bold mb-2" style={{ color: '#03354E' }}>
              Vehicle Details
            </h1> */}
            <div className="flex items-center gap-2">
              
              <span className="text-2xl font-semibold" style={{ color: '#03354E' }}>
                {data.registrationNumber}
              </span>
            </div>
            <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
            
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium" style={{ color: '#03354E' }}>
              Back
            </span>
          </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Vehicle Overview Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border-0 px-8 py-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EFF9FD' }}>
                <Car className="w-7 h-7" style={{ color: '#119549' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#03354E' }}>
                Vehicle Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16  ">
              <div className="space-y-4">
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Financer
                  </label>
                  <p className="text-xl font-bold transition-colors duration-200 group-hover:text-green-600" style={{ color: '#119549' }}>
                    {data.maker} 
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Engine Number
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-green-600" style={{ color: '#03354E' }}>
                    {data.engineNumber || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Chassis Number
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-green-600" style={{ color: '#03354E' }}>
                    {data.chassisNumber || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Fuel Type
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-green-600" style={{ color: '#03354E' }}>
                    {data.fuelType || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Model Class
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-green-600" style={{ color: '#03354E' }}>
                    {data.model || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Manufacturing Month Year
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-green-600" style={{ color: '#03354E' }}>
                    {data.manufacturingYear || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Seating Capacity
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-green-600" style={{ color: '#03354E' }}>
                    {data.seatingCapacity || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Color
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-green-600" style={{ color: '#03354E' }}>
                    {data.color || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Registration Card */}
          <div className="space-y-6">
            {/* <div className="bg-white rounded-xl shadow-lg border-0 p-6 transition-all duration-200 hover:shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#F0FFEE' }}>
                  <Shield className="w-6 h-6" style={{ color: '#119549' }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#03354E' }}>Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium" style={{ color: '#818181' }}>RC Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    data.rcStatus === 'ACTIVE' 
                      ? 'text-white' 
                      : 'text-white'
                  }`} style={{
                    background: data.rcStatus === 'ACTIVE' ? '#119549' : '#DC2626'
                  }}>
                    {data.rcStatus || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium" style={{ color: '#818181' }}>Financer</span>
                  <span className="font-semibold" style={{ color: '#03354E' }}>
                    {data.financer || <span className="text-gray-400 italic">N/A</span>}
                  </span>
                </div>
              </div>
            </div> */}
            
            <div className="bg-white rounded-2xl shadow-lg border-0 p-6 transition-all duration-200 hover:shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#03354E' }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#03354E' }}>Registration</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium uppercase tracking-wider mb-1 block" style={{ color: '#818181' }}>
                    Registration Number
                  </label>
                  <p className="font-semibold" style={{ color: '#03354E' }}>
                    {data.registrationNumber || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium uppercase tracking-wider mb-1 block" style={{ color: '#818181' }}>
                    Registration Date
                  </label>
                  <p className="font-semibold" style={{ color: '#03354E' }}>
                    {data.registrationDate || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium uppercase tracking-wider mb-1 block" style={{ color: '#818181' }}>
                    RTO
                  </label>
                  <p className="font-semibold" style={{ color: '#03354E' }}>
                    {data.rto || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium uppercase tracking-wider mb-1 block" style={{ color: '#818181' }}>
                    Fitness Upto
                  </label>
                  <p className="font-semibold" style={{ color: '#03354E' }}>
                    {data.fitnessUpto || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border-0 px-8 py-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FFF7E6' }}>
                <User className="w-7 h-7" style={{ color: '#FA7501' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#03354E' }}>
                Owner Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Owner Name
                  </label>
                  <p className="text-xl font-bold transition-colors duration-200 group-hover:text-orange-500" style={{ color: '#FA7501' }}>
                    {data.ownerName || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Father's Name
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-orange-500" style={{ color: '#03354E' }}>
                    {data.fatherName || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Mobile Number
                  </label>
                  <p className="text-lg font-medium transition-colors duration-200 group-hover:text-orange-500" style={{ color: '#03354E' }}>
                    {data.mobileNumber || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Present Address
                  </label>
                  <p className="text-lg font-medium leading-relaxed transition-colors duration-200 group-hover:text-orange-500" style={{ color: '#03354E' }}>
                    {data.presentAddress || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium uppercase tracking-wider mb-2 block" style={{ color: '#818181' }}>
                    Permanent Address
                  </label>
                  <p className="text-lg font-medium leading-relaxed transition-colors duration-200 group-hover:text-orange-500" style={{ color: '#03354E' }}>
                    {data.permanentAddress || <span className="text-gray-400 italic">N/A</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border-0 p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#EFF9FD' }}>
                <CreditCard className="w-6 h-6" style={{ color: '#119549' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: '#03354E' }}>Insurance</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-sm font-medium uppercase tracking-wider mb-1 block" style={{ color: '#818181' }}>
                  Insurance Company
                </label>
                <p className="font-semibold" style={{ color: '#03354E' }}>
                  {data.insuranceCompany || <span className="text-gray-400 italic">N/A</span>}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium uppercase tracking-wider mb-1 block" style={{ color: '#818181' }}>
                  Policy Number
                </label>
                <p className="font-semibold" style={{ color: '#03354E' }}>
                  {data.insurancePolicyNumber || <span className="text-gray-400 italic">N/A</span>}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium uppercase tracking-wider mb-1 block" style={{ color: '#818181' }}>
                  Expiry Date
                </label>
                <p className="font-semibold" style={{ color: '#03354E' }}>
                  {data.insuranceExpiryDate || <span className="text-gray-400 italic">N/A</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}