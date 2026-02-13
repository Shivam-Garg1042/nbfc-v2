import React from 'react';
import '../../styles/IconCard.css';
import RunKms from '../../svg/RunKms';
import AverageDPD from '../../svg/AverageDPD';
import { TbBatteryOff } from "react-icons/tb";
import Services from '../../svg/Services';
import LossDays from '../../svg/LossDays';
import NPS from '../../svg/NPS';
import ConcentricScoresChart from '../../child components/ConcentricScoresChart';

export default function IconCard({ driverData }) {
    if (!driverData) {
        return <div className="card-container">Loading...</div>;
    }

    // Calculate total earnings from the earning data
    const totalEarnings = driverData.earningExpense?.earnings ? 
        Object.values(driverData.earningExpense.earnings).reduce((sum, val) => sum + (val || 0), 0) : 0;

    return (
        <div className="icon-card-main-container">
            <div className="card-container">
                <div className="child">
                    <div className="logo" style={{ backgroundColor: '#DFFFEC' }}>
                        <p style={{ color: '#23BC64', fontWeight: '600', fontSize: '22px' }}>₹</p>
                    </div>
                    <div className="info">
                        <h4> Earnings</h4>
                        <h3>{totalEarnings.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="child">
                    <div className="logo" style={{ backgroundColor: '#876CF1' }}>
                        <RunKms/>
                    </div>
                    <div className="info">
                        <h4>Run Kms</h4>
                        <h3>{(driverData.cardData?.runKm || 0).toLocaleString()}</h3>
                    </div>
                </div>
                <div className="child">
                    <div className="logo" style={{ backgroundColor: '#FFEDFB' }}>
                        <AverageDPD/>
                    </div>
                    <div className="info">
                        <h4>Avg - DPD</h4>
                        <h3>{driverData.cardData?.avgDpd ? 
                            String(Math.round(driverData.cardData.avgDpd)) : '0'}</h3>
                    </div>
                </div>
                <div className="child">
                    <div className="logo" style={{ backgroundColor: '#EDFFF5' }}>
                        <TbBatteryOff style={{ width: '24px', height: '24px', color: '#23BC64' }}/>
                    </div>
                    <div className="info">
                        <h4>AON</h4>
                        <h3>{(driverData.cardData?.aon || 0).toLocaleString()}</h3>
                    </div>
                </div>
                <div className="child">
                    <div className="logo" style={{ backgroundColor: '#E3F4FF' }}>
                        <Services/>
                    </div>
                    <div className="info">
                        <h4>Services</h4>
                        <h3>{driverData.cardData?.service ? 
                            String(Math.round(driverData.cardData.service)) : '0'}</h3>
                    </div>
                </div>
                <div className="child">
                    <div className="logo" style={{ backgroundColor: '#F1FAFF' }}>
                        <LossDays/>
                    </div>
                    <div className="info">
                        <h4>Loss Days</h4>
                        <h3>{driverData.cardData?.lossDays ? 
                            String(Math.round(driverData.cardData.lossDays)) : '0'}</h3>
                    </div>
                </div>
                <div className="child">
                    <div className="logo" style={{ backgroundColor: '#FFF2E6' }}>
                        <NPS/>
                    </div>
                    <div className="info">
                        <h4>NPS</h4>
                        <h3>{driverData.cardData?.nps ? 
                            String(Math.round(driverData.cardData.nps)) : '0'}</h3>
                    </div>
                </div>
            </div>
            
            {/* Right side concentric chart */}
            <div className="concentric-chart-container">
                <ConcentricScoresChart driverData={driverData} />
            </div>
        </div>
    );
}