import React, { useState } from 'react';
import DriverOverviewCard from './DriverOverviewCard';
import CreditVsRiskCard from './CreditVsRiskCard';
import CreditVsKarmaCard from './CreditVsKarmaCard';
import MonthlyDrivingTrends from './MonthlyDrivingTrends';
import EmiTrendsPie from './EmiTrendsPie';
import NpsSatisfactionCard from './NpsSatisfactionCard';

import '../../styles/Home.css';

export default function DashboardOverview() {
  // const [selectedNBFC, setSelectedNBFC] = useState('all');

  return (
    <div className="dashboard-overview">
      {/* NBFC Filter for admin/employee */}
      {/* <NBFCFilter 
        selectedNBFC={selectedNBFC}
        onNBFCChange={setSelectedNBFC}
      /> */}
      
      {/* Overview Cards with NBFC filtering */}
      {/* <OverviewCards nbfcFilter={selectedNBFC} /> */}
      
      <div className="dashboard-main-grid">
        {/* Top Row */}
        <DriverOverviewCard />
        <CreditVsRiskCard />
        <CreditVsKarmaCard />
        </div>
        <br></br>
       <div className = "dashboard-main2-grid">
         <MonthlyDrivingTrends />
         <EmiTrendsPie />
         <NpsSatisfactionCard />
       </div>
        
      
    </div>
  );
}
