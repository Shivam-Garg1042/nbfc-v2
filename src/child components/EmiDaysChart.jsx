import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const EmiDaysChart = ({ driverData }) => {
  // Create data from driver's EMI DPD information
  const createEmiDpdData = () => {
    if (!driverData?.financialInfo?.emiDpd) {
      // Fallback data if no driver data (sample data for 10 months)
      return Array.from({ length: 10 }, (_, index) => ({
        month: index + 1,
        days: Math.floor(Math.random() * 10) - 3, // Random values between -3 and 6
      }));
    }

    // Parse comma-separated values from emiDpd
    const emiDpdString = driverData.financialInfo.emiDpd.toString();
    const emiDpdValues = emiDpdString.split(',').map(value => parseFloat(value.trim()) || 0);
    
    // Create data for 10 months, padding with zeros if needed
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        month: i + 1,
        days: emiDpdValues[i] || 0,
      });
    }
    
    return data;
  };

  const data = createEmiDpdData();

  // Calculate average for display
  const average = data.reduce((sum, item) => sum + item.days, 0) / data.length;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-3 rounded shadow-lg border text-sm">
          <p className="font-medium">{`Month ${label}`}</p>
          <p className="text-blue-600">
            {value > 0 ? `${value} days late` : value < 0 ? `${Math.abs(value)} days early` : 'On time'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot for active state
  const CustomizedActiveDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill="white" 
        stroke="#3B82F6" 
        strokeWidth={2} 
      />
    );
  };

  return (
    <div className="w-full h-72 p-3">
      {/* Average indicator */}
      {/* <div className="flex justify-center mb-2">
        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
          Average: {average >= 0 ? `${average.toFixed(1)} days late` : `${Math.abs(average).toFixed(1)} days early`}
        </div>
      </div> */}
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: -12, bottom: 20 }}
        >
          <defs>
            {/* Gradient for positive values (late payments) */}
            <linearGradient id="colorGradientPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
            </linearGradient>
            {/* Gradient for negative values (early payments) */}
            <linearGradient id="colorGradientNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
            </linearGradient>
            {/* Default blue gradient */}
            <linearGradient id="colorGradientDefault" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            horizontal={true} 
            vertical={false}
            stroke="#E5E7EB"
          />
          
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => value === 0 ? '0' : `${value > 0 ? '+' : ''}${value}`}
            domain={['dataMin - 2', 'dataMax + 2']}
            width={40}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
            isAnimationActive={false}
          />
          
          <Area 
            type="monotone" 
            dataKey="days" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fill="url(#colorGradientDefault)" 
            dot={false}
            activeDot={<CustomizedActiveDot />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmiDaysChart;