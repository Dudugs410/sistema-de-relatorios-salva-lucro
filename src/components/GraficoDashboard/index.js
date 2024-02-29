import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Modal from '../Modal';
import './grafico.scss'
import TabelaVendasCreditos from '../Componente_TabelaVendasCreditos';
import TabelaGenerica from '../Componente_TabelaGenerica';



ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data01, arrayAdm, tipo, dados } ) => {

  const [selectedAdm, setSelectedAdm] = useState(null)
  const [showAdmModal, setShowAdmModal] = useState(false)
  const [dado, setDado] = useState('')

  useEffect(()=>{
    switch (dados) {
      case 'vendas':
          setDado('Vendas')
        break;
      case 'creditos':
          setDado('Créditos')
        break;
      case 'servicos':
          setDado('Serviços')
        break;
      default:
          setDado('')
        break;
    }
  },[])

  const handleChartClick = useCallback((event, elements) => {
    console.log('array adm grafico dashboard: ', arrayAdm)
    if (elements.length > 0) {
      const clickedElementIndex = elements[0].index;
      const selectedAdmData = arrayAdm[clickedElementIndex];

      setSelectedAdm(selectedAdmData);
      setShowAdmModal(true);

      console.log('Array da Fatia Clicada: ', arrayAdm[clickedElementIndex])

    }
  }, [arrayAdm]);

  // setando as cores do gráfico por administradora.
  // Caso não especificada, a cor será cinza.

  const labelColors = {
    "Abrapetite" : 'rgb(244, 26, 26, 1)',
    "Alelo" : 'rgb(189, 214, 84, 1)',
    "Banescard" : 'rgb(184, 218, 55, 1)',
    "Ben Visa Vale" : 'rgb(24, 24, 24, 1)',
    "Bin" : 'rgb(255, 102, 0, 1)',
    "Biq" : 'rgb(0, 110, 204, 1)',
    "BK Bank" : 'rgb(51, 51, 99, 1)',
    "Bônuscred" : 'rgb(255, 194, 14, 1)',
    "BPF" : 'rgb(0, 124, 199, 1)',
    "Brasilcard" : 'rgb(0, 75, 137, 1)',
    "C6 Bank" : 'rgb(18, 18, 18, 1)',
    "Cabal" : 'rgb(35, 160, 217, 1)',
    "Caixa" : 'rgb(24, 148, 179, 1)',
    "Cielo" : 'rgb(255, 157, 5, 1)',
    "Convcard" : 'rgb(0, 131, 155, 1)',
    "Cooper Card" : 'rgb(0, 123, 63, 1)',
    "CredPar" : 'rgb(240, 97, 53, 1)',
    "DMCard" : 'rgb(32, 42, 208, 1)',
    "Ectare" : 'rgb(175, 255, 142, 1)',
    "Eucard" : 'rgb(7, 163, 112, 1)',
    "Facecard" : 'rgb(244, 180, 19, 1)',
    "Fitcard" : 'rgb(255, 25, 32, 1)',
    "Flexocard" : 'rgb(61, 63, 148, 1)',
    "Getnet" : 'rgb(237, 0, 0, 1)',
    "Goodcard" : 'rgb(253, 210, 35, 1)',
    "Granito" : 'rgb(251, 86, 7, 1)',
    "Greencard" : 'rgb(29, 112, 64, 1)',
    "i-Food" : 'rgb(234, 29, 44, 1)',
    "InovePay": 'rgb(2, 36, 95, 1)',
    "Izi": 'rgb(245, 134, 52, 1)',
    "Lecard" : 'rgb(246, 188, 0, 1)',
    "MegaVale" : 'rgb(8, 196, 195, 1)',
    "Nutricard" : 'rgb(230, 40, 42, 1)',
    "Onecard" : 'rgb(101, 216, 244, 1)',
    "Pagseguro" : 'rgb(27, 185, 154, 1)',
    "PayGo Net" : 'rgb(253, 213, 2, 1)',
    "Paypal" : 'rgb(39, 144, 195, 1)',
    "Personal Card" : 'rgb(5, 104, 57, 1)',
    "PicPay" : 'rgb(33, 194, 94, 1)',
    "Planvale" : 'rgb(0, 0, 130, 1)',
    "Policard" : 'rgb(55, 11, 92, 1)',
    "QCard" : 'rgb(104, 119, 168, 1)',
    "Redecard" : 'rgb(236, 112, 0, 1)',
    "Romcard" : 'rgb(193, 33, 34, 1)',
    "Safecard" : 'rgb(1, 185, 232, 1)',
    "Safepay" : 'rgb(0, 202, 187, 1)',
    "Safra Pay" : 'rgb(5, 75, 214, 1)',
    "Senff" : 'rgb(0, 26, 87, 1)',
    "SESI Max" : 'rgb(19, 165, 56, 1)',
    "Sicredi" : 'rgb(100, 200, 50, 1)',
    "Sipag" : 'rgb(0, 83, 96, 1)',
    "Sodexo" : 'rgb(238, 0, 0, 1)',
    "Sorocred" : 'rgb(181, 233, 0, 1)',
    "Stone" : 'rgb(0, 142, 90, 1)',
    "SupCard" : 'rgb(26, 75, 36, 1)',
    "Ticket" : 'rgb(247, 39, 23, 1)',
    "Tricard" : 'rgb(225, 14, 137, 1)',
    "Triocard" : 'rgb(207, 96, 30, 1)',
    "Única" : 'rgb(237, 3, 124, 1)',
    "Valecard" : 'rgb(51, 51, 153, 1)',
    "ValeShop" : 'rgb(255, 241, 103, 1)',
    "Vegascard" : 'rgb(122, 174, 207, 1)',
    "Verdecard" : 'rgb(0, 150, 53, 1)',
    "Vero" : 'rgb(160, 112, 254, 1)',
    "Vexper" : 'rgb(229, 200, 57, 1)',
    "ViaSoft Pay" : 'rgb(247, 2, 99, 1)',
    "Volus" : 'rgb(121, 177, 96, 1)',
    "VR" : 'rgb(0, 190, 39, 1)',
    "Wizeo" : 'rgb(147, 26, 40, 1)',
  }

  const generateColors = (labels) => {
    return labels.map(label => labelColors[label] || 'grey');
  }

  const chartData = useMemo(() => {
    return {
      labels: data01.labels.slice(),
      datasets: [
        {
          label: `Total de ${dado}: R$`,
          data: data01.data,
          backgroundColor: generateColors(data01.labels.slice()),
          borderWidth: 0.2,
        },
      ],
    };
  }, [data01]);
  
  const chartOptions = {
    maintainAspectRatio: false,
    onClick: handleChartClick,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top"
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.dataset.data[context.dataIndex];
            const formattedValue = value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return `Total de ${dado}: ${formattedValue}`;
          },
        },
      },
    },  
    layout:{
      padding: 10
    }
  };

  return (
    <div className='chart-container' style={{ height: '250px', position: 'relative', maintainAspectRatio: false }}>
      <Pie data={chartData} options={chartOptions} />
      {showAdmModal && selectedAdm && (
        <Modal onClose={() => setShowAdmModal(false)}>
          { tipo === '0' ? <TabelaVendasCreditos array={selectedAdm} tipo={dados} isDashboard={true} /> : <TabelaGenerica array = {selectedAdm}/>}
        </Modal>
      )}
    </div>
  );
};

export default PieChart;

//////////////////////////////////////////////////////////////////////////////////////////