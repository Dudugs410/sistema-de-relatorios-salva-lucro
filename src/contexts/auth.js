/* eslint-disable react/prop-types */
/* eslint-disable default-case */
import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api from '../services/api'

import md5 from 'md5'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jwtDecode from 'jwt-decode'

import _ from 'lodash'

export const AuthContext = createContext({})

function AuthProvider({ children }){
	const [isSignedIn, setIsSignedIn] = useState(false)
	const [accessToken, setAccessToken] = useState(undefined)

	////////////////////////////////////////////////////////////////

	const [salesTableData, setSalesTableData] = useState([])
	const [creditsTableData, setCreditsTableData] = useState([])
	const [servicesTableData, setServicesTableData] = useState([])

	const [exportName, setExportName] = useState('')
	const [isCheckedCalendar, setIsCheckedCalendar] = useState(true)
	const [changedOption, setChangedOption] = useState(false)

	const [errorSales, setErrorSales] = useState(false)
	const [errorCredits, setErrorCredits] = useState(false)
	const [errorServices, setErrorServices] = useState(false)

	const [fetchingData, setFetchingData] = useState(false)

	//////////////////////////////////////////////////////////////////

	// *** Usuário e Login *** //

	// objeto que guardará dados do usuário, caso seja necessário acessar algo //

	const [groupsList, setGroupsList] = useState([])
	const [clientsList, setClientsList] = useState([])

	// Função que loga o usuário e gerencia quaisquer dados relevantes à isso
	const loginApp = async (login, password) => {
		try {
			const response = await api.post('token', { client_id: login, client_secret: md5(password) })
			const responseData = response.data
			Cookies.set('token', responseData.acess_token)
			Cookies.set('refreshToken', responseData.refresh_token)
			const userId = jwtDecode(responseData.acess_token).id
			Cookies.set('userID', userId)
			const loggedSuccessfully = JSON.parse(responseData.sucess)

			if (loggedSuccessfully) {
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
					localStorage.setItem('isDark', false)
					localStorage.setItem('isChecked', false)
					localStorage.setItem('calendar', true)
					localStorage.setItem('localUsers', JSON.stringify(localUsers))
				}
				const opt = await loadOptions()
				sessionStorage.setItem('options', JSON.stringify(opt))
				
				const gru = await loadGroupsList()

				sessionStorage.setItem('groupsStorage', JSON.stringify(gru))
				Cookies.set('groupCode', gru[0].CODIGOGRUPO)
				Cookies.set('cnpj', 'todos')
			}
  
			const userResponse = await api.get('/usuario')
			const userList = userResponse.data
			const userMatch = userList.find((user) => (user.LOGIN.toLowerCase() === login.toLowerCase()) && (user.SENHA === md5(password)))
  
			if (userMatch) {
				const userData = { NOME: userMatch.NOME, EMAIL: userMatch.EMAIL }
				Cookies.set('GRUCODIGO', userMatch.GRUCODIGO)
				sessionStorage.setItem('isSignedIn', true)
				sessionStorage.setItem('userData', JSON.stringify(userData))
				localStorage.setItem('isSignedIn', true)
				sessionStorage.setItem('isSignedIn', true)
				setIsSignedIn(true)
			} else {
				console.log('Usuario não encontrado')
			}
		} catch (error) {
			console.error(error)
			alert(error.message)
		}
	}

	// funções que retornam arrays com Grupos, Clientes, Bandeiras e Adquirentes, respectivamente //

		const loadGroupsList = async () => {
			try {
				const response = await api.get('/grupo')
				const gru = response.data
				setGroupsList(gru)
				setClientsList(gru[0].CLIENTES)
				return gru
			} catch (error) {
				console.error(error)
				if (error.response.status === 401) {
					logout()
				}
				throw new Error(error.message) // Re-throw the error for handling in the caller function
			}
		}

	// *** funções API *** //

		//controladores do disabled dos botões nas páginas com calendarios

		const [btnDisabledSales, setBtnDisabledSales] = useState(false)
		const [btnDisabledCredits, setBtnDisabledCredits] = useState(false)
		const [btnDisabledServices, setBtnDisabledServices] = useState(false)
		const [btnDisabledSysmo, setBtnDisabledSysmo] = useState(false)


		// retorna array de vendas //
		const loadSales = async (startDate, endDate) => {
			try {
				setErrorSales(false)
				const apiCNPJ = Cookies.get('cnpj')
				const apiGroupCode = Cookies.get('groupCode')
				if(apiCNPJ === ('todos' || 'TODOS') && (apiGroupCode !== 'selecione')){
					let params = {
						datainicial: startDate,
						datafinal: endDate,
						codigoGrupo: apiGroupCode,
					}
	
					let config = {
						params: params
					}

					const response = await api.get('vendas', config)
					return response.data.VENDAS

				} else {
					let params = {
						datainicial: startDate,
						datafinal: endDate,
						cnpj: apiCNPJ,
					}
	
					let config = {
						params: params
					}
					const response = await api.get('vendas', config)
					setBtnDisabledSales(false)
					exportSales(response.data.VENDAS)
					return response.data.VENDAS
				}
			} catch (error) {
				setBtnDisabledSales(false)
				toast.error('Erro ao Carregar Vendas ', error.response.status )
				console.error('Error fetching vendas:', error)
				setErrorSales(true)
				if (error.response.status === 401) {
					logout()
					return
				}
				return []
			}
		}
		// retorna array de créditos/recebimentos
		const loadCredits = async (startDate, endDate) => {
			try {
				setErrorCredits(false)
				const apiCNPJ = Cookies.get('cnpj')
				const apiGroupCode = Cookies.get('groupCode')
				if(apiCNPJ === ('todos' || 'TODOS') && (apiGroupCode !== 'selecione')){
					let params = {
						dataInicial: startDate,
						dataFinal: endDate,
						codigoGrupo: apiGroupCode
					}
	  
					let config = {
						params: params
					}
					const response = await api.get('recebimentos', config)
					return response.data
	
				} else {
					let params = {
						cnpj: apiCNPJ,
						dataInicial: startDate,
						dataFinal: endDate,
					}
	  
					let config = {
						params: params
					}
	  
					const response = await api.get('recebimentos', config)
					setBtnDisabledCredits(false)
					return response.data
				}
			} catch (error) {
				setBtnDisabledCredits(false)
				toast.error('Erro ao Carregar Créditos ', error.response.status )
				console.error('Error fetching credits:', error)
				if(error.response.status === 401){
					logout()
					alert('erro 401 - não autorizado')
				}
				return []
			} finally{
				setErrorCredits(true)
			}
		}
		// retorna array de serviços/ajustes
		const loadServices = async (startDate, endDate) => {
			try {
				setErrorServices(false)
				const apiCNPJ = Cookies.get('cnpj')
				const apiGroupCode = Cookies.get('groupCode')
				if(apiCNPJ === ('todos' || 'TODOS') && (apiGroupCode !== 'selecione')){
					let params = {
						dataInicial: startDate,
						dataFinal: endDate,
						codigoGrupo: apiGroupCode
					}
		
					let config = {
						params: params
					}
					const response = await api.get('ajustes', config)
					return response.data
				} else {
					const params = {
						cnpj: apiCNPJ,
						dataInicial: startDate,
						dataFinal: endDate,
					}
		
					let config = {
						params,
					}
					const response = await api.get('ajustes', config)
					setBtnDisabledServices(false)
					return response.data
				}
			} catch (error) {
				setBtnDisabledServices(false)
				toast.error('Erro ao Carregar Serviços ', error.response.status )
				console.log(error)
				setErrorServices(true)
				if (error.response.status === 401) {
					logout()
					return
				}
				return []
			}
		}
		// retorna Objeto de Taxas
		const loadTaxes = async () => {
			setIsLoadingTaxes(true)
			try {
				const apiClientCode = Cookies.get('clientCode')
				if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
					let params = {
						codigo: apiClientCode
					}
		
					let config = {
						params: params
					}
		
					const response = await api.get('taxas', config)
					return response.data
				} else {
					console.log('Invalid client code:', apiClientCode)
					return []
				}
			} catch (error) {
				console.error('Error fetching taxas:', error)
				if (error.response.status === 401) {
					logout()
					return
				}
				return []
			} finally {
				setIsLoadingTaxes(false)
			}
		}
		
		//Adiciona nova Taxa
		const addTax = async (tax) => {
			setIsLoadingTaxes(true)
			try {
				const apiClientCode = Cookies.get('clientCode')
				if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
					let body = tax
					const response = await api.post('taxas', body)
					console.log('response:', response)
				} else {
					console.log('Invalid client code:', apiClientCode)
				}
			} catch (error) {
				console.error('Error adding tax:', error)
				if (error.response.status === 401) {
					logout()
					return
				}
			} finally {
				setIsLoadingTaxes(false)
			}
		}

		//Edita Taxa

		const editTax = async (tax) => {
			setIsLoadingTaxes(true)
			console.log('editTax: ', tax)
		  
			try {
			  const apiClientCode = tax.CLICODIGO
			  if (apiClientCode !== 'todos' && apiClientCode !== 'TODOS' && apiClientCode !== undefined) {
				let body = JSON.stringify(tax)
		  
				const response = await fetch('https://app.salvalucro.com.br/api/v1/taxas', {
				  method: 'PUT',
				  headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${Cookies.get('token')}`
				  },
				  body: body,
				})
		  
				const responseData = await response.json()
				console.log('response: ', responseData)
		  
				if (response.ok) {
					toast.dismiss()
				  	toast.success('Taxa alterada com sucesso!')
				} else {
					toast.dismiss()
				  	toast.error('Erro ao alterar taxa!')
				}
			  } else {
				return []
			  }
			} catch (error) {
			  console.error('Error updating tax:', error)
			  toast.dismiss()
			  toast.error('Erro ao alterar taxa!')
			  if (error.response.status === 401) {
				logout()
				return
			}
			} finally {
			  setIsLoadingTaxes(false)
			}
		  }
		  

		//Deleta Taxa

		const deleteTax = async (tax) => {
			setIsLoadingTaxes(true)
			console.log(tax)
			try {
				const apiClientCode = Cookies.get('clientCode')
				if(apiClientCode !== 'todos' && apiClientCode !== 'TODOS' && apiClientCode !== undefined) {
					let body = tax
					api.delete('taxas', {
						headers: {
							'Content-Type': 'application/json'
						},
						data: body
					})
					.then(response => {
						console.log('response: ', response)
						toast.dismiss()
						toast.success('Taxa deletada com sucesso!')
					})
					.catch(error => {
						console.log('error: ', error)
						toast.dismiss()
						toast.error('Erro ao deletar taxa!')
					})
				} else {
					return []
				}
				setIsLoadingTaxes(false)
			} catch (error) {
				console.error('Error fetching vendas:', error)
				setIsLoadingTaxes(false)
				if (error.response.status === 401) {
					logout()
					return
				}
				return
			}
		}

		//Bancos

		const [isLoadingBanks, setIsLoadingBanks] = useState(false)

		//

		// retorna array de bancos
		const loadBanks = async () => {
			setIsLoadingBanks(true)
			try {
				const apiClientCode = Cookies.get('clientCode')
				if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
					let params = {
						codigo: apiClientCode
					}
		
					let config = {
						params: params
					}
		
					const response = await api.get('banco', config)
					return response.data
				} else {
					console.log('Invalid client code:', apiClientCode)
					return []
				}
			} catch (error) {
				console.error('Error fetching banco:', error)
				if (error.response.status === 401) {
					logout()
					return
				}
				return []
			} finally {
				setIsLoadingBanks(false)
			}
		}

		// adiciona novo banco
		const addBank = async (bank) => {
			console.log('addBank: ', bank)
			setIsLoadingBanks(true)
			try {
				const apiClientCode = Cookies.get('clientCode')
				if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
					let body = bank
					const response = await api.post('banco', body)
					console.log('response:', response)
					if (response.data.success) {
						toast.dismiss()
						toast.success(response.data.mensagem)
					} else {
						toast.dismiss()
						toast.error('Erro ao adicionar Banco!')
					}
				} else {
					console.log('Invalid client code:', apiClientCode)
				}

			} catch (error) {
				console.error('Error adding banco:', error)
				if (error.response.status === 401) {
					logout()
					return
				}
			} finally {
				setIsLoadingBanks(false)
			}
		}

		// edita banco
		const editBank = async (editedBank) => {
			console.log('editBank:', editedBank)
			setIsLoadingBanks(true)
			try {
					console.log('entrou no if')
					let body = JSON.stringify(editedBank)
					const response = await fetch('https://app.salvalucro.com.br/api/v1/banco', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${Cookies.get('token')}`
					},
					body: body,
					})

					console.log(response)
			
					const responseData = await response.json()
					console.log('response: ', responseData)
			
					if (response.ok) {
						toast.dismiss()
						toast.success('Banco alterado com sucesso!')
					} else {
						toast.dismiss()
						toast.error('Erro ao alterar Banco!')
					}
			} catch (error) {
				console.error('Erro ao Alterar Banco:', error)
				toast.dismiss()
				toast.error('Erro ao alterar banco!')
				if (error.response.status === 401) {
					logout()
					return
				}
			} finally {
				setIsLoadingBanks(false)
			}	 
		}

		// deleta banco
		const deleteBank = async (bankToDelete) => {
			console.log('deleteBank: ', bankToDelete)
			setIsLoadingBanks(true)
			try {
				let body = bankToDelete
				api.delete('banco', {
					headers: {
						'Content-Type': 'application/json'
					},
					data: body
				})
				.then(response => {
					console.log('response: ', response)
					toast.dismiss()
					toast.success('Banco deletado com sucesso!')
				})
				.catch(error => {
					console.log('error: ', error)
					toast.dismiss()
					toast.error('Erro ao deletar taxa!')
				})
				setIsLoadingBanks(false)
			} catch (error) {
				console.error('Error fetching vendas:', error)
				setIsLoadingBanks(false)
				if (error.response.status === 401) {
					logout()
					return
				}
				return
			}
		}

		const loadCliAdq = async () => {
			try {
				let params = {
					codigoCliente: Cookies.get('clientCode'),
					codigoAdquirente: Cookies.get('admCode')
				}

				let config = {
					params: params
				}

				const response = await api.get('clienteAdquirente', config)
				return response.data
			} catch (error) {
				console.log(error)
			}
		}
		
		const loadProducts = async () => {
			try {
				const response = await api.get('produto')
				return response.data
			} catch (error) {
				console.log(error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}
		}

		const loadSubproducts = async () => {
			try {
				let params = {
					codigoAdquirente: Cookies.get('admCode')
				}

				let config = {
					params: params
				}
				const response = await api.get('Subproduto', config)
				//await refreshSession()
				return response.data
			} catch (error) {
				console.log(error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}
		}

		// retorna array de bandeiras
		const loadBanners = async () => {
			try {
				const response = await api.get('bandeira')
				return response.data
			} catch (error) {
				console.log(error)
			}
		}

		// retorna array de administradoras
		const loadAdmins = async () => {
			try {
				const response = await api.get('adquirente')
				//await refreshSession()
				return response.data
			} catch (error) {
				console.log(error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}
		}

		// retorna array de modalidades e seus respectivos códigos
		const loadMods = async () => {
			try {
				const response = await api.get('Modalidade')
				//await refreshSession()
				return response.data
			} catch (error) {
				console.log(error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}
		}

		// retorna string do arquivo SYSMO
		const loadSysmo = async (obj) => {
			setBtnDisabledSysmo(true)
			try {
				let params = {
					tipo: obj.TIPO,
					bandeira: obj.Bandeira,
					adquirente: obj.Adquirente,
					data: obj.Data
				}

				let config = {
					params: params
				}

				const response = await api.get('Sysmo', config)
				//await refreshSession()
				return response.data
			} catch (error) {
				setBtnDisabledSysmo(false)
				console.log(error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}
		} 

		// renova o access token/sessão do usuário
		const refreshSession = async () =>{
			try {
					let refreshToken = Cookies.get('refreshToken')
					const encodedRefreshToken = encodeURIComponent(refreshToken)
					const response = await api.post('token/refresh/' + encodedRefreshToken)
					Cookies.set('token', response.data.acess_token)
					Cookies.set('refreshToken', response.data.refresh_token)
			} catch (error) {
				console.log(error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}	
		}

	// >>> Dashboard <<< //

		// *** Definição de consts / useStates *** 

		// const que controla que define se os dados a serem apresentados na
		// página 'Dashboard' foram carregados ou não. caso seja 'false', será
		// feita a consulta a API, carregando os dados e seu valor será setado 
		// para 'true' ao final, evitando que os dados sejam carregados novamente
		// sem necessidade.

		const [isLoadedDashboard, setIsLoadedDashboard] = useState(false) // //

		const [isLoadedSalesDashboard, setIsLoadedSalesDashboard] = useState(false)
		const [isLoadedCreditsDashboard, setIsLoadedCreditsDashboard] = useState(false)
		const [isLoadedServicesDashboard, setIsLoadedServicesDashboard] = useState(false)
				// consts que guardarão os objetos referentes à cada grupo de dados no Dashboard

				const [salesDashboard, setSalesDashboard] = useState({
					sales: [], 		// ->	Array com as vendas do Mês 		//
					totalLast4: 0, 	// ->	Total dos últimos 4 dias 		//
					totalMonth: 0, 	// ->	Total do mês 					//
					chart: { 		// ->	Dados referentes ao gráfico 	//
						data: [], 	// ->	Valores (por administradora) 	//
						labels: [] 	// ->	Nomes (por administradora) 		//
					}
				})
		
				const [creditsDashboard, setCreditsDashboard] = useState({
					credits: [],
					predictToday: 0,
					predictNext5: 0,
					chart: {
						data: [],
						labels: []
					}
				})
		
				const [servicesDashboard, setServicesDashboard] = useState({
					services: [],
					totalToday: 0,
					totalMonth: 0,
					chart: {
						data: [],
						labels: []
					}
				})


		// consts que guardarão as informações do Gráfico (react-chartjs-2)

		const [chartSales, setChartSales] = useState({data: [], labels: []})
		const [chartCredits, setChartCredits] = useState({data: [], labels: []})
		const [chartServices, setChartServices] = useState({data: [], labels: []})

		// funções que gerenciarão o carregamento dos dados referente à cada grupo de dados (vendas, créditos, serviços/ajustes)

		// ---------------------------------------------------------------------------- //

		// ************** //
		//  >> Vendas <<  //
		// ************** //
		const loadSalesGroup = async ()=> {
			let salesMonth
			let salesLast4
			
			let salesByAdmin
			let tempAdmin
			
			let totalSalesMonth
			let totalSalesLast4
			
			const loadSalesMonth = async () => {
				let salesTemp = []
		
				function getFirstDayOfMonth() {
					const currentDate = new Date()
					const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
					return firstDayOfMonth
				}
			
				function getLastDayOfMonth(){
					const currentDate = new Date()
					const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
					return lastDayOfMonth
				}
			
				const firstDay = getFirstDayOfMonth()
				const lastDay = getLastDayOfMonth()
			  
				try {
					salesTemp = await loadSales(firstDay, lastDay)
				} catch (error) {
					console.error('Erro: ', error)
					if (error.response.status === 401) {
						logout()
						return
					}
				}
				salesMonth = salesTemp
			}

			const loadLast4 = async () =>{
				let startDate = new Date()
				let endDate = new Date()
		
				startDate.setDate(startDate.getDate() - 4)
				startDate = converteData(startDate)
		
				endDate.setDate(endDate.getDate() -1)
				endDate = converteData(endDate)
		
				const salesTemp = await loadSales(startDate, endDate)
				
				salesLast4 = salesTemp
			}

			function loadChart(array){
				let label = []
				let data = []
				
				array.forEach((index) => {
					const sum = index.total
					const adminName = index.adminName
					let temp = sum
					label.push(adminName)
					data.push(Number(temp))
				})
				const obj = {labels: label, data: data}
				return obj
			}

			function separateAdmin(array) {
				let sums = {
					total: 0
				}
				
				let tempSales = []
				let separatedByAdquirente = []

					array.forEach((sale) => {
						sums.total += sale.valorBruto
						tempSales.push(sale)
					
						// Find or create entry in separatedByAdquirente
						let entry = separatedByAdquirente.find(adquirente => adquirente.adminName === sale.adquirente.nomeAdquirente)
						if (!entry) {
							entry = {
								id: separatedByAdquirente.length,
								adminName: sale.adquirente.nomeAdquirente,
								total: 0,
								sales: [] // Initialize vendas array
							}
							separatedByAdquirente.push(entry)
						}
					
						// Push the current venda into the vendas array of the entry
						entry.sales.push(sale)
					
						// Update total for this adquirente
						entry.total += sale.valorBruto
					})
				return separatedByAdquirente
			}

			try {
				await Promise.all([
					loadSalesMonth(),
					loadLast4()
				]).then(() => {
					tempAdmin = separateAdmin(salesMonth)
					salesByAdmin = sortArray(tempAdmin)
					const chartData = loadChart(salesByAdmin)
					setChartSales(chartData)
			
					// Move the code that depends on chartSales here
					totalSalesLast4 = salesLast4.reduce((total, obj) => total + obj.valorBruto, 0)
					totalSalesMonth = salesMonth.reduce((total, obj) => total + obj.valorBruto, 0)
			
					setSalesDashboard({
						sales: salesMonth,
						salesByAdmin: salesByAdmin,
						totalLast4: Number(totalSalesLast4),
						totalMonth: Number(totalSalesMonth),
						chart: chartData
					})
					setIsLoadedSalesDashboard(true)
				})
			} catch (error) {
				console.log('Erro: ', error)
			}
		}
		// ************** //
		// >> Créditos << //
		// ************** //
		const loadCreditsGroup = async ()=> {
			let creditsMonth
			
			let creditsByAdmin
			let tempAdmin

			let totalCreditsToday
			let totalCreditsNext5
			
			const loadCreditsMonth = async () => {
				let creditsTemp = []
		
				function getFirstDayOfMonth() {
					const currentDate = new Date()
					const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
					return firstDayOfMonth
				}
			
				function getLastDayOfMonth(){
					const currentDate = new Date()
					const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
					return lastDayOfMonth
				}
			
				const firstDay = getFirstDayOfMonth()
				const lastDay = getLastDayOfMonth()
			  
				try {
					creditsTemp = await loadCredits(firstDay, lastDay)
				} catch (error) {
					console.error('Erro: ', error)
					if (error.response.status === 401) {
						logout()
						return
					}
				}
				creditsMonth = creditsTemp
			}

			function loadChart(array){
				let label = []
				let data = []

				array.forEach((index) => {
					const sum = index.total
					const adminName = index.adminName
					let temp = sum
					label.push(adminName)
					data.push(Number(temp))
				})
				const obj = {labels: label, data: data}
				return obj
			}

			function separateAdmin(array) {
				let sums = {
					total: 0
				}
				
				let tempSales = []
				let separatedByAdquirente = []
			
					array.forEach((sale) => {
						sums.total += sale.valorLiquido
						tempSales.push(sale)
					
						// Find or create entry in separatedByAdquirente
						let entry = separatedByAdquirente.find(adquirente => adquirente.adminName === sale.adquirente.nomeAdquirente)
						if (!entry) {
							entry = {
								id: separatedByAdquirente.length,
								adminName: sale.adquirente.nomeAdquirente,
								total: 0,
								sales: [] // Initialize vendas array
							}
							separatedByAdquirente.push(entry)
						}
					
						// Push the current venda into the vendas array of the entry
						entry.sales.push(sale)
					
						// Update total for this adquirente
						entry.total += sale.valorLiquido
					})
				return separatedByAdquirente
			}

			try {

				await Promise.all([
					loadCreditsMonth(),
					//loadNext5()
				]).then(() => {
					tempAdmin = separateAdmin(creditsMonth)
					creditsByAdmin = sortArray(tempAdmin)
					const chartData = loadChart(creditsByAdmin)
					setChartCredits(chartData)
			
					let todayTemp = new Date()
		
					todayTemp = converteData(todayTemp)
					totalCreditsToday = 0
					totalCreditsNext5 = 0
					creditsMonth.forEach((venda) => {
						if(venda.dataCredito === todayTemp){
							totalCreditsToday += venda.valorLiquido
						}
					})
			
					creditsMonth.forEach((venda) => {
						for (let i = 1; i <= 5; i++) {
							let nextDate = new Date(todayTemp)
							nextDate.setDate(nextDate.getDate() + i)
							let nextDateFormatted = nextDate.toISOString().split('T')[0] // Format as "YYYY-MM-DD"
							if (venda.dataCredito === nextDateFormatted) {
								totalCreditsNext5 += venda.valorLiquido
							}
						}
					})
			
					setCreditsDashboard({
						credits: creditsMonth,
						creditsByAdmin: creditsByAdmin,
						totalCreditsNext5: Number(totalCreditsNext5),
						totalCreditsToday: Number(totalCreditsToday),
						chart: chartData
					})
					setIsLoadedCreditsDashboard(true)
				})
			} catch (error) {
				console.log('Erro: ', error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}
		}
		// ************** //
		// >> Serviços << //
		// ************** //
		const loadServicesGroup = async ()=> {

			let servicesMonth

			let totalServicesToday = 0
			let totalServicesMonth = 0

			const loadServicesMonth = async () => {
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

				const servicesTemp = await loadServices(firstDay(), lastDay())
				servicesMonth = servicesTemp
			}

			function loadChart(array){
				let label = []
				let data = []

				array.forEach((index) => {
					const sum = index.total
					const adminName = index.adminName
					let temp = sum
					label.push(adminName)
					data.push(Number(temp))
				})
				const obj = {labels: label, data: data}
				return obj
			}

			function separateAdmin(array) {
				let sums = {
					total: 0
				}
				
				let tempSales = []
				let separatedByAdquirente = []
			
					array.forEach((sale) => {
						sums.total += sale.valor
						tempSales.push(sale)
					
						// Find or create entry in separatedByAdquirente
						let entry = separatedByAdquirente.find(adquirente => adquirente.adminName === sale.nome_adquirente)
						if (!entry) {
							entry = {
								id: separatedByAdquirente.length,
								adminName: sale.nome_adquirente,
								total: 0,
								sales: [] // Initialize vendas array
							}
							separatedByAdquirente.push(entry)
						}
					
						// Push the current venda into the vendas array of the entry
						entry.sales.push(sale)
					
						// Update total for this adquirente
						entry.total += sale.valor
					})
				return separatedByAdquirente
			}

			try {
				await Promise.all([
					loadServicesMonth()
				]).then(() => {
					let temp = []
					let objAdq = {}
					servicesMonth.map((service) => {
						if(temp.length === 0){
							objAdq = {
								adminName: service.nome_adquirente,
								total: service.valor,
								id: 0,
								sales: [service]
							}
							temp.push(objAdq)
		
						} else {
							const existingObject = temp.find(obj => obj.nomeAdquirente === service.nome_adquirente)
							if (existingObject) {
								existingObject.total = (existingObject.total || 0) + service.valor
								existingObject.total = parseFloat(existingObject.total.toFixed(2)) // Round to 2 decimal places
								existingObject.vendas.push(service)
							} else {
								temp.push({
									adminName: service.nome_adquirente,
									total: service.valor,
									id: temp.length,
									sales: [service]
								})
							}
						}})

					let tempAdmin = separateAdmin(servicesMonth)
					const servicesByAdmin = (sortArray(tempAdmin))        
					const chartData = loadChart(servicesByAdmin)

					setChartServices(chartData)

					const totalMesTemp = servicesMonth.reduce((total, obj) => total + obj.valor, 0)
					totalServicesMonth = totalMesTemp

					let today = new Date
					today = converteData(today)
					servicesMonth.forEach((service) => {
						if(service.data === today){
							totalServicesToday += service.valor
						}
					})
					
					setServicesDashboard({
						services: servicesMonth,
						servicesByAdmin: servicesByAdmin,
						totalServicesMonth: Number(totalServicesMonth),
						totalServicesToday: Number(totalServicesToday),
						chart: chartData
					})
					setIsLoadedServicesDashboard(true)
				})
			} catch (error) {
				console.log('Erro: ', error)
			}
		}

		// ----------------------------------------------------------------------------- //

		// função que gerencia o carregamento de tudo que será visto no Dashboard

		const loadDashboard = async () => {	
			try {
				setFetchingData(true)
				Promise.all([
					loadSalesGroup(),
					loadCreditsGroup(),
					loadServicesGroup()
				]).then(()=>{
					setIsLoadedDashboard(true)
					setChangedOption(false)
				})
			} catch (error) {
				console.log('erro: ', error)
				if (error.response.status === 401) {
					logout()
					return
				}
			}
		}

		useEffect(()=>{
			if(isLoadedSalesDashboard && isLoadedCreditsDashboard && isLoadedServicesDashboard){
				setFetchingData(false)
			}
		},[isLoadedSalesDashboard, isLoadedCreditsDashboard, isLoadedServicesDashboard])

		// >>> Página de Vendas <<< //
		const [salesPageArray, setSalesPageArray] = useState([])
		const [salesPageAdminArray, setSalesPageAdminArray] =  useState([])
		const [salesTotal, setSalesTotal] = useState({
			debit: 0,
			credit: 0,
			voucher: 0,
			total: 0,
		})
		const [salesDateRange, setSalesDateRange] = useState([new Date(), new Date()])

		// >>> Página de Créditos <<< //
		const [creditsPageArray, setCreditsPageArray] = useState([])
		const [creditsPageAdminArray, setCreditsPageAdminArray] = useState([])
		const [creditsTotal, setCreditsTotal] = useState({
			debit: 0,
			credit: 0,
			voucher: 0,
			total: 0,
		})
		const [creditsDateRange, setCreditsDateRange] = useState([new Date(), new Date()])

		// >>> Página de Serviços <<< //
		const [servicesPageArray, setServicesPageArray] = useState([])
		const [servicesPageAdminArray, setServicesPageAdminArray] = useState([])
		const [servicesDateRange, setServicesDateRange] = useState([new Date(), new Date()])

		// >>> Página de Taxas <<< //
		const [isLoadingTaxes, setIsLoadingTaxes] = useState(false)
	////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////
	
	// *** > Outras Funções Auxiliares < *** //

	////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////

	// Retorna novo array com os dados agrupados por adquirente (Vendas e Créditos)
	function groupByAdmin(array) {

		let sums = {
			total: 0
		}
		
		let tempSales = []
		let separatedByAdquirente = []

			array.forEach((sale) => {
				sums.total += sale.valorBruto
				tempSales.push(sale)
			
				// Find or create entry in separatedByAdquirente
				let entry = separatedByAdquirente.find(adquirente => adquirente.adminName === sale.adquirente.nomeAdquirente)
				if (!entry) {
					entry = {
						id: separatedByAdquirente.length,
						adminName: sale.adquirente.nomeAdquirente,
						total: 0,
						sales: [] // Initialize vendas array
					}
					separatedByAdquirente.push(entry)
				}
			
				// Push the current venda into the vendas array of the entry
				entry.sales.push(sale)
			
				// Update total for this adquirente
				entry.total += sale.valorBruto
			})
		return separatedByAdquirente
	}

	function groupServicesByAdmin(array) {

		let sums = {
			total: 0
		}
		
		let tempSales = []
		let separatedByAdquirente = []

			array.forEach((sale) => {
				sums.total += sale.valor
				tempSales.push(sale)
			
				// Find or create entry in separatedByAdquirente
				let entry = separatedByAdquirente.find(adquirente => adquirente.adminName === sale.nome_adquirente)
				if (!entry) {
					entry = {
						id: separatedByAdquirente.length,
						adminName: sale.nome_adquirente,
						total: 0,
						sales: [] // Initialize vendas array
					}
					separatedByAdquirente.push(entry)
				}
			
				// Push the current venda into the vendas array of the entry
				entry.sales.push(sale)
			
				// Update total for this adquirente
				entry.total += sale.valor
			})
		return separatedByAdquirente
	}

	////////////////////////////////////////////////////////////////////////////////////////

	function loadTotalSales(array){
		if(array.length > 0){
			let temp = []
			let totalCreditTemp = 0
			let totalDebitTemp = 0
			let totalVoucherTemp = 0
			let total = 0
	
			array.forEach((venda)=>{
				if(temp.length === 0){
				let newObj = {
					adminName: venda.adquirente.nomeAdquirente,
					total: venda.valorBruto,
					id: 0,
					sales: []
				}
				temp.push(newObj)
				}else{
				let newObj = {
					adminName: venda.adquirente.nomeAdquirente,
					total: venda.valorBruto,
					id: 0,
					sales: []
				}
	
				if(!(temp.find((objeto) => objeto.adminName === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
					newObj.id = (temp.length)
					temp.push(newObj)
				}
	
				else{
					for(let i = 0; i < temp.length; i++){
						if(temp[i].adminName === venda.adquirente.nomeAdquirente){
							temp[i].total += venda.valorBruto
						}
					}
				}
				}
				// eslint-disable-next-line default-case
				switch(venda.produto.descricaoProduto){
				case 'Crédito':
					totalCreditTemp += venda.valorBruto
					break
	
				case 'Débito':
					totalDebitTemp += venda.valorBruto
					break
	
				case 'Voucher':
					totalVoucherTemp += venda.valorBruto
					break
				}
				total += venda.valorBruto
			})
				temp.forEach((adq) => {
					let salesTemp = []
					salesTemp.length = 0
					array.forEach((vendasDia) => {
						if(vendasDia.length > 0){
							vendasDia.forEach((venda) => {
								if(venda.adquirente.nomeAdquirente === adq.adminName){
									salesTemp.push(venda)
								}
								adq.sales = salesTemp
							})
						}
					})
				})
				let totalTemp = {debit: Number(totalDebitTemp), credit: Number(totalCreditTemp), voucher: Number(totalVoucherTemp), total: Number(total)}
				
				setSalesTotal(totalTemp)
			}
	}

	function loadTotalCredits(array){
		if(array.length > 0){
			let temp = []
			let totalCreditTemp = 0
			let totalDebitTemp = 0
			let totalVoucherTemp = 0
			let total = 0
	
			array.forEach((venda)=>{
				if(temp.length === 0){
				let newObj = {
					adminName: venda.adquirente.nomeAdquirente,
					total: venda.valorLiquido,
					id: 0,
					sales: []
				}
				temp.push(newObj)
				} else {
				let newObj = {
					adminName: venda.adquirente.nomeAdquirente,
					total: venda.valorLiquido,
					id: 0,
					sales: []
				}
	
				if(!(temp.find((objeto) => objeto.adminName === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
					newObj.id = (temp.length)
					temp.push(newObj)
				}
	
				else{
					for(let i = 0; i < temp.length; i++){
						if(temp[i].adminName === venda.adquirente.nomeAdquirente){
							temp[i].total += venda.valorLiquido
						}
					}
				}
				}
				// eslint-disable-next-line default-case
				switch(venda.produto.descricaoProduto){
				case 'Crédito':
					totalCreditTemp += venda.valorLiquido
					break
	
				case 'Débito':
					totalDebitTemp += venda.valorLiquido
					break
	
				case 'Voucher':
					totalVoucherTemp += venda.valorLiquido
					break
				}
				total += venda.valorLiquido
			})
				temp.forEach((adq) => {
					let salesTemp = []
					salesTemp.length = 0
					array.forEach((vendasDia) => {
						if(vendasDia.length > 0){
							vendasDia.forEach((venda) => {
								if(venda.adquirente.nomeAdquirente === adq.adminName){
									salesTemp.push(venda)
								}
								adq.sales = salesTemp
							})
						}
					})
				})
				let totalTemp = {debito: Number(totalDebitTemp), credito: Number(totalCreditTemp), voucher: Number(totalVoucherTemp), total: Number(total)}
				setCreditsTotal(totalTemp)
			}
	}

	////////////////////////////////////////////////////////////////////////////////////////

	const resetAppValues = () => {
		setIsLoadedDashboard(false)
		setIsLoadedSalesDashboard(false)
		setIsLoadedCreditsDashboard(false)
		setIsLoadedServicesDashboard(false)
		setSalesPageArray([])
		setSalesPageAdminArray([])
		setSalesTotal({
			debit: 0,
			credit: 0,
			voucher: 0,
			total: 0,
		})
		setSalesDateRange([new Date(), new Date()])
		setCreditsPageArray([])
		setCreditsPageAdminArray([])
		setCreditsTotal({
			debit: 0,
			credit: 0,
			voucher: 0,
			total: 0,
		})
		setCreditsDateRange([new Date(), new Date()])
		setServicesPageArray([])
		setServicesPageAdminArray([])
		setServicesDateRange([new Date(), new Date()])
		setSalesDashboard({
			sales: [],
			totalLast4: 0,
			totalMonth: 0,
			chart: {
				data: [],
				labels: []
			}
		})
		setCreditsDashboard({
			credits: [],
			predictToday: 0,
			predictNext5: 0,
			chart: {
				data: [],
				labels: []
			}
		})
		setServicesDashboard({
			services: [],
			totalToday: 0,
			totalMonth: 0,
			chart: {
				data: [],
				labels: []
			}
		})
		setChartSales({data: [], labels: []})
		setChartCredits({data: [], labels: []})
		setChartServices({data: [], labels: []})
	}

	////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////


	// // // // // // // // // // // // // // // // // // // // // // // // // 

	const navigate = useNavigate()

	async function loadOptions() {
		try {
			let params = {
				codigo: Cookies.get('userID')
			}
  
			let config = {
				params: params
			}
  
			const response = await api.get('Menu', config)
			return response.data
		} catch (error) {
			console.error(error)
			if (error.response.status === 401) {
				logout()
				return
			}
			return null // or handle the error as needed
		}
	}

	/////desloga usuário
	function logout(){
		sessionStorage.clear()
		const clearAllCookies = () => {
			const cookies = Cookies.get()
			for (const cookie in cookies) {
				if (Object.prototype.hasOwnProperty.call(cookies, cookie)) {
					Cookies.remove(cookie)
				}
			}
		}
		resetAppValues()
		clearAllCookies()
		setIsSignedIn(false)
		sessionStorage.setItem('isSignedIn', false)
		navigate('/')
	}

	//////////////////////////////////////////////////////////////////

	// funções de Manipulação de formato de Data

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

	function converteData(data){
		const ano = data.getFullYear()
		const mes = String(data.getMonth() + 1).padStart(2, '0')
		const dia = String(data.getDate()).padStart(2, '0')
		return `${ano}-${mes}-${dia}`
	}

	//////////////////////////////////////////////////////////////////	

	function alerta(text){
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

	function exportSales(array){
		if(array.length === 0){
			return
		}
		setSalesTableData([])
		if (array.length > 0) {
			array.map((venda) => {
				salesTableData.push({
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
		} 
	}

	function exportCredits(array){
		if(array.length === 0){
			return
		}
		setCreditsTableData([])
		if (array.length > 0) {
			array.map((venda) => {
				creditsTableData.push({
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
		} 
	}

	function exportServices(array){
		servicesTableData.length = 0
		if(array.length === 0){
			return
		}
		servicesTableData.length = 0
		if (array.length > 0) {
			array.map((venda) => {
				servicesTableData.push({
					cnpj: venda.cnpj,
					razao_social: venda.razao_social,
					codigo_estabelecimento: venda.codigo_estabelecimento,
					adquirente: venda.nome_adquirente,
					valor: venda.valor,
					data: venda.data,
					descricao: venda.descricao,
				})
			})
		}
		return servicesTableData
	}

	// Função que organiza array em ordem alfabética

	const sortArray = (arrayAdq) => {
		const sortedArray = [...arrayAdq].sort((a, b) => {
			const nameA = a.adminName.toUpperCase()
			const nameB = b.adminName.toUpperCase()
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

	return(
		<AuthContext.Provider
			value={{
				alerta,
				isSignedIn, setIsSignedIn,
				logout,
				accessToken, setAccessToken,

				////////////////

				//****************************************************//
				//****************************************************//
				//****************************************************//

								// *** REFATORAÇÃO *** //

				//****************************************************//
				//****************************************************//
				//****************************************************//

				// Dashboard //
				
				loadDashboard, isLoadedDashboard, setIsLoadedDashboard,
				salesDashboard, isLoadedSalesDashboard, setIsLoadedSalesDashboard, loadSalesGroup,
				creditsDashboard, isLoadedCreditsDashboard, setIsLoadedCreditsDashboard, loadCreditsGroup,
				servicesDashboard, isLoadedServicesDashboard, setIsLoadedServicesDashboard, loadServicesGroup,
				
				// Vendas //

				loadSales, loadTotalSales, loadSalesGroup,
				salesDateRange, setSalesDateRange,
				salesPageArray, setSalesPageArray,
				salesPageAdminArray, setSalesPageAdminArray,
				salesTotal, setSalesTotal,
				btnDisabledSales, setBtnDisabledSales,
				salesTableData, setSalesTableData,
				exportSales, errorSales,

				// Creditos //

				loadCredits, loadTotalCredits, loadCreditsGroup,
				creditsPageArray, setCreditsPageArray,
				creditsPageAdminArray, setCreditsPageAdminArray,
				creditsDateRange, setCreditsDateRange,
				creditsTotal, setCreditsTotal,
				btnDisabledCredits, setBtnDisabledCredits,
				creditsTableData, setCreditsTableData,
				exportCredits, errorCredits,

				// Serviços //

				loadServices, loadServicesGroup,
				servicesPageArray, setServicesPageArray,
				servicesPageAdminArray, setServicesPageAdminArray,
				servicesDateRange, setServicesDateRange,
				btnDisabledServices, setBtnDisabledServices,
				servicesTableData, setServicesTableData,
				exportServices, errorServices,

				// Taxas

				loadTaxes, isLoadingTaxes, setIsLoadingTaxes,
				addTax, editTax, deleteTax,

				// Bancos

				loadBanks, isLoadingBanks, setIsLoadingBanks,
				addBank, editBank, deleteBank,
				loadCliAdq,

				// Sysmo

				loadSysmo,
				btnDisabledSysmo, setBtnDisabledSysmo,

				// outros / compartilhados //

				loginApp, 
				loadBanners, loadAdmins, loadMods, loadProducts, loadSubproducts,
				groupByAdmin, groupServicesByAdmin,
				exportName, setExportName,
				isCheckedCalendar, setIsCheckedCalendar,
				converteData, dateConvert, dateConvertSearch, dateConvertYYYYMMDD,

				fetchingData,

				groupsList, clientsList,
				loadGroupsList, setGroupsList,

				changedOption, setChangedOption,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider

