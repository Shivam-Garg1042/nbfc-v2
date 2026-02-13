import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { useNbfcFilter } from '../UI/NBFCFilter/NbfcFilterContext';

export default function EmiTrends() {
  const { selectedNbfc } = useNbfcFilter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRange, setHoveredRange] = useState(null);

  useEffect(() => {
    const fetchEmiTrends = async () => {
      try {
        setLoading(true);
        const nbfcFilter = selectedNbfc || 'all';
        const response = await ApiService.getChartData('emi-trends', nbfcFilter);
        
        if (response?.data && response.data.length > 0) {
          setData(response.data);
        } else {
          // Fallback data
          setData([
            {
              month: 'September',
              emi12: 20,
              emi18: 10,
              emi24: 15,
              loanReimbursed: { emi12: 240000, emi18: 180000, emi24: 360000 }
            },
            {
              month: 'October',
              emi12: 19,
              emi18: 8,
              emi24: 14,
              loanReimbursed: { emi12: 228000, emi18: 144000, emi24: 336000 }
            },
            {
              month: 'November',
              emi12: 13,
              emi18: 7,
              emi24: 13,
              loanReimbursed: { emi12: 156000, emi18: 126000, emi24: 312000 }
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch EMI trends data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmiTrends();
  }, [selectedNbfc]);

  const rangeLabelMap = {
    emi12: '12 months',
    emi18: '18 months',
    emi24: '24 months'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length || !hoveredRange) return null;
    const entry = payload.find(p => p.dataKey === hoveredRange);
    if (!entry) return null;
    const drivers = entry.value;
    const reimburse = entry.payload.loanReimbursed[hoveredRange];
    const displayRange = rangeLabelMap[hoveredRange];
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{`Month: ${label}`}</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-sm font-medium text-gray-700">{displayRange}</span>
        </div>
        <p className="text-sm text-gray-600 mb-1"><span className="font-medium">{drivers}</span> drivers</p>
        <p className="text-sm text-gray-600">₹<span className="font-medium">{reimburse.toLocaleString()}</span> reimbursed</p>
      </div>
    );
  };


  const CustomLegend = ({ payload }) => {
    const mapValue = v => ({ emi12: '12 months', emi18: '18 months', emi24: '24 months' }[v] || v);
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-gray-600 font-medium">{mapValue(entry.dataKey)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Loading EMI Trends...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl">
      
      
      <div style={{ width: '100%', height: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{ value: 'No of Drivers', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Legend content={<CustomLegend />} />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="emi12"
              fill="#65E1F5"
              radius={[2, 2, 0, 0]}
              name="12 months"
              onMouseEnter={() => setHoveredRange('emi12')}
              onMouseLeave={() => setHoveredRange(null)}
            />
            <Bar
              dataKey="emi18"
              fill="#FF7A59"
              radius={[2, 2, 0, 0]}
              name="18 months"
              onMouseEnter={() => setHoveredRange('emi18')}
              onMouseLeave={() => setHoveredRange(null)}
            />
            <Bar
              dataKey="emi24"
              fill="#FFD465"
              radius={[2, 2, 0, 0]}
              name="24 months"
              onMouseEnter={() => setHoveredRange('emi24')}
              onMouseLeave={() => setHoveredRange(null)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
