import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";



function RePieChart( vendasDiaAnterior, vendasUltimosDias) {

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie data={vendasDiaAnterior} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
          <Pie data={vendasUltimosDias} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
export default RePieChart;