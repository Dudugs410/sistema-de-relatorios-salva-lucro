/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable default-case */

import './dashboard.scss';
import { useContext, useEffect, useState } from 'react';
import Joyride from 'react-joyride';
import { AuthContext } from '../../contexts/auth';
import { cancelOngoingRequests } from '../../services/api.js';
import TabelaHorizontal from '../../components/Componente_TabelaHorizontal';
import PieChart from '../../components/GraficoDashboard';
import { useLocation } from 'react-router-dom';
import '../../index.scss';
import LazyLoader from '../../components/Componente_LazyLoader/index.js';
import { FiHelpCircle, FiSun, FiMoon } from 'react-icons/fi';
import ModalAlerta from './ModalAlerta/index.js';

import { LuCircleDollarSign } from "react-icons/lu";
import { FaRegCreditCard } from "react-icons/fa6";
import { LiaToolsSolid } from "react-icons/lia";

const Dashboard = () => {
  const location = useLocation();
  const [runTutorial, setRunTutorial] = useState(false);
  const [activeDataType, setActiveDataType] = useState('vendas');

  const alerta = false;
  const [modalOpen, setModalOpen] = useState(alerta);

  const [steps] = useState([
    {
      target: '[data-tour="trocar-section"]',
      content: 'Este botão permite trocar o Cliente/Filial, caso exista mais de um. O que for selecionado terá seus dados exibidos nos gráficos do dashboard',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="selector-cards"]',
      content: 'Selecione entre Vendas, Créditos ou Serviços para visualizar métricas específicas. Cada card mostra o valor total do período atual.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="main-chart"]',
      content: 'Este gráfico de pizza mostra a distribuição dos valores por adquirente ou tipo de serviço. Passe o mouse sobre as fatias para ver detalhes.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="metrics-grid"]',
      content: 'Métricas adicionais específicas para o tipo de dado selecionado. Os valores são atualizados automaticamente.',
      placement: 'top'
    },
    {
      target: '[data-tour="summary-section"]',
      content: 'Resumo detalhado com distribuição percentual de cada adquirente ou tipo de serviço, incluindo barras de progresso para fácil visualização.',
      placement: 'bottom'
    },
  ]);

  const {  
    loadDashboard, isLoadedDashboard,
    salesDashboard, isLoadedSalesDashboard, setIsLoadedSalesDashboard, loadSalesGroup, errorSales,
    creditsDashboard, isLoadedCreditsDashboard, setIsLoadedCreditsDashboard, loadCreditsGroup, errorCredits,
    servicesDashboard, isLoadedServicesDashboard, setIsLoadedServicesDashboard, loadServicesGroup, errorServices,
    changedOption, canceled, fetchingData, setFetchingData, setCanceled,
    canceledSales, canceledCredits, canceledServices,
    setCanceledSales, setCanceledCredits, setCanceledServices,
    // Add these from context
    userPreferences,
    loadUserPreferences,
    currentContext,
    currentTheme
  } = useContext(AuthContext);

  // ===== FIX: Load user preferences from API on mount =====
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const userId = localStorage.getItem('userID');
        if (userId) {
          // This should load preferences from API and apply them
          await loadUserPreferences(userId);
        }
      } catch (error) {
        console.error('Error loading preferences in dashboard:', error);
      }
    };
    
    loadPrefs();
  }, []); // Run once on mount

  // ===== Apply preferences when they change =====
  useEffect(() => {
    if (currentContext) {
      document.documentElement.setAttribute('data-context', currentContext);
      console.log('🎨 Dashboard applied context from API:', currentContext);
    }
    
    if (currentTheme !== undefined && currentTheme !== null) {
      const themeValue = currentTheme ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', themeValue);
      console.log('🎨 Dashboard applied theme from API:', themeValue);
    }
  }, [currentContext, currentTheme]);
  // ===== END FIX =====

  // Helper function to format currency with secondary color class
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  useEffect(() => {
    setCanceled(false);
  }, []);

  useEffect(() => {
    if (isLoadedDashboard === false) {
      loadDashboard();
    }
  }, [changedOption]);

  const handleTutorialEnd = () => {
    setRunTutorial(false);
  };

  const reloadSales = () => {
    setIsLoadedSalesDashboard(false);
    setCanceledSales(false);
    loadSalesGroup();
  };

  const reloadCredits = () => {
    setIsLoadedCreditsDashboard(false);
    setCanceledCredits(false);
    loadCreditsGroup();
  };

  const reloadServices = () => {
    setIsLoadedServicesDashboard(false);
    setCanceledServices(false);
    loadServicesGroup();
  };

  useEffect(() => {
    if (canceled === true) {
      setFetchingData(false);
      if (!isLoadedSalesDashboard) {
        setCanceledSales(true);
      }

      if (!isLoadedCreditsDashboard) {
        setCanceledCredits(true);
      }

      if (!isLoadedServicesDashboard) {
        setCanceledServices(true);
      }
    }
  }, [canceled]);

  const formatDateRange = () => {
    const currentDate = new Date()
    const finalDate = new Date(currentDate)
    finalDate.setDate(currentDate.getDate() - 2)
    const initialDate = new Date(finalDate)
    initialDate.setDate(finalDate.getDate() - 3)
    
    const formatToBrazilian = (date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
    
    const initialDay = formatToBrazilian(initialDate)
    const finalDay = formatToBrazilian(finalDate)
    
    if (initialDate.getMonth() === finalDate.getMonth() && 
        initialDate.getFullYear() === finalDate.getFullYear()) {
      const initialDayOnly = String(initialDate.getDate()).padStart(2, '0')
      return `${initialDayOnly} a ${finalDay}`
    }
    
    return `${initialDay} a ${finalDay}`
  }

  const getCurrentDashboardData = () => {
    switch(activeDataType) {
      case 'vendas':
        return {
          dashboard: salesDashboard,
          isLoaded: isLoadedSalesDashboard,
          title: 'Vendas',
          icon: LuCircleDollarSign,
          color: 'var(--secondary-color)',
          tipo: '0',
          dados: 'vendas'
        }
      case 'creditos':
        return {
          dashboard: creditsDashboard,
          isLoaded: isLoadedCreditsDashboard,
          title: 'Créditos',
          icon: FaRegCreditCard,
          color: 'var(--secondary-color)',
          tipo: '1',
          dados: 'creditos'
        }
      case 'servicos':
        return {
          dashboard: servicesDashboard,
          isLoaded: isLoadedServicesDashboard,
          title: 'Serviços',
          icon: LiaToolsSolid,
          color: 'var(--secondary-color)',
          tipo: '2',
          dados: 'servicos'
        }
      default:
        return null
    }
  }

  const currentData = getCurrentDashboardData()

  const getTotalValue = () => {
    if (!currentData?.dashboard?.chart?.data) return 0
    return currentData.dashboard.chart.data.reduce((sum, val) => sum + val, 0)
  }

  const getSummaryData = () => {
    if (!currentData?.dashboard?.chart) return []
    const { labels, data } = currentData.dashboard.chart
    const total = getTotalValue()
    return labels?.map((label, index) => ({
      label,
      value: data[index],
      percentage: total > 0 ? ((data[index] / total) * 100).toFixed(1) : 0
    })) || []
  }

  const renderModernView = () => {
    if (!currentData) return null

    const { dashboard, isLoaded, title, icon: IconComponent, color, tipo, dados } = currentData
    const totalValue = getTotalValue()
    const summaryData = getSummaryData()

    if (!isLoaded) {
      return (
        <div className='chart-main-section' data-tour="main-chart">
          <LazyLoader />
        </div>
      )
    }

    return (
      <>
        {/* Chart Type Selector Cards */}
        <div className="chart-type-selector" data-tour="selector-cards">
          <div 
            className={`selector-card ${activeDataType === 'vendas' ? 'active' : ''}`}
            onClick={() => setActiveDataType('vendas')}
          >
            <div className="card-icon">
              <LuCircleDollarSign className={`icon-global ${activeDataType === 'vendas' ? 'active-icon' : ''}`} />
            </div>
            <div className="card-title">Vendas</div>
            <div className="card-value currency-value money">
              {formatCurrency(salesDashboard?.totalMonth) || 'R$ 0,00'}
            </div>
          </div>
          
          <div 
            className={`selector-card ${activeDataType === 'creditos' ? 'active' : ''}`}
            onClick={() => setActiveDataType('creditos')}
          >
            <div className="card-icon">
              <FaRegCreditCard className={`icon-global ${activeDataType === 'creditos' ? 'active-icon' : ''}`} />
            </div>
            <div className="card-title">Créditos</div>
            <div className="card-value currency-value money">
              {formatCurrency(creditsDashboard?.totalCreditsToday) || 'R$ 0,00'}
            </div>
          </div>
          
          <div 
            className={`selector-card ${activeDataType === 'servicos' ? 'active' : ''}`}
            onClick={() => setActiveDataType('servicos')}
          >
            <div className="card-icon">
              <LiaToolsSolid className={`icon-global ${activeDataType === 'servicos' ? 'active-icon' : ''}`} />
            </div>
            <div className="card-title">Serviços</div>
            <div className="card-value currency-value money">
              {formatCurrency(servicesDashboard?.totalServicesMonth) || 'R$ 0,00'}
            </div>
          </div>
        </div>

        {/* Main Chart Section */}
        <div className="chart-main-section" data-tour="main-chart">
          <div className="chart-header">
            <h2>
              <span className="section-icon">
                <IconComponent className="icon-global" />
              </span>
              {title} por {dados === 'servicos' ? 'Tipo' : 'Adquirente'}
            </h2>
            <div className="total-info">
              <span className="total-label">Total Geral:</span>
              <span className="total-value currency-value money">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
          
          <div className="chart-wrapper-enhanced">
            <PieChart 
              data01={dashboard.chart} 
              arrayAdm={tipo === '0' ? dashboard.sales : tipo === '1' ? dashboard.credits : dashboard.services} 
              totalAdmin={dashboard.totalAdmin}
              tipo={tipo} 
              dados={dados}
            />
          </div>
        </div>

        {/* Métricas Adicionais */}
        <div className="additional-metrics" data-tour="metrics-grid">
          <div className='subtitle-container-global'>
            <h3 className='subtitle'>Métricas Adicionais</h3>
          </div>
          <hr className='hr-global'/>
          <div className="metrics-grid">
            {tipo === '0' && (
              <>
                <div className="metric-card">
                  <div className="metric-label">Total últimos 4 dias</div>
                  <div className="metric-value currency-value money">
                    {formatCurrency(dashboard.totalLast4)}
                  </div>
                  <div className="metric-period">{formatDateRange()}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total do Mês</div>
                  <div className="metric-value currency-value money">
                    {formatCurrency(dashboard.totalMonth)}
                  </div>
                </div>
              </>
            )}
            {tipo === '1' && (
              <>
                <div className="metric-card">
                  <div className="metric-label">Previsão de Hoje</div>
                  <div className="metric-value currency-value">
                    {formatCurrency(dashboard.totalCreditsToday)}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Previsão Próx 5 Dias</div>
                  <div className="metric-value currency-value">
                    {formatCurrency(dashboard.totalCreditsNext5)}
                  </div>
                </div>
              </>
            )}
            {tipo === '2' && (
              <>
                <div className="metric-card">
                  <div className="metric-label">Total de Hoje</div>
                  <div className="metric-value currency-value">
                    {formatCurrency(dashboard.totalServicesToday)}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total do Mês</div>
                  <div className="metric-value currency-value">
                    {formatCurrency(dashboard.totalServicesMonth)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section" data-tour="summary-section">
          <div className='subtitle-container-global'>
            <h3 className='subtitle'>Resumo por {dados === 'servicos' ? 'Tipo de Serviço' : 'Adquirente'}</h3>
          </div>
          <hr className='hr-global'/>
          <div className="summary-cards">
            {summaryData.map((item, index) => (
              <div key={item.label} className="summary-card">
                <div className="summary-card-header">
                  <span className="summary-label">{item.label}</span>
                  <span className="summary-percentage">{item.percentage}%</span>
                </div>
                <div className="summary-value currency-value money">
                  {formatCurrency(item.value)}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: 'var(--primary-color)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className='hr-global'/>
      </>
    )
  }

  return (
    <>
      {modalOpen && (
        <ModalAlerta onClose={() => { setModalOpen(false); }} />
      )}
      
      {runTutorial && (
        <Joyride
          steps={steps}
          run={runTutorial}
          continuous={true}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          scrollOffset={80}
          disableOverlayClose={true}
          styles={{
            options: {
              primaryColor: '#99cc33',
              textColor: '#0a3d70',
              zIndex: 10000,
            }
          }}
          callback={(data) => {
            if (data.status === 'finished' || data.status === 'skipped') {
              handleTutorialEnd();
            }
          }}
          locale={{
            back: 'Voltar',
            close: 'Fechar',
            last: 'Finalizar',
            next: 'Próximo',
            skip: 'Pular',
            nextLabelWithProgress: 'Próximo ({step} de {steps})',
          }}
        />	
      )}
      
      <div className='appPage'>
        <div className='content-area dash'>
          <div className="modern-dashboard-view">
            {renderModernView()}
          </div>
        </div>
      </div>    
      
      <button 
        className='btn btn-success-dados btn-tutorial px-2 py-1'
        onClick={() => setRunTutorial(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 10,
          padding: '10px 15px',
          background: 'none',
          color: '#99cc33',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        <FiHelpCircle />
      </button>
    </>  
  )
}

export default Dashboard