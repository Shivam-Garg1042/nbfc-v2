import React from 'react'
import OverviewCards from './OverviewCards'
import MyProducts from './MyProducts'
import MainData from './MainData.jsx'
import './../../styles/Dashboard.css'

function Dashboard() {
  return (
    <>
        <OverviewCards/>
        <div className="bundle">
          <MainData/>
          <MyProducts/>
        </div>
    </>
  )
}

export default Dashboard