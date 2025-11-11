import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import Modal from '../Modal';
import './grafico.scss';
import { FiRefreshCw, FiPieChart, FiBarChart, FiTrendingUp, FiCircle } from 'react-icons/fi';
import NewTabelaGenerica from '../NewTabelaGenerica';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

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

// Chart types configuration
const CHART_TYPES = {
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  BAR: 'bar',
  LINE: 'line'
};

const CHART_TYPE_LABELS = {
  [CHART_TYPES.PIE]: 'Pizza',
  [CHART_TYPES.DOUGHNUT]: 'Doughnut',
  [CHART_TYPES.BAR]: 'Barras',
  [CHART_TYPES.LINE]: 'Linha'
};

const CHART_TYPE_ICONS = {
  [CHART_TYPES.PIE]: FiPieChart,
  [CHART_TYPES.DOUGHNUT]: FiCircle,
  [CHART_TYPES.BAR]: FiBarChart,
  [CHART_TYPES.LINE]: FiTrendingUp
};

// Column configuration function - MOVED HERE from Modal
const getTableColumns = (tableType) => {
  switch(tableType) {
    case 'vendas':
      return [
        { key: 'adquirente.nomeAdquirente', header: 'Adquirente', accessor: (item) => item.adquirente?.nomeAdquirente },
        { key: 'bandeira.descricaoBandeira', header: 'Bandeira', accessor: (item) => item.bandeira?.descricaoBandeira },
        { key: 'cnpj', header: 'CNPJ' },
        { key: 'valorBruto', header: 'Valor Bruto', accessor: (item) => item.valorBruto },
        { key: 'valorLiquido', header: 'Valor Líquido', accessor: (item) => item.valorLiquido },
        { key: 'taxa', header: 'Taxa', accessor: (item) => item.taxa },
        { key: 'dataVenda', header: 'Data Venda', accessor: (item) => item.dataVenda },
        { key: 'quantidadeParcelas', header: 'Parcelas', accessor: (item) => item.quantidadeParcelas },
        { key: 'nsu', header: 'NSU' },
        { key: 'tid', header: 'TID' }
      ];
    case 'creditos':
      return [
        { key: 'adquirente.nomeAdquirente', header: 'Adquirente', accessor: (item) => item.adquirente?.nomeAdquirente },
        { key: 'bandeira.descricaoBandeira', header: 'Bandeira', accessor: (item) => item.bandeira?.descricaoBandeira },
        { key: 'cnpj', header: 'CNPJ' },
        { key: 'valorBruto', header: 'Valor Bruto', accessor: (item) => item.valorBruto },
        { key: 'valorLiquido', header: 'Valor Líquido', accessor: (item) => item.valorLiquido },
        { key: 'taxa', header: 'Taxa', accessor: (item) => item.taxa },
        { key: 'dataVenda', header: 'Data Venda', accessor: (item) => item.dataVenda },
        { key: 'quantidadeParcelas', header: 'Parcelas', accessor: (item) => item.quantidadeParcelas }
      ];
    case 'servicos':
      return [
        { key: 'nome_adquirente', header: 'Adquirente' },
        { key: 'descricao', header: 'Serviço' },
        { key: 'cnpj', header: 'CNPJ' },
        { key: 'data', header: 'Data' },
        { key: 'valor', header: 'Valor' },
        { key: 'razao_social', header: 'Razão Social' }
      ];
    default:
      return [];
  }
};

const PieChart = ({ data01, arrayAdm, tipo, dados, totalAdmin }) => {
  const [selectedAdm, setSelectedAdm] = useState(null);
  const [showAdmModal, setShowAdmModal] = useState(false);
  const [dado, setDado] = useState('');
  const [fontColor, setFontColor] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('--font-color')
  );
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.BOTH);
  const [chartType, setChartType] = useState(CHART_TYPES.PIE);

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

  // Cycle through chart types
  const cycleChartType = () => {
    const types = Object.values(CHART_TYPES);
    const currentIndex = types.indexOf(chartType);
    const nextIndex = (currentIndex + 1) % types.length;
    setChartType(types[nextIndex]);
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
          // Additional properties for bar and line charts
          borderColor: chartType === CHART_TYPES.LINE ? generateColors(data01.labels.slice()).map(color => color.replace('rgb', 'rgba').replace(')', ', 1)')) : undefined,
          tension: chartType === CHART_TYPES.LINE ? 0.1 : undefined,
        },
      ],
    };
  }, [data01, dado, chartType]);

  const commonChartOptions = {
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
  };

  // Add specific options for different chart types
  const chartOptions = useMemo(() => {
    const options = { ...commonChartOptions };
    
    if (chartType === CHART_TYPES.BAR) {
      options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            color: fontColor,
          },
          grid: {
            color: fontColor + '20',
          }
        },
        x: {
          ticks: {
            color: fontColor,
          },
          grid: {
            color: fontColor + '20',
          }
        }
      };
    }
    
    if (chartType === CHART_TYPES.LINE) {
      options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            color: fontColor,
          },
          grid: {
            color: fontColor + '20',
          }
        },
        x: {
          ticks: {
            color: fontColor,
          },
          grid: {
            color: fontColor + '20',
          }
        }
      };
    }
    
    return options;
  }, [chartType, displayMode, fontColor, totalAdmin, dado]);

  // Render the appropriate chart component
  const renderChart = () => {
    const chartProps = {
      data: chartData,
      options: chartOptions
    };

    switch (chartType) {
      case CHART_TYPES.PIE:
        return <Pie {...chartProps} />;
      case CHART_TYPES.DOUGHNUT:
        return <Doughnut {...chartProps} />;
      case CHART_TYPES.BAR:
        return <Bar {...chartProps} />;
      case CHART_TYPES.LINE:
        return <Line {...chartProps} />;
      default:
        return <Pie {...chartProps} />;
    }
  };

  const ChartIcon = CHART_TYPE_ICONS[chartType];

  return (
    <div className="chart-container">
      {/* Chart Controls */}
      <div className="chart-controls">
        <button 
          className="chart-type-toggle"
          onClick={cycleChartType}
          title={`Tipo de gráfico: ${CHART_TYPE_LABELS[chartType]}. Clique para alternar.`}
        >
          <ChartIcon className="toggle-icon" />
          <span className="toggle-label">
            {CHART_TYPE_LABELS[chartType]}
          </span>
        </button>
        
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
      
      {renderChart()}
      
      {/* Fixed Modal with proper columns */}
      {showAdmModal && selectedAdm && (
        <Modal onClose={() => setShowAdmModal(false)}>
          {console.log('Selected Admin Data:', selectedAdm)}
          {console.log('Sales Data:', selectedAdm.sales)}
          {console.log('Table Type:', tipo)}
          
          {tipo === '0' ? (
            <NewTabelaGenerica
              array={selectedAdm.sales}
              tableType="vendas"
              columns={getTableColumns('vendas')}
              showFilters={false}
              enableResponsive={true}
            />
          ) : tipo === '1' ? (
            <NewTabelaGenerica
              array={selectedAdm.sales}
              tableType="creditos"
              columns={getTableColumns('creditos')}
              showFilters={false}
              enableResponsive={true}
            />
          ) : tipo === '2' ? (
            <NewTabelaGenerica
              array={selectedAdm.sales}
              tableType="servicos"
              columns={getTableColumns('servicos')}
              showFilters={false}
              enableResponsive={true}
            />
          ) : (
            <div className="no-data-message">
              Tipo de dados não suportado: {tipo}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default PieChart;