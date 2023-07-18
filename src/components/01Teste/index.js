import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { Doughnut } from 'react-chartjs-2';

const App = (data01) => {
  const chartReference = useRef(null);
  const [data, setData] = useState({
    labels: ['Red', 'Green', 'Blue'],
    datasets: [{
      data: data01,
      backgroundColor: ['red', 'green', 'blue']
    }]
  });
  return <Doughnut ref={chartReference} data={data} />;
};