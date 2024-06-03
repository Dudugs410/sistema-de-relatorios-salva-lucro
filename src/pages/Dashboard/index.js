/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable default-case */

import './dashboard.scss'

import { Suspense, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
//////
import ModalCliente from '../../components/ModalCliente'
import TabelaHorizontal from '../../components/Componente_TabelaHorizontal'
//////
import PieChart from '../../components/GraficoDashboard'

import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import LazyLoader from '../../components/Componente_LazyLoader/index.js'

const Dashboard = () => {
	const location = useLocation()

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname)
	}, [location])
    
	const {  
		loadDashboard, isLoadedDashboard,
		salesDashboard, isLoadedSalesDashboard,
		creditsDashboard, isLoadedCreditsDashboard,
		servicesDashboard, isLoadedServicesDashboard,
		changedOption
	} = useContext(AuthContext)

	useEffect(()=>{
		async function inicializar(){
			loadDashboard()
		}
		inicializar()
	},[])

	useEffect(()=>{
		if(isLoadedDashboard){
			loadDashboard()
		}
	},[changedOption])

	return(
		<>
			<div className='appPage'>
				<div className='content-area dash'>
					<div className='data-group-area'>
						{isLoadedSalesDashboard === false ? 
							<LazyLoader /> 
						: 
							<div className='graph-data'>
								<h1 className='title-chart'>Vendas:</h1>
								<PieChart data01 = {salesDashboard.chart} arrayAdm={salesDashboard.salesByAdmin} tipo = '0' dados = 'vendas'/>
								<div className='dash-table-container'>
									<TabelaHorizontal header='Total Últimos 4 dias' valor={salesDashboard.totalLast4} />
									<TabelaHorizontal header='Total do Mês' valor={salesDashboard.totalMonth} />
								</div>
							</div>}
					</div>

					<div className='data-group-area'>				
						{ isLoadedCreditsDashboard === false ? 
							<LazyLoader /> 
						: 
							<div className='graph-data'>
								<h1 className='title-chart'>Créditos:</h1>
								<PieChart data01 = {creditsDashboard.chart} arrayAdm={creditsDashboard.creditsByAdmin} tipo = '1' dados = 'creditos'/>
								<div className='dash-table-container'>
									<TabelaHorizontal header='Previsão de Hoje' valor={creditsDashboard.totalCreditsToday} />
									<TabelaHorizontal header='Previsão Próx 5 Dias' valor={creditsDashboard.totalCreditsNext5} />
								</div>
							</div>
						}
					</div>
	
					<div className='data-group-area'>
						<>
							{ isLoadedServicesDashboard === false ? 
								<LazyLoader />
							: 
								<div className='graph-data'>
									<h1 className='title-chart'>Serviços:</h1>
									<PieChart data01 = {servicesDashboard.chart} arrayAdm={servicesDashboard.servicesByAdmin} tipo = '2' dados = 'servicos'/>
									<div className='dash-table-container'>
										<TabelaHorizontal header='Total de Hoje' valor={servicesDashboard.totalServicesToday} />
										<TabelaHorizontal header='Total do Mês' valor={servicesDashboard.totalServicesMonth} />
									</div>
								</div>				
							}
						</>
					</div>
				</div>		
			</div>
		</>  
	)  
}

export default Dashboard