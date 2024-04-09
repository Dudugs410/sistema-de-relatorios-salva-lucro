/* eslint-disable react/prop-types */
/* eslint-disable default-case */
import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api, { config } from '../services/api'

import md5 from 'md5'
import { gruposStatic } from './static'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jwtDecode from 'jwt-decode'

export const AuthContext = createContext({})

function AuthProvider({ children }){
	const [isSignedIn, setIsSignedIn] = useState(false)
	const [loading, setLoading] = useState(null)
	const [accessToken, setAccessToken] = useState(undefined)
	const [refreshToken, setRefreshToken] = useState(undefined)

	////////////////////////////////////////////////////////////////

	const [dataInicial, setDataInicial] = useState(new Date())
	const [dataFinal, setDataFinal] = useState(new Date())
	const [cnpj, setCnpj] = useState('')

	const [podeBuscar, setPodeBuscar] = useState(true)
  
	const [vendas, setVendas] = useState([])
	const [creditos, setCreditos] = useState([])
	const [ajustes, setAjustes] = useState([])

	const [detalhes, setDetalhes] = useState(false)

	const [vendasDash, setVendasDash] = useState([])
	const [tableData, setTableData] = useState([])

	const [totaisGlobal, setTotaisGlobal] = useState({debito: 0, credito: 0, voucher: 0, liquido: 0})
	const [totaisGlobalVendas, setTotaisGlobalVendas] = useState({debito: 0, credito: 0, voucher: 0, liquido: 0})
	const [totaisGlobalCreditos, setTotaisGlobalCreditos] = useState({debito: 0, credito: 0, voucher: 0, liquido: 0})

	const [recebimentos, setRecebimentos] = useState([])
	const [recebimentosDash, setRecebimentosDash] = useState([])

	const [vendaAtual, setVendaAtual] = useState([])
	const [vendaDias, setVendaDias] = useState([])

	const [bandeiras, setBandeiras] = useState([])
	const [adquirentes, setAdquirentes] = useState([])
	const [grupos, setGrupos] = useState([])
	const [grupoSelecionado, setGrupoSelecionado] = useState({value: 0, label: '-'})
	const [clientes, setClientes] = useState([])
	const [clienteSelecionado, setClienteSelecionado] = useState({value: 0, label: '-'})

	const [gruSelecionado, setGruSelecionado] = useState('')
	const [listaClientes, setListaClientes] = useState('')
	const [inicializouGruposAux, setInicializouGruposAux] = useState(false)

	const [modalCliente, setModalCliente] = useState(true)
	const [buscou, setBuscou] = useState(true)
	const [carregouDashboard, setCarregouDashboard] = useState(false)

	const [isDarkTheme, setIsDarkTheme] = useState(false)

	const [admVendasAux, setAdmVendasAux] = useState([])
	const [somatorioVendasMesAux, setSomatorioVendasMesAux] = useState(0)
	const [totalVendas4diasAux, setTotalVendas4diasAux] = useState(0)
	const [graficoVendasAux, setGraficoVendasAux] = useState({data: [], labels: []})

	const [admCreditosAux, setAdmCreditosAux] = useState([])
	const [somatorioCreditosHojeAux, setSomatorioCreditosHojeAux] = useState(0)
	const [totalCreditos5diasAux, setTotalCreditos5diasAux] = useState(0)
	const [graficoCreditosAux, setGraficoCreditosAux] = useState({data: [], labels: []})

	const [admServicosAux, setAdmServicosAux] = useState([])
	const [totalServicosHojeAux, setTotalServicosHojeAux] = useState(0)
	const [totalServicosMesAux, setTotalServicosMesAux] = useState(0)
	const [graficoServicosAux, setGraficoServicosAux] = useState({data: [], labels: []})

	const [inicializouAux, setInicializouAux] = useState(false)

	const [showErrorMessage, setShowErrorMessage] = useState(false)
	const [trocarHeader, setTrocarHeader] = useState(false)

	const [textoExport, setTextoExport] = useState(Cookies.get('textoExport'))

	const [isCheckedCalendar, setIsCheckedCalendar] = useState(true);

	const [carregou, setCarregou] = useState(false)

	const [pagina, setPagina] = useState(sessionStorage.getItem('currentPath'))


	const navigate = useNavigate()

	useEffect(() =>{
		setDataInicial(new Date())
		setAccessToken('')
	},[])

	useEffect(()=>{
		if((cnpj === ('todos' || 'TODOS')) && (gruSelecionado !== 'selecione')){
			
		}
		setVendas([])
		setCreditos([])
		setServicos([])
		setDetalhes(false)
		setBuscou(!buscou)
		setInicializouAux(false)
		setInicializou(false)
	},[cnpj, gruSelecionado])

	/////Login do usuário
	async function submitLogin(login, password) {
		try {
			setLoading(true)
  
			const response = await api.post('token', { client_id: login, client_secret: md5(password) })
			const responseData = response.data
  
			Cookies.set('token', responseData.acess_token)
			Cookies.set('refreshToken', responseData.refresh_token)
			Cookies.set('buscou', false)
			setAccessToken(responseData.acess_token)
			setRefreshToken(responseData.refresh_token)
      
			const userId = jwtDecode(responseData.acess_token).id
			Cookies.set('userID', userId)
      
			const loggedSuccessfully = JSON.parse(responseData.sucess)
			if (loggedSuccessfully) {
				console.log('>>> entrou <<<')
				Cookies.set('mostrarModal', true)
				let localUsers = []
				if (localStorage.getItem('localUsers') !== null) {
					localUsers = JSON.parse(localStorage.getItem('localUsers'))
				}
        
				let userTemp = {}

				const userExists = localUsers.some(storedUser => storedUser.id === userId)
  
				if (userExists) {
					// Handle existing user in localUsers
					const updatedUsers = localUsers.map(user => {
						if (user.id === userId) {
							userTemp = {id: userId, theme: JSON.parse(user.theme)}
							setIsDarkTheme(JSON.parse(user.theme))
							localStorage.setItem('isDark', JSON.parse(user.theme))
							localStorage.setItem('isChecked', JSON.parse(user.theme))
							return { ...user, theme: user.theme } // Update the theme if needed
						}
						return user
					})
					localStorage.setItem('localUsers', JSON.stringify(updatedUsers))
				} else {
					// Add new user to localUsers
					userTemp = { id: userId, theme: false, calendar: true}
					localUsers.push(userTemp)
					setIsDarkTheme(false)
					localStorage.setItem('isDark', false)
					localStorage.setItem('isChecked', false)
					localStorage.setItem('calendar', true)
					localStorage.setItem('localUsers', JSON.stringify(localUsers))
				}
				setCnpj('')
				Cookies.set('cnpj', '')
				const opt = await loadOptions()
				sessionStorage.setItem('options', JSON.stringify(opt))
				const gru = await loadGrupos()
				sessionStorage.setItem('grupos', JSON.stringify(gru))
				console.log('gru: ', gru)
				if(gru.length === 1){
					console.log('length = 1')
					setGruSelecionado(gru[(gru.length - 1)])
					setCnpj('todos')
					Cookies.set('cnpj', 'todos')
					Cookies.set('isCliente', 'true')
					Cookies.set('ultimoGrupoSelecionado', 'nenhum')
				}
			}
  
			const userResponse = await api.get('/usuario')
			const userList = userResponse.data
			const userMatch = userList.find((user) => (user.LOGIN.toLowerCase() === login.toLowerCase()) && (user.SENHA === md5(password)))
  
			if (userMatch) {
				console.log('Usuário encontrado')
				const userData = { NOME: userMatch.NOME, EMAIL: userMatch.EMAIL }
				sessionStorage.setItem('isSignedIn', true)
				sessionStorage.setItem('userData', JSON.stringify(userData))
				localStorage.setItem('isSignedIn', true)
  
				const isDark = localStorage.getItem('isDark')
				setIsDarkTheme(isDark ? isDark : false)
				setIsSignedIn(true)
			} else {
				console.log('Usuario não encontrado')
			}
			sessionStorage.setItem('teste', false)
			sessionStorage.setItem('isSignedIn', true)
			setLoading(false)
		} catch (error) {
			console.error(error)
			alert(error.message)
			setLoading(false)
		}
	}

	async function loadOptions() {
		try {
			let params = {
				codigo: Cookies.get('userID')
			}
  
			let config = {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${Cookies.get('token')}`
				},
				params: params
			}
  
			const response = await api.get('Menu', config)
			return response.data
		} catch (error) {
			console.error(error)
			return null // or handle the error as needed
		}
	}
  
	/////Reseta valores globais
	function resetaValores(){
    
		const clearAllCookies = () => {
			const cookies = Cookies.get()
			for (const cookie in cookies) {
				if (Object.prototype.hasOwnProperty.call(cookies, cookie)) {
					Cookies.remove(cookie)
				}
			}
		}

		localStorage.removeItem('isDark')
		localStorage.removeItem('isChecked')
		clearAllCookies()
		sessionStorage.clear()
		setIsSignedIn(false)

		setVendas([])
		setCreditos([])
		setRecebimentos([])
		setDataInicial(new Date())
		setDataFinal(new Date())
		setCnpj('')
		setGrupoSelecionado({value: '-', label: '-'})
		setClienteSelecionado({value: '-', label: '-'})
		setVendas([])
		setVendasDash([])
		setTableData([])
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalVendas({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalCreditos({debito: 0, credito: 0, voucher: 0, liquido: 0})
  
		setRecebimentos([])
		setRecebimentosDash([])
  
		setVendaAtual([])
		setVendaDias([])
  
		setBandeiras([])
		setGrupos([]) 
		setClientes([])
		setAdquirentes([])
  
		setGruSelecionado('')
		setListaClientes('')
		setInicializouGruposAux(false)
  
		setModalCliente(true)
		setBuscou(false)
  
		setIsDarkTheme(false)
  
		setAdmVendasAux([])
		setAdmCreditosAux([])
		setAdmServicosAux([])
		setSomatorioCreditosHojeAux(0)
		setTotalCreditos5diasAux(0)
		setSomatorioVendasMesAux(0)
		setTotalVendas4diasAux(0)
		setTotalServicosHojeAux(0)
		setTotalServicosMesAux(0)
		setGraficoVendasAux({data: [], labels: []})
		setGraficoCreditosAux({data: [], labels: []})
		setGraficoServicosAux({data: [], labels: []})
		setInicializouAux(false)

		resetaSomatorios()

		console.log('<<< * Valores Resetados * >>>')
	}

	/////reseta somatorios globais dos valores de vendas/créditos

	function resetaSomatorios(){
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalVendas({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalCreditos({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setSomatorioCreditosHojeAux(0)
		setTotalCreditos5diasAux(0)
		setSomatorioVendasMesAux(0)
		setTotalVendas4diasAux(0)
	}

	function resetaDashboard(){
		setVendas([])
		setCreditos([])
		setAjustes([]) // adicionando aqui, reseta para o calendário quando troca o cliente.
		setRecebimentos([])
		setVendas([])
		setVendasDash([])
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalVendas({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalCreditos({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setRecebimentos([])
		setRecebimentosDash([])
		setVendaAtual([])
		setVendaDias([])
		setAdmVendasAux([])
		setAdmCreditosAux([])
		setSomatorioCreditosHojeAux(0)
		setTotalCreditos5diasAux(0)
		setSomatorioVendasMesAux(0)
		setTotalVendas4diasAux(0)
		setGraficoVendasAux({data: [], labels: []})
		setGraficoCreditosAux({data: [], labels: []})
		setInicializouAux(false)
		resetaSomatorios()
	}

	/////desloga usuário
	function logout(){
		setLoading(true)
		resetaValores()
		setLoading(false)
		navigate('/')
	}

	function expired(){
		if(Cookies.get('expired') === true){
			alert('Sessão expirada. Faça o Login novamente')
		}
		logout()
		navigate('/')
	}

	//////////////////////////////////////////////////////////////////

	//Vendas**********************************************************


	//Bandeiras
    
	async function loadBandeiras(){
		setLoading(true)
		await api.get('/bandeira')
			.then( response => {
				setBandeiras(response.data)
				setLoading(false)
			})
			.catch(error =>{
				console.log(error)
				setLoading(false)
			})
	}

	//Grupo de Clientes

	async function loadGrupos() {
		try {
			if (!inicializouGruposAux) {
				const response = await api.get('/grupo')
				const gru = response.data
    
				setGrupos(gru)
				sessionStorage.setItem('grupos', JSON.stringify(gru))
				setInicializouGruposAux(true)
				setLoading(false)
    
				return gru
			} else if (inicializouGruposAux) {
				setGrupos(JSON.parse(sessionStorage.getItem('grupos')))
				return JSON.parse(sessionStorage.getItem('grupos'))
			} else {
				setGrupos(gruposStatic)
				return gruposStatic
			}
		} catch (error) {
			console.error(error)
			throw new Error(error.message) // Re-throw the error for handling in the caller function
		}
	}

	async function loadAdquirentes(){
      
		setLoading(true)
		await api.get('/adquirente')
			.then( response => {
				console.log(response)
				setAdquirentes(response.data)
				setLoading(false)
			})
			.catch(() =>{
				setLoading(false)
			})
	}
  
	//loadVendas melhorias

	// retorna as vendas da data e cliente específicos.

	async function loadVendas(dataInicial, dataFinal, cnpj){
		if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
			return 0
		}
		setLoading(true)
		try {
			if(cnpj === ('todos' || 'TODOS')){
				let params = {
					datainicial: dataInicial,
					datafinal: dataFinal,
					codigoGrupo: Cookies.get('codigoGrupo')
				}
          
				let config = {
					headers: { 
						'Content-Type': 'application/json', 
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}
  
				await api.get('vendas', config)
					.then((response) => {
						setVendas(response.data.VENDAS)
						setLoading(false)
						setBuscou(false)
						return response.data.VENDAS
					})
			} else { 
				let params = {
					datainicial: dataInicial,
					datafinal: dataFinal,
					cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
				}
          
				let config = {
					headers: { 
						'Content-Type': 'application/json', 
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}

				await api.get('vendas', config)
					.then((response) => {
						setVendas(response.data.VENDAS)
						setLoading(false)
						setBuscou(false)
						return response.data.VENDAS
					})
			}
		} catch (error) {
			setLoading(false)
			console.log(error)
		}
	}

	//Consulta de vendas, com intervalo de datas

	async function loadPeriodo(datainicial, datafinal, cnpj, adquirente, bandeira){
      
		setLoading(true)
		let params = {
			dataInicial: dateConvert(datainicial),
			dataFinal: dateConvert(datafinal),
			cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
			adquirente: adquirente,
			bandeira: bandeira,
		}

		let config = {
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${Cookies.get('token')}`
			},
			params: params
		}

		try {
			const response = await api.get('vendas', config)
			const vendasData = response.data.VENDAS
			setVendasDash(vendasData)
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}
    
	/////////////////////////////////////////////////////////////////////////////////////////////////////////

	async function loadCreditos(cnpj, dataInicial, dataFinal) {
		setLoading(true)

		try {
			if(cnpj === ('todos' || 'TODOS')){
				const params = {
					dataInicial: dataInicial,
					dataFinal: dataFinal,
					codigoGrupo: Cookies.get('codigoGrupo')
				}
      
				const config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`,
					},
					params,
				}

				const response = await api.get('recebimentos', config)
				const recebimentosData = response.data

				setCreditos(recebimentosData)
				setRecebimentosDash(recebimentosData)
				setLoading(false)
				return

			} else {
				const params = {
					cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
					dataInicial: dataInicial,
					dataFinal: dataFinal,
				}
      
				const config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`,
					},
					params,
				}

				const response = await api.get('recebimentos', config)
				const recebimentosData = response.data
    
				setCreditos(recebimentosData)
				setRecebimentosDash(recebimentosData)
				setLoading(false)
				return
			}
		} catch (error) {
			console.error('Error loading creditos:', error)
			if(error.response.status === 401){
				logout()
				alert('Sessão Expirada')
			}
			setLoading(false)
			// Handle specific errors here, e.g., display a message to the user
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////

	//Consulta de vendas, com intervalo de datas

	async function retornaVendasPeriodo(datainicial, datafinal, cnpj, adquirente, bandeira){
		setLoading(true)
		if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
			return 0
		}

		setLoading(true)
		let params = {}

		if(((adquirente !== '') && (bandeira !== '')) && (buscou === false)){
			params = {
				datainicial: datainicial,
				datafinal: datafinal,
				cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
				adquirente: adquirente,
				bandeira: bandeira,
			}
			setBuscou(true)
		}

		else if(((adquirente !== '') && (bandeira === '')) && (buscou === false)){
			params = {
				datainicial: datainicial,
				datafinal: datafinal,
				cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
				adquirente: adquirente,
			}
			setBuscou(true)
		}

		else if(((bandeira !== '') && (adquirente === '')) && (buscou === false)){
			params = {
				datainicial: datainicial,
				datafinal: datafinal,
				cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
				bandeira: bandeira,
			}
			setBuscou(true)
		}

		else{
			params = {
				datainicial: datainicial,
				datafinal: datafinal,
				cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
			}
		}
      
		let config = {
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${Cookies.get('token')}`
			},
			params: params
		}

		await api.get('vendas', config)
			.then((response) => {
				setLoading(false)
				setBuscou(false)
				return(response.data.VENDAS)
			})
			.catch((error) => {
				setLoading(false)
				if(error.response.status === 401){
					logout()
					alert('Sessão Expirada')
				}
				console.log(error)
			})
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////

	async function retornaRecebimentos(cnpj, datainicial, datafinal){
		setLoading(true)
		let params = {
			cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
			dataInicial: dateConvert(datainicial),
			dataFinal: dateConvert(datafinal),
		}

		let config = {
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${Cookies.get('token')}`
			},
			params: params
		}

		try {
			const response = await api.get('recebimentos', config)
			const recebimentosData = response.data
			setLoading(false)
			return recebimentosData
		} catch (error) {
			console.log(error)
			if(error.response.status === 401){
				logout()
				alert('Sessão Expirada')
			}
			setLoading(false)
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//Ajustes

	async function loadAjustes(cnpj, dataInicial, dataFinal){
		if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
			return 0
		}
		setLoading(true)
		try {
			if(cnpj === ('todos' || 'TODOS')){
				let params = {
					dataInicial: (dataInicial.toLocaleString('pt-BR')),
					dataFinal: (dataFinal.toLocaleString('pt-BR')),
					codigoGrupo: Cookies.get('codigoGrupo')
				}
    
				let config = {
					headers: { 
						'Content-Type': 'application/json', 
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}

				const response = await api.get('ajustes', config)
				const recebimentosData = response.data
				//console.log('response data ajustes', response.data)
				setAjustes(response.data)
				setLoading(false)
				setBuscou(false)
				return response.data

			} else {
				const params = {
					cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
					dataInicial: dataInicial.toLocaleString('pt-BR'),
					dataFinal: dataFinal.toLocaleString('pt-BR'),
				}
    
				const config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`,
					},
					params,
				}
				const response = await api.get('ajustes', config)
				setAjustes(response.data)
				// const recebimentosData = response.data
				setLoading(false)
				setBuscou(false)
				return response.data
			}
		} catch (error) {
			console.log(error)
			if(error.response.status === 401){
				logout()
				alert('Sessão Expirada')
			}
			setBuscou(false)
			setLoading(false)
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//refresh

	async function refresh(){
		await api.post('/token/refresh/' + Cookies.get('refreshToken'), config(accessToken))
			.then((response) => {
				setAccessToken(response.acessToken)
				Cookies.set('token', accessToken)
				setRefreshToken(response.refreshToken)
				Cookies.set('refreshToken', refreshToken)        
			}).catch(error => {
				console.log(error)
				if(error.response.status === 401){
					logout()
					alert('Sessão Expirada')
				}
			})
	}

	function dateConvert(date) {
		let parts = date.split('-')
		let year = parts[0]
		let month = parts[1]
		let day = parts[2]
  
		let convertedDate = day + '/' + month + '/' + year
		return convertedDate
	}

	function timeConvert(time){
		if(time){
			let parts = time.split('-')
			let hours = parts[0]
			let minutes = parts[1]
			let seconds = parts[2]
	  
			let convertedTime = hours + ':' + minutes + ':' + seconds
			return convertedTime
		}
	}

	function dateConvertSearch(date) {
		let newDate = dateConvertYYYYMMDD(date)

		let parts = newDate.split('-')
		let year = parts[0]
		let month = parts[1]
		let day = parts[2]
  
		let convertedDate = day + '-' + month + '-' + year
		return convertedDate
	}

	function dateConvertYYYYMMDD(date){
		return date.toISOString().split('T')[0]
	}
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////

	function converteData(data){
		const ano = data.getFullYear()
		const mes = String(data.getMonth() + 1).padStart(2, '0')
		const dia = String(data.getDate()).padStart(2, '0')
		return `${ano}-${mes}-${dia}`
	}

	async function returnVendas(datainicial, datafinal, cnpj) {
		try {
			setLoading(true)

			if(cnpj === ('todos' || 'TODOS') && (Cookies.get('codigoGrupo') !== 'selecione')){
				let params = {
					datainicial: datainicial,
					datafinal: datafinal,
					codigoGrupo: Cookies.get('codigoGrupo')
				}
  
				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}

				const response = await api.get('vendas', config)
				setLoading(false)
				setBuscou(false)
				if(response.data.VENDAS === null){
					alert(`${response.data.MENSAGEM}`)
					logout()
					return
				}
				return response.data.VENDAS

			} else {
				let params = {
					datainicial: datainicial,
					datafinal: datafinal,
					cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
				}
  
				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}
				const response = await api.get('vendas', config)
				setLoading(false)
				setBuscou(false)
				if(response.data.VENDAS === null){
					alert(`${response.data.MENSAGEM}`)
					logout()
					return
				}
				return response.data.VENDAS
			}
		} catch (error) {
			console.error('Error fetching vendas:', error)
			setShowErrorMessage(true)
			if(error.response.status === 401){
				logout()
				alert('Sessão Expirada')
			}
			setLoading(false)
			return []
		}
	}

	async function returnVendasPorPeriodo(datainicial, dataFinal, cnpj) {
		try {
			setLoading(true)

			if(cnpj === ('todos' || 'TODOS')){
				let params = {
					datainicial: datainicial,
					datafinal: dataFinal,
					codigoGrupo: Cookies.get('codigoGrupo')
				}

				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}

				const response = await api.get('vendas', config)
				setLoading(false)
				setBuscou(false)
				if(response.data.VENDAS === null){
					alert(`${response.data.MENSAGEM}`)
					logout()
					return
				}
				return response.data.VENDAS
      
			} else {
				let params = {
					datainicial: datainicial,
					datafinal: dataFinal,
					cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
				}

				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}
				const response = await api.get('vendas', config)
				setLoading(false)
				setBuscou(false)
				if(response.data.VENDAS === null){
					alert(`${response.data.MENSAGEM}`)
					logout()
					return
				}
				return response.data.VENDAS
			}
		} catch (error) {
			console.error('Error fetching vendas:', error)
			setShowErrorMessage(true)
			if(error.response.status === 401){
				logout()
				alert('Sessão Expirada')
			}
			setLoading(false)
			return []
		}
	}

	async function returnCreditos(cnpj, dataInicial, dataFinal) {
		if(cnpj === ''){
			alerta('Erro no cliente selecionado. Selecione um cliente válido ou atualize a página e tente novamente')
			return
		}
		try {
			setLoading(true)

			if(cnpj === ('todos' || 'TODOS')){
				let params = {
					dataInicial: dataInicial,
					dataFinal: dataFinal,
					codigoGrupo: Cookies.get('codigoGrupo')
				}
  
				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}
  
				const response = await api.get('recebimentos', config)
				setLoading(false)
				setRecebimentos(response.data)
				return response.data

			} else {
				let params = {
					cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
					dataInicial: dataInicial,
					dataFinal: dataFinal,
				}
  
				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					params: params
				}
  
				const response = await api.get('recebimentos', config)
				setLoading(false)
				setRecebimentos(response.data)
				return response.data
			}
		} catch (error) {
			console.error('Error fetching creditos:', error)
			setShowErrorMessage(true)
			if(error.response.status === 401){
				logout()
				alert('Sessão Expirada')
			} else {
				alert('erro ', error.response.status)
				logout()
			}
			setLoading(false)
			return []
		}
	}

	async function returnTotalDia(cnpj, data) {
		setLoading(true)
		try {
			if(cnpj === ('todos' || 'TODOS')){

				let params = {
					codigoGrupo: Cookies.get('codigoGrupo'),
					data: data,
				}
    
				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`,
					},
					params: params,
				}

				const response = await api.get('vendastotais', config)
				setLoading(false)
				return response.data

			} else {
				let params = {
					cnpj: cnpj,
					data: data,
				}
    
				let config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`,
					},
					params: params,
				}

				const response = await api.get('vendastotais', config)
				setLoading(false)
				return response.data
			}
		} catch (error) {
			setLoading(false)
		}
	}

	async function returnTotalMes(cnpj) {
		const currentDate = new Date()
		const currentYear = currentDate.getFullYear()
		const currentMonth = currentDate.getMonth()
		const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
		let mes = []
		setLoading(true)
  
		try {
			const promises = Array.from({ length: lastDayOfMonth }, (_, day) => {
				const data = new Date(currentYear, currentMonth, day + 1)
				return returnTotalDia(cnpj, data).catch(error => {
					console.log(error)
					return null
				})
			})

			const results = await Promise.all(promises)
			mes = results.filter(result => result !== null)
		} catch (error) {
			console.error(error)
		}

		setLoading(false)
		return mes
	}

	async function returnCreditosBanco(cnpj, dataInicial, dataFinal, codigoBanco){
		setLoading(true)

		if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
			setLoading(false)
			return 0
		}

		setLoading(true)
		let params = {}

		if(((codigoBanco !== '' || undefined))){
			params = {
				cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
				dataInicial: dataInicial,
				dataFinal: dataFinal,
				codigoBanco: codigoBanco,
			}
		}else{
			let objTemp = [
				{
					'Banco': 'ITAÚ UNIBANCO S.A',
					'Conta': '341/6321/996438',
					'DataPrevista': '23/08/2023',
					'ValorBruto': 18185.83,
					'ValorTaxa': 236.57,
					'ValorLiquido': 17949.26
				}
			]
			return objTemp
		}

		let config = {
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${Cookies.get('token')}`
			},
			params: params
		}

		try {
			const response = await api.get('recebimentos', config)
			const creditosBanco = response.data
			setLoading(false)
			setBuscou(false)
			return creditosBanco
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	function alerta(text){
		console.log('função alerta')
		toast.info(text, {
			position: 'bottom-right',
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'light',
		})
	}

	function gerarDados(array){
		const tipoTemp = Cookies.get('tipo')
		tableData.length = 0
		if (array.length > 0) {
			if(tipoTemp === 'vendas'){
				array.map((venda) => {
					tableData.push({
						cnpj: venda.cnpj,
						adquirente: venda.adquirente.nomeAdquirente,
						bandeira: venda.bandeira.descricaoBandeira,
						produto: venda.produto.descricaoProduto,
						subproduto: venda.modalidade.descricaoModalidade,
						valorBruto: venda.valorBruto.toFixed(2),
						valorLiquido: venda.valorLiquido.toFixed(2),
						taxa: venda.taxa.toFixed(2),
						valorDesconto: venda.valorDesconto.toFixed(2),
						nsu: venda.nsu,
						dataVenda: venda.dataVenda,
						horaVenda: timeConvert(venda.horaVenda),
						dataCredito: venda.dataCredito,
						numeroPV: venda.numeroPV,
						cartao: venda.cartao,
						codigoAutorizacao: venda.codigoAutorizacao,
						quantidadeParcelas: venda.quantidadeParcelas,
						tid: venda.tid,
					})
				})
				console.log(`${tipoTemp} ao gerar dados: `, tableData)
			} else if(tipoTemp === 'creditos'){
				array.map((venda) => {
					tableData.push({
						cnpj: venda.cnpj,
						adquirente: venda.adquirente.nomeAdquirente,
						bandeira: venda.bandeira.descricaoBandeira,
						produto: venda.produto.descricaoProduto,
						subproduto: venda.modalidade.descricaoModalidade,
						dataCredito: venda.dataCredito,
						dataVenda: venda.dataVenda,
						valorBruto: venda.valorBruto,
						valorLiquido: venda.valorLiquido,
						taxa: venda.taxa,
						valorDesconto: venda.valorDesconto,
						nsu: venda.nsu,
						cartao: venda.cartao,
						codigoAutorizacao: venda.codigoAutorizacao,
						parcela: venda.parcela,
						totalParcelas: venda.totalParcelas,
						banco: venda.banco,
						agencia: venda.agencia,
						conta: venda.conta,
						tid: venda.tid,
					})
				})
			} else if(tipoTemp === 'servicos'){
				array.map((venda) => {
					tableData.push({
						cnpj: venda.cnpj,
						razao_social: venda.razao_social,
						codigo_estabelecimento: venda.codigo_estabelecimento,
						adquirente: venda.nome_adquirente,
						valor: venda.valor,
						data: venda.data,
						descricao: venda.descricao,
					})
				})
				console.log(`${tipoTemp} ao gerar dados: `, tableData)
			}
		} 
		return tableData
	}

	async function getCli(){
		jwtDecode(Cookies.get('token'))

		let params = {
			codigo: JSON.parse(Cookies.get('cliCodigo'))
		}

		let config = {
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${Cookies.get('token')}`
			},
			params: params
		}

		try{
			const response = await api.get('Cliente', config)
			return response
		} catch (error) {
			setLoading(false)
			console.log(error)
		}
	}

	async function loadDashboard(){
		let params = {
			cnpj: cnpj
		}
		let config = {
			headers: {
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${Cookies.get('token')}`
			},
			params: params
		}
		try{
			const response = await api.get('dashboard', config)
			return response.data
		} catch (error) {
			setLoading(false)
			console.log(error)
		}
	}

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

	const [loadingVendas, setLoadingVendas] = useState([])
	const [loadingCreditos, setLoadingCreditos] = useState([])
	const [loadingServicos, setLoadingServicos] = useState([])

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
		if(Cookies.get('buscou')){
			setBuscou(JSON.parse(Cookies.get('buscou')))
		}
	},[])

	useEffect(()=>{
		if((cnpj !== Cookies.get('ultimoCnpj')) && (cnpj !== 'selecione')){
			//setBuscou(!buscou)
		}
	},[cnpj])

	useEffect(()=>{
		if((cnpj === 'todos') && (Cookies.get('ultimoGrupoSelecionado') !== gruSelecionado.label)){
			setInicializouAux(false)
			setInicializou(false)
			//setBuscou(!buscou)
			Cookies.set('ultimoGrupoSelecionado', gruSelecionado.label)
		}
	},[gruSelecionado])

	useEffect(()=>{
		if(inicializouAux === true){
			setLoadingVendas(false)
			setLoadingCreditos(false)
			setLoadingServicos(false)
		}
	},[])

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
		const total = creditos5dias.reduce((total, obj) => total + obj.valorLiquido, 0)
		setTotalCreditos5dias(total)
	},[creditos5dias])


	useEffect(()=>{
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
	//

		//

		const [paginaAtual, setPaginaAtual] = useState('')
		const [dataInicialDisplay, setDataInicialDisplay] = useState('')
		const [dataFinalDisplay, setDataFinalDisplay] = useState('')
	
		useEffect(()=>{
			console.log('effect data display')
			console.log('inicial: ', dataInicialDisplay, 'final: ', dataFinalDisplay)
	
		},[dataInicialDisplay, dataFinalDisplay])
	
		//

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	const loadDashboardPage = async () => {
		console.log('executou loadDashboardPage');
		async function inicializar() {
			if (cnpj !== 'selecione') {
				if ((cnpj !== Cookies.get('ultimoCnpj')) && (cnpj !== '') || (cnpj === ('todos' || 'TODOS'))) {
					setLoadingVendas(true);
					setLoadingCreditos(true);
					setLoadingServicos(true);
	
					try {
						await Promise.all([
							inicializaVendas4dias(),
							inicializaVetorVendasMes(),
							inicializaCreditos5dias(),
							inicializaVetorCreditosMes(),
							inicializaServicos()
						]);
		
						setInicializou(true);
						setInicializouAux(true);
						setLoadingVendas(false);
						setLoadingCreditos(false);
						setLoadingServicos(false);
						sessionStorage.setItem('inicializou', true);
						toast.success('Dashboard Carregado');
					} catch (error) {
						setLoadingVendas(false);
						setLoadingCreditos(false);
						setLoadingServicos(false);
						console.error('Error occurred during initialization:', error);
						toast.error('Ocorreu um erro durante a inicialização.');
					}
				} else {
					setLoadingVendas(false);
					setLoadingCreditos(false);
					setLoadingServicos(false);
					return;
				}
			}
		}
	
		if (buscou) {
			if (inicializouAux !== true) {
				setLoadingCreditosDash(true);
				setLoadingVendasDash(true);
				await inicializar();
				setLoadingCreditosDash(false);
				setLoadingVendasDash(false);
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	const [totalCreditoVendas, setTotalCreditoVendas] = useState(0.00)
	const [totalDebitoVendas, setTotalDebitoVendas] = useState(0.00)
	const [totalVoucherVendas, setTotalVoucherVendas] = useState(0.00)
	const [totalLiquidoVendas, setTotalLiquidoVendas] = useState(0.00)

	const [arrayAdmVendas, setArrayAdmVendas] = useState([])
	const [arrayRelatorioVendas, setArrayRelatorioVendas] = useState([])
	const [dataBuscaVendas, setDataBuscaVendas] = useState([new Date(), new Date()])
	const [cnpjBuscaVendas, setCnpjBuscaVendas] = useState(Cookies.get('cnpj'))
	const [tipo, setTipo] = useState('vendas')

	const [vendasTemp, setVendasTemp] = useState([])
	const [dataBuscaInicialVendas, setDataBuscaInicialVendas] = useState(new Date)
	const [dataBuscaFinalVendas, setDataBuscaFinalVendas] = useState(new Date)

	const [dataInicialExibicaoVendas, setDataInicialExibicaoVendas] = useState(new Date().toLocaleDateString('pt-BR'))
	const [dataFinalExibicaoVendas, setDataFinalExibicaoVendas] = useState(new Date().toLocaleDateString('pt-BR'))

	const inicializarVendasPage = async () => {
		if(bandeiras.length === 0){
			await loadBandeiras()
		}
		
		if(grupos.length === 0){
			setGrupos(JSON.parse(sessionStorage.getItem('grupos')))     
		}
		
		if(adquirentes.length === 0){
			await loadAdquirentes()
		}
	}

	function handleDateChangeVendas(date){
		setDataBuscaVendas(date)
	}

	function separaAdmArray(array){
		if(array.length > 0){
		let temp = []
		let totalCreditoTemp = 0
		let totalDebitoTemp = 0
		let totalVoucherTemp = 0
		let totalLiquidoTemp = 0

		array.forEach((venda)=>{
			if(temp.length === 0){
			let novoObj = {
				nomeAdquirente: venda.adquirente.nomeAdquirente,
				total: venda.valorBruto,
				id: 0,
				vendas: []
			}
			temp.push(novoObj)
			}else{
			let novoObj = {
				nomeAdquirente: venda.adquirente.nomeAdquirente,
				total: venda.valorBruto,
				id: 0,
				vendas: []
			}

			if(!(temp.find((objeto) => objeto.nomeAdquirente === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
				novoObj.id = (temp.length)
				temp.push(novoObj)
			}

			else{
				for(let i = 0; i < temp.length; i++){
					if(temp[i].nomeAdquirente === venda.adquirente.nomeAdquirente){
						temp[i].total += venda.valorBruto
					}
				}
			}
			}
			// eslint-disable-next-line default-case
			switch(venda.produto.descricaoProduto){
			case 'Crédito':
				totalCreditoTemp += venda.valorBruto
				break;

			case 'Débito':
				totalDebitoTemp += venda.valorBruto
				break;

			case 'Voucher':
				totalVoucherTemp += venda.valorBruto
				break;
			}
			totalLiquidoTemp += venda.valorBruto
		})
			temp.forEach((adq) => {
				let vendasTemp = []
				vendasTemp.length = 0
				array.forEach((vendasDia) => {
					if(vendasDia.length > 0){
						vendasDia.forEach((venda) => {
							if(venda.adquirente.nomeAdquirente === adq.nomeAdquirente){
								vendasTemp.push(venda)
							}
							adq.vendas = vendasTemp
						})
					}
				})
			})
			let totalTemp = {debito: totalDebitoTemp, credito: totalCreditoTemp, voucher: totalVoucherTemp, liquido: totalLiquidoTemp}
			
			setTotaisGlobalVendas(totalTemp)
			return temp
		}
	}

	useEffect(()=>{
		if(detalhes){
			setVendasTemp(loadVendas(dataBuscaInicialVendas, dataBuscaFinalVendas, cnpjBuscaVendas))
		}
	},[cnpjBuscaVendas])

	useEffect(()=>{
		if((dataBuscaVendas[0] !== undefined) && (dataBuscaVendas[1] !== undefined)){
		setDataBuscaInicialVendas(dataBuscaVendas[0].toLocaleDateString('pt-BR'))
		setDataBuscaFinalVendas(dataBuscaVendas[1].toLocaleDateString('pt-BR'))
		setDataInicialExibicaoVendas(dataBuscaVendas[0].toLocaleDateString('pt-BR'))
		setDataFinalExibicaoVendas(dataBuscaVendas[1].toLocaleDateString('pt-BR'))
		}
	},[dataBuscaVendas])

	const loadVendasPage = async () => {

		setTipo('vendas')
		Cookies.set('tipo', 'vendas')
		await inicializarVendasPage()

		toast.promise(inicializarVendasPage, {
			pending: 'Carregando...',
			success: 'Vendas Carregadas com Sucesso',
			error: 'Ocorreu um Erro',
		})
		vendas.length = 0
		setTotalCreditoVendas(0.00)
		setTotalDebitoVendas(0.00)
		setTotalVoucherVendas(0.00)
		setTotalLiquidoVendas(0.00)
		setTotaisGlobalVendas({debito: 0, credito: 0, voucher: 0, liquido: 0})
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////

	const [dataInicialExibicaoCreditos, setDataInicialExibicaoCreditos] = useState(new Date().toLocaleDateString('pt-BR'))
	const [dataFinalExibicaoCreditos, setDataFinalExibicaoCreditos] = useState(new Date().toLocaleDateString('pt-BR'))
	const [totalCreditoCreditos, setTotalCreditoCreditos] = useState(0.00)
	const [totalDebitoCreditos, setTotalDebitoCreditos] = useState(0.00)
	const [totalVoucherCreditos, setTotalVoucherCreditos] = useState(0.00)
	const [totalLiquidoCreditos, setTotalLiquidoCreditos] = useState(0.00)
	const [arrayAdmCreditos, setArrayAdmCreditos] = useState([])
	const [arrayRelatorioCreditos, setArrayRelatorioCreditos] = useState([])
	const [dataBuscaCreditos, setDataBuscaCreditos] = useState([new Date(), new Date])
	const [cnpjBuscaCreditos, setCnpjBuscaCreditos] = useState('')
	const [creditosTemp, setCreditosTemp] = useState([])
	const [dataBuscaInicialCreditos, setDataBuscaInicialCreditos] = useState(new Date)
	const [dataBuscaFinalCreditos, setDataBuscaFinalCreditos] = useState(new Date)

	useEffect(()=>{
		setCreditos([])
	},[])

	useEffect(()=>{
	  setTipo('creditos')
	  Cookies.set('tipo', 'creditos')
	},[])

	useEffect(()=>{
		//setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
	},[])

	useEffect(()=>{
		creditos.length = 0
		setTotalCreditoCreditos(0.00)
		setTotalDebitoCreditos(0.00)
		setTotalVoucherCreditos(0.00)
		setTotalLiquidoCreditos(0.00)
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalCreditos({debito: 0, credito: 0, voucher: 0, liquido: 0})
	},[])
	
	useEffect(()=>{
		try {
			if(creditos.length === 0){
				setTotalCreditoCreditos(0.00)
				setTotalDebitoCreditos(0.00)
				setTotalVoucherCreditos(0.00)
				setTotalLiquidoCreditos(0.00)
			}
			else if(creditos.length > 0){
				setArrayRelatorioCreditos(gerarDados(creditos))
				setArrayAdmCreditos(separaAdmCreditos(creditos))
			}
		} catch (error) {
			console.log(error)
		}
	},[creditos])

	useEffect(()=>{
		setCnpjBuscaCreditos(cnpj)
	},[cnpj])

	useEffect(()=>{
		if(detalhes && (cnpjBuscaCreditos !== '')){
			setCreditosTemp(loadCreditos(cnpjBuscaCreditos, dataBuscaCreditos[0], dataBuscaCreditos[1]))
		}

	},[cnpjBuscaCreditos])

	useEffect(()=>{
		if((dataBuscaCreditos[0] !== undefined) && (dataBuscaCreditos[1] !== undefined)){
			setDataBuscaInicialCreditos(dataBuscaCreditos[0].toLocaleDateString('pt-BR'))
			setDataBuscaFinalCreditos(dataBuscaCreditos[1].toLocaleDateString('pt-BR'))
			setDataInicialExibicaoCreditos(dataBuscaCreditos[0].toLocaleDateString('pt-BR'))
			setDataFinalExibicaoCreditos(dataBuscaCreditos[1].toLocaleDateString('pt-BR'))
		}
		},[dataBuscaCreditos])

	function separaAdmCreditos(array) {
		let sums = {
			debito: 0,
			credito: 0,
			voucher: 0,
			total: 0
		};
	
		let separatedByAdquirente = [];
	
		array.forEach((item) => {
			// Calculate individual sums
			switch (item.produto.descricaoProduto) {
				case 'Débito':
					sums.debito += item.valorLiquido;
					break;
				case 'Crédito':
					sums.credito += item.valorLiquido;
					break;
				case 'Voucher':
					sums.voucher += item.valorLiquido;
					break;
			}
			sums.total += item.valorLiquido;
	
			// Find or create entry in separatedByAdquirente
			let entry = separatedByAdquirente.find(adquirente => adquirente.nomeAdquirente === item.adquirente.nomeAdquirente);
			if (!entry) {
				entry = {
					id: separatedByAdquirente.length,
					nomeAdquirente: item.adquirente.nomeAdquirente,
					total: 0
				};
				separatedByAdquirente.push(entry);
			}
	
			// Update total for this adquirente
			entry.total += item.valorLiquido;
		});

		let totalTemp = { debito: sums.debito, credito: sums.credito, voucher: sums.voucher, liquido: sums.total };
	
		setTotaisGlobalCreditos(totalTemp);
		console.log('Separated by Adquirente:', separatedByAdquirente);
		return separatedByAdquirente;
	}

	function handleDateChangeCreditos(date){
		setDataBuscaCreditos(date)
	}
		
	const loadCreditosPage = async () => {
		if(bandeiras.length === 0){
			await loadBandeiras()
		}
  
		if(grupos.length === 0){
			setGrupos(JSON.parse(sessionStorage.getItem('grupos')))     
		}
  
		if(adquirentes.length === 0){
			await loadAdquirentes()
		}
	}

	return(
		<AuthContext.Provider
			value={{
				alerta,
				isSignedIn, setIsSignedIn,
				loading, setLoading,
				submitLogin, logout,
				accessToken, setAccessToken,
				refreshToken, setRefreshToken,
				expired,
				dateConvert,
				dateConvertSearch,
				dateConvertYYYYMMDD,
				refresh,
				////////////////
				dataInicial, setDataInicial,
				dataFinal, setDataFinal,
				cnpj, setCnpj,
				podeBuscar, setPodeBuscar,
				vendas, setVendas,
				creditos, setCreditos,
				vendasDash, setVendasDash,
				recebimentos, recebimentosDash, setRecebimentosDash,
				loadCreditos,
				bandeiras, setBandeiras, loadBandeiras,
				grupos, setGrupos, loadGrupos,
				inicializouGruposAux, setInicializouGruposAux,
				clientes, setClientes,
				loadVendas,
				adquirentes, setAdquirentes, loadAdquirentes,
				vendaAtual, setVendaAtual,
				vendaDias, setVendaDias,
				buscou, setBuscou,
				loadPeriodo,
				modalCliente, setModalCliente,
				retornaVendasPeriodo,
				retornaRecebimentos,
				returnTotalDia,
				gruSelecionado, setGruSelecionado,
				listaClientes, setListaClientes,
				returnVendas,
				returnCreditos,
				converteData,
				returnTotalMes,
				returnCreditosBanco,
				loadAjustes, ajustes, setAjustes,
				isDarkTheme, setIsDarkTheme,
				admVendasAux, setAdmVendasAux,
				admCreditosAux, setAdmCreditosAux,
				somatorioCreditosHojeAux, setSomatorioCreditosHojeAux,
				totalCreditos5diasAux, setTotalCreditos5diasAux,
				somatorioVendasMesAux, setSomatorioVendasMesAux,
				totalVendas4diasAux, setTotalVendas4diasAux,
				graficoVendasAux, setGraficoVendasAux,
				graficoCreditosAux, setGraficoCreditosAux,
				inicializouAux, setInicializouAux,
				tableData, setTableData,
				gerarDados,
				totaisGlobal, setTotaisGlobal,
				totaisGlobalVendas, setTotaisGlobalVendas,
				totaisGlobalCreditos, setTotaisGlobalCreditos,
				resetaSomatorios,
				getCli,
				showErrorMessage,
				setShowErrorMessage,
				resetaDashboard,
				admServicosAux, setAdmServicosAux,
				totalServicosHojeAux, setTotalServicosHojeAux,
				totalServicosMesAux, setTotalServicosMesAux,
				graficoServicosAux, setGraficoServicosAux,
				loadDashboard,
				returnVendasPorPeriodo,
				grupoSelecionado, setGrupoSelecionado,
				clienteSelecionado, setClienteSelecionado,
				trocarHeader, setTrocarHeader,
				detalhes, setDetalhes,
				textoExport, setTextoExport,
				isCheckedCalendar, setIsCheckedCalendar,
				carregou, setCarregou,
				vetorVendasMes, setVetorVendasMes,
				vetorCreditosMes, setVetorCreditosMes,
				vendas4dias, setVendas4dias,
				creditos5dias, setCreditos5dias,
				totalVendas4dias, setTotalVendas4dias,
				totalCreditos5dias, setTotalCreditos5dias,
				vendasMes, setVendasMes,
				somatorioVendasMes, setSomatorioVendasMes,
				creditosMes, setCreditosMes,
				somatorioCreditosHoje, setSomatorioCreditosHoje,
				totalServicosHoje, setTotalServicosHoje,
				totalServicosMes, setTotalServicosMes,
				admVendas, setAdmVendas,
				admCreditos, setAdmCreditos,
				admServicos, setAdmServicos,
				graficoVendas, setGraficoVendas,
				graficoCreditos, setGraficoCreditos,
				graficoServicos, setGraficoServicos,
				cnpjSelecionado, setCnpjSelecionado,
				inicializou, setInicializou,
				loadingVendasDash, setLoadingVendasDash,
				loadingCreditosDash, setLoadingCreditosDash,
				servicos, setServicos,
				loadingVendas, setLoadingVendas,
				loadingCreditos, setLoadingCreditos,
				loadingServicos, setLoadingServicos,
				carregouDashboard, setCarregouDashboard,
				loadDashboardPage,
				pagina, setPagina,
				
				//
				
				loadVendasPage,
				dataBuscaVendas, 
				setDataBuscaVendas, 
				totalDebitoVendas,
				setTotalDebitoVendas,
				totalCreditoVendas,
				setTotalCreditoVendas,
				totalVoucherVendas,
				setTotalVoucherVendas,
				totalLiquidoVendas,
				setTotalLiquidoVendas,
				cnpjBuscaVendas,
				setCnpjBuscaVendas,
				dataInicialExibicaoVendas,
				dataFinalExibicaoVendas,
				handleDateChangeVendas,
				separaAdmArray,
				totalCreditoVendas, setTotalCreditoVendas,
				totalDebitoVendas, setTotalDebitoVendas,
				totalVoucherVendas, setTotalVoucherVendas,
				totalLiquidoVendas, setTotalLiquidoVendas,
				arrayAdmVendas, setArrayAdmVendas,
				arrayRelatorioVendas, setArrayRelatorioVendas,
				dataBuscaVendas, setDataBuscaVendas,
				cnpjBuscaVendas, setCnpjBuscaVendas,
				tipo, setTipo,
				vendasTemp, setVendasTemp,
				dataBuscaInicialVendas, setDataBuscaInicialVendas,
				dataBuscaFinalVendas, setDataBuscaFinalVendas,
				dataInicialExibicaoVendas, setDataInicialExibicaoVendas,
				dataFinalExibicaoVendas, setDataFinalExibicaoVendas,

				//

				loadCreditosPage, handleDateChangeCreditos,
				dataInicialExibicaoCreditos, setDataInicialExibicaoCreditos,
				dataFinalExibicaoCreditos, setDataFinalExibicaoCreditos,
				totalCreditoCreditos, setTotalCreditoCreditos,
				totalDebitoCreditos, setTotalDebitoCreditos,
				totalVoucherCreditos, setTotalVoucherCreditos,
				totalLiquidoCreditos, setTotalLiquidoCreditos,
				arrayAdmCreditos, setArrayAdmCreditos,
				arrayRelatorioCreditos, setArrayRelatorioCreditos,
				dataBuscaCreditos, setDataBuscaCreditos,
				cnpjBuscaCreditos, setCnpjBuscaCreditos,
				creditosTemp, setCreditosTemp,
				dataBuscaInicialCreditos, setDataBuscaInicialCreditos,
				dataBuscaFinalCreditos, setDataBuscaFinalCreditos,

				//

				paginaAtual, setPaginaAtual,
				dataInicialDisplay, setDataInicialDisplay,
				dataFinalDisplay, setDataFinalDisplay,

				//
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider

