import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const RadialContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  transform: scale(1.02);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
`;

const ScoreValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  color: #666;
  font-weight: 400;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  
  margin-left: 15px;
  min-width: 90px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
`;

const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

export default function ConcentricScoresChart({ driverData }) {
  // Extract scores with fallbacks
  const creditScore = driverData?.financialInfo?.creditScore || 0;
  const karmaScore = driverData?.cardData?.karmaScore || 0;
  const riskScore = driverData?.riskInfo?.riskScore || 0;
  
  const maxScore = 1000;
  
  // Calculate percentages (convert to 0-100 scale for the chart)
  const creditPercentage = (creditScore / maxScore) * 100;
  const karmaPercentage = (karmaScore / maxScore) * 100;
  const riskPercentage = (riskScore / maxScore) * 100;
  
  // Fixed colors matching project design
  const colors = {
    credit: '#23BC64',   // Green (matches your earnings color)
    karma: '#876CF1',    // Purple (matches your run kms color)
    risk: '#FF901A',     // Orange (distinctive risk color)
    background: '#f6f6f667' // Light gray for unfilled portion
  };
  
  // Create data for each concentric ring
  const createRingData = (percentage, maxVal = 100) => [
    { name: 'filled', value: percentage },
    { name: 'empty', value: maxVal - percentage }
  ];
  
  const creditData = createRingData(creditPercentage);
  const karmaData = createRingData(karmaPercentage);
  const riskData = createRingData(riskPercentage);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      
      width: 'fit-content'
    }}>
      <RadialContainer>
        <ResponsiveContainer width="100%" height="100%">
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Outermost ring - Credit Score */}
            <PieChart width={200} height={200} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
              <Pie
                data={creditData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={colors.credit} stroke="none" />
                <Cell fill={colors.background} stroke="none" />
              </Pie>
            </PieChart>
            
            {/* Middle ring - Karma Score */}
            <PieChart width={200} height={200} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
              <Pie
                data={karmaData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={colors.karma} stroke="none" />
                <Cell fill={colors.background} stroke="none" />
              </Pie>
            </PieChart>
            
            {/* Inner ring - Risk Score */}
            <PieChart width={200} height={200} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={colors.risk} stroke="none" />
                <Cell fill={colors.background} stroke="none" />
              </Pie>
            </PieChart>
          </div>
        </ResponsiveContainer>
      </RadialContainer>
      
      {/* Legend - Right side of chart */}
      <Legend>
        <LegendItem>
          <ColorDot color={colors.credit} />
          <span>Credit: {creditScore}/900</span>
        </LegendItem>
        <LegendItem>
          <ColorDot color={colors.karma} />
          <span>Karma: {karmaScore}/1000</span>
        </LegendItem>
        <LegendItem>
          <ColorDot color={colors.risk} />
          <span>Risk: {riskScore}/1000</span>
        </LegendItem>
      </Legend>
    </div>
  );
}