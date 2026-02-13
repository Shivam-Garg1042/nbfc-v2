import React, { useEffect, useState } from 'react';
import '../styles/KarmaScoreChart.css';

const RiskScoreChart = ({ score }) => {
  // Add state to track the animated score
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Determine color based on score (OPPOSITE to karma/credit - lower is better for risk)
  const getRiskScoreColorClass = (score) => {
    if (score <= 400) return 'karma-score-high';   
    if (score <= 500) return 'karma-score-medium';
    if (score <= 600) return 'karma-score-medium2';
    if (score <= 750) return  ' karma-score-medium3';
    return '#karma-score-low';                      
  };
  
  // Calculate the circumference of the circle
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash array based on animated score (out of 1000)
  const strokeDashArray = (animatedScore / 1000) * circumference;
  
  // Calculate rotation to start from the top
  const rotation = -90;
  
  // Animation effect that runs when the component mounts or score changes
  useEffect(() => {
    // Reset animation if score changes
    setAnimatedScore(0);
    
    // Animate from 0 to actual score
    const duration = 1500; // Animation duration in ms
    const stepTime = 20; // Update every 20ms for smooth animation
    const steps = duration / stepTime;
    const increment = score / steps;
    
    let currentScore = 0;
    const timer = setInterval(() => {
      currentScore += increment;
      
      if (currentScore >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(currentScore));
      }
    }, stepTime);
    
    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [score]);
  
  return (
    <div className="karma-chart-container">
      <svg className="karma-chart-circle" viewBox="0 0 64 64">
        <circle
          className="karma-chart-background"
          cx="32"
          cy="32"
          r={radius}
        />
        <circle
          className={`karma-chart-progress ${getRiskScoreColorClass(score)}`}
          cx="32"
          cy="32"
          r={radius}
          strokeDasharray={`${strokeDashArray} ${circumference}`}
          strokeDashoffset="0"
          transform={`rotate(${rotation} 32 32)`}
        />
      </svg>
      <div className={`karma-chart-score ${getRiskScoreColorClass(score)}`}>
        {animatedScore}
      </div>
    </div>
  );
};

export default RiskScoreChart;