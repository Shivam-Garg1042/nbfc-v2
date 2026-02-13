import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

// const data1 = [
//   { x: 0, y: 0 },
//   { x: 45000000, y: 0 }
// ];

// const data2 = [
//   { x: 0, y: 0 },
//   { x: 25000000, y: 0 }
// ];

function HeaderGraphs({props}) {
  const data1 = [
    { x: 0, y: 0 },
    { x: props.graph1, y: 0 }
  ];
  
  const data2 = [
    { x: 0, y: 0 },
    { x: props.graph2, y: 0 }
  ];
  
  return (
    <div className="h-2 rounded pl-2 pr-2">
      <ResponsiveContainer width="100%" height="100%" className="graph">
        <LineChart margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <XAxis type="number" hide dataKey="x" domain={[0, props.graph1]} />
          <YAxis hide />
          
          <ReferenceLine x={props.graph2} stroke="#CCCCCC" strokeDasharray="3 3" />
          
          <Line
            type="monotone"
            data={data1}
            dataKey="y"
            stroke={props.line1}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
          />
          <Line
            type="monotone"
            data={data2}
            dataKey="y"
            stroke={props.line2}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HeaderGraphs;