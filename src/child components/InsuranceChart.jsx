
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Generate last 5 months labels and sample amount values
function buildData() {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const arr = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Amount mock (can later be replaced). Keep in a reasonable range.
    const base = 0; // base amount
    const variance = (Math.sin(d.getMonth()) + 1) * 0 + (i * 0);
    arr.push({
      month: months[d.getMonth()],
      amount: Math.round(base + variance)
    });
  }
  return arr;
}

const data = buildData();
// Color palette (tonal, consistent with dashboard accent hues)
const barColors = ['#FF7A59', '#68E1F5', '#FFD465', '#3D7EFF', '#10B981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white px-2 py-1.5 rounded shadow text-xs border border-gray-100">
        <p className="font-medium text-gray-600 mb-0">{label}</p>
        <p className="text-gray-500 m-0">₹ {val.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function InsuranceChart() {
  return (
    <div className="w-full h-[230px]  px-4 pb-6 flex flex-col justify-center bg-white rounded-2xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barCategoryGap={24}
          
          margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
        >
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(v) => (v / 1) + 'k'}
            width={34}
          />
          <Tooltip
            cursor={{ fill: 'rgba(17,149,73,0.05)' }}
            content={<CustomTooltip />}
            wrapperStyle={{ outline: 'none' }}
          />
          <Bar dataKey="amount" radius={[5,5,0,0]} maxBarSize={52}>
            {data.map((_, i) => (
              <Cell key={i} fill={barColors[i % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}