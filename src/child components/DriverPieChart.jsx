import { useState, useEffect } from 'react';
import '../styles/DriverPieChart.css'
import ApiService from '../services/api';
import { useNbfcFilter } from '../UI/NBFCFilter/NbfcFilterContext';

export default function DriverPieChart() {
  const { selectedNbfc } = useNbfcFilter();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [data, setData] = useState([]);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const nbfcFilter = selectedNbfc || 'all';
        const response = await ApiService.getChartData('city-distribution', nbfcFilter);
        
        if (response?.data && response.data.length > 0) {
          // Ensure percentages add up to 100% for complete circle
          const totalPercentage = response.data.reduce((sum, item) => sum + (item.percentage || 0), 0);
          
          // Calculate angles for each segment - always complete the circle
          let currentAngle = -90; // Start from top
          const chartData = response.data.map((item, index) => {
            // Normalize percentage to ensure total is 100%
            const normalizedPercentage = totalPercentage > 0 ? (item.percentage / totalPercentage) * 100 : 0;
            const angleSize = (normalizedPercentage / 100) * 360;
            
            const segment = {
              ...item,
              percentage: Math.round(normalizedPercentage),
              startAngle: currentAngle,
              endAngle: currentAngle + angleSize
            };
            currentAngle += angleSize;
            return segment;
          });
          
          // Ensure the last segment completes the circle
          if (chartData.length > 0) {
            chartData[chartData.length - 1].endAngle = 270; // Complete the circle
          }
          
          setData(chartData);
          setTotalDrivers(response.data.totalDrivers || chartData.reduce((sum, item) => sum + item.value, 0));
        } 
      } catch (error) {
        console.error('Failed to fetch city distribution data:', error);
        setData([]);
        setTotalDrivers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedNbfc]);
  
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    // Convert angles from degrees to radians
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    
    // Calculate the start and end points
    const startX = x + radius * Math.cos(start);
    const startY = y + radius * Math.sin(start);
    const endX = x + radius * Math.cos(end);
    const endY = y + radius * Math.sin(end);
    
    // Determine if the arc should be drawn in a clockwise or counterclockwise direction
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    // Create the SVG arc command
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Skeleton component for loading
  const PieChartSkeleton = () => (
    <div className="flex items-center justify-center gap-1 font-sans pb-4 pr-4">
      <div className="relative" style={{ width: 230, height: 230 }}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-52 h-52 rounded-full border-8 border-gray-200 border-t-blue-400 animate-spin"></div>
        </div>
        
        {/* Skeleton center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton legend */}
      <div className="flex flex-col gap-5 text-sm ml-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="h-2 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex items-center gap-1">
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-10 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <PieChartSkeleton />;
  }

  return (
    <div className="flex items-center justify-center gap-1 font-sans pb-4 pr-4">
      <div className="relative" style={{ width: 230, height: 230 }}>
        <svg width="230" height="230" viewBox="0 0 280 280">
          {/* Pink segment - Gurugram */}
          <path 
            d={describeArc(140, 140, 105, data[4].startAngle, data[4].endAngle)} 
            fill="none" 
            stroke={data[4].color} 
            strokeWidth="10" 
            strokeLinecap="round"
          />
          
          {/* Sky blue segment - Noida */}
          <path 
            d={describeArc(140, 140, 105, data[3].startAngle, data[3].endAngle)} 
            fill="none" 
            stroke={data[3].color} 
            strokeWidth="14" 
            strokeLinecap="round"
          />
          
          {/* Red segment - Ghaziabad */}
          <path 
            d={describeArc(140, 140, 105, data[2].startAngle, data[2].endAngle)} 
            fill="none" 
            stroke={data[2].color} 
            strokeWidth="18" 
            strokeLinecap="round"
          />
          
          {/* Yellow segment - Meerut */}
          <path 
            d={describeArc(140, 140, 105, data[1].startAngle, data[1].endAngle)} 
            fill="none" 
            stroke={data[1].color} 
            strokeWidth="22" 
            strokeLinecap="round"
          />
          
          {/* Blue segment - NCR (thickest) */}
          <path 
            d={describeArc(140, 140, 105, data[0].startAngle, data[0].endAngle)} 
            fill="none" 
            stroke={data[0].color} 
            strokeWidth="26" 
            strokeLinecap="round"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold leading-none">{totalDrivers}</p>
          <p className="text-sm text-gray-500 leading-tight">Total Drivers</p>
        </div>
      </div>

      {/* Exactly matching legend from reference image */}
      <div className="flex flex-col gap-5 text-sm ml-2">
        {data.map((entry, index) => (
          <div 
            key={index} 
            className="flex flex-col gap-1"
          >
            <div 
              className="h-2 w-8 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
              <span className="name">{entry.name}</span>
                <span className="value">{entry.value}</span>
                <span className="percentage">({entry.percentage}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}