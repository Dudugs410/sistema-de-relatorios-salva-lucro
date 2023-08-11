import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import DetalhesCredito from '../DetalhesCredito';
import Modal from '../Modal';



ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data01, arrayAdm }) => {
  
  const [showAdm, setShowAdm] = useState(false)
  const [selectedAdm, setSelectedAdm] = useState(null)
  const [showAdmModal, setShowAdmModal] = useState(false)
  
  if (!data01 || data01.length === 0) {
    return <div>Loading...</div>; // Display a loading state or alternative content
  }

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedElementIndex = elements[0].index;
      const selectedAdmData = arrayAdm[clickedElementIndex];

      setSelectedAdm(selectedAdmData);
      setShowAdmModal(true);
    }
  }

  function modalAdm(adm){
    console.log('modalAdm')
    setShowAdm(true)
    if(showAdm){
      return(
        <div className='modal-adm'>
          <span>nome: {adm.nomeAdquirente}</span>
          <span>total: {adm.total}</span>
          <DetalhesCredito array={adm.vendas}/>
        </div>
      )
    }
  }

  const chartData = {
    labels: data01.labels,
    datasets: [
      {
        label: 'Total de Vendas: R$',
        data: data01.data,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 0, 0, 1)',
          'rgba(238, 130, 238, 1)',
          'rgba(106, 90, 205, 1)',
          'rgba(255, 165, 0, 1)',
          'rgba(255, 99, 71, 1)',
          'rgba(111, 255, 232, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 0, 0, 1)',
          'rgba(238, 130, 238, 1)',
          'rgba(106, 90, 205, 1)',
          'rgba(255, 165, 0, 1)',
          'rgba(255, 99, 71, 1)',
          'rgba(111, 255, 232, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    onClick: (event, elements) => handleChartClick(event, elements),
  };

  return (
    <div style={{ height: '250px', position: 'relative', maintainAspectRatio: false }}>
      <Pie data={chartData} options={chartOptions} />

      {showAdmModal && selectedAdm && (
        <Modal onClose={() => setShowAdmModal(false)}>
          <div className='modal-adm'>
            <span>nome: {selectedAdm.nomeAdquirente}</span>
            <span>total: {selectedAdm.total}</span>
            <DetalhesCredito array={selectedAdm.vendas} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PieChart;

//////////////////////////////////////////////////////////////////////////////////////////