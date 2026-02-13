// src/UI/Dashboard/OverviewCards.jsx
import React, { useEffect, useState } from 'react'
import './../../styles/OverviewCards.css'
import HeaderCards from '../../child components/HeaderCards'
import HeaderCard3 from '../../svg/HeaderCard3'
import ApiService from '../../services/api'
import { useNbfcFilter } from '../NBFCFilter/NbfcFilterContext'
import { MdOutlineBookmarks } from "react-icons/md";

function OverviewCards() {
  const { selectedNbfc } = useNbfcFilter();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For initial load, show full loading
        if (!apiData) {
          setLoading(true);
        } else {
          // For filter changes, show only updating state
          setUpdating(true);
        }
        
        setError(null);
        const nbfcFilter = selectedNbfc || 'all';
        console.log('🔄 OverviewCards: Fetching data for NBFC:', nbfcFilter);
        const response = await ApiService.getDashboard(nbfcFilter);
        setApiData(response);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    };

    fetchData();
  }, [selectedNbfc]);

  // Skeleton card component for initial loading
  const SkeletonCard = ({ cardColor }) => (
    <div className="cards skeleton-card" style={{ backgroundColor: cardColor }}>
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-icon"></div>
      </div>
      <div className="skeleton-amount"></div>
      <div className="skeleton-chart"></div>
      <div className="skeleton-footer">
        <div className="skeleton-line skeleton-small"></div>
        <div className="skeleton-line skeleton-small"></div>
      </div>
    </div>
  );

  // Show skeleton cards on initial load
  if (loading && !apiData) {
    return (
      <div className="deckCards loading">
        <SkeletonCard cardColor="#F3FFF8" />
        <SkeletonCard cardColor="#EFF9FD" />
        <SkeletonCard cardColor="#FFF7FF" />
        <SkeletonCard cardColor="#F3FFF8" />
      </div>
    );
  }
  
  if (error || !apiData?.success) {
    return <div className="deckCards error">Failed to load dashboard data</div>;
  }
  
  const api = apiData.data;
  
  // Helper function to show loading state for numbers
  const formatNumber = (value, isUpdating) => {
    if (isUpdating) {
      return "..."; // Show dots while updating
    }
    return value?.toLocaleString() || "0";
  };
  
  // Create cards data with loading states
  const cardsData = [
    {
      title1: "Total Loan Amount",
      amount: updating ? "..." : (api.cardsData?.disbursed?.amount || "0"),
      cardColor: "#F3FFF8",
      image: "₹",
      line1: "#FFBABA",
      graph1: updating ? 0 : (api.cardsData?.disbursed?.active || 0),
      line2: "#46CB7F", 
      graph2: updating ? 0 : (api.cardsData?.disbursed?.closed || 0),
      title2: "Current AUM",
      amount2: updating ? "..." : (api.cardsData?.disbursed?.activeAmount || "0"),
      title3: "EMI Amount", 
      amount3: updating ? "..." : (api.cardsData?.disbursed?.emiAmount || "0"),
      isUpdating: updating
    },
    {
      title1: "Total Cases",
      amount: formatNumber(api.cardsData?.totalCases?.totalCases, updating),
      cardColor: "#EFF9FD",
      image: "👤",
      line1: "#3AB86D",
      graph1: updating ? 0 : (api.cardsData?.approved?.approved || 0),
      line2: "#FBC02D",
      graph2: updating ? 0 : (api.cardsData?.opportunityLost?.opportunityLost || 0),
      title2: "Approved",
      amount2: updating ? "..." : `${api.cardsData?.approved?.approved || 0} (${api.cardsData?.approved?.amount || "0"})`,
      title3: "Rejected (Opp Lost)",
      amount3: updating ? "..." : `${api.cardsData?.opportunityLost?.opportunityLost || 0} (${api.cardsData?.opportunityLost?.amount || "0"})`,
      isUpdating: updating
    },
    {
      title1: "DO Generated", 
      amount: formatNumber(api.cardsData?.DOGenerated?.DOGenerated, updating),
      cardColor: "#FFF7FF",
      image: <MdOutlineBookmarks style={{color: '#39B3FF', fontSize: '24px'}}/>,
      line1: "#FFBABA",
      graph1: updating ? 0 : (api.cardsData?.DOGenerated?.DOGenerated || 0),
      line2: "#39B3FF",
      graph2: updating ? 0 : (api.cardsData?.DisbursPending?.DisbursPending || 0),
      title2: "Disbursement Pending",
      amount2: updating ? "..." : `${api.cardsData?.DisbursPending?.DisbursPending || 0} (${api.cardsData?.DisbursPending?.amount || "0"})`,
      title3: "Do Pending", 
      amount3: updating ? "..." : (api.cardsData?.DisbursPending?.amount || "0"),
      isUpdating: updating
    },
    {
      title1: "Total Disbursed",
      amount: formatNumber(api.cardsData?.disbursed?.disbursed, updating),
      cardColor: "#F3FFF8",
      image: <HeaderCard3/>,
      line1: "#eeee",
      graph1: updating ? 0 : (api.cardsData?.disbursed?.active || 0),
      line2: "#FF8B6B",
      graph2: updating ? 0 : (api.cardsData?.disbursed?.closed || 0),
      title2: "Active",
      amount2: updating ? "..." : formatNumber(api.cardsData?.disbursed?.active, updating),
      title3: "Closed",
      amount3: updating ? "..." : formatNumber(api.cardsData?.disbursed?.closed, updating),
      isUpdating: updating
    }
  ];
  
  return (
    <div className={`deckCards ${updating ? 'updating' : ''}`}>
      {cardsData.map((item, index) => (
        <div className={`cards ${item.isUpdating ? 'card-updating' : ''}`} key={index}>
          <HeaderCards props={item}/>
        </div>   
      ))}
    </div>
  )
}

export default OverviewCards