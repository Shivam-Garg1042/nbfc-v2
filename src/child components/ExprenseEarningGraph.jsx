import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomizedLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex justify-center items-center gap-8 mt-1">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ExpenseEarningGraph({ driverData }) {
  // Create data from driver's earning and expense information
  const createChartData = () => {
    if (!driverData?.earningExpense) {
      // Fallback data if no driver data
      return [
        { name: 'Month 1', Earnings: 0, Expense: 0 },
        { name: 'Month 2', Earnings: 0, Expense: 0 },
        { name: 'Month 3', Earnings: 0, Expense: 0 },
      ];
    }

    const { earnings, expenses } = driverData.earningExpense;
    
    return [
      { 
        name: 'Month 1', 
        Earnings: earnings?.thirdLast || 0, 
        Expense: expenses?.thirdLast || 0 
      },
      { 
        name: 'Month 2', 
        Earnings: earnings?.secondLast || 0, 
        Expense: expenses?.secondLast || 0 
      },
      { 
        name: 'Month 3', 
        Earnings: earnings?.last || 0, 
        Expense: expenses?.last || 0 
      },
    ];
  };

  const data = createChartData();

  return (
    <div className="w-full h-72 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
          barSize={20}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }}
            dy={8}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickCount={5}
            domain={[0, dataMax => Math.ceil(dataMax / 1000) * 1000]}
            tickFormatter={(value) => value === 0 ? '' : `${value / 1000}k`}
            tick={{ fontSize: 12 }}
            width={30}
          />
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString()}`, '']}
            labelStyle={{ color: '#000' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend 
            content={<CustomizedLegend />}
            verticalAlign="bottom"
            align="center"
          />
          <Bar 
            dataKey="Earnings" 
            fill="#2ECC71" 
            radius={[10, 10, 0, 0]} 
            name="Earnings"
          />
          <Bar 
            dataKey="Expense" 
            fill="#FF7675" 
            radius={[10, 10, 0, 0]} 
            name="Expense"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}