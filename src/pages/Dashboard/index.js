/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable default-case */

import './dashboard.scss'

import { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth'
import { cancelOngoingRequests } from '../../services/api.js'
import TabelaHorizontal from '../../components/Componente_TabelaHorizontal'
import PieChart from '../../components/GraficoDashboard'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import LazyLoader from '../../components/Componente_LazyLoader/index.js'

const Dashboard = () => {
	const location = useLocation()
	
	useEffect(() => {
		localStorage.setItem('currentPath', location.pathname)
	}, [location])

	const {  
		loadDashboard, isLoadedDashboard,
		salesDashboard, isLoadedSalesDashboard, setIsLoadedSalesDashboard, loadSalesGroup, errorSales,
		creditsDashboard, isLoadedCreditsDashboard, setIsLoadedCreditsDashboard, loadCreditsGroup, errorCredits,
		servicesDashboard, isLoadedServicesDashboard, setIsLoadedServicesDashboard, loadServicesGroup, errorServices,
		changedOption,
	} = useContext(AuthContext)

	// Run loadDashboard only once when the component mounts
	useEffect(() => {
		if(isLoadedDashboard === false){
			loadDashboard()
		}
	}, [])

	useEffect(()=>{
		if((changedOption === true) && (isLoadedDashboard === true)){
			loadDashboard()
		}
	},[changedOption])

	const chartDataExists = (array) => array.length > 0

	const reloadSales = () => {
		setIsLoadedSalesDashboard(false)
		loadSalesGroup()
	}

	const reloadCredits = () => {
		setIsLoadedCreditsDashboard(false)
		loadCreditsGroup()
	}

	const reloadServices = () => {
		setIsLoadedServicesDashboard(false)
		loadServicesGroup()
	}

	const DisplaySales = () => {
		return (
			<div className='graph-data'>
				<div className='dash-table-container'>
					{ chartDataExists(salesDashboard.sales) ? 
						<>
							<PieChart data01={salesDashboard.chart} arrayAdm={salesDashboard.salesByAdmin} tipo='0' dados='vendas'/>
							<TabelaHorizontal header='Total Últimos 4 dias' valor={salesDashboard.totalLast4} />
							<TabelaHorizontal header='Total do Mês' valor={salesDashboard.totalMonth} /> 
						</>
						: 
						<div style={{'alignSelf': 'center'}}>
							{ errorSales || salesDashboard.sales === null ? 
								<div className='dashboard-error-container'>
									<h3 className='subtitle-global'>Ocorreu um erro</h3>
									<button className='btn btn-global btn-danger  btn-dash-error' onClick={reloadSales}>Recarregar</button>
								</div>
								:
								<h3 className='subtitle-global'>Ainda não existem dados a serem exibidos para o mês atual</h3>						
								}
						</div>
					}
				</div>
			</div>
		)
	}

	const DisplayCredits = () => {
		return (
			<div className='graph-data'>
				<div className='dash-table-container'>
					{ chartDataExists(creditsDashboard.credits) ? 
						<>
							<PieChart data01={creditsDashboard.chart} arrayAdm={creditsDashboard.creditsByAdmin} tipo='1' dados='creditos'/>
							<TabelaHorizontal header='Previsão de Hoje' valor={creditsDashboard.totalCreditsToday} />
							<TabelaHorizontal header='Previsão Próx 5 Dias' valor={creditsDashboard.totalCreditsNext5} /> 
						</>
					: 
						<div style={{'alignSelf': 'center'}}>
							{ errorCredits ? 
								<div className='dashboard-error-container'>
									<h3 className='subtitle-global'>Ocorreu um erro</h3>
									<button className='btn btn-global btn-danger  btn-dash-error' onClick={reloadCredits}>Recarregar</button>
								</div>
								:
								<h3 className='subtitle-global'>Ainda não existem dados a serem exibidos para o mês atual</h3>
							}
						</div>
					}
				</div>
			</div>
		)
	}

	const DisplayServices = () => {
		return (
			<div className='graph-data'>
				<div className='dash-table-container'>
					{ chartDataExists(servicesDashboard.services) ? 
						<>
							<PieChart data01={servicesDashboard.chart} arrayAdm={servicesDashboard.servicesByAdmin} tipo='2' dados='servicos'/> 
							<TabelaHorizontal header='Total de Hoje' valor={servicesDashboard.totalServicesToday} />
							<TabelaHorizontal header='Total do Mês' valor={servicesDashboard.totalServicesMonth} /> 
						</>
					: 
						<div style={{'alignSelf': 'center'}}>
							{ errorServices ? 
								<div className='dashboard-error-container'>
									<h3 className='subtitle-global'>Ocorreu um erro</h3>
									<button className='btn btn-global btn-danger btn-dash-error' onClick={reloadServices}>Recarregar</button>
								</div>
								:
								<h3 className='subtitle-global'>Ainda não existem dados a serem exibidos para o mês atual</h3>
							}
						</div>
					}
				</div>
			</div>
		)
	}

	return (
		<>
			<div className='appPage'>
				<div className='content-area dash'>
					<div className='data-group-area'>
						<h1 className='title-chart'>Vendas:</h1>
						{isLoadedSalesDashboard === false ? 
							<LazyLoader /> 
						: 
							<DisplaySales />
						}
					</div>
					<div className='data-group-area'>
						<h1 className='title-chart'>Créditos:</h1>			
						{ isLoadedCreditsDashboard === false ? 
							<LazyLoader /> 
						: 
							<DisplayCredits />
						}
					</div>
					<div className='data-group-area'>
						<h1 className='title-chart'>Serviços:</h1>
						{ isLoadedServicesDashboard === false ? 
							<LazyLoader />
						: 
							<DisplayServices />
						}
					</div>
				</div>		
			</div>
		</>  
	)
}

export default Dashboard
