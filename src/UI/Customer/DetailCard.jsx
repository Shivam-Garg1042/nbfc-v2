import React from 'react'

import '../../styles/DetailCard.css'
import Instagram from '../../svg/Instagram'
import Paytm from '../../svg/Paytm'
import { FaAmazon } from 'react-icons/fa'
import { SiFlipkart } from "react-icons/si";
import { FaWhatsapp,FaSquareWhatsapp } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

function DetailCard({ driverData }) {
    if (!driverData) {
        return <div className='main'>Loading...</div>;
    }

    

    const calculateYearsSince = (dateString) => {
        if (!dateString) return 0;
        const onboardDate = new Date(dateString);
        const today = new Date();
        const years = Math.floor((today - onboardDate) / (365.25 * 24 * 60 * 60 * 1000));
        if(years < 1){
            return Math.floor((today - onboardDate) / (30.44 * 24 * 60 * 60 * 1000)) + " months";
        }
       
        return years + " years";
        
        
    };

    return (
        <div className='main'>
            <div className='contain'>
                <div className="firstflex">
                    <div className='user-avatar'>
                        <FaUser size={32} color="#6B7280" />
                    </div>
                    <div className="child">
                        <div className="line">
                            <h3>{driverData.personalInfo?.fullName || 'Name not available'}</h3>
                            <p className='stock'>
                                Customer Since {calculateYearsSince(driverData.onboardedDate)} 
                            </p>
                        </div>
                        <div className="info">
                            <div className="children">{driverData.id || 'N/A'} </div>
                            <div className="children">
                                {driverData.personalInfo?.gender || 'N/A'} - {driverData.personalInfo?.dob ? new Date().getFullYear() - new Date(driverData.personalInfo.dob).getFullYear() : 'N/A'} years
                            </div>
                            
                            <div className="children">{driverData.businessInfo?.serviceType || 'N/A'}</div>
                            <div className="children">{driverData.contactInfo?.mobile || 'N/A'}</div>
                            
                        </div>
                    </div>
                </div>
                <div className="flex-parent">
                    <div className="child2">{driverData.status || 'Unknown'}</div>
                </div>
            </div>
            <div className="difference"></div>
            <div className="bottom-card">
                <div className="left">
                    <h5>Address</h5>
                    <p>{driverData.personalInfo?.permanentAddress || 'Address not available'}, {driverData.personalInfo?.city || ''}, {driverData.personalInfo?.state || ''}</p>
                </div>
                <div className="right social-icons">
                    
                    {driverData.socialMediaInfo?.instagram === "Account Found" && <Instagram/>}
                    {driverData.socialMediaInfo?.amazon === "Account Found" && <FaAmazon size={32}/>}
                    {driverData.socialMediaInfo?.flipkart === "Account Found" && <SiFlipkart size={36} />}
                    {driverData.socialMediaInfo?.whatsapp === "Account Found" && <FaWhatsapp size={32}/>}
                    {driverData.socialMediaInfo?.waBusiness === "Account Found" && <FaSquareWhatsapp size={32}/>}
                    {driverData.socialMediaInfo?.paytm === "Account Found" && <Paytm size={40}/>}
                </div>
            </div>
        </div>
    )
}

export default DetailCard