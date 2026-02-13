import React from 'react'
import Filters from '../Helper/Filters'
import './../styles/Home.css'
import Dashboard from './Dashboard/Dashboard'

function Home() {
  return (
    <div className='container'>
        <Filters/>
        <Dashboard/>
    </div>
  )
}

export default Home