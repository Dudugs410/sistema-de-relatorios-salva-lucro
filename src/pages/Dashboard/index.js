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
		isDarkTheme, setIsDarkTheme,
		loadDashboard, isLoadedDashboard,
		salesDashboard, isLoadedSalesDashboard,
		creditsDashboard, isLoadedCreditsDashboard,
		servicesDashboard, isLoadedServicesDashboard,
		apiGroupCode, apiCNPJ,
	} = useContext(AuthContext)

	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
	},[])

	useEffect(()=>{
		async function inicializar(){
			loadDashboard()
		}
		inicializar()
	},[])

	useEffect(()=>{
		async function inicializar(){
			loadDashboard()
		}
		if(isLoadedDashboard){
			inicializar()
		}
	},[apiGroupCode, apiCNPJ])

	return(
		<>
			<div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				<div className={`content-area dash ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
					<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						{isLoadedSalesDashboard === false ? 
							<LazyLoader /> 
						: 
							<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
								<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Vendas:</h1>
								<PieChart data01 = {salesDashboard.chart} arrayAdm={salesDashboard.salesByAdmin} tipo = '0' dados = 'vendas'/>
								<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
									<TabelaHorizontal header='Total Últimos 4 dias' valor={salesDashboard.totalLast4} />
									<TabelaHorizontal header='Total do Mês' valor={salesDashboard.totalMonth} />
								</div>
							</div>}
					</div>

					<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>				
						{ isLoadedCreditsDashboard === false ? 
							<LazyLoader /> 
						: 
							<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
								<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Créditos:</h1>
								<PieChart data01 = {creditsDashboard.chart} arrayAdm={creditsDashboard.creditsByAdmin} tipo = '1' dados = 'creditos'/>
								<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
									<TabelaHorizontal header='Previsão de Hoje' valor={creditsDashboard.totalCreditsToday} />
									<TabelaHorizontal header='Previsão Próx 5 Dias' valor={creditsDashboard.totalCreditsNext5} />
								</div>
							</div>
						}
					</div>
	
					<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						<>
							{ isLoadedServicesDashboard === false ? 
								<LazyLoader />
							: 
								<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
									<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Serviços:</h1>
									<PieChart data01 = {servicesDashboard.chart} arrayAdm={servicesDashboard.servicesByAdmin} tipo = '2' dados = 'servicos'/>
									<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
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