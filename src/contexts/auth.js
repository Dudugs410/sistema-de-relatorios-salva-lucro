/* eslint-disable react/prop-types */
/* eslint-disable default-case */
import { React, createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api, { cancelOngoingRequests } from '../services/api'

import md5 from 'md5'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jwtDecode from 'jwt-decode'
import defaultImg from '../assets/LOGO AZUL.png'
import { imageToBase64 } from '../components/utils/base64'

import _ from 'lodash'

export const AuthContext = createContext({})

function AuthProvider({ children }){
	const [isSignedIn, setIsSignedIn] = useState(false)
	const [accessToken, setAccessToken] = useState(undefined)

	const [clientUserId, setClientUserId] = useState()
  const [userImg, setUserImg] = useState('')

	////////////////////////////////////////////////////////////////

	const [salesTableData, setSalesTableData] = useState([])
	const [creditsTableData, setCreditsTableData] = useState([])
	const [servicesTableData, setServicesTableData] = useState([])
	const [taxesTableData, setTaxesTableData] = useState([])

	const [exportName, setExportName] = useState('')
	const [isCheckedCalendar, setIsCheckedCalendar] = useState(true)
	const [changedOption, setChangedOption] = useState(false)

	const [errorSales, setErrorSales] = useState(false)
	const [errorCredits, setErrorCredits] = useState(false)
	const [errorServices, setErrorServices] = useState(false)

	const [fetchingData, setFetchingData] = useState(false)

	const [displayGroup, setDisplayGroup] = useState('')
    const [displayClient, setDisplayClient] = useState('')

	
	const [canceledSales, setCanceledSales] = useState(false)
	const [canceledCredits, setCanceledCredits] = useState(false)
	const [canceledServices, setCanceledServices] = useState(false)

  const [chartSales, setChartSales] = useState()
  const [chartCredits, setChartCredits] = useState()
  const [chartServices, setChartServices] = useState()

	//////////////////////////////////////////////////////////////////

  const navigate = useNavigate()

	// *** Usuário e Login *** //

	// objeto que guardará dados do usuário, caso seja necessário acessar algo //

	const [groupsList, setGroupsList] = useState([])
	const [clientsList, setClientsList] = useState([])

	useEffect(()=>{
		if(canceled){
			resetAppValues()
			setErrorSales(false)
			setErrorCredits(false)
			setErrorServices(false)
			setIsLoadedSalesDashboard(false)
			setIsLoadedCreditsDashboard(false)
			setIsLoadedServicesDashboard(false)
			setIsLoadedDashboard(false)
			setFetchingData(false)
		}
	},[cancelOngoingRequests])

	// Função que loga o usuário e gerencia quaisquer dados relevantes à isso
  const loginApp = async (login, password) => {
  resetAppValues()
  try {
    const response = await api.post('token', { client_id: login, client_secret: md5(password) })
    const responseData = response.data
    localStorage.setItem('token', responseData.acess_token)
    localStorage.setItem('refreshToken', responseData.refresh_token)
    const userId = jwtDecode(responseData.acess_token).id
    localStorage.setItem('userID', userId)
    Cookies.set('userID', userId)
    const loggedSuccessfully = JSON.parse(responseData.sucess)

    if (loggedSuccessfully) {
        localStorage.setItem('currentPath', '/dashboard')
        //localStorage.setItem('md5Pass', md5(password))
        setClientUserId(userId)
        let user
      try {
        user = await loadUser(userId)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('isChecked', user.TEMA)
      } catch (error) {
        console.log(error)
      }
      console.log(user)

      //checa se o usuário não tem tema e imagem definidos,
      //seta os que não tem com as definições padrão e
      //atualiza o usuário no banco
      const handleUpdateUser = async () => {
        try{
          if(!user.TEMA){
            user.TEMA = false
          }
          if(!user.IMAGEMBASE64){
            console.log('user.IMAGEMBASE64')
            const base64String = await imageToBase64(defaultImg)
            user.IMAGEMBASE64 = base64String
            setUserImg(base64String)
          }
          updateUser(user)
          localStorage.setItem('user', JSON.stringify(user))
        } catch (error){
          console.log(error)
        }
      }

      if((!user.TEMA) || (!user.IMAGEMBASE64)){
        await handleUpdateUser()
      }

      const userData = { NOME: user.NOME, EMAIL: user.EMAIL }
      localStorage.setItem('GRUCODIGO', user.GRUCODIGO)
      localStorage.setItem('isSignedIn', true)
      localStorage.setItem('userData', JSON.stringify(userData))

    try {
      const clientUserId = userId

      const loginLog = async () => {
        function getBrazilianISOTime() {
          const now = new Date()
          
          const dateTimeParts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
            hour12: false,
          }).formatToParts(now)
          
          const { year, month, day, hour, minute, second, fractionalSecond } = 
            dateTimeParts.reduce((acc, part) => {
            acc[part.type] = part.value
            return acc
            }, {})
          return `${year}-${month}-${day}T${hour}:${minute}:${second}.${fractionalSecond}`;
        }

        const currentDateTime = getBrazilianISOTime()

          let body = {
            USUCODIGO: userId,
            USULOGIN: login.toUpperCase(),
            ACESSOPERMITIDO: 'S',
            APLICACAO: 'ReactApp',
            DATAHORA: currentDateTime,
          }

          api.post('/LogAcesso', body)
          console.log('login registrado')
        }
      const getLoginLog = async () => {
        let params = {
          codigo: userId
        }

        let config = {
          params: params
        }

        let res = await api.get('/LogAcesso', config)
        console.log(res)
        return res
      }

      try {
        await loginLog()
      } catch (error) {
        console.log(error)
      }
	
    //pluggy
    const response = await fetch('https://api.pluggy.ai/auth', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      clientId: "7cee8f27-cbfa-4a19-b14d-306f9656787a",
      clientSecret: "01e4edaf-639a-40ae-945a-4a04ab652bad",
      itemOptions: {
        clientUserId: clientUserId
      }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()

    Cookies.set('pluggy_api_key', data.apiKey, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    Cookies.set('pluggy_client_id', clientUserId, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  } catch (error) {
    console.error('Authentication failed:', error)
    Cookies.remove('pluggy_api_key')
    Cookies.remove('pluggy_client_id')
    throw error
  }

	const opt = await loadOptions()
	localStorage.setItem('options', JSON.stringify(opt))
	
	const gru = await loadGroupsList()
	localStorage.setItem('groupsStorage', JSON.stringify(gru))
	localStorage.setItem('groupCode', gru[0].CODIGOGRUPO)
	localStorage.setItem('cnpj', 'todos')
  setIsSignedIn(true)
}  } catch (error) {
      console.error('Login error:', error)
      alert(error.message)
  }}

  const getLocalJoyRide = () => {
    return JSON.parse(localStorage.getItem('joyride'))
  }

  const setLocalJoyride = (item) => {
    localStorage.setItem(JSON.stringify(item), 'joyride')
  }

  const loadUser = async (userId) => {
    console.log('userID: ', userId)
    let params = {
      codigo: userId
    }

    let config = {
      params: params
    }

    try {
      const response = await api.get('usuario', config)
      return response.data
    } catch (error) {
      console.log(error)
    }

  }
	
  /////desloga usuário
	// FIXED: Memoized logout function
	const logout = useCallback(() => {
		clearCookies()
		localStorage.clear()
		cancelOngoingRequests()
		resetAppValues()
    localStorage.removeItem('isSignedIn')
    localStorage.removeItem('selectedContext')
    sessionStorage.removeItem('currentPath')
		localStorage.setItem('isSignedIn', false)
		navigate('/')
	}, [navigate])

  // FIXED: Memoized updateUser function
  const updateUser = useCallback(async (userObj) => {
    //setIsLoadingUser(true)
    console.log('update user: ', userObj)
    try {
        let body = JSON.stringify(userObj)

        const response = await fetch('https://app.salvalucro.com.br/api/v1/usuario', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: body,
        })

        const responseData = await response.json()
        console.log('response: ', responseData)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      toast.dismiss()
      toast.error('Erro ao atualizar usuário!')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    } finally {
      //setIsLoadingUser(false)
    }
  }, [logout]) // Added logout as dependency

	// funções que retornam arrays com Grupos, Clientes, Bandeiras e Adquirentes, respectivamente //

		const loadGroupsList = async () => {
			try {
				const response = await api.get('/grupo')
				const gru = response.data
				setGroupsList(gru)
				setClientsList(gru[0].CLIENTES)
				//console.log('groupsList: ', gru)
				return gru
			} catch (error) {
				console.error(error)
				if (error.response.status === 401) {
					logout()
				}
				throw new Error(error.message)
			}
		}

	// *** funções API *** //

		//controladores do disabled dos botões nas páginas com calendarios

		const [btnDisabledSales, setBtnDisabledSales] = useState(false)
		const [btnDisabledCredits, setBtnDisabledCredits] = useState(false)
		const [btnDisabledServices, setBtnDisabledServices] = useState(false)
		const [btnDisabledSysmo, setBtnDisabledSysmo] = useState(false)

// Relatórios:

/*
{
    "dataInicial": "2026-04-01",
    "dataFinal":"2026-04-03",
    "clientes" : "5261",  --Se tiver mais que um : "5261,5262,5263"
    "nomeGrupo" : "CELIO SUPERMERCADO",
    "bandeira" : "", --um código apenas Ex. "23" 
    "adquirente" : "",--um código apenas Ex. "23" 
    "produto" : "",--um código apenas Ex. "23" 
    "modalidade" : "",--um código apenas Ex. "23" 
    "arquivo" : "PDF", Pode ser : PDF/XLSX/JSON 
    "modelo" : "VENDA_DETALHADO"   Pode ser RECEBIMENTO_DETALHADO OU AJUSTE_DETALHADO
}
*/

const loadSales = async (startDate, endDate) => {
  console.log('carregando vendas: ', startDate, ' até ', endDate)
  try {
    setErrorSales(false)
    const apiCNPJ = localStorage.getItem('cnpj')
    const apiGroupCode = localStorage.getItem('groupCode')
    console.log('CNPJ: ', apiCNPJ, 'GRUcodigo: ', apiGroupCode)
    if((apiCNPJ === 'todos' || apiCNPJ === 'TODOS') && (apiGroupCode !== 'selecione')){
      let params = {
        datainicial: startDate,
        datafinal: endDate,
        codigoGrupo: apiGroupCode,
      }
      let config = {
        params: params
      }

      console.log('antes da requisição (vendas): ', 'params: ', params, ' config: ', config )

      const response = await api.get('vendas', config)
      return response.data.VENDAS

    } else {
      console.log('else')
      let params = {
        datainicial: startDate,
        datafinal: endDate,
        cnpj: apiCNPJ,
      }

      let config = {
        params: params
      }

      console.log('antes da requisição (vendas): ', 'params: ', params, ' config: ', config )
      const response = await api.get('vendas', config)
      setBtnDisabledSales(false)
      exportSales(response.data.VENDAS)
      console.log('response: ', response)
      console.log('retorna response.data.VENDAS')
      return response.data.VENDAS
    }
  } catch (error) {
    console.log('erro vendas: ', error)
    setBtnDisabledSales(false)
    console.log('bomba: ', error)
    if(error.code === 'ERR_CANCELED'){
      console.log('canceled')
      setErrorSales(false)
    } else if (error.response && error.response.status === 401) {
      console.log('error response status 401')
      toast.error('Sessão Expirada')
      logout()
      return
    } else {
      console.log('not canceled')
      toast.error('Erro ao Carregar Vendas ', error.code)
      console.error('Error fetching vendas:', error)
      setErrorSales(true)
    }
    return []
  }
}

const formatDateToYYYYMMDD = (date) => {
  if (!date) return ''
  
  // If it's already a string in YYYY-MM-DD format, return it
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }
  
  // If it's a Date object
  if (date instanceof Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // If it's a string in Brazilian format (dd/mm/yyyy)
  if (typeof date === 'string' && date.includes('/')) {
    const [day, month, year] = date.split('/')
    return `${year}-${month}-${day}`
  }
  
  // Try to parse as Date
  const dateObj = new Date(date)
  if (!isNaN(dateObj.getTime())) {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  return ''
}

const newLoadSales = async (startDate, endDate, additionalFilters = {}) => {
  console.log('carregando vendas: ', startDate, ' até ', endDate)
  try {
    setErrorSales(false)
    
    // Format dates to YYYY-MM-DD
    const formatDateToYYYYMMDD = (date) => {
      if (!date) return ''
      
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
      }
      
      if (date instanceof Date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      if (typeof date === 'string' && date.includes('/')) {
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
      }
      
      const dateObj = new Date(date)
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      return ''
    }
    
    const formattedStartDate = formatDateToYYYYMMDD(startDate)
    const formattedEndDate = formatDateToYYYYMMDD(endDate)
    
    console.log('Formatted dates:', formattedStartDate, formattedEndDate)
    
    // Get stored data from localStorage
    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
    const selectedBan = JSON.parse(localStorage.getItem('selectedBan'))
    const selectedAdm = JSON.parse(localStorage.getItem('selectedAdm'))
    
    // Store formatted dates in localStorage
    localStorage.setItem('dataInicial', formattedStartDate)
    localStorage.setItem('dataFinal', formattedEndDate)
    
    // Determine client codes as a comma-separated string
    let clientesString = "";
    
    if (cliente && cliente.label === 'TODOS') {
      const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || [];
      clientesString = clientCodes.join(', ');
      console.log('All client codes (TODOS):', clientesString);
    } else if (cliente && cliente.cod) {
      clientesString = String(cliente.cod);
      console.log('Single client code:', clientesString);
    } else if (cliente && cliente.value) {
      clientesString = String(cliente.value);
    } else {
      const apiCNPJ = localStorage.getItem('cnpj')
      const apiGroupCode = localStorage.getItem('groupCode')
      clientesString = apiCNPJ === 'todos' ? String(apiGroupCode) : String(apiCNPJ)
    }
    
    // Get filter values
    const bandeira = selectedBan?.value || additionalFilters.bandeira || "";
    const adquirente = selectedAdm?.value || additionalFilters.adquirente || "";
    const nomeGrupo = grupo?.label || localStorage.getItem('clientName') || "";
    
    // Build the request object
    const requestObject = {
      dataInicial: formattedStartDate,
      dataFinal: formattedEndDate,
      clientes: clientesString,
      nomeGrupo: nomeGrupo,
      bandeira: bandeira,
      adquirente: adquirente,
      produto: additionalFilters.produto || "",
      modalidade: additionalFilters.modalidade || "",
      arquivo: "JSON",
      modelo: "VENDA"
    }
    
    console.log('Final request object:', requestObject)
    
    const response = await api.post('relatorios/detalhado', requestObject)
    
    console.log('Full API Response:', response.data)
    console.log('Response success type:', typeof response.data.success)
    console.log('Response success value:', response.data.success)
    console.log('Response dados length:', response.data.dados?.length)
    
    setBtnDisabledSales(false)
    
    // Fix: Check boolean, not string comparison
    if (response.data.success === true && response.data.dados && response.data.dados.length > 0) {
      console.log('Vendas data received:', response.data.dados.length, 'records')
      console.log('First record sample:', response.data.dados[0])
      
      // Store in localStorage for export
      //localStorage.setItem('salesData', JSON.stringify(response.data.dados))
      
      return response.data.dados
    } else if (response.data.success === true && (!response.data.dados || response.data.dados.length === 0)) {
      console.log('Success true but no data in dados array')
      toast.info(response.data.mensagem || "Nenhum dado encontrado para o período selecionado")
      return []
    } else {
      console.log('Unsuccessful response:', response.data)
      toast.error(response.data.mensagem || "Erro ao carregar dados")
      return []
    }
    
  } catch (error) {
    console.error('Error in newLoadSales:', error)
    setBtnDisabledSales(false)
    
    if(error.code === 'ERR_CANCELED'){
      console.log('Request canceled')
      setErrorSales(false)
    } else if (error.response && error.response.status === 401) {
      console.log('Session expired')
      toast.error('Sessão Expirada')
      logout()
      return
    } else {
      toast.error('Erro ao Carregar Vendas: ' + (error.response?.data?.mensagem || error.message))
      console.error('Error fetching vendas:', error)
      setErrorSales(true)
    }
    return []
  }
}

const newGroupByAdmin = (salesArray) => {
  if (!salesArray || salesArray.length === 0) return []
  
  console.log('newGroupByAdmin called with:', salesArray.length, 'records')
  
  const adminMap = new Map()
  
  salesArray.forEach(sale => {
    const adminName = sale.ADMINISTRADORA || 'Unknown'
    const total = sale.VALORBRUTO || 0
    
    if (adminMap.has(adminName)) {
      adminMap.set(adminName, adminMap.get(adminName) + total)
    } else {
      adminMap.set(adminName, total)
    }
  })
  
  const result = []
  let id = 0
  adminMap.forEach((total, adminName) => {
    result.push({
      id: id++,
      adminName: adminName,
      total: total,
      sales: []
    })
  })
  
  console.log('newGroupByAdmin result:', result)
  return result
}

const newLoadTotalSales = (salesArray) => {
  if (!salesArray || salesArray.length === 0) {
    // Only reset if values are not already zero
    const currentTotal = salesTotal;
    if (currentTotal.debit !== 0 || currentTotal.credit !== 0 || currentTotal.voucher !== 0 || currentTotal.total !== 0) {
      setSalesTotal({ debit: 0, credit: 0, voucher: 0, total: 0 })
    }
    return
  }
  
  console.log('newLoadTotalSales called with:', salesArray.length, 'records')
  
  let totalCredito = 0
  let totalDebito = 0
  let totalVoucher = 0
  let totalGeral = 0
  
  salesArray.forEach(sale => {
    const valor = sale.VALORBRUTO || 0
    const produto = (sale.PRODUTO || "").trim()
    
    totalGeral += valor
    
    if (produto === 'Crédito') {
      totalCredito += valor
    } else if (produto === 'Débito') {
      totalDebito += valor
    } else {
      totalVoucher += valor
    }
  })
  
  const result = {
    debit: totalDebito,
    credit: totalCredito,
    voucher: totalVoucher,
    total: totalGeral
  }
  
  console.log('newLoadTotalSales result:', result)
  
  // Only update if values actually changed
  const currentTotal = salesTotal;
  if (currentTotal.debit !== result.debit ||
      currentTotal.credit !== result.credit ||
      currentTotal.voucher !== result.voucher ||
      currentTotal.total !== result.total) {
    console.log('Updating sales total')
    setSalesTotal(result)
  } else {
    console.log('Sales total unchanged, skipping update')
  }
}

const newLoadCredits = async (startDate, endDate, additionalFilters = {}) => {
  console.log('carregando créditos/recebimentos: ', startDate, ' até ', endDate)
  try {
    setErrorCredits(false)
    
    // Format dates to YYYY-MM-DD
    const formatDateToYYYYMMDD = (date) => {
      if (!date) return ''
      
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
      }
      
      if (date instanceof Date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      if (typeof date === 'string' && date.includes('/')) {
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
      }
      
      const dateObj = new Date(date)
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      return ''
    }
    
    const formattedStartDate = formatDateToYYYYMMDD(startDate)
    const formattedEndDate = formatDateToYYYYMMDD(endDate)
    
    console.log('Formatted dates:', formattedStartDate, formattedEndDate)
    
    // Get stored data from localStorage
    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
    const selectedBan = JSON.parse(localStorage.getItem('selectedBanCredits')) // Note: different key for credits
    const selectedAdm = JSON.parse(localStorage.getItem('selectedAdmCredits')) // Note: different key for credits
    
    // Store formatted dates in localStorage
    localStorage.setItem('dataInicial', formattedStartDate)
    localStorage.setItem('dataFinal', formattedEndDate)
    
    // Determine client codes as a comma-separated string
    let clientesString = "";
    
    if (cliente && cliente.label === 'TODOS') {
      const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || [];
      clientesString = clientCodes.join(', ');
      console.log('All client codes (TODOS):', clientesString);
    } else if (cliente && cliente.cod) {
      clientesString = String(cliente.cod);
      console.log('Single client code:', clientesString);
    } else if (cliente && cliente.value) {
      clientesString = String(cliente.value);
    } else {
      const apiCNPJ = localStorage.getItem('cnpj')
      const apiGroupCode = localStorage.getItem('groupCode')
      clientesString = apiCNPJ === 'todos' ? String(apiGroupCode) : String(apiCNPJ)
    }
    
    // Get filter values from localStorage or additionalFilters
    const bandeira = selectedBan?.codigoBandeira || additionalFilters.bandeira || "";
    const adquirente = selectedAdm?.codigoAdquirente || additionalFilters.adquirente || "";
    const nomeGrupo = grupo?.label || localStorage.getItem('clientName') || "";
    
    // Build the request object - NOTE: modelo is "RECEBIMENTO" for credits
    const requestObject = {
      dataInicial: formattedStartDate,
      dataFinal: formattedEndDate,
      clientes: clientesString,
      nomeGrupo: nomeGrupo,
      bandeira: bandeira,
      adquirente: adquirente,
      produto: additionalFilters.produto || "",
      modalidade: additionalFilters.modalidade || "",
      arquivo: "JSON", // Always JSON for data loading
      modelo: "RECEBIMENTO" // Changed from "VENDA" to "RECEBIMENTO"
    }
    
    console.log('Final request object for credits:', requestObject)
    
    const response = await api.post('relatorios/detalhado', requestObject)
    
    console.log('Full API Response for credits:', response.data)
    console.log('Response success type:', typeof response.data.success)
    console.log('Response success value:', response.data.success)
    console.log('Response dados length:', response.data.dados?.length)
    
    setBtnDisabledCredits(false)
    
    // Fix: Check boolean, not string comparison
    if (response.data.success === true && response.data.dados && response.data.dados.length > 0) {
      console.log('Credits data received:', response.data.dados.length, 'records')
      console.log('First record sample:', response.data.dados[0])
      
      // Store in localStorage for export
      //localStorage.setItem('creditsData', JSON.stringify(response.data.dados))
      
      return response.data.dados
    } else if (response.data.success === true && (!response.data.dados || response.data.dados.length === 0)) {
      console.log('Success true but no data in dados array')
      toast.info(response.data.mensagem || "Nenhum dado encontrado para o período selecionado")
      return []
    } else {
      console.log('Unsuccessful response:', response.data)
      toast.error(response.data.mensagem || "Erro ao carregar dados de créditos")
      return []
    }
    
  } catch (error) {
    console.error('Error in newLoadCredits:', error)
    setBtnDisabledCredits(false)
    
    if(error.code === 'ERR_CANCELED'){
      console.log('Request canceled')
      setErrorCredits(false)
    } else if (error.response && error.response.status === 401) {
      console.log('Session expired')
      toast.error('Sessão Expirada')
      logout()
      return
    } else {
      toast.error('Erro ao Carregar Créditos: ' + (error.response?.data?.mensagem || error.message))
      console.error('Error fetching credits:', error)
      setErrorCredits(true)
    }
    return []
  }
}

// In AuthContext.js - Update newGroupByAdminCredits
const newGroupByAdminCredits = (creditsArray) => {
  if (!creditsArray || creditsArray.length === 0) return []
  
  console.log('newGroupByAdminCredits called with:', creditsArray.length, 'records')
  
  const adminMap = new Map()
  
  creditsArray.forEach(credit => {
    const adminName = credit.ADMINISTRADORA || 'Unknown'
    const total = Number(credit.VALORLIQUIDO) || 0  // Use VALORLIQUIDO instead of VALORBRUTO
    
    if (adminMap.has(adminName)) {
      adminMap.set(adminName, adminMap.get(adminName) + total)
    } else {
      adminMap.set(adminName, total)
    }
  })
  
  const result = []
  let id = 0
  adminMap.forEach((total, adminName) => {
    result.push({
      id: id++,
      adminName: adminName,
      total: total,
      credits: []
    })
  })
  
  console.log('newGroupByAdminCredits result:', result)
  return result
}

const newLoadTotalCredits = (creditsArray) => {
  if (!creditsArray || creditsArray.length === 0) {
    console.log('newLoadTotalCredits: No data, resetting totals')
    setCreditsTotal({ 
      debit: 0, 
      credit: 0, 
      voucher: 0, 
      total: 0 
    })
    return
  }
  
  console.log('newLoadTotalCredits called with:', creditsArray.length, 'records')
  
  let totalCredito = 0
  let totalDebito = 0
  let totalVoucher = 0
  let totalGeral = 0
  
  creditsArray.forEach(credit => {
    const valor = Number(credit.VALORLIQUIDO) || 0
    const produto = (credit.PRODUTO || "").trim()
    
    totalGeral += valor
    
    if (produto === 'Crédito') {
      totalCredito += valor
    } else if (produto === 'Débito') {
      totalDebito += valor
    } else if (produto === 'Voucher') {
      totalVoucher += valor
    }
  })
  
  const result = {
    debit: totalDebito,
    credit: totalCredito,
    voucher: totalVoucher,
    total: totalGeral
  }
  
  console.log('newLoadTotalCredits result:', result)
  setCreditsTotal(result)
}

const newLoadServices = async (startDate, endDate, additionalFilters = {}) => {
  console.log('carregando serviços/ajustes: ', startDate, ' até ', endDate)
  try {
    setErrorServices(false)
    
    // Format dates to YYYY-MM-DD
    const formatDateToYYYYMMDD = (date) => {
      if (!date) return ''
      
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
      }
      
      if (date instanceof Date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      if (typeof date === 'string' && date.includes('/')) {
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
      }
      
      const dateObj = new Date(date)
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      return ''
    }
    
    const formattedStartDate = formatDateToYYYYMMDD(startDate)
    const formattedEndDate = formatDateToYYYYMMDD(endDate)
    
    console.log('Formatted dates for services:', formattedStartDate, formattedEndDate)
    
    // Get stored data from localStorage
    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
    const selectedBan = JSON.parse(localStorage.getItem('selectedBanServices')) || '' // Optional: create specific key for services filters
    const selectedAdm = JSON.parse(localStorage.getItem('selectedAdmServices')) || '' // Optional: create specific key for services filters
    
    // Store formatted dates in localStorage
    localStorage.setItem('dataInicial', formattedStartDate)
    localStorage.setItem('dataFinal', formattedEndDate)
    
    // Determine client codes as a comma-separated string
    let clientesString = "";
    
    if (cliente && cliente.label === 'TODOS') {
      const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || [];
      clientesString = clientCodes.join(', ');
      console.log('All client codes (TODOS):', clientesString);
    } else if (cliente && cliente.cod) {
      clientesString = String(cliente.cod);
      console.log('Single client code:', clientesString);
    } else if (cliente && cliente.value) {
      clientesString = String(cliente.value);
    } else {
      const apiCNPJ = localStorage.getItem('cnpj')
      const apiGroupCode = localStorage.getItem('groupCode')
      clientesString = apiCNPJ === 'todos' ? String(apiGroupCode) : String(apiCNPJ)
    }
    
    // Get filter values from localStorage or additionalFilters
    const bandeira = selectedBan?.codigoBandeira || additionalFilters.bandeira || "";
    const adquirente = selectedAdm?.codigoAdquirente || additionalFilters.adquirente || "";
    const nomeGrupo = grupo?.label || localStorage.getItem('clientName') || "";
    
    // Build the request object - NOTE: modelo is "AJUSTE" for services
    const requestObject = {
      dataInicial: formattedStartDate,
      dataFinal: formattedEndDate,
      clientes: clientesString,
      nomeGrupo: nomeGrupo,
      bandeira: bandeira,
      adquirente: adquirente,
      produto: additionalFilters.produto || "",
      modalidade: additionalFilters.modalidade || "",
      arquivo: "JSON", // Always JSON for data loading
      modelo: "AJUSTE" // Changed from "VENDA"/"RECEBIMENTO" to "AJUSTE"
    }
    
    console.log('Final request object for services:', requestObject)
    
    const response = await api.post('relatorios/detalhado', requestObject)
    
    console.log('Full API Response for services:', response.data)
    console.log('Response success type:', typeof response.data.success)
    console.log('Response success value:', response.data.success)
    console.log('Response dados length:', response.data.dados?.length)
    
    setBtnDisabledServices(false)
    
    // Fix: Check boolean, not string comparison
    if (response.data.success === true && response.data.dados && response.data.dados.length > 0) {
      console.log('Services data received:', response.data.dados.length, 'records')
      console.log('First record sample:', response.data.dados[0])
      
      // Store in localStorage for export
      localStorage.setItem('servicesData', JSON.stringify(response.data.dados))
      
      return response.data.dados
    } else if (response.data.success === true && (!response.data.dados || response.data.dados.length === 0)) {
      console.log('Success true but no data in dados array')
      toast.info(response.data.mensagem || "Nenhum serviço/ajuste encontrado para o período selecionado")
      return []
    } else {
      console.log('Unsuccessful response:', response.data)
      toast.error(response.data.mensagem || "Erro ao carregar dados de serviços/ajustes")
      return []
    }
    
  } catch (error) {
    console.error('Error in newLoadServices:', error)
    setBtnDisabledServices(false)
    
    if(error.code === 'ERR_CANCELED'){
      console.log('Request canceled')
      setErrorServices(false)
    } else if (error.response && error.response.status === 401) {
      console.log('Session expired')
      toast.error('Sessão Expirada')
      logout()
      return
    } else {
      toast.error('Erro ao Carregar Serviços/Ajustes: ' + (error.response?.data?.mensagem || error.message))
      console.error('Error fetching services:', error)
      setErrorServices(true)
    }
    return []
  }
}

// Create a new group by admin function for services if needed
const newGroupByAdminServices = (servicesArray) => {
  if (!servicesArray || servicesArray.length === 0) return []
  
  console.log('newGroupByAdminServices called with:', servicesArray.length, 'records')
  
  const adminMap = new Map()
  
  servicesArray.forEach(service => {
    // For services, adjust based on your actual data structure from the API
    const adminName = service.nome_adquirente || service.ADMINISTRADORA || 'Unknown'
    const valor = Math.abs(service.valor || service.VALOR || 0) // Use absolute value for services
    
    if (adminMap.has(adminName)) {
      adminMap.set(adminName, adminMap.get(adminName) + valor)
    } else {
      adminMap.set(adminName, valor)
    }
  })
  
  const result = []
  let id = 0
  adminMap.forEach((total, adminName) => {
    result.push({
      id: id++,
      adminName: adminName,
      total: total,
      services: []
    })
  })
  
  console.log('newGroupByAdminServices result:', result)
  return result
}

// Create a new load total function for services
const newLoadTotalServices = (servicesArray) => {
  if (!servicesArray || servicesArray.length === 0) {
    // Only reset if values are not already zero
    const currentTotal = servicesTotal;
    if (currentTotal.total !== 0) {
      setServicesTotal({ total: 0 })
    }
    return
  }
  
  console.log('newLoadTotalServices called with:', servicesArray.length, 'records')
  
  let total = 0
  
  servicesArray.forEach(service => {
    const valor = Math.abs(service.valor || service.VALOR || 0) // Use absolute value for services
    total += valor
  })
  
  const result = {
    total: total
  }
  
  console.log('newLoadTotalServices result:', result)
  
  // Only update if values actually changed
  const currentTotal = servicesTotal;
  if (currentTotal.total !== result.total) {
    console.log('Updating services total')
    setServicesTotal(result)
  } else {
    console.log('Services total unchanged, skipping update')
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// retorna array de créditos/recebimentos
const loadCredits = async (startDate, endDate) => {
  console.log('carregando créditos/recebimentos: ', startDate, ' até ', endDate)
  try {
    setErrorCredits(false)
    const apiCNPJ = localStorage.getItem('cnpj')
    const apiGroupCode = localStorage.getItem('groupCode')
    console.log('CNPJ: ', apiCNPJ, 'GRUcodigo: ', apiGroupCode)
    if((apiCNPJ === 'todos' || apiCNPJ === 'TODOS') && (apiGroupCode !== 'selecione')){
      let params = {
        dataInicial: startDate,
        dataFinal: endDate,
        codigoGrupo: apiGroupCode
      }

      let config = {
        params: params
      }

      console.log('antes da requisição (créditos/recebimentos): ', 'params: ', params, ' config: ', config )
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
      console.log('antes da requisição (créditos/recebimentos): ', 'params: ', params, ' config: ', config )
      const response = await api.get('recebimentos', config)
      setBtnDisabledCredits(false)
      return response.data
    }
  } catch (error) {
    console.log('erro creditos/recebimentos: ', error)
    setBtnDisabledCredits(false)
    if(error.code === 'ERR_CANCELED'){
      console.log('canceled')
      setErrorCredits(false)
    } else if (error.response && error.response.status === 401) {
      toast.error('Sessão Expirada')
      logout()
      return
    } else {
      console.log('not canceled')
      toast.error('Erro ao Carregar Créditos: ', error.code)
      console.error('Erro ao carregar créditos/recebimentos:', error)
      setErrorCredits(true)
    }
    return []
  }
}

// retorna array de serviços/ajustes
const loadServices = async (startDate, endDate) => {
  try {
    setErrorServices(false)
    const apiCNPJ = localStorage.getItem('cnpj')
    const apiGroupCode = localStorage.getItem('groupCode')
    if((apiCNPJ === 'todos' || apiCNPJ === 'TODOS') && (apiGroupCode !== 'selecione')){
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
    if(error.code === 'ERR_CANCELED'){
      console.log('canceled')
      setErrorServices(false)
    } else if (error.response && error.response.status === 401) {
      toast.error('Sessão Expirada')
      logout()
      return
    } else {
      console.log('not canceled')
      toast.error('Erro ao Carregar Serviços: ', error.response ? error.response.status : 'Unknown error')
      console.error('Error fetching serviços:', error)
      setErrorServices(true)
    }
    return []
  }
}

// retorna Objeto de Taxas
const loadTaxes = async () => {
  setIsLoadingTaxes(true)
  try {
    const apiClientCode = localStorage.getItem('clientCode')
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
    if (error.response && error.response.status === 401) {
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
    const apiClientCode = localStorage.getItem('clientCode')
    if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
      let body = tax
      const response = await api.post('taxas', body)
      console.log('response:', response)
    } else {
      console.log('Invalid client code:', apiClientCode)
    }
  } catch (error) {
    toast.alert('Erro ao cadastrar taxa')
    console.error('Error adding tax:', error)
    if (error.response && error.response.status === 401) {
      logout()
      return
    }
  } finally {
    toast.success('Taxa cadastrada com sucesso')
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    if (error.response && error.response.status === 401) {
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
    const apiClientCode = localStorage.getItem('clientCode')
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
    if (error.response && error.response.status === 401) {
      logout()
      return
    }
    return
  }
}

//Bancos
const [isLoadingBanks, setIsLoadingBanks] = useState(false)

// retorna array de bancos
const loadBanks = async () => {
  setIsLoadingBanks(true)
  try {
    const apiClientCode = localStorage.getItem('clientCode')
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
    if (error.response && error.response.status === 401) {
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
    const apiClientCode = localStorage.getItem('clientCode')
    if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
      let body = bank
      const response = await api.post('banco', body)
      if (response.data.success) {
        toast.dismiss()
        toast.success(response.data.mensagem)
      } else {
        toast.dismiss()
        toast.error('Erro ao adicionar Banco!')
      }
    } else {
      console.log('código do cliente inválido:', apiClientCode)
    }

  } catch (error) {
    console.error('Erro ao adicionar banco:', error)
    if (error.response && error.response.status === 401) {
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
      let body = JSON.stringify(editedBank)
      const response = await fetch('https://app.salvalucro.com.br/api/v1/banco', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: body,
      })

      const responseData = await response.json()

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
    if (error.response && error.response.status === 401) {
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
    if (error.response && error.response.status === 401) {
      logout()
      return
    }
    return
  }
}

const loadCliAdq = async () => {
  try {
    let params = {
      codigoCliente: localStorage.getItem('clientCode'),
      codigoAdquirente: localStorage.getItem('admCode')
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
    if (error.response && error.response.status === 401) {
      logout()
      return
    }
  }
}

const loadSubproducts = async () => {
  try {
    let params = {
      codigoAdquirente: localStorage.getItem('admCode')
    }

    let config = {
      params: params
    }
    const response = await api.get('Subproduto', config)
    return response.data
  } catch (error) {
    console.log(error)
    if (error.response && error.response.status === 401) {
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
    if (error.response && error.response.status === 401) {
      logout()
      return
    }
  }
}

// retorna array de modalidades e seus respectivos códigos
const loadMods = async () => {
  try {
    const response = await api.get('Modalidade')
    return response.data
  } catch (error) {
    console.log(error)
    if (error.response && error.response.status === 401) {
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
    return response.data
  } catch (error) {
    setBtnDisabledSysmo(false)
    console.log(error)
    if (error.response && error.response.status === 401) {
      logout()
      return
    }
  }
} 

// renova o access token/sessão do usuário
const refreshSession = async () => {
  if(localStorage.getItem('token')){
    
  }
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.log('No refresh token available')
      return
    }
    const response = await api.post('token/refresh/', {
      refresh_token: refreshToken
    })

    localStorage.setItem('token', response.data.acess_token)
    localStorage.setItem('refreshToken', response.data.refresh_token)

  } catch (error) {
    console.error('Error refreshing session:', error)

    if (error.response && error.response.status === 401) {
      console.log('Unauthorized: logging out')
      logout()
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

const resetDashboard = () => {
  setSalesDashboard(null)
  setCreditsDashboard(null)
  setServicesDashboard(null)

}

const [isLoadedDashboard, setIsLoadedDashboard] = useState(false) // //

const [isLoadedSalesDashboard, setIsLoadedSalesDashboard] = useState(false)
const [isLoadedCreditsDashboard, setIsLoadedCreditsDashboard] = useState(false)
const [isLoadedServicesDashboard, setIsLoadedServicesDashboard] = useState(false)

const [canceled, setCanceled] = useState(false)

// consts que guardarão os objetos referentes à cada grupo de dados no Dashboard
    const [salesDashboard, setSalesDashboard] = useState({
      sales: [],     // ->  Array com as vendas do Mês     //
      totalLast4: 0,   // ->  Total dos últimos 4 dias     //
      totalMonth: 0,   // ->  Total do mês           //
      chart: {     // ->  Dados referentes ao gráfico   //
        data: [],   // ->  Valores (por administradora)   //
        labels: []   // ->  Nomes (por administradora)     //
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
// funções que gerenciarão o carregamento dos dados referente à cada grupo de dados (vendas, créditos, serviços/ajustes)

// ---------------------------------------------------------------------------- //

// ************** //
//  >> Vendas <<  //
// ************** //

// ************** //
// >> Créditos << //
// ************** //

// ************** //
// >> Serviços << //
// ************** //


// ----------------------------------------------------------------------------- //
/*Mock Dashboard*/
const mockDashboard = 
{
    "vendas": {
        "valorTotaldias": 0.0,
        "valorTotalMes": 0.0,
        "totalAdquirentes": [
            {
                "adquirente": "Izi",
                "valor": 845.01,
                "percentual": 0.0
            },
            {
                "adquirente": "Maxiscard",
                "valor": 10661.65,
                "percentual": 0.02
            },
            {
                "adquirente": "TecBiz",
                "valor": 1551.0,
                "percentual": 0.0
            },
            {
                "adquirente": "Triocard",
                "valor": 19821.42,
                "percentual": 0.05
            },
            {
                "adquirente": "ViaSoft Pay",
                "valor": 284.01,
                "percentual": 0.0
            },
            {
                "adquirente": "Alelo",
                "valor": 898892.19,
                "percentual": 2.08
            },
            {
                "adquirente": "Verdecard",
                "valor": 30262.55,
                "percentual": 0.07
            },
            {
                "adquirente": "VR",
                "valor": 326399.44,
                "percentual": 0.76
            },
            {
                "adquirente": "Cielo",
                "valor": 28440337.57,
                "percentual": 65.88
            },
            {
                "adquirente": "Vero",
                "valor": 7448248.2,
                "percentual": 17.25
            },
            {
                "adquirente": "O2PlusCard",
                "valor": 11946.71,
                "percentual": 0.03
            },
            {
                "adquirente": "Personal Card",
                "valor": 540.66,
                "percentual": 0.0
            },
            {
                "adquirente": "Pluxee",
                "valor": 513954.53,
                "percentual": 1.19
            },
            {
                "adquirente": "Onecard",
                "valor": 669275.15,
                "percentual": 1.55
            },
            {
                "adquirente": "Valecard",
                "valor": 5375.21,
                "percentual": 0.01
            },
            {
                "adquirente": "Tricard",
                "valor": 8728.31,
                "percentual": 0.02
            },
            {
                "adquirente": "PicPay",
                "valor": 626.97,
                "percentual": 0.0
            },
            {
                "adquirente": "Facecard",
                "valor": 85434.2,
                "percentual": 0.2
            },
            {
                "adquirente": "Senff",
                "valor": 4141146.5,
                "percentual": 9.59
            },
            {
                "adquirente": "Greencard",
                "valor": 151183.95,
                "percentual": 0.35
            },
            {
                "adquirente": "Goodcard",
                "valor": 1824.03,
                "percentual": 0.0
            },
            {
                "adquirente": "Romcard",
                "valor": 815.76,
                "percentual": 0.0
            },
            {
                "adquirente": "Lecard",
                "valor": 947.03,
                "percentual": 0.0
            },
            {
                "adquirente": "Flexocard",
                "valor": 8224.92,
                "percentual": 0.02
            },
            {
                "adquirente": "Ticket",
                "valor": 383152.84,
                "percentual": 0.89
            },
            {
                "adquirente": "Cooper Card",
                "valor": 2114.66,
                "percentual": 0.0
            },
            {
                "adquirente": "Policard",
                "valor": 7357.3,
                "percentual": 0.02
            },
            {
                "adquirente": "Vegascard",
                "valor": 254.2,
                "percentual": 0.0
            }
        ]
    },
    "creditos":{
        "valorTotaldias": 0.0,
        "valorTotalMes": 0.0,
        "totalAdquirentes": [
            {
                "adquirente": "Izi",
                "valor": 845.01,
                "percentual": 0.0
            },
            {
                "adquirente": "Maxiscard",
                "valor": 10661.65,
                "percentual": 0.02
            },
            {
                "adquirente": "TecBiz",
                "valor": 1551.0,
                "percentual": 0.0
            },
            {
                "adquirente": "Triocard",
                "valor": 19821.42,
                "percentual": 0.05
            },
            {
                "adquirente": "ViaSoft Pay",
                "valor": 284.01,
                "percentual": 0.0
            },
            {
                "adquirente": "Alelo",
                "valor": 898892.19,
                "percentual": 2.08
            },
            {
                "adquirente": "Verdecard",
                "valor": 30262.55,
                "percentual": 0.07
            },
            {
                "adquirente": "VR",
                "valor": 326399.44,
                "percentual": 0.76
            },
            {
                "adquirente": "Cielo",
                "valor": 28440337.57,
                "percentual": 65.88
            },
            {
                "adquirente": "Vero",
                "valor": 7448248.2,
                "percentual": 17.25
            },
            {
                "adquirente": "O2PlusCard",
                "valor": 11946.71,
                "percentual": 0.03
            },
            {
                "adquirente": "Personal Card",
                "valor": 540.66,
                "percentual": 0.0
            },
            {
                "adquirente": "Pluxee",
                "valor": 513954.53,
                "percentual": 1.19
            },
            {
                "adquirente": "Onecard",
                "valor": 669275.15,
                "percentual": 1.55
            },
            {
                "adquirente": "Valecard",
                "valor": 5375.21,
                "percentual": 0.01
            },
            {
                "adquirente": "Tricard",
                "valor": 8728.31,
                "percentual": 0.02
            },
            {
                "adquirente": "PicPay",
                "valor": 626.97,
                "percentual": 0.0
            },
            {
                "adquirente": "Facecard",
                "valor": 85434.2,
                "percentual": 0.2
            },
            {
                "adquirente": "Senff",
                "valor": 4141146.5,
                "percentual": 9.59
            },
            {
                "adquirente": "Greencard",
                "valor": 151183.95,
                "percentual": 0.35
            },
            {
                "adquirente": "Goodcard",
                "valor": 1824.03,
                "percentual": 0.0
            },
            {
                "adquirente": "Romcard",
                "valor": 815.76,
                "percentual": 0.0
            },
            {
                "adquirente": "Lecard",
                "valor": 947.03,
                "percentual": 0.0
            },
            {
                "adquirente": "Flexocard",
                "valor": 8224.92,
                "percentual": 0.02
            },
            {
                "adquirente": "Ticket",
                "valor": 383152.84,
                "percentual": 0.89
            },
            {
                "adquirente": "Cooper Card",
                "valor": 2114.66,
                "percentual": 0.0
            },
            {
                "adquirente": "Policard",
                "valor": 7357.3,
                "percentual": 0.02
            },
            {
                "adquirente": "Vegascard",
                "valor": 254.2,
                "percentual": 0.0
            }
        ]
    },
    "ajustes":{
        "valorTotaldias": 0.0,
        "valorTotalMes": 0.0,
        "totalAdquirentes": [
            {
                "adquirente": "Izi",
                "valor": 845.01,
                "percentual": 0.0
            },
            {
                "adquirente": "Maxiscard",
                "valor": 10661.65,
                "percentual": 0.02
            },
            {
                "adquirente": "TecBiz",
                "valor": 1551.0,
                "percentual": 0.0
            },
            {
                "adquirente": "Triocard",
                "valor": 19821.42,
                "percentual": 0.05
            },
            {
                "adquirente": "ViaSoft Pay",
                "valor": 284.01,
                "percentual": 0.0
            },
            {
                "adquirente": "Alelo",
                "valor": 898892.19,
                "percentual": 2.08
            },
            {
                "adquirente": "Verdecard",
                "valor": 30262.55,
                "percentual": 0.07
            },
            {
                "adquirente": "VR",
                "valor": 326399.44,
                "percentual": 0.76
            },
            {
                "adquirente": "Cielo",
                "valor": 28440337.57,
                "percentual": 65.88
            },
            {
                "adquirente": "Vero",
                "valor": 7448248.2,
                "percentual": 17.25
            },
            {
                "adquirente": "O2PlusCard",
                "valor": 11946.71,
                "percentual": 0.03
            },
            {
                "adquirente": "Personal Card",
                "valor": 540.66,
                "percentual": 0.0
            },
            {
                "adquirente": "Pluxee",
                "valor": 513954.53,
                "percentual": 1.19
            },
            {
                "adquirente": "Onecard",
                "valor": 669275.15,
                "percentual": 1.55
            },
            {
                "adquirente": "Valecard",
                "valor": 5375.21,
                "percentual": 0.01
            },
            {
                "adquirente": "Tricard",
                "valor": 8728.31,
                "percentual": 0.02
            },
            {
                "adquirente": "PicPay",
                "valor": 626.97,
                "percentual": 0.0
            },
            {
                "adquirente": "Facecard",
                "valor": 85434.2,
                "percentual": 0.2
            },
            {
                "adquirente": "Senff",
                "valor": 4141146.5,
                "percentual": 9.59
            },
            {
                "adquirente": "Greencard",
                "valor": 151183.95,
                "percentual": 0.35
            },
            {
                "adquirente": "Goodcard",
                "valor": 1824.03,
                "percentual": 0.0
            },
            {
                "adquirente": "Romcard",
                "valor": 815.76,
                "percentual": 0.0
            },
            {
                "adquirente": "Lecard",
                "valor": 947.03,
                "percentual": 0.0
            },
            {
                "adquirente": "Flexocard",
                "valor": 8224.92,
                "percentual": 0.02
            },
            {
                "adquirente": "Ticket",
                "valor": 383152.84,
                "percentual": 0.89
            },
            {
                "adquirente": "Cooper Card",
                "valor": 2114.66,
                "percentual": 0.0
            },
            {
                "adquirente": "Policard",
                "valor": 7357.3,
                "percentual": 0.02
            },
            {
                "adquirente": "Vegascard",
                "valor": 254.2,
                "percentual": 0.0
            }
        ]
    }
}
const [dashboardData, setDashboardData] = useState([])
// função que gerencia o carregamento de tudo que será visto no Dashboard

const loadDashboard = async () => {  
  resetDashboard();
  setIsLoadedSalesDashboard(false);
  setIsLoadedCreditsDashboard(false);
  setIsLoadedServicesDashboard(false);
  setIsLoadedDashboard(false);

  const apiCNPJ = localStorage.getItem('cnpj')
  
  let dashboardData

  try {
    if (!fetchingData) {
      setFetchingData(true);
    }
    
    if((apiCNPJ !== 'todos') && (apiCNPJ !== 'TODOS') && (apiCNPJ !== 'Todos')){
      const params = {
        cnpj: apiCNPJ,
      }

      let config = {
        params,
      }
      const response = await api.get('dashboard', config)
      dashboardData = response.data
    } else if ((apiCNPJ === 'todos') || (apiCNPJ === 'TODOS') || (apiCNPJ === 'Todos')){
      const params = {
        grupo: localStorage.getItem('groupCode'),
      }

      let config = {
        params,
      }
      const response = await api.get('dashboard', config)
      dashboardData = response.data
    } else {
        const params = {
          usuario: localStorage.getItem('userID'),
        }

        let config = {
          params,
        }
        const response = await api.get('dashboard', config)
        dashboardData = response.data // Changed from response to response.data
      }
    
    // Transform API data to match the expected structure
    const transformedData = transformApiData(dashboardData);
    
    const transformAdquirentesForChart = (adquirentesArray) => {
      const labels = []
      const data = []
      
      adquirentesArray.forEach(item => {
        labels.push(item.adquirente)
        data.push(item.valor)
      })
      
      return { labels, data }
    }
    
    const vendasChartData = transformAdquirentesForChart(transformedData.vendas.totalAdquirentes); // Using transformedData
    const creditsChartData = transformAdquirentesForChart(transformedData.creditos.totalAdquirentes); // Using transformedData
    const ajustesChartData = transformAdquirentesForChart(transformedData.ajustes.totalAdquirentes); // Using transformedData
    
    const totalVendas = transformedData.vendas.totalAdquirentes.reduce((sum, item) => sum + item.valor, 0); // Using transformedData
    const totalCredits = transformedData.creditos.totalAdquirentes.reduce((sum, item) => sum + item.valor, 0); // Using transformedData
    const totalAjustes = transformedData.ajustes.totalAdquirentes.reduce((sum, item) => sum + item.valor, 0); // Using transformedData
    
    setDashboardData(transformedData); // Setting transformedData instead of raw API data
    
    setSalesDashboard({
      totalLast4: transformedData.vendas.valorTotaldias, // Using transformedData
      totalMonth: transformedData.vendas.valorTotalMes, // Using transformedData
      chart: {
        data: vendasChartData.data,
        labels: vendasChartData.labels
      },
      sales: transformedData.vendas.totalAdquirentes, // Using transformedData
      totalAdmin: totalVendas
    });
    setIsLoadedSalesDashboard(true);
    
    setCreditsDashboard({
      totalCreditsToday: transformedData.creditos.valorTotaldias, // Using transformedData
      totalCreditsNext5: transformedData.creditos.valorTotalMes, // Using transformedData
      chart: {
        data: creditsChartData.data,
        labels: creditsChartData.labels
      },
      credits: transformedData.creditos.totalAdquirentes, // Using transformedData
      totalAdmin: totalCredits
    })
    setIsLoadedCreditsDashboard(true)
    
    setServicesDashboard({
      totalServicesToday: transformedData.ajustes.valorTotaldias, // Using transformedData
      totalServicesMonth: transformedData.ajustes.valorTotalMes, // Using transformedData
      chart: {
        data: ajustesChartData.data,
        labels: ajustesChartData.labels
      },
      services: transformedData.ajustes.totalAdquirentes, // Using transformedData
      totalAdmin: totalAjustes
    })
    setIsLoadedServicesDashboard(true)
    
    setIsLoadedDashboard(true)
    setChangedOption(false)
    setFetchingData(false)
    
    return transformedData // Return transformed data
  } catch (error) {
    console.log('Error in dashboard loading:', error)
    setFetchingData(false)
    
    if (error.response && error.response.status === 401) {
      logout()
      return
    }
  }
}

// Add the transformation function (you can place it above loadDashboard or in a separate file)
function transformApiData(apiData) {
  const result = {
    vendas: {
      valorTotaldias: apiData.vendas?.valorTotaldias || 0,
      valorTotalMes: apiData.vendas?.valorTotalMes || 0,
      totalAdquirentes: []
    },
    creditos: {
      valorTotaldias: apiData.creditos?.valorTotaldias || 0,
      valorTotalMes: apiData.creditos?.valorTotalMes || 0,
      totalAdquirentes: []
    },
    ajustes: {
      valorTotaldias: apiData.ajustes?.valorTotaldias || 0,
      valorTotalMes: apiData.ajustes?.valorTotalMes || 0,
      totalAdquirentes: []
    }
  };

  // Transform vendas
  if (apiData.vendas?.resumo_Adquirentes_vendas) {
    result.vendas.totalAdquirentes = apiData.vendas.resumo_Adquirentes_vendas.map(item => ({
      adquirente: item.adquirente,
      valor: item.valor || 0,
      percentual: item.percentual || 0
    }));
  }

  // Transform creditos
  if (apiData.creditos?.resumo_Adquirentes_recebimentos) {
    result.creditos.totalAdquirentes = apiData.creditos.resumo_Adquirentes_recebimentos.map(item => ({
      adquirente: item.adquirente,
      valor: item.valor || 0,
      percentual: item.percentual || 0
    }));
  }

  // Transform ajustes
  if (apiData.ajustes?.resumo_Adquirentes_ajustes) {
    result.ajustes.totalAdquirentes = apiData.ajustes.resumo_Adquirentes_ajustes.map(item => ({
      adquirente: item.adquirente,
      valor: item.valor || 0,
      percentual: item.percentual || 0
    }));
  }

  return result;
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
const [servicesTotal, setServicesTotal] = useState(0);

// >>> Página de Taxas <<< //
const [isLoadingTaxes, setIsLoadingTaxes] = useState(false)
const [taxesPageArray, setTaxesPageArray] = useState([])

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

				let entry = separatedByAdquirente.find(adquirente => adquirente.adminName === sale.adquirente.nomeAdquirente)
				if (!entry) {
					entry = {
						id: separatedByAdquirente.length,
						adminName: sale.adquirente.nomeAdquirente,
						total: 0,
						sales: []
					}
					separatedByAdquirente.push(entry)
				}
				entry.sales.push(sale)
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

				let entry = separatedByAdquirente.find(adquirente => adquirente.adminName === sale.nome_adquirente)
				if (!entry) {
					entry = {
						id: separatedByAdquirente.length,
						adminName: sale.nome_adquirente,
						total: 0,
						sales: []
					}
					separatedByAdquirente.push(entry)
				}
				entry.sales.push(sale)
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

		setErrorSales(false)
		setErrorCredits(false)
		setErrorServices(false)

		setCanceled(false)
		setCanceledSales(false)
		setCanceledCredits(false)
		setCanceledServices(false)
		setIsSignedIn(false)
	}



	async function loadOptions() {
		try {
			let params = {
				codigo: localStorage.getItem('userID')
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
			return null
		}
	}

	function clearCookies(){
		Cookies.remove('apiKey')
		Cookies.remove('accessToken')
		Cookies.remove('id')
		Cookies.remove('accounts')
		Cookies.remove('itemID')
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
    if(!time) return ''
    
    try {
        // Remove any 'undefined' strings and split by '-'
        const cleanTime = time.replace(/undefined/g, '')
        const parts = cleanTime.split('-').filter(part => part.trim() !== '')
        
        if (parts.length >= 3) {
            return `${parts[0]}:${parts[1]}:${parts[2]}`
        } else if (parts.length === 2) {
            return `${parts[0]}:${parts[1]}`
        } else if (parts.length === 1) {
            return parts[0]
        }
        
        return time // Return original if we can't parse it
    } catch (error) {
        console.error('Error converting time:', error, time)
        return time // Return original on error
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

  const exportSales = (data) => {
    try {
      console.log('exportSales called with data type:', Array.isArray(data))
      console.log('Data length:', data?.length)
      
      if (!data || data.length === 0) {
        console.log('No data to export')
        // Only clear if not already empty
        if (salesTableData.length > 0) {
          setSalesTableData([])
        }
        return
      }
      
      console.log('First item in exportSales:', data[0])
      console.log('First item keys:', Object.keys(data[0]))
      
      // Check if data is from new API (has uppercase fields like CNPJ, ADMINISTRADORA)
      const isNewApiData = data[0] && data[0].CNPJ !== undefined
      
      let transformedData = []
      
      if (isNewApiData) {
        console.log('Detected NEW API data structure in exportSales - transforming...')
        
        // Transform new API data to match expected export structure
        transformedData = data.map((item, index) => {
          // Safely extract values with fallbacks
          const cnpj = item.CNPJ || ''
          const razaosocial = item.RAZAOSOCIAL || ''
          const administradora = item.ADMINISTRADORA || ''
          const bandeira = item.BANDEIRA || ''
          const produto = (item.PRODUTO || '').trim()
          const modalidade = item.MODALIDADE || ''
          const valorBruto = item.VALORBRUTO || 0
          const valorLiquido = item.VALORLIQUIDO || 0
          const taxa = item.TAXA || 0
          const desconto = item.DESCONTO || 0
          const cartao = item.CARTAO || ''
          const nsu = item.NSU || ''
          const dataVenda = item.DATAVENDA || ''
          const horaVenda = item.HORAVENDA || ''
          const dataCredito = item.DATACREDITO || ''
          const codigoAutorizacao = item.AUTORIZACAO || ''
          const parcela = item.PARCELA || '0'
          const status = item.STATUS || ''
          const numeroPV = item.NUMEROPV || ''
          const ro = item.RO || ''
          
          return {
            // Basic fields
            cnpj: cnpj,
            razaosocial: razaosocial,
            numeroPV: numeroPV,
            
            // Nested objects to maintain compatibility with existing components
            adquirente: {
              codigoAdquirente: null,
              nomeAdquirente: administradora
            },
            produto: {
              codigoProduto: null,
              descricaoProduto: produto
            },
            bandeira: {
              codigoBandeira: null,
              descricaoBandeira: bandeira
            },
            modalidade: {
              codigoModalidade: null,
              descricaoModalidade: modalidade
            },
            
            // Financial fields
            valorBruto: valorBruto,
            valorLiquido: valorLiquido,
            valorDesconto: desconto,
            taxa: taxa,
            
            // Date fields
            dataVenda: dataVenda,
            dataCredito: dataCredito,
            horaVenda: horaVenda,
            
            // Other fields
            nsu: nsu,
            cartao: cartao,
            codigoAutorizacao: codigoAutorizacao,
            quantidadeParcelas: parseInt(parcela) || 0,
            status: status,
            ro: ro
          }
        })
        
        console.log('Transformed NEW data for export:', transformedData.length, 'records')
        
      } else {
        console.log('Detected OLD API data structure in exportSales - using as is')
        
        // For old API data, ensure it has the required structure
        transformedData = data.map((item, index) => ({
          ...item,
          adquirente: item.adquirente || { codigoAdquirente: null, nomeAdquirente: '' },
          produto: item.produto || { codigoProduto: null, descricaoProduto: '' },
          bandeira: item.bandeira || { codigoBandeira: null, descricaoBandeira: '' },
          modalidade: item.modalidade || { codigoModalidade: null, descricaoModalidade: '' },
          valorDesconto: item.valorDesconto || 0,
          quantidadeParcelas: item.quantidadeParcelas || 0
        }))
      }
      
      // Compare with current salesTableData to prevent unnecessary updates
      const currentData = salesTableData
      const isDataSame = JSON.stringify(currentData) === JSON.stringify(transformedData)
      
      if (!isDataSame) {
        console.log('Data changed, updating salesTableData')
        setSalesTableData(transformedData)
      } else {
        console.log('Data unchanged, skipping update')
      }
      
    } catch (error) {
      console.error('Error in exportSales:', error)
      console.error('Error stack:', error.stack)
      if (salesTableData.length > 0) {
        setSalesTableData([])
      }
    }
  }

const exportCredits = (data) => {
  if (!data || data.length === 0) {
    console.log('No credits data to export')
    return []
  }

  console.log('Exporting credits data:', data.length, 'records')
  console.log('Sample data structure:', data[0])

  // Transform the data for export - using flat structure
  const transformedData = data.map(item => {
    return {
      cnpj: item.CNPJ || '',
      adquirente: item.ADMINISTRADORA || '',
      bandeira: item.BANDEIRA || '',
      produto: (item.PRODUTO || "").trim(),
      modalidade: item.MODALIDADE || '',
      dataCredito: item.DATACREDITO || '',
      dataVenda: item.DATAVENDA || '',
      valorBruto: item.VALORBRUTO || 0,
      valorLiquido: item.VALORLIQUIDO || 0,
      taxa: item.TAXA || 0,
      valorDesconto: item.DESCONTO || 0,
      banco: item.BANCO || '',
      agencia: item.AGENCIA || '',
      conta: item.CONTA || '',
      nsu: item.NSU || '',
      codigoAutorizacao: item.AUTORIZACAO || '',
      parcela: item.PARCELA || '',
      quantidadeParcelas: item.TOTALPARCELA || '',
      cartao: item.CARTAO || '',
      status: item.STATUS || '',
      numeroPV: item.NUMEROPV || '',
      ro: item.RO || '',
      razaoSocial: item.RAZAOSOCIAL || ''
    }
  })

  console.log('Transformed data for export:', transformedData.length, 'records')
  
  // Store in localStorage for the GerarRelatorio component to use
  localStorage.setItem('creditsTableData', JSON.stringify(transformedData))
  
  // If you have a state setter for creditsTableData, use it
  if (typeof setCreditsTableData === 'function') {
    setCreditsTableData(transformedData)
  }
  
  return transformedData
}

	function exportServices(array){
		servicesTableData.length = 0
		if(array.length === 0){
			return
		}
		servicesTableData.length = 0
		setServicesTableData([])
		let arrayTemp = []
		if (array.length > 0) {
			array.map((venda) => {
				arrayTemp.push({
					cnpj: venda.cnpj,
					razao_social: venda.razao_social,
					codigo_estabelecimento: venda.codigo_estabelecimento,
					adquirente: venda.nome_adquirente,
					valor: venda.valor,
					data: venda.data,
					descricao: venda.descricao,
				})
			})
			setServicesTableData(arrayTemp)
		}
		return servicesTableData
	}

	function exportTaxes(array){
		taxesTableData.length = 0
		setTaxesTableData([])
		let arrayTemp = []
		if (array.length > 0){
			array.map((taxa) => {
				arrayTemp.push({
					adquirente: taxa.adquirente,
					bandeira: taxa.bandeira,
					produto: taxa.produto,
					modalidade: taxa.modalidade,
					taxaPenultimoMes: taxa.taxaMedia.PenultimoMes,
					taxaUltimoMes: taxa.taxaMediaUltimoMes,
					taxaCadastrada: taxa.taxaCadastrada,
					comparativo: taxa.comparativo,
				})
			})
		}
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

	// FIXED: Memoized context value to prevent unnecessary re-renders
	const contextValue = useMemo(() => ({
		alerta,
		isSignedIn, setIsSignedIn,
		logout,
		accessToken, setAccessToken,
		refreshSession,

		//Usuário //
		loadUser, updateUser,
		userImg, setUserImg,

		// Dashboard //
		
		loadDashboard, isLoadedDashboard, setIsLoadedDashboard,
		salesDashboard, isLoadedSalesDashboard, setIsLoadedSalesDashboard,
		creditsDashboard, isLoadedCreditsDashboard, setIsLoadedCreditsDashboard,
		servicesDashboard, isLoadedServicesDashboard, setIsLoadedServicesDashboard,
		canceledSales, setCanceledSales,
		canceledCredits, setCanceledCredits,
		canceledServices, setCanceledServices,
		
		// Vendas //

		loadSales, loadTotalSales, newLoadSales, newLoadTotalSales,
		salesDateRange, setSalesDateRange,
		salesPageArray, setSalesPageArray,
		salesPageAdminArray, setSalesPageAdminArray,
		salesTotal, setSalesTotal,
		btnDisabledSales, setBtnDisabledSales,
		salesTableData, setSalesTableData,
		exportSales, errorSales,

		// Creditos //

		loadCredits, loadTotalCredits, newLoadCredits, newGroupByAdminCredits, newLoadTotalCredits,
		creditsPageArray, setCreditsPageArray,
		creditsPageAdminArray, setCreditsPageAdminArray,
		creditsDateRange, setCreditsDateRange,
		creditsTotal, setCreditsTotal,
		btnDisabledCredits, setBtnDisabledCredits,
		creditsTableData, setCreditsTableData,
		exportCredits, errorCredits,

		// Serviços //

		loadServices, newLoadServices, newGroupByAdminServices, newLoadTotalServices,
		servicesPageArray, setServicesPageArray,
		servicesPageAdminArray, setServicesPageAdminArray,
		servicesDateRange, setServicesDateRange,
		btnDisabledServices, setBtnDisabledServices,
		servicesTableData, setServicesTableData,
		exportServices, errorServices,

		// Taxas

		loadTaxes, isLoadingTaxes, setIsLoadingTaxes,
		addTax, editTax, deleteTax,
		taxesTableData, setTaxesTableData, exportTaxes,
		taxesPageArray, setTaxesPageArray,

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
		groupByAdmin, newGroupByAdmin, groupServicesByAdmin,
		exportName, setExportName,
		isCheckedCalendar, setIsCheckedCalendar,
		converteData, dateConvert, dateConvertSearch, dateConvertYYYYMMDD,

		fetchingData, setFetchingData,

		groupsList, clientsList,
		loadGroupsList, setGroupsList,
		displayClient, displayGroup,
		setDisplayGroup, setDisplayClient,

		changedOption, setChangedOption,
		canceled, setCanceled,

		resetAppValues,

		clientUserId,
	}), [
		// List all dependencies that should trigger context updates
		isSignedIn, accessToken, userImg, salesTableData, creditsTableData, servicesTableData, taxesTableData,
		exportName, isCheckedCalendar, changedOption, errorSales, errorCredits, errorServices, fetchingData,
		displayGroup, displayClient, canceledSales, canceledCredits, canceledServices, groupsList, clientsList,
		btnDisabledSales, btnDisabledCredits, btnDisabledServices, btnDisabledSysmo, isLoadingTaxes, isLoadingBanks,
		isLoadedDashboard, isLoadedSalesDashboard, isLoadedCreditsDashboard, isLoadedServicesDashboard, canceled,
		salesDashboard, creditsDashboard, servicesDashboard, chartSales, chartCredits, chartServices,
		salesPageArray, salesPageAdminArray, salesTotal, salesDateRange,
		creditsPageArray, creditsPageAdminArray, creditsTotal, creditsDateRange,
		servicesPageArray, servicesPageAdminArray, servicesDateRange, servicesTotal,
		taxesPageArray,
		logout, updateUser // Add the memoized functions
	])

	return(
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider