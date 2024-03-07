/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
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

const Dashboard = () => {
	const location = useLocation()

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname)
	}, [location])
    
	const {  
		returnVendas,
		returnCreditos,
		returnTotalMes,
		cnpj, 
		dateConvertSearch, 
		modalCliente,
		converteData,
		admVendasAux,
		setAdmVendasAux,
		admCreditosAux,
		setAdmCreditosAux,
		somatorioCreditosHojeAux,
		setSomatorioCreditosHojeAux,
		totalCreditos5diasAux,
		setTotalCreditos5diasAux,
		somatorioVendasMesAux,
		setSomatorioVendasMesAux,
		totalVendas4diasAux,
		setTotalVendas4diasAux,
		graficoVendasAux,
		setGraficoVendasAux,
		graficoCreditosAux,
		setGraficoCreditosAux,
		inicializouAux,
		setInicializouAux,
		isDarkTheme,
		setIsDarkTheme,
		loadAjustes,
		admServicosAux,
		setAdmServicosAux,
		graficoServicosAux,
		setGraficoServicosAux,
		totalServicosHojeAux,
		setTotalServicosHojeAux,
		totalServicosMesAux,
		setTotalServicosMesAux,
		returnVendasPorPeriodo,
		buscou,
		setBuscou,
		setCnpj,
	} = useContext(AuthContext)

	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
	},[])

	const [vetorVendasMes, setVetorVendasMes] = useState([])
	const [vetorCreditosMes, setVetorCreditosMes] = useState([])

	const [vendas4dias, setVendas4dias] = useState([])
	const [creditos5dias, setCreditos5dias] = useState([])

	const [totalVendas4dias, setTotalVendas4dias] = useState(0)
	const [totalCreditos5dias, setTotalCreditos5dias] = useState(0)

	const [vendasMes, setVendasMes] = useState([])
	const [somatorioVendasMes, setSomatorioVendasMes] = useState(0)

	const [creditosMes, setCreditosMes] = useState([])
	const [somatorioCreditosHoje, setSomatorioCreditosHoje] = useState(0)

	const [totalServicosHoje, setTotalServicosHoje] = useState(0)
	const [totalServicosMes, setTotalServicosMes] = useState(0)

	const [admVendas, setAdmVendas] = useState([])
	const [admCreditos, setAdmCreditos] = useState([])
	const [admServicos, setAdmServicos] = useState([])

	const [graficoVendas, setGraficoVendas] = useState({ labels: [], data: [] })
	const [graficoCreditos, setGraficoCreditos] = useState({ labels: [], data: [] })
	const [graficoServicos, setGraficoServicos] = useState({labels: [], data: []})

	const [cnpjSelecionado, setCnpjSelecionado] = useState(false)

	const [inicializou, setInicializou] = useState(false)
    
	const [loadingVendasDash, setLoadingVendasDash] = useState(null)
	const [loadingCreditosDash, setLoadingCreditosDash] = useState(null)

	// ajustes/serviços

	const [servicos, setServicos] = useState([])

	//

	useEffect(()=>{
		if(sessionStorage.getItem('inicializou')){
			setInicializou(sessionStorage.getItem('inicializou'))
		}
	},[])

	async function inicializaVendas4dias(){
		let vendaDataInicial = new Date()
		let vendaDataFinal = new Date()

		vendaDataInicial.setDate(vendaDataInicial.getDate() - 4)
		vendaDataInicial = converteData(vendaDataInicial)

		vendaDataFinal.setDate(vendaDataFinal.getDate() -1)
		vendaDataFinal = converteData(vendaDataFinal)

		const vendasTemp = await returnVendas(vendaDataInicial, vendaDataFinal, cnpj)
        
		setVendas4dias(vendasTemp)
	}

	async function inicializaVetorVendasMes() {
		
		let vendasTemp = []

		function getFirstDayOfMonth() {
			const currentDate = new Date();
			const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			return firstDayOfMonth;
		}
	
		function getLastDayOfMonth(){
			const currentDate = new Date();
			const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
			return lastDayOfMonth;
		}
	
		const primeiroDiaDoMes = getFirstDayOfMonth();
		const ultimoDiaDoMes = getLastDayOfMonth();
      
		try {
			vendasTemp = await returnVendas(primeiroDiaDoMes, ultimoDiaDoMes, cnpj)
		} catch (error) {
			console.error('Error fetching vendas:', error)
		} finally {
			setLoadingVendasDash(false)
		}
      
		setVetorVendasMes(vendasTemp)
	}

	/*async function inicializaVendas4diasMes(){
		const temp = await returnTotalMes(cnpj)
		setVendasMes(temp)
	}*/

	async function inicializaCreditos5dias(){
		let creditosTemp;
		let dataInicial = new Date();
		let dataFinal = new Date();
	
		// Increment dataInicial by 1 day
		dataInicial.setDate(dataInicial.getDate() + 1);
	
		// Increment dataFinal by 5 days
		dataFinal.setDate(dataFinal.getDate() + 5);
	
		creditosTemp = await returnCreditos(cnpj, dataInicial, dataFinal);

		if(creditosTemp.length > 0){
			setCreditos5dias(creditosTemp);
		}
	}

	async function inicializaVetorCreditosMes() {
		setLoadingCreditosDash(true);
	
		function getFirstDayOfMonth() {
			const currentDate = new Date();
			const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			return firstDayOfMonth;
		}
	
		function getLastDayOfMonth(){
			const currentDate = new Date();
			const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
			return lastDayOfMonth;
		}
	
		const primeiroDiaDoMes = getFirstDayOfMonth();
		const ultimoDiaDoMes = getLastDayOfMonth();
	
		let creditosTemp = [];
	
		try {
			creditosTemp = await returnCreditos(cnpj, primeiroDiaDoMes, ultimoDiaDoMes);
		} catch (error) {
			console.error('Error fetching creditos:', error);
		} finally {
			setLoadingCreditosDash(false);
		}
	
		if (creditosTemp && creditosTemp.length > 0) {
			setVetorCreditosMes(creditosTemp);
		} else {
			// Handle the case where creditosTemp is empty or undefined
			console.error('No data available for vetorCreditosMes');
		}
	}

	async function inicializaServicos(){

		function firstDay() {
			const today = new Date()
			const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
            
			return firstDay
		}

		function lastDay() {
			const today = new Date()
			const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            
			return lastDay
		}
		const servicosTemp = await loadAjustes(cnpj, firstDay(), lastDay())
		setServicos(servicosTemp)
	}

	useEffect(() => {
		if(servicos.length > 0){
			let temp = []
			let objAdq = {}
			servicos.map((servico) => {
				if(temp.length === 0){
					objAdq = {
						nomeAdquirente: servico.nome_adquirente,
						total: servico.valor,
						id: 0,
						vendas: [servico]
					}
					temp.push(objAdq)

				} else {
					const existingObject = temp.find(obj => obj.nomeAdquirente === servico.nome_adquirente)
					if (existingObject) {
						existingObject.total = (existingObject.total || 0) + servico.valor;
						existingObject.total = parseFloat(existingObject.total.toFixed(2)); // Round to 2 decimal places
						existingObject.vendas.push(servico);
					} else {
						temp.push({
							nomeAdquirente: servico.nome_adquirente,
							total: servico.valor,
							id: temp.length,
							vendas: [servico]
						})
					}
				}})
			setAdmServicos(sortArray(temp))        
			if(temp.length > 0){
				setAdmServicosAux(sortArray(temp))
			}

			const totalMesTemp = servicos.reduce((total, obj) => total + obj.valor, 0)
			setTotalServicosMes(totalMesTemp)
			setTotalServicosMesAux(totalMesTemp)


			let dataHoje = new Date()
			dataHoje = converteData(dataHoje)
			let totalHoje = 0
			servicos.forEach((servico) => {
				if(servico.data === dataHoje){
					totalHoje += servico.valor
				}
			})
			setTotalServicosHoje(totalHoje)    
			if(totalHoje > 0){
				setTotalServicosHojeAux(totalHoje)
			}
		}
	}, [servicos])

	///////////////////////////////////////////////////////////////////////////////
	//// Inicializar Dados de Vendas e Créditos ///////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	useEffect(()=>{
		setBuscou(JSON.parse(Cookies.get('buscou')))
	},[])

	useEffect(()=>{
		if((cnpj !== Cookies.get('ultimoCnpj')) && (cnpj !== 'selecione')){
			setBuscou(!buscou)
		}
	},[cnpj])

	useEffect(()=>{
		async function inicializar(){
			if(cnpj !== 'selecione'){
				if((cnpj !== Cookies.get('ultimoCnpj')) && (cnpj !== '')) {
					await inicializaVendas4dias()
					//await inicializaVendas4diasMes()
					await inicializaVetorVendasMes()
					await inicializaCreditos5dias()
					await inicializaVetorCreditosMes()
					await inicializaServicos()
	
					setInicializou(true)
					setInicializouAux(true)
					sessionStorage.setItem('inicializou', true)
				} else {
					return
				}
			}
		}

		if(buscou){
			if(inicializouAux !== true){
				setLoadingCreditosDash(true)
				setLoadingVendasDash(true)
				inicializar().then(() => {
					setLoadingCreditosDash(false)
					setLoadingVendasDash(false)
				})
			} 
		}
	},[buscou, cnpj])

	useEffect(()=>{
		async function inicializar(){
			const total = vetorVendasMes.reduce((total, obj) => total + obj.valorBruto, 0)
			setSomatorioVendasMes(total)
			if(total > 0){
				setSomatorioVendasMesAux(total)
			}
		}
		inicializar()
	},[vetorVendasMes])

	useEffect(()=>{
		if(vendas4dias === null){
			setTotalVendas4dias(0)
			setTotalVendas4diasAux(0)
			return
		}
		const totalTemp = vendas4dias.reduce((total, obj) => total + obj.valorBruto, 0)
		setTotalVendas4dias(totalTemp)
		if(totalTemp > 0){
			setTotalVendas4diasAux(totalTemp)
		}
	},[vendas4dias])
    
	useEffect(()=>{
		let dataHoje = new Date()
		
		dataHoje = converteData(dataHoje)
		let totalHoje = 0
		let total5dias = 0
		vetorCreditosMes.forEach((venda) => {
			if(venda.dataCredito === dataHoje){
				totalHoje += venda.valorLiquido
			}
		})

		vetorCreditosMes.forEach((venda) => {
			for (let i = 1; i <= 5; i++) {
				let nextDate = new Date(dataHoje);
				nextDate.setDate(nextDate.getDate() + i);
				let nextDateFormatted = nextDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
				if (venda.dataCredito === nextDateFormatted) {
					total5dias += venda.valorLiquido;
				}
			}
		});

		setSomatorioCreditosHoje(totalHoje)
		setTotalCreditos5dias(total5dias)

		if((totalHoje > 0) && (total5dias > 0)){
			setSomatorioCreditosHojeAux(totalHoje)
			setTotalCreditos5diasAux(total5dias)
		}
	},[vetorCreditosMes])

	useEffect(()=>{
		//console.log('créditos dos próximos 5 dias: ', creditos5dias)
		const total = creditos5dias.reduce((total, obj) => total + obj.valorLiquido, 0)
		setTotalCreditos5dias(total)
	},[creditos5dias])


	useEffect(()=>{
		//console.log('somatório dos créditos dos próximos 5 dias: ', totalCreditos5dias)
		if(inicializouAux === false){
			setTotalCreditos5diasAux(totalCreditos5dias)
		}
	},[totalCreditos5dias])

	useEffect(()=>{
		if(inicializouAux === false){
			setSomatorioCreditosHojeAux(somatorioCreditosHoje)
		}
	},[somatorioCreditosHoje])

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

	function separaAdm(array, tipo) {
		let sums = {
			total: 0
		};
		let vendasTemp = []
	
		let separatedByAdquirente = [];
	
		if(tipo === 'vendas'){
			array.forEach((venda) => {
				sums.total += venda.valorBruto;
				vendasTemp.push(venda);
			
				// Find or create entry in separatedByAdquirente
				let entry = separatedByAdquirente.find(adquirente => adquirente.nomeAdquirente === venda.adquirente.nomeAdquirente);
				if (!entry) {
					entry = {
						id: separatedByAdquirente.length,
						nomeAdquirente: venda.adquirente.nomeAdquirente,
						total: 0,
						vendas: [] // Initialize vendas array
					};
					separatedByAdquirente.push(entry);
				}
			
				// Push the current venda into the vendas array of the entry
				entry.vendas.push(venda);
			
				// Update total for this adquirente
				entry.total += venda.valorBruto;
			});
		} else if(tipo === 'creditos'){
			array.forEach((venda) => {
				sums.total += venda.valorLiquido;
				vendasTemp.push(venda);
			
				// Find or create entry in separatedByAdquirente
				let entry = separatedByAdquirente.find(adquirente => adquirente.nomeAdquirente === venda.adquirente.nomeAdquirente);
				if (!entry) {
					entry = {
						id: separatedByAdquirente.length,
						nomeAdquirente: venda.adquirente.nomeAdquirente,
						total: 0,
						vendas: [] // Initialize vendas array
					};
					separatedByAdquirente.push(entry);
				}
			
				// Push the current venda into the vendas array of the entry
				entry.vendas.push(venda);
			
				// Update total for this adquirente
				entry.total += venda.valorLiquido;
			});
		}

		return separatedByAdquirente;
	}

	useEffect(()=>{
		let temp = separaAdm(vetorVendasMes, 'vendas')

		setAdmVendas(sortArray(temp))
		if(temp.length > 0){
			setAdmVendasAux(sortArray(temp))
		}
	},[vetorVendasMes])

	useEffect(() => {
		if(inicializouAux === false){
			setSomatorioVendasMesAux(somatorioVendasMes)
		}
	},[somatorioVendasMes])

	useEffect(()=>{
		if(admVendas.length > 0){
			//console.log('admVendas: ', admVendas)
			setGraficoVendas(carregaGrafico(admVendas))
		}
		if(admVendasAux.length > 0){
			setGraficoVendasAux(carregaGrafico(admVendasAux))
		}
	},[admVendas])

	useEffect(()=>{
		let temp = separaAdm(vetorCreditosMes, 'creditos')

		setAdmCreditos(sortArray(temp))
		if(temp.length > 0){
			setAdmCreditosAux(sortArray(temp))
		}
	},[vetorCreditosMes])

	useEffect(()=>{
		//console.log('admCreditos: ', admCreditos)
		setGraficoCreditos(carregaGrafico(admCreditos))
		if(admCreditosAux.length > 0){
			setGraficoCreditosAux(carregaGrafico(admCreditosAux))
		}

	},[admCreditos])

	useEffect(()=>{
		setGraficoServicos(carregaGrafico(admServicos))
		if(admServicosAux.length > 0){
			setGraficoServicosAux(carregaGrafico(admServicosAux))
		}
	},[admServicos])

	function carregaGrafico(array){
		let label = []
		let data = []
		
		array.forEach((posicao) => {
			const valorTotal = posicao.total
			const nomeAdq = posicao.nomeAdquirente
			let temp = valorTotal.toFixed(2)
			label.push(nomeAdq)
			data.push(Number(temp))
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
								{ inicializouAux === true ? <PieChart data01 = {graficoVendasAux} arrayAdm={admVendasAux} tipo = '0' dados = 'vendas'/> : <PieChart data01 = {graficoVendas} arrayAdm={admVendas}/>}
								<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
									{ loadingVendasDash && (<LoadingModal/>) }
									{inicializouAux ? <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4diasAux.toFixed(2)} /> : <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4dias.toFixed(2)} />}
									{inicializouAux ? <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMesAux.toFixed(2)} /> : <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMes.toFixed(2)} />}
								</div>
							</div>
						</div>
						<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
								<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Créditos:</h1>
								{ inicializouAux === true ? <PieChart data01 = {graficoCreditosAux} arrayAdm={admCreditosAux} tipo = '0' dados = 'creditos'/> : <PieChart data01 = {graficoCreditos} arrayAdm={admCreditos}/>}
								<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
									{ loadingCreditosDash && (<LoadingModal/>) }
									{inicializouAux ? <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHojeAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHoje.toFixed(2)} />}
									{inicializouAux ? <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5diasAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5dias.toFixed(2)} />}
								</div>
							</div>
						</div>
						<div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
								<h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Serviços:</h1>
								{ inicializouAux === true ? <PieChart data01 = {graficoServicosAux} arrayAdm={admServicosAux} tipo = '1' dados = 'servicos'/> : <PieChart data01 = {graficoServicos} arrayAdm={admServicos}/>}
								<div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
									{ loadingCreditosDash && (<LoadingModal/>) }
									{inicializouAux ? <TabelaHorizontal header='Total de Hoje' valor={totalServicosHojeAux.toFixed(2)} /> : <TabelaHorizontal header='Total de Hoje' valor={totalServicosHoje.toFixed(2)} />}
									{inicializouAux ? <TabelaHorizontal header='Total do Mês' valor={totalServicosMesAux.toFixed(2)} /> : <TabelaHorizontal header='Total do Mês' valor={totalServicosMes.toFixed(2)} />}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>  
	)  
}

export default Dashboard