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
		cnpj, 
		modalCliente,
		admVendasAux,
		admCreditosAux,
		somatorioCreditosHojeAux,
		totalCreditos5diasAux,
		somatorioVendasMesAux,
		totalVendas4diasAux,
		graficoVendasAux,
		graficoCreditosAux,
		inicializouAux,
		isDarkTheme, setIsDarkTheme,
		admServicosAux,
		graficoServicosAux, totalServicosHojeAux, totalServicosMesAux,
		loadDashboardPage,
		totalVendas4dias,
		totalCreditos5dias,
		somatorioVendasMes,
		somatorioCreditosHoje,
		totalServicosHoje,
		totalServicosMes,
		admVendas,
		admCreditos,
		admServicos,
		graficoVendas,
		graficoCreditos,
		graficoServicos,
		loadingVendasDash,
		loadingCreditosDash,
		loadingVendas,
		loadingCreditos,
		loadingServicos,
		buscou,
	} = useContext(AuthContext)

	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
	},[])
	
	useEffect(()=>{
		if(buscou && cnpj){
			console.log('Código Grupo: ', Cookies.get('codigoGrupo'))
			loadDashboardPage()
		}
	},[buscou, cnpj])

	return(
		<>
			<div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				{ (modalCliente) && (!inicializouAux) && (Cookies.get('carregouModalCliente') === 'true') && ( <ModalCliente/> ) }
				{cnpj && (
					<div className={`content-area dash ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							
								{loadingVendas ? 
									<LazyLoader /> 
								: 
									<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
										<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Vendas:</h1>
										{ inicializouAux === true ? <PieChart data01 = {graficoVendasAux} arrayAdm={admVendasAux} tipo = '0' dados = 'vendas'/> : <PieChart data01 = {graficoVendas} arrayAdm={admVendas}/>}
										<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
											{ loadingVendasDash }
											{ inicializouAux ? <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4diasAux.toFixed(2)} /> : <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4dias.toFixed(2)} />}
											{ inicializouAux ? <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMesAux.toFixed(2)} /> : <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMes.toFixed(2)} />}
										</div>
									</div>}
						</div>
									<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
										
							{ loadingCreditos ? 
								<LazyLoader /> 
							: 
								<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
									<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Créditos:</h1>
									{ inicializouAux === true ? <PieChart data01 = {graficoCreditosAux} arrayAdm={admCreditosAux} tipo = '0' dados = 'creditos'/> : <PieChart data01 = {graficoCreditos} arrayAdm={admCreditos}/>}
									<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
										{ loadingCreditosDash }
										{ inicializouAux ? <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHojeAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHoje.toFixed(2)} />}
										{ inicializouAux ? <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5diasAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5dias.toFixed(2)} />}
									</div>
								</div>
							}

									</div>
									<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
										<>
											{ loadingServicos ? 
												<LazyLoader /> 
											: 
												<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
													<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Serviços:</h1>
													{ inicializouAux === true ? <PieChart data01 = {graficoServicosAux} arrayAdm={admServicosAux} tipo = '1' dados = 'servicos'/> : <PieChart data01 = {graficoServicos} arrayAdm={admServicos}/>}
													<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
														{ loadingCreditosDash }
														{ inicializouAux ? <TabelaHorizontal header='Total de Hoje' valor={totalServicosHojeAux.toFixed(2) } /> : <TabelaHorizontal header='Total de Hoje' valor={totalServicosHoje.toFixed(2)} />}
														{ inicializouAux ? <TabelaHorizontal header='Total do Mês' valor={totalServicosMesAux.toFixed(2) } /> : <TabelaHorizontal header='Total do Mês' valor={totalServicosMes.toFixed(2)} />}
													</div>
												</div>				
											}
										</>
									</div>
								</div>
							)}
			</div>
		</>  
	)  
}

export default Dashboard