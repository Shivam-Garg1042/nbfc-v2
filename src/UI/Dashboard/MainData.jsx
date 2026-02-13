import React from 'react'
import './../../styles/mainData.css'
import MainDataCardGraph1 from '../../child components/MainDataCardGraph1'
import MainDataCardGraph2 from '../../child components/MainDataCardGraph2'

import MoreIcon from '../../svg/MoreIcon'
import LoanCategories from '../../child components/LoanCategories'
import DriverPieChart from '../../child components/DriverPieChart'

import DriverDistanceDistribution from '../../child components/DriverDistanceDistribution'

import ActivitiesByLocationsMap from '../../child components/ActivitiesByLocationsMap'
import EmiTrends from '../../child components/EmiTrends'
import  Impact  from '../Impact/Impact'
import InsuranceChart from '../../child components/InsuranceChart'



function mainData() {
  return (
    <>
      <div className="bundleCards">
        <div className="shortCard">
          <div className="manage">
            <h3>Login Overview</h3>
            <div className="alignRight">
              {/* <DownloadIcon/> */}
              <MoreIcon />
            </div>
          </div>
          <MainDataCardGraph1 />
        </div>
        <div className="shortCard">
          <div className="manage">
            <h3>Disbursment Overview</h3>
            <div className="alignRight">
              {/* <DownloadIcon/> */}
              <MoreIcon />
            </div>
          </div>
          <MainDataCardGraph2 />
        </div>
        
        <div className="shortCard">
          <div className="manage">
            <h3>EMI Tenure</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div>
          <EmiTrends/>
        </div>
        <div className="shortCard">
          <div className="manage">
            <h3>Driver Distance Distribution</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div>
          {/* <PerformanceChart/> */}
          <DriverDistanceDistribution/>
        </div>
        {/* <div className="shortCard"> */}
          {/* <div className="manage">
            <h3>Activities By Locations</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div> */}
          {/* <ActivitiesByLocationsMap />
        </div> */}
        <div className="shortCard">
          <div className="manage">
            <h3>ESGs</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div>
          <Impact/>
        </div>
        <div className="shortCard">
          <div className="manage">
            <h3>Top 5 Cities</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div>
          <DriverPieChart/>
          
          </div>
          {/* <div className="shortCard">
          <div className="manage">
            <h3>EMI History</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div>
      
          </div> */}
           
        {/* <div className="shortCard">
          <div className="manage">
            <h3>Insurance</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
            
          </div>
          <InsuranceChart/>
        </div> */}
          {/* <div className="longCard">
          <div className="manage">
            <h3>Drivers Performance</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div>
          <LoanCategories/>
        </div> */}
       

        
          
        
          <br></br>
        {/* <div className="shortCard">
          <div className="manage">
            <h3>EMI Trends</h3>
            <div className="alignRight">
              <MoreIcon />
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default mainData