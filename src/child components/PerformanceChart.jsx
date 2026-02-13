import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceChart() {
  const data = [
    {
      date: 'Mar 3',
      Good: 98,
      Better: 70,
      Average: 45,
      'Below Average': 35
    },
    {
      date: 'Mar 4',
      Good: 88,
      Better: 78,
      Average: 40,
      'Below Average': 20
    },
    {
      date: 'Mar 5',
      Good: 98,
      Better: 60,
      Average: 40,
      'Below Average': 40
    },
    {
      date: 'Mar 6',
      Good: 98,
      Better: 70,
      Average: 45,
      'Below Average': 35
    },
    {
      date: 'Mar 7',
      Good: 0,
      Better: 75,
      Average: 45,
      'Below Average': 20
    },
    {
      date: 'Mar 8',
      Good: 98,
      Better: 75,
      Average: 48,
      'Below Average': 0
    },
    {
      date: 'Mar 9',
      Good: 0,
      Better: 0,
      Average: 48,
      'Below Average': 28
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const CustomLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center items-center space-x-8 mt-4 text-xs">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="w-full h-64 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          barCategoryGap="20%"
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e6e6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 12 }}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value) => value === 100 ? '100+' : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="Good" 
            fill="#00a86b" 
            radius={[3, 3, 0, 0]}
            barSize={6}
          />
          <Bar 
            dataKey="Better" 
            fill="#4ade80" 
            radius={[3, 3, 0, 0]}
            barSize={6}
          />
          <Bar 
            dataKey="Average" 
            fill="#fcd34d" 
            radius={[3, 3, 0, 0]}
            barSize={6}
          />
          <Bar 
            dataKey="Below Average" 
            fill="#f97316" 
            radius={[3, 3, 0, 0]}
            barSize={6}
          />
         <Legend content={<CustomLegend />} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}