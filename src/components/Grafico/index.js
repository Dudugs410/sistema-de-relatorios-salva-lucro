import React from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

export default function Grafico({ data01, data02, color01, color02 }) {

  return (
    <ResponsiveContainer width="65%" height="65%">
        <PieChart width={100} height={100}>
          <Pie 
            data={data01} 
            dataKey="total" 
            cx="50%" 
            cy="50%" 
            outerRadius={60} 
            fill={color01} 
            label
          />
          <Pie 
            data={data02} 
            dataKey="total" 
            cx="50%" 
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill={color02}
            label
          />
        </PieChart>
      </ResponsiveContainer>
  );
}