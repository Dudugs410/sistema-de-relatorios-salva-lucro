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

const Dashboard = () => {
  const location = useLocation();
  // Joyride state
  const [runTutorial, setRunTutorial] = useState(false);
  const [activeDataType, setActiveDataType] = useState('vendas'); // 'vendas', 'creditos', 'servicos'

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
      target: '[data-tour="sales-section"]',
      content: 'Esta seção mostra seus dados de vendas, incluindo totais mensais e desempenho dos últimos 4 dias.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="credits-section"]',
      content: 'Aqui você pode ver informações de crédito, incluindo previsão para hoje e para os próximos 5 dias.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="services-section"]',
      content: 'Esta seção exibe dados de serviços com o total de hoje e o resumo mensal.',
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
  } = useContext(AuthContext);

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

  const chartDataExists = (array) => array && array.length > 0;

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
    // Get current date
    const currentDate = new Date()
    
    // Calculate final date (current date - 2 days)
    const finalDate = new Date(currentDate)
    finalDate.setDate(currentDate.getDate() - 2)
    
    // Calculate initial date (final date - 3 days)
    const initialDate = new Date(finalDate)
    initialDate.setDate(finalDate.getDate() - 3)
    
    // Format dates to Brazilian format (dd/mm/yyyy)
    const formatToBrazilian = (date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
    
    const initialDay = formatToBrazilian(initialDate)
    const finalDay = formatToBrazilian(finalDate)
    
    // Check if same month/year to show abbreviated format
    if (initialDate.getMonth() === finalDate.getMonth() && 
        initialDate.getFullYear() === finalDate.getFullYear()) {
      // Same month, show as "01 a 05/04/2024"
      const initialDayOnly = String(initialDate.getDate()).padStart(2, '0')
      return `${initialDayOnly} a ${finalDay}`
    }
    
    // Different months, show full dates
    return `${initialDay} a ${finalDay}`
  }

  // Get current active dashboard data
  const getCurrentDashboardData = () => {
    switch(activeDataType) {
      case 'vendas':
        return {
          dashboard: salesDashboard,
          isLoaded: isLoadedSalesDashboard,
          title: 'Vendas',
          icon: '💰',
          color: 'var(--secondary-color)', // Using CSS variable for lime green
          tipo: '0',
          dados: 'vendas'
        }
      case 'creditos':
        return {
          dashboard: creditsDashboard,
          isLoaded: isLoadedCreditsDashboard,
          title: 'Créditos',
          icon: '💳',
          color: 'var(--secondary-color)', // Using CSS variable for lime green
          tipo: '1',
          dados: 'creditos'
        }
      case 'servicos':
        return {
          dashboard: servicesDashboard,
          isLoaded: isLoadedServicesDashboard,
          title: 'Serviços',
          icon: '🛠️',
          color: 'var(--secondary-color)', // Using CSS variable for lime green
          tipo: '2',
          dados: 'servicos'
        }
      default:
        return null
    }
  }

  const currentData = getCurrentDashboardData()

  // Calculate total for summary cards
  const getTotalValue = () => {
    if (!currentData?.dashboard?.chart?.data) return 0
    return currentData.dashboard.chart.data.reduce((sum, val) => sum + val, 0)
  }

  // Get summary data for current type
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

  const DisplaySales = () => {
    return (
      <div className='graph-data'>
          <>
            <PieChart 
              data01={salesDashboard.chart} 
              arrayAdm={salesDashboard.sales} 
              totalAdmin={salesDashboard.totalAdmin}
              tipo='0' 
              dados='vendas'
            />
            <hr className='hr-global'/>
            <div className='dash-table-container'>
              <TabelaHorizontal 
                header={`Total últimos 4 dias (${formatDateRange()})`}
                valor={salesDashboard.totalLast4} 
                isCurrency={true}
              />
              <TabelaHorizontal 
                header='Total do Mês'
                valor={salesDashboard.totalMonth} 
                isCurrency={true}
              />
            </div>
          </>
      </div>
    );
  };

  const DisplayCredits = () => {
    return (
      <div className='graph-data'>
        <>
          <PieChart 
            data01={creditsDashboard.chart} 
            arrayAdm={creditsDashboard.credits} 
            totalAdmin={creditsDashboard.totalAdmin}
            tipo='1' 
            dados='creditos'
          />
          <hr className='hr-global'/>
          <div className='dash-table-container'>
            <TabelaHorizontal 
              header='Previsão de Hoje' 
              valor={creditsDashboard.totalCreditsToday} 
              isCurrency={true}
            />
            <TabelaHorizontal 
              header='Previsão Próx 5 Dias' 
              valor={creditsDashboard.totalCreditsNext5} 
              isCurrency={true}
            />
          </div> 
        </>
      </div>
    )
  }

  const DisplayServices = () => {
    return (
      <div className='graph-data'>
        <>
          <PieChart 
            data01={servicesDashboard.chart} 
            arrayAdm={servicesDashboard.services} 
            totalAdmin={servicesDashboard.totalAdmin}
            tipo='2' 
            dados='servicos'
          />
          <hr className='hr-global'/>
          <div className='dash-table-container'>
            <TabelaHorizontal 
              header='Total de Hoje' 
              valor={servicesDashboard.totalServicesToday} 
              isCurrency={true}
            />
            <TabelaHorizontal 
              header='Total do Mês' 
              valor={servicesDashboard.totalServicesMonth} 
              isCurrency={true}
            /> 
          </div>
        </>
      </div>
    )
  }

  // Render modern unified view
  const renderModernView = () => {
    if (!currentData) return null

    const { dashboard, isLoaded, title, icon, color, tipo, dados } = currentData
    const totalValue = getTotalValue()
    const summaryData = getSummaryData()

    if (!isLoaded) {
      return (
        <div className='chart-main-section'>
          <LazyLoader />
        </div>
      )
    }

    return (
      <>
        {/* Chart Type Selector Cards */}
        <div className="chart-type-selector">
          <div 
            className={`selector-card ${activeDataType === 'vendas' ? 'active' : ''}`}
            onClick={() => setActiveDataType('vendas')}
          >
            <div className="card-icon">💰</div>
            <div className="card-title">Vendas</div>
            <div className="card-value">
              {salesDashboard?.totalMonth?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
            </div>
          </div>
          
          <div 
            className={`selector-card ${activeDataType === 'creditos' ? 'active' : ''}`}
            onClick={() => setActiveDataType('creditos')}
          >
            <div className="card-icon">💳</div>
            <div className="card-title">Créditos</div>
            <div className="card-value">
              {creditsDashboard?.totalCreditsToday?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
            </div>
          </div>
          
          <div 
            className={`selector-card ${activeDataType === 'servicos' ? 'active' : ''}`}
            onClick={() => setActiveDataType('servicos')}
          >
            <div className="card-icon">🛠️</div>
            <div className="card-title">Serviços</div>
            <div className="card-value">
              {servicesDashboard?.totalServicesToday?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
            </div>
          </div>
        </div>

        {/* Main Chart Section */}
        <div className="chart-main-section">
          <div className="chart-header">
            <h2>
              <span className="section-icon">{icon}</span>
              {title} por {dados === 'servicos' ? 'Tipo' : 'Adquirente'}
            </h2>
            <div className="total-info">
              <span className="total-label">Total Geral:</span>
              <span className="total-value">
                {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

        {/* Métricas Adicionais - Right below chart section */}
        <div className="additional-metrics">
          <div className='subtitle-container-global'>
            <h3 className='subtitle'>Métricas Adicionais</h3>
          </div>
          <hr className='hr-global'/>
          <div className="metrics-grid">
            {tipo === '0' && (
              <>
                <div className="metric-card">
                  <div className="metric-label">Total últimos 4 dias</div>
                  <div className="metric-value">
                    {dashboard.totalLast4?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div className="metric-period">{formatDateRange()}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total do Mês</div>
                  <div className="metric-value">
                    {dashboard.totalMonth?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
              </>
            )}
            {tipo === '1' && (
              <>
                <div className="metric-card">
                  <div className="metric-label">Previsão de Hoje</div>
                  <div className="metric-value">
                    {dashboard.totalCreditsToday?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Previsão Próx 5 Dias</div>
                  <div className="metric-value">
                    {dashboard.totalCreditsNext5?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
              </>
            )}
            {tipo === '2' && (
              <>
                <div className="metric-card">
                  <div className="metric-label">Total de Hoje</div>
                  <div className="metric-value">
                    {dashboard.totalServicesToday?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total do Mês</div>
                  <div className="metric-value">
                    {dashboard.totalServicesMonth?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section">
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
                <div className="summary-value">
                  {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: 'var(--secondary-color)'
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
          scrollToFirstStep={false}
          showProgress={true}
          showSkipButton={true}
          scrollOffset={80}
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
          {/* Modern Unified View */}
          <div className="modern-dashboard-view">
            {renderModernView()}
          </div>

          {/* Original Separate Views (commented - can be toggled) */}
          {/*
          <div className="original-views">
            {renderSalesSection()}
            {renderCreditsSection()}
            {renderServicesSection()}
          </div>
          */}
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

export default Dashboard;