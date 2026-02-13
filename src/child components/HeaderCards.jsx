import React from 'react'
import './../styles/HeaderCards.css'
import HeaderGraphs from './HeaderGraphs'

function HeaderCards({props}) {
    return (
        <div className='content'>
            <div className="upper">
                <div className="info">
                    <h3>{props.title1}</h3>
                    <h2>{props.amount}</h2>
                </div>
                <div className="cards" style={{backgroundColor: props.cardColor}}>
                    <p>{props.image}</p>
                </div>
            </div>
            <div className="middle">
                <HeaderGraphs props={props}/>
            </div>
            <div className="lower">
                <div className="info">
                    <h3>{props.title2}</h3>
                    <h4>{props.amount2}</h4>
                </div>
                <div className="info">
                    <h3>{props.title3}</h3>
                    <h4>{props.amount3}</h4>
                </div>
            </div>
        </div>
    )
}

export default HeaderCards