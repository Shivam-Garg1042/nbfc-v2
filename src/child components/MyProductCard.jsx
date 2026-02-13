import React from 'react'
import '../styles/MyProductCard.css'
import Arrow from '../svg/Arrow'
import IncreasigChart from '../svg/IncreasigChart'
import { Link } from 'react-router-dom'
import ProductView from '../UI/ProductView/ProductView'

function MyProductCard({ props }) {
    return (
        <div className='card'>
            <div className="firstflex">
                <img src={props.image} alt={props.titlle} />
                <div className="child">
                    <h3>{props.title}</h3>
                    <div className="line">
                        <h3>{props.value}</h3>
                        {/* <p className='unit'>&nbsp;{props.unit}</p> */}
                        {/* <p className='stock'>24.51%</p> */}
                        <IncreasigChart/>
                    </div>
                </div>
            </div>
            <div className="secondflex">
                <div className="line2">
                    <div className="child2">
                        <h4>{props.activeDrivers}</h4>
                        <p>Active Drivers</p>
                    </div>
                    {/* <div className="child2">
                        <h4>{props.totalAddedDrivers}</h4>
                        <p>Newly Added Drivers</p>
                    </div> */}
                </div>
            </div>
            <div className="thirdflex">
                <Link to="/productView">View More &nbsp;</Link>
                <Arrow/>
            </div>
        </div>
    )
}

export default MyProductCard