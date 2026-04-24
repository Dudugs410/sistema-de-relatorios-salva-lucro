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
import { FiHelpCircle } from 'react-icons/fi';
import ModalAlerta from './ModalAlerta/index.js';

const Dashboard = () => {
  const location = useLocation();
  // Joyride state
  const [runTutorial, setRunTutorial] = useState(false);

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
                header={`Total últimos dias (${formatDateRange()})`}
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
              header='Previsão Próx 4 Dias' 
              valor={creditsDashboard.totalCreditsToday} 
              isCurrency={true}
            />
            <TabelaHorizontal 
              header='Previsão de Hoje' 
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
          <div className='data-group-area' data-tour="sales-section">
            <h1 className='title-chart'>Vendas:</h1>
            {isLoadedSalesDashboard === false ? (
              <LazyLoader /> 
            ) : (
              <DisplaySales />
            )}
          </div>
          
          <div className='data-group-area' data-tour="credits-section">
            <h1 className='title-chart'>Créditos:</h1>			
            {isLoadedCreditsDashboard === false ? (
              <LazyLoader /> 
            ) : (
              <DisplayCredits />
            )}
          </div>
          
          <div className='data-group-area' data-tour="services-section">
            <h1 className='title-chart'>Serviços:</h1>
            {isLoadedServicesDashboard === false ? (
              <LazyLoader />
            ) : (
              <DisplayServices />
            )}
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

export default Dashboard;