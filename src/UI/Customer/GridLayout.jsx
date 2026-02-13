import React from 'react'
import '../../styles/GridLayout.css'
import CreditScoreGauge from '../../child components/CreditScoreGauge'
import KarmaScoreGauge from '../../child components/KarmaScoreGauge'
import RiskScoreGauge from '../../child components/RiskScoreGauge'
import ExpenseEarningGraph from '../../child components/ExprenseEarningGraph'
import RunKmsTrends from '../../child components/RunKmsTrends'
import RouteMap from '../../child components/RouteMap'
import EmiHistory from '../../child components/EmiHistory'
import EmiDaysChart from '../../child components/EmiDaysChart'

function GridLayout({ driverData }) {
    if (!driverData) {
        return <div className="dashboard">Loading...</div>;
    }

    return (
        <div className="dashboard">
            {/* <div className="card">
                <h2>Credit Score</h2>
                <CreditScoreGauge score={driverData.financialInfo?.creditScore || 0} />
            </div>
            <div className="card">
                <h2>Karma Score</h2>
                <KarmaScoreGauge score={driverData.cardData?.karmaScore || 0} />
            </div>
            <div className="card">
                <h2>Risk Score</h2>
                <RiskScoreGauge score={driverData.riskInfo?.riskScore || 0} />
            </div> */}
            
            <div className="card h-340px">
                <h2>Expense vs Earnings</h2>
                <ExpenseEarningGraph driverData={driverData} />
            </div>
            <div className="card h-340px">
                <h2>Run Kms Trends</h2>
                {/* <div className="flex items-baseline justify-center"> */}
                    
                    
                    {/* <span className="text-sm text-gray-500">
                        Total Run Kms: {(driverData.runKmInfo?.thirdLast +driverData.runKmInfo?.thirdLast || 0).toLocaleString()}
                    </span> */}
                {/* </div> */}
                <RunKmsTrends driverData={driverData} />
            </div>
            <div className="card h-340px">
                <h2>EMI Days Late / Early</h2>
                <EmiDaysChart driverData={driverData} />
            </div>
            <div className="card ">
                <h2>EMI History</h2>
                <EmiHistory driverData={driverData} />
            </div>
            
        </div>
    )
}

export default GridLayout