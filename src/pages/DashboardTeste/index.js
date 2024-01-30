/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */

import './dashboard.scss'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
//////
import LoadingModal from '../../components/LoadingModal'
import ModalCliente from '../../components/ModalCliente'
import TabelaHorizontal from '../../components/Componente_TabelaHorizontal'
//////
import PieChart from '../../components/GraficoDashboard'

import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'
import '../../index.scss'

const DashboardTeste = () => {

	const location = useLocation()

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname)
	}, [location])
    
	const {  
		cnpj, 
		modalCliente,
		admVendasAux,
		setAdmVendasAux,
		somatorioVendasMesAux,
		setSomatorioVendasMesAux,
		totalVendas4diasAux,
		setTotalVendas4diasAux,
		graficoVendasAux,
		setGraficoVendasAux,
		inicializouAux,
		setInicializouAux,
		isDarkTheme,
		setIsDarkTheme,
		loadDashboard,
	} = useContext(AuthContext)

	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
	},[])

	const [vendas4dias, setVendas4dias] = useState([])
	const [totalVendas4dias, setTotalVendas4dias] = useState(0)
	const [somatorioVendasMes, setSomatorioVendasMes] = useState(0)
	const [admVendas, setAdmVendas] = useState([])
	const [graficoVendas, setGraficoVendas] = useState({ labels: [], data: [] })
	const [inicializou, setInicializou] = useState(false)
	const [loadingVendasDash, setLoadingVendasDash] = useState(null)

	useEffect(()=>{
		if(sessionStorage.getItem('inicializou')){
			setInicializou(sessionStorage.getItem('inicializou'))
		}
	},[])

	const [carregaTotais, setCarregaTotais] = useState(false)

	async function inicializaTotais(){
		console.log('inicializaTotais()')
		if((cnpj !== undefined) && (cnpj !== '')){
			console.log(Cookies.get('cnpj'))
			try{
				console.log('try >>')
				const totalConsulta = await loadDashboard()
				setVendas4dias(totalConsulta.vendas.valorTotaldias)
				setTotalVendas4dias(totalConsulta.vendas.valorTotaldias)
				setTotalVendas4diasAux(totalConsulta.vendas.valorTotaldias)
				setSomatorioVendasMes(totalConsulta.vendas.valorTotalMes)
				setSomatorioVendasMesAux(totalConsulta.vendas.valorTotalMes)
				setAdmVendas(totalConsulta.vendas.valorTotalAdquirentes)
				setAdmVendasAux(totalConsulta.vendas.valorTotalAdquirentes)
			} catch (error){
				console.log('catch >>')
				console.error('Error fetching vendas:', error)
			} finally {
				console.log('finally >>')
				setCarregaTotais(true)
			}
		}
	}

	useEffect(()=>{
		if(carregaTotais){
			console.log('----- Testando Endpoint >dashboard< Totais -----')
			console.log(totalVendas4dias)
			console.log(somatorioVendasMes)
			console.log(admVendas)
		}
	},[carregaTotais])

	///////////////////////////////////////////////////////////////////////////////
	//// Inicializar Dados de Vendas e Créditos ///////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	useEffect(()=>{
		async function inicializar(){
			if(cnpj !== null && cnpj !== ''){
				inicializaTotais()
				setInicializou(true)
				setInicializouAux(true)
				sessionStorage.setItem('inicializou', true)
			}
		}

		if(inicializouAux !== true){
			setLoadingVendasDash(true)
			inicializar().then(() => {
				setLoadingVendasDash(false)
			})
		}
	},[cnpj])

	const sortArray = (arrayAdq) => {
		const sortedArray = [...arrayAdq].sort((a, b) => {
			const nameA = a.nomeAdquirente.toUpperCase()
			const nameB = b.nomeAdquirente.toUpperCase()
			if (nameA < nameB) {
				return -1
			}
			if (nameA > nameB) {
				return 1
			}
			return 0
		})
		return sortedArray
	}

	useEffect(()=>{
		console.log('-admVendas-')
		console.log(admVendas)
		setGraficoVendas(carregaGrafico(admVendas))
		if(admVendasAux.length > 0){
			setGraficoVendasAux(carregaGrafico(admVendasAux))
		}
	},[admVendas])

	//////////////////////////////////////////////

	function carregaGrafico(array){
		let label = []
		let data = []

		array.forEach((posicao) => {
			const valorTotal = posicao.valor
			const nomeAdq = posicao.adquirente
			label.push(nomeAdq)
			data.push(Number(valorTotal.toFixed(2)))
		})
		const obj = {labels: label, data: data}
		return obj
	}

	return(
		<>
			<div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				{ (modalCliente) && (!inicializouAux) && (Cookies.get('carregouModalCliente') === 'true') && ( <ModalCliente/> ) }
				{cnpj && (
					<div className={`content-area dash ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
								<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Vendas:</h1>
								{ inicializouAux === true ? <PieChart data01 = {graficoVendasAux} arrayAdm={admVendasAux} tipo = '0'/> : <PieChart data01 = {graficoVendas} arrayAdm={admVendas}/>}
								<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
									{ loadingVendasDash && (<LoadingModal/>) }
									{inicializouAux ? <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4diasAux.toFixed(2)} /> : <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4diasAux.toFixed(2)} />}
									{inicializouAux ? <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMesAux.toFixed(2)} /> : <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMesAux.toFixed(2)} />}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>  
	)  
}

export default DashboardTeste