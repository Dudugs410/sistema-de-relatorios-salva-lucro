import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
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

const colorPool = [
  'rgb(244, 67, 54)', 'rgb(76, 175, 80)', 'rgb(33, 150, 243)', 'rgb(255, 152, 0)',
  'rgb(156, 39, 176)', 'rgb(0, 188, 212)', 'rgb(63, 81, 181)', 'rgb(139, 195, 74)',
  'rgb(255, 87, 34)', 'rgb(121, 85, 72)', 'rgb(96, 125, 139)', 'rgb(255, 235, 59)',
];

const labelColorMap = new Map();
let colorIndex = 0;

const assignColor = (label) => {
  if (!labelColorMap.has(label)) {
    labelColorMap.set(label, colorPool[colorIndex % colorPool.length]);
    colorIndex++;
  }
  return labelColorMap.get(label);
};

// Simplified to only 2 display modes
const DISPLAY_MODES = {
  CURRENCY: 'currency',
  BOTH: 'both'
};

const DISPLAY_MODE_LABELS = {
  [DISPLAY_MODES.CURRENCY]: 'Valor',
  [DISPLAY_MODES.BOTH]: 'Valor + %'
};

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

const getTableColumns = (tableType) => {
  switch (tableType) {
    case 'vendas':
      return [
        { key: 'dataVenda', label: 'Data Venda', type: 'date' },
        { key: 'adquirente', label: 'Adquirente' },
        { key: 'valorBruto', label: 'Valor Bruto', type: 'currency' },
        { key: 'valorLiquido', label: 'Valor Líquido', type: 'currency' }
      ];
    case 'creditos':
      return [
        { key: 'dataCredito', label: 'Data Crédito', type: 'date' },
        { key: 'adquirente', label: 'Adquirente' },
        { key: 'valor', label: 'Valor', type: 'currency' }
      ];
    case 'servicos':
      return [
        { key: 'dataServico', label: 'Data Serviço', type: 'date' },
        { key: 'adquirente', label: 'Adquirente' },
        { key: 'descricao', label: 'Descrição' },
        { key: 'valor', label: 'Valor', type: 'currency' }
      ];
    default:
      return [
        { key: 'adquirente', label: 'Adquirente' },
        { key: 'valor', label: 'Valor', type: 'currency' },
        { key: 'percentual', label: 'Percentual', type: 'percentage' }
      ];
  }
};

const PieChart = ({ data01, arrayAdm = [], totalAdmin = 0, tipo, dados }) => {
  const [selectedAdm, setSelectedAdm] = useState(null);
  const [showAdmModal, setShowAdmModal] = useState(false);
  const [dado, setDado] = useState('');
  const [fontColor, setFontColor] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('--font-color')
  );
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.BOTH);
  const [chartType, setChartType] = useState(CHART_TYPES.PIE);
  const [legendItems, setLegendItems] = useState([]);
  const [originalDataOrder, setOriginalDataOrder] = useState([]);
  const chartRef = useRef(null);
  const legendContainerRef = useRef(null);

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

  useEffect(() => {
    if (data01 && data01.labels && data01.data && data01.labels.length > 0) {
      const indices = data01.labels.map((_, index) => index);
      const sortedIndices = [...indices].sort((a, b) => {
        const labelA = data01.labels[a].toLowerCase();
        const labelB = data01.labels[b].toLowerCase();
        return labelA.localeCompare(labelB);
      });
      
      setOriginalDataOrder(sortedIndices);
      
      const sortedLegendItems = sortedIndices.map((originalIndex, sortedIndex) => {
        const label = data01.labels[originalIndex];
        const value = data01.data[originalIndex];
        const { labelPart, valuePart, fullText } = formatValueParts(value, label, true);
        const color = assignColor(label);
        
        return {
          text: fullText,
          labelPart,
          valuePart,
          color,
          hidden: false,
          originalIndex,
          sortedIndex,
          label,
          value,
        };
      });
      
      setLegendItems(sortedLegendItems);
    } else {
      setLegendItems([]);
      setOriginalDataOrder([]);
    }
  }, [data01, displayMode, totalAdmin]);

  const cycleDisplayMode = () => {
    const modes = Object.values(DISPLAY_MODES);
    const currentIndex = modes.indexOf(displayMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setDisplayMode(modes[nextIndex]);
  };

  const cycleChartType = () => {
    const types = Object.values(CHART_TYPES);
    const currentIndex = types.indexOf(chartType);
    const nextIndex = (currentIndex + 1) % types.length;
    setChartType(types[nextIndex]);
  };

  const handleChartClick = useCallback(
    (event, elements) => {
      if (elements.length > 0 && arrayAdm && arrayAdm.length > 0) {
        const clickedElementIndex = elements[0].index;
        const originalIndex = originalDataOrder[clickedElementIndex];
        const clickedLabel = data01.labels[originalIndex];

        const selectedAdmData = arrayAdm.find(item => item.adquirente === clickedLabel);
        
        if (selectedAdmData) {
          setSelectedAdm(selectedAdmData);
          setShowAdmModal(true);
        }
      }
    },
    [arrayAdm, data01?.labels, originalDataOrder]
  );

  const generateColors = (labels) => labels.map(assignColor);

  const formatValueParts = (value, label, includeLabel = true) => {
    if (!value && value !== 0) return { labelPart: '', valuePart: '', fullText: '' };
    
    const percentage = totalAdmin > 0 ? ((value / totalAdmin) * 100).toFixed(2) : '0.00';
    const currencyValue = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    switch (displayMode) {
      case DISPLAY_MODES.CURRENCY:
        return {
          labelPart: includeLabel ? `${label}: ` : '',
          valuePart: currencyValue,
          fullText: includeLabel ? `${label}: ${currencyValue}` : currencyValue
        };
      
      case DISPLAY_MODES.BOTH:
      default:
        return {
          labelPart: includeLabel ? `${label}: ` : '',
          valuePart: `${currencyValue} (${percentage}%)`,
          fullText: includeLabel ? `${label}: ${currencyValue} (${percentage}%)` : `${currencyValue} (${percentage}%)`
        };
    }
  };

  const handleLegendClick = (originalIndex) => {
    if (!chartRef.current) return;
    
    const chart = chartRef.current;
    const sortedChartIndex = originalDataOrder.indexOf(originalIndex);
    
    if (sortedChartIndex !== -1) {
      const datasetMeta = chart.getDatasetMeta(0);
      
      if (datasetMeta.data[sortedChartIndex]) {
        datasetMeta.data[sortedChartIndex].hidden = !datasetMeta.data[sortedChartIndex].hidden;
        chart.update();
        
        const updatedItems = legendItems.map(item => 
          item.originalIndex === originalIndex 
            ? { ...item, hidden: !item.hidden }
            : item
        );
        setLegendItems(updatedItems);
      }
    }
  };

  const chartData = useMemo(() => {
    if (!data01 || !data01.labels || !data01.data) {
      return {
        labels: [],
        datasets: [{
          label: `Total de ${dado}: R$`,
          data: [],
          backgroundColor: [],
          borderWidth: 0.2,
        }]
      };
    }

    if (originalDataOrder.length > 0 && originalDataOrder.length === data01.labels.length) {
      const sortedLabels = originalDataOrder.map(index => data01.labels[index]);
      const sortedData = originalDataOrder.map(index => data01.data[index]);
      
      return {
        labels: sortedLabels,
        datasets: [
          {
            label: `Total de ${dado}: R$`,
            data: sortedData,
            backgroundColor: generateColors(sortedLabels),
            borderWidth: 0.2,

            borderColor: chartType === CHART_TYPES.LINE ? generateColors(sortedLabels).map(color => color.replace('rgb', 'rgba').replace(')', ', 1)')) : undefined,
            tension: chartType === CHART_TYPES.LINE ? 0.1 : undefined,
          },
        ],
      };
    }

    return {
      labels: data01.labels.slice(),
      datasets: [
        {
          label: `Total de ${dado}: R$`,
          data: data01.data,
          backgroundColor: generateColors(data01.labels.slice()),
          borderWidth: 0.2,

          borderColor: chartType === CHART_TYPES.LINE ? generateColors(data01.labels.slice()).map(color => color.replace('rgb', 'rgba').replace(')', ', 1)')) : undefined,
          tension: chartType === CHART_TYPES.LINE ? 0.1 : undefined,
        },
      ],
    };
  }, [data01, dado, chartType, originalDataOrder]);

  const commonChartOptions = {
    maintainAspectRatio: false,
    onClick: handleChartClick,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.dataset.data[context.dataIndex];
            const originalIndex = originalDataOrder[context.dataIndex];
            const label = data01?.labels?.[originalIndex] || '';
            const { valuePart } = formatValueParts(value, label, false);
            return valuePart;
          },
          title: (tooltipItems) => {
            const originalIndex = originalDataOrder[tooltipItems[0].dataIndex];
            return data01?.labels?.[originalIndex] || '';
          }
        },
      },
    },
  };

  const chartOptions = useMemo(() => {
    const options = { ...commonChartOptions };
    
    if (chartType === CHART_TYPES.BAR) {
      options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            color: fontColor,
            callback: function(value) {
              return value.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              });
            }
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
            callback: function(value) {
              return value.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              });
            }
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
  }, [chartType, displayMode, fontColor, totalAdmin, data01?.labels, originalDataOrder]);

  const renderChart = () => {
    const chartProps = {
      ref: chartRef,
      data: chartData,
      options: chartOptions,
      height: 300
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
      
      <div className="chart-wrapper">
        {legendItems.length > 0 ? (
          <div className="custom-legend" ref={legendContainerRef}>
            <div className="legend-scroll-container">
              {legendItems.map((item, index) => (
                <div 
                  key={item.originalIndex}
                  className={`legend-item ${item.hidden ? 'hidden' : ''}`}
                  onClick={() => handleLegendClick(item.originalIndex)}
                  title="Clique para mostrar/esconder"
                >
                  <span 
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="legend-text">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="custom-legend empty">
            <div className="legend-scroll-container">
              <div className="no-legend-data">
                Sem dados para legenda
              </div>
            </div>
          </div>
        )}
        
        <div className="chart-area">
          {data01 && data01.labels && data01.labels.length > 0 ? (
            renderChart()
          ) : (
            <div className="no-chart-data">
              <p>Não há dados disponíveis para exibir no gráfico</p>
            </div>
          )}
        </div>
      </div>
      
    {/* Função: Exibir modal ao clicar em uma fatia do gráfico
      {showAdmModal && selectedAdm && (
        <Modal onClose={() => setShowAdmModal(false)}>
          {tipo === '0' ? (
            <NewTabelaGenerica
              array={[selectedAdm]}
              tableType="vendas"
              columns={getTableColumns('vendas')}
              showFilters={false}
              enableResponsive={true}
            />
          ) : tipo === '1' ? (
            <NewTabelaGenerica
              array={[selectedAdm]}
              tableType="creditos"
              columns={getTableColumns('creditos')}
              showFilters={false}
              enableResponsive={true}
            />
          ) : tipo === '2' ? (
            <NewTabelaGenerica
              array={[selectedAdm]}
              tableType="servicos"
              columns={getTableColumns('servicos')}
              showFilters={false}
              enableResponsive={true}
            />
          ) : (
            <div className="no-data-message">
              <p>Dados da adquirente:</p>
              <p><strong>Nome:</strong> {selectedAdm.adquirente}</p>
              <p><strong>Valor:</strong> {selectedAdm.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p><strong>Percentual:</strong> {selectedAdm.percentual}%</p>
            </div>
          )}
        </Modal>
      )}
    */}
    </div>
  );
};

export default PieChart;