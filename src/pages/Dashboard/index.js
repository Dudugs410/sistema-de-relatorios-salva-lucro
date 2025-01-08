/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable default-case */

import './dashboard.scss'

import { useContext, useEffect, useState } from 'react'
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
		changedOption, canceled, fetchingData, setFetchingData, setCanceled,
		canceledSales, canceledCredits, canceledServices,
		setCanceledSales, setCanceledCredits, setCanceledServices,
	} = useContext(AuthContext)

	useEffect(()=>{
		setCanceled(false)

	},[])

	// Run loadDashboard only once when the component mounts
	useEffect(()=>{
		console.log('loadDashboard')
		if(isLoadedDashboard === false){
			loadDashboard()
		}
	},[changedOption])

	const chartDataExists = (array) => array.length > 0


	const reloadSales = () => {
		setIsLoadedSalesDashboard(false)
		setCanceledSales(false)
		loadSalesGroup()
	}

	const reloadCredits = () => {
		setIsLoadedCreditsDashboard(false)
		setCanceledCredits(false)
		loadCreditsGroup()
	}

	const reloadServices = () => {
		setIsLoadedServicesDashboard(false)
		setCanceledServices(false)
		loadServicesGroup()
	}

	useEffect(()=>{
		console.log('canceled: ', canceled)
		if(canceled){
			setFetchingData(false)
			if(!isLoadedSalesDashboard){
				setCanceledSales(true)
			}

			if(!isLoadedCreditsDashboard){
				setCanceledCredits(true)
			}

			if(!isLoadedServicesDashboard){
				setCanceledServices(true)
			}
		}
	},[canceled])

	useEffect(()=>{
		console.log('isLoadedSalesDashboard: ', isLoadedSalesDashboard)
	},[isLoadedSalesDashboard])

	const DisplaySales = () => {
		return (
			<div className='graph-data'>
				{ !canceledSales ?
					<>
						{ chartDataExists(salesDashboard.sales) && !canceledSales ? 
							<>
								<PieChart data01={salesDashboard.chart} arrayAdm={salesDashboard.salesByAdmin} tipo='0' dados='vendas' totalAdmin={salesDashboard.totalAdmin}/>
								<div className='dash-table-container'>
									<TabelaHorizontal header='Total Últimos 4 dias' valor={salesDashboard.totalLast4} />
									<TabelaHorizontal header='Total do Mês' valor={salesDashboard.totalMonth} /> 
								</div>
							</>
							: 
							<div>
								{ errorSales || salesDashboard.sales === null ? 
									<div className='dash-table-container'>
										<h3 className='subtitle-global'>Ocorreu um erro</h3>
										<button className='btn btn-global' onClick={reloadSales}>Recarregar</button>
									</div>
									:
									<div className='dash-table-container'>
										<h3 className='subtitle-global'>Ainda não existem dados a serem exibidos para o mês atual</h3>
										<button className='btn btn-global' onClick={reloadSales}>Recarregar</button>
									</div>					
									}
							</div>
						}
					</>
						:
					<>
						<div className='dash-table-container'>
							<h3 className='subtitle-global'>Carregamento Cancelado</h3>
							<button className='btn btn-global' onClick={reloadSales}>Recarregar</button>
						</div>	
					</>
				}
			</div>
		)
	}

	const DisplayCredits = () => {
		return (
			<div className='graph-data'>
				{ !canceledCredits ?
					<>
						{ chartDataExists(creditsDashboard.credits) && !canceledCredits ? 
							<>
								<PieChart data01={creditsDashboard.chart} arrayAdm={creditsDashboard.creditsByAdmin} tipo='1' dados='creditos' totalAdmin={creditsDashboard.totalAdmin}/>
								<div className='dash-table-container'>
									<TabelaHorizontal header='Previsão de Hoje' valor={creditsDashboard.totalCreditsToday} />
									<TabelaHorizontal header='Previsão Próx 5 Dias' valor={creditsDashboard.totalCreditsNext5} />
								</div> 
							</>
						: 
							<div>
								{ errorCredits ? 
									<div className='dash-table-container'>
										<h3 className='subtitle-global'>Ocorreu um erro</h3>
										<button className='btn btn-global' onClick={reloadCredits}>Recarregar</button>
									</div>
									:
									<div className='dash-table-container'>
										<h3 className='subtitle-global'>Ainda não existem dados a serem exibidos para o mês atual</h3>
										<button className='btn btn-global' onClick={reloadCredits}>Recarregar</button>
									</div>
								}
							</div>
						}
					</>
						:
					<>
						<div className='dash-table-container'>
							<h3 className='subtitle-global'>Carregamento Cancelado</h3>
							<button className='btn btn-global' onClick={reloadCredits}>Recarregar</button>
						</div>	
					</>
				}
			</div>
		)
	}

	const DisplayServices = () => {
		return (
			<div className='graph-data'>
				{ !canceledServices ?
					<>
						{ chartDataExists(servicesDashboard.services) && !canceledServices ? 
							<>
								<PieChart data01={servicesDashboard.chart} arrayAdm={servicesDashboard.servicesByAdmin} tipo='2' dados='servicos' totalAdmin={servicesDashboard.totalAdmin}/> 
								<div className='dash-table-container'>
									<TabelaHorizontal header='Total de Hoje' valor={servicesDashboard.totalServicesToday} />
									<TabelaHorizontal header='Total do Mês' valor={servicesDashboard.totalServicesMonth} /> 
								</div>
							</>
						: 
							<div>
								{ errorServices ? 
									<div className='dash-table-container'>
										{<h3 className='subtitle-global'>Ocorreu um erro</h3>}
										<button className='btn btn-global' onClick={reloadServices}>Recarregar</button>
									</div>
									:
									<div className='dash-table-container'>
										<h3 className='subtitle-global'>Ainda não existem dados a serem exibidos para o mês atual</h3>
										<button className='btn btn-global ' onClick={reloadServices}>Recarregar</button>
									</div>
								}
							</div>
						}
					</>
						:
					<>
						<div className='dash-table-container'>
							<h3 className='subtitle-global'>Carregamento Cancelado</h3>
							<button className='btn btn-global' onClick={reloadServices}>Recarregar</button>
						</div>	
					</>
				}
			</div>
		)
	}

	return (
		<>
			<div className='appPage'>
				<div className='content-area dash'>
					<div className='data-group-area'>
						<h1 className='title-chart'>Vendas:</h1>
						{isLoadedSalesDashboard === false  ? 
							<LazyLoader /> 
						: 
							<DisplaySales />
						}
					</div>
					{/*<br/><br/>*/}
					<div className='data-group-area'>
						<h1 className='title-chart'>Créditos:</h1>			
						{ isLoadedCreditsDashboard === false ? 
							<LazyLoader /> 
						: 
							<DisplayCredits />
						}
					</div>
					{/*<br/><br/>*/}
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
