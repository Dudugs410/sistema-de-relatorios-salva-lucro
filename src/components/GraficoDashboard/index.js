import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import Modal from '../Modal'
import './grafico.scss'
import TabelaVendasDashboard from '../Componente_TabelaVendasDashboard'
import TabelaCreditosDashboard from '../Componente_TabelaCreditosDashboard'
import TabelaServicosDashboard from '../Componente_TabelaServicosDashboard'

ChartJS.register(ArcElement, Tooltip, Legend)

// Global color mapping object to ensure consistent colors across charts
const labelColorMap = {};
const colorPool = [
  'rgb(244, 67, 54)', 'rgb(76, 175, 80)', 'rgb(33, 150, 243)', 'rgb(255, 152, 0)',
  'rgb(156, 39, 176)', 'rgb(0, 188, 212)', 'rgb(63, 81, 181)', 'rgb(139, 195, 74)',
  'rgb(255, 87, 34)', 'rgb(121, 85, 72)', 'rgb(96, 125, 139)', 'rgb(255, 235, 59)',
];

let colorIndex = 0;

// Function to assign colors dynamically
const assignColor = (label) => {
  if (!labelColorMap[label]) {
    // If no color is assigned yet, assign one from the pool
    labelColorMap[label] = colorPool[colorIndex % colorPool.length];
    colorIndex++;
  }
  return labelColorMap[label];
};

const PieChart = ({ data01, arrayAdm, tipo, dados }) => {
  const [selectedAdm, setSelectedAdm] = useState(null);
  const [showAdmModal, setShowAdmModal] = useState(false);
  const [dado, setDado] = useState('');

  useEffect(() => {
    switch (dados) {
      case 'vendas':
        setDado('Vendas');
        break;
      case 'creditos':
        setDado('Créditos');
        break;
      case 'servicos':
        setDado('Serviços');
        break;
      default:
        setDado('');
        break;
    }
  }, [dados]);

  const handleChartClick = useCallback(
    (event, elements) => {
      if (elements.length > 0) {
        const clickedElementIndex = elements[0].index;
        const selectedAdmData = arrayAdm[clickedElementIndex];

        setSelectedAdm(selectedAdmData);
        setShowAdmModal(true);
      }
    },
    [arrayAdm]
  );

  const generateColors = (labels) => labels.map(assignColor);

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
  }, [data01, dado]);

  const chartOptions = {
    maintainAspectRatio: false,
    onClick: handleChartClick,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'left',
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.dataset.data[context.dataIndex];
            return `Total de ${dado}: ${value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Pie data={chartData} options={chartOptions} />
      {showAdmModal && selectedAdm && (
        <Modal onClose={() => setShowAdmModal(false)}>
          {tipo === '0' ? (
            <TabelaVendasDashboard array={selectedAdm} />
          ) : tipo === '1' ? (
            <TabelaCreditosDashboard array={selectedAdm} />
          ) : tipo === '2' ? (
            <TabelaServicosDashboard array={selectedAdm} />
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default PieChart;
