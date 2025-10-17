import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Modal from '../Modal';
import './grafico.scss';
import TabelaVendasDashboard from '../Componente_TabelaVendasDashboard';
import TabelaCreditosDashboard from '../Componente_TabelaCreditosDashboard';
import TabelaServicosDashboard from '../Componente_TabelaServicosDashboard';
import TabelaResponsiva from '../TabelaResponsiva';
import { FiRefreshCw } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend);

// Global color pool and mapping
const colorPool = [
  'rgb(244, 67, 54)', 'rgb(76, 175, 80)', 'rgb(33, 150, 243)', 'rgb(255, 152, 0)',
  'rgb(156, 39, 176)', 'rgb(0, 188, 212)', 'rgb(63, 81, 181)', 'rgb(139, 195, 74)',
  'rgb(255, 87, 34)', 'rgb(121, 85, 72)', 'rgb(96, 125, 139)', 'rgb(255, 235, 59)',
];

const labelColorMap = new Map();
let colorIndex = 0;

// Function to assign colors in order
const assignColor = (label) => {
  if (!labelColorMap.has(label)) {
    labelColorMap.set(label, colorPool[colorIndex % colorPool.length]);
    colorIndex++;
  }
  return labelColorMap.get(label);
};

// Display modes configuration
const DISPLAY_MODES = {
  PERCENTAGE: 'percentage',
  CURRENCY: 'currency',
  BOTH: 'both',
  SIMPLE: 'simple'
};

const DISPLAY_MODE_LABELS = {
  [DISPLAY_MODES.PERCENTAGE]: 'Porcentagem',
  [DISPLAY_MODES.CURRENCY]: 'Valor em R$',
  [DISPLAY_MODES.BOTH]: 'Ambos',
  [DISPLAY_MODES.SIMPLE]: 'Simples'
};

const PieChart = ({ data01, arrayAdm, tipo, dados, totalAdmin }) => {
  const [selectedAdm, setSelectedAdm] = useState(null);
  const [showAdmModal, setShowAdmModal] = useState(false);
  const [dado, setDado] = useState('');
  const [fontColor, setFontColor] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('--font-color')
  );
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.BOTH);

  useEffect(() => {
    const interval = setInterval(() => {
      const newColor = getComputedStyle(document.documentElement).getPropertyValue('--font-color');
      if (newColor !== fontColor) {
        setFontColor(newColor);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fontColor]);

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

  // Cycle through display modes
  const cycleDisplayMode = () => {
    const modes = Object.values(DISPLAY_MODES);
    const currentIndex = modes.indexOf(displayMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setDisplayMode(modes[nextIndex]);
  };

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

  // Format value based on display mode and return parts for styling
  const formatValueParts = (value, label, includeLabel = true) => {
    const percentage = ((value / totalAdmin) * 100).toFixed(2);
    const currencyValue = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    switch (displayMode) {
      case DISPLAY_MODES.PERCENTAGE:
        return {
          labelPart: includeLabel ? `${label}: ` : '',
          valuePart: `${percentage}%`,
          fullText: includeLabel ? `${label}: ${percentage}%` : `${percentage}%`
        };
      
      case DISPLAY_MODES.CURRENCY:
        return {
          labelPart: includeLabel ? `${label}: ` : '',
          valuePart: currencyValue,
          fullText: includeLabel ? `${label}: ${currencyValue}` : currencyValue
        };
      
      case DISPLAY_MODES.BOTH:
        return {
          labelPart: includeLabel ? `${label}: ` : '',
          valuePart: `${currencyValue} (${percentage}%)`,
          fullText: includeLabel ? `${label}: ${currencyValue} (${percentage}%)` : `${currencyValue} (${percentage}%)`
        };
      
      case DISPLAY_MODES.SIMPLE:
        return {
          labelPart: includeLabel ? label : '',
          valuePart: '',
          fullText: includeLabel ? label : ''
        };
      
      default:
        return {
          labelPart: includeLabel ? `${label}: ` : '',
          valuePart: currencyValue,
          fullText: includeLabel ? `${label}: ${currencyValue}` : currencyValue
        };
    }
  };

  // Create custom legend with bold values
  const createCustomLegend = (chart) => {
    const { data } = chart;
    if (data.labels.length && data.datasets.length) {
      return data.labels.map((label, index) => {
        const value = data.datasets[0].data[index];
        const datasetMeta = chart.getDatasetMeta(0);
        const { labelPart, valuePart } = formatValueParts(value, label, true);
        
        return {
          // Return raw text that will be styled in the label callback
          text: `${labelPart}${valuePart}`,
          labelPart,
          valuePart,
          fillStyle: data.datasets[0].backgroundColor[index],
          fontColor: fontColor,
          hidden: datasetMeta.data[index]?.hidden || false,
          index,
          datasetIndex: 0,
        };
      });
    }
    return [];
  };

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

  const chartOptions = useMemo(() => ({
    maintainAspectRatio: false,
    onClick: handleChartClick,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'left',
        labels: {
          generateLabels: createCustomLegend,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 20,
          padding: 10,
          font: {
            size: displayMode === DISPLAY_MODES.BOTH ? 14 : 16,
          },
          // Use custom render function to style parts differently
          render: (context) => {
            const { labelPart, valuePart, text, fillStyle, fontColor, hidden } = context;
            
            // Create a span with different styling for label and value
            return `
              <span style="
                color: ${fontColor};
                text-decoration: ${hidden ? 'line-through' : 'none'};
                opacity: ${hidden ? 0.5 : 1};
              ">
                ${labelPart}<span style="font-weight: bold;">${valuePart}</span>
              </span>
            `;
          }
        },
        onClick: function (e, legendItem, legend) {
          const chart = legend.chart;
          const datasetMeta = chart.getDatasetMeta(legendItem.datasetIndex);
          const index = legendItem.index;

          datasetMeta.data[index].hidden = !datasetMeta.data[index].hidden;
          chart.update();
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.dataset.data[context.dataIndex];
            const { valuePart } = formatValueParts(value, '', false);
            return valuePart;
          },
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          }
        },
      },
    },
  }), [displayMode, fontColor, handleChartClick, totalAdmin, dado]);

  return (
    <div className="chart-container">
      {/* Display Mode Toggle Button */}
      <div className="chart-controls">
        <button 
          className="display-mode-toggle"
          onClick={cycleDisplayMode}
          title={`Modo de exibição: ${DISPLAY_MODE_LABELS[displayMode]}. Clique para alternar.`}
        >
          <FiRefreshCw className="toggle-icon" />
          <span className="toggle-label">
            {DISPLAY_MODE_LABELS[displayMode]}
          </span>
        </button>
      </div>
      
      <Pie data={chartData} options={chartOptions} />
      
      {showAdmModal && selectedAdm && (
        <Modal onClose={() => setShowAdmModal(false)}>
          {tipo === '0' ? (
            <TabelaResponsiva array={selectedAdm} dataType='sales'/>
          ) : tipo === '1' ? (
            <TabelaResponsiva array={selectedAdm} dataType='credits'/>
          ) : tipo === '2' ? (
            <TabelaResponsiva array={selectedAdm} dataType='services'/>
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default PieChart; 