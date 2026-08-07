/* eslint-disable react/prop-types */
/* eslint-disable default-case */
import { React, createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPreferences } from '../hooks/useUserPreferences/useUserPreferences'
import Cookies from 'js-cookie'
import api, { cancelOngoingRequests } from '../services/api'

import md5 from 'md5'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jwtDecode from 'jwt-decode'
import defaultImg from '../assets/LOGO AZUL.png'
import { imageToBase64 } from '../components/utils/base64'

//imagens de Logo
import salvalucro from '../assets/LogoTopo.png'
import sifra from '../assets/logoSifra.png'
import MG from '../assets/logoMG transparente.png'
import superjur from '../assets/logoSuperjur outline.png'
import carddigital from '../assets/logoCardDigital outline.png'
import SPECIAL from '../assets/PLACEHOLDER.png'

import _ from 'lodash'

import { getIconPathByCode, DEFAULT_ICON_PATH, ICON_MAP } from '../util/iconRegistry'
// ===== IMPORT DO TENANT =====
import { getCurrentTenant, getLogoByContext, getTenantFromURL } from '../util/tenant'

export const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [accessToken, setAccessToken] = useState(undefined)
  const [clientUserId, setClientUserId] = useState()
  const [userImg, setUserImg] = useState('')
  
  // ===== SINGLE SOURCE OF TRUTH FOR THEME =====
  const [theme, setTheme] = useState(false)
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)
  const [userPreferences, setUserPreferences] = useState(null)

  // ===== USER PREFERENCES HOOK =====
  const {
    loadUserPrefs,
    saveUserPrefs,
    getOrCreatePreferences,
    createDefaultPreferences,
  } = useUserPreferences()

  // ===== LOGO STATE =====
  const initialTenant = getTenantFromURL();
  const [currentLogo, setCurrentLogo] = useState(initialTenant?.logo || salvalucro)
  const [currentContext, setCurrentContext] = useState(initialTenant?.contextKey || 'SL')

  // ===== APPLY THEME TO DOM =====
  const applyTheme = useCallback((themeValue) => {
    const isDark = themeValue === true || themeValue === 'true'
    setTheme(isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    
    // Store for initial page load only (to prevent flash)
    localStorage.setItem('appTheme', isDark ? 'dark' : 'light')
  }, [])

  // ===== APPLY CONTEXT TO DOM =====
  const applyContext = useCallback((context) => {
    const contextKey = context || 'salvalucro'
    setCurrentContext(contextKey)
    document.documentElement.setAttribute('data-context', contextKey)
    localStorage.setItem('appContext', contextKey)
  }, [])

  // ===== LOAD USER PREFERENCES FROM DATABASE =====
  const loadUserPreferences = useCallback(async (userId) => {
    if (!userId) {
      console.warn('No userId provided to loadUserPreferences')
      return null
    }

    try {
      const preferences = await loadUserPrefs()
      
      if (preferences) {
        setUserPreferences(preferences)
        
        // Apply theme from database
        const themeValue = preferences.TEMA === true || preferences.TEMA === 'true'
        applyTheme(themeValue)
        
        // Apply context from database
        const context = preferences.ESQUEMACORES || 'salvalucro'
        applyContext(context)
        
        // Apply icon if exists
        if (preferences.ICONE) {
          const iconPath = getIconPathByCode(preferences.ICONE)
          if (iconPath) {
            setUserImg(iconPath)
          }
          localStorage.setItem('userIconCode', preferences.ICONE)
        }
        
        return preferences
      }
      
      // No preferences found - create defaults
      const newPrefs = await createDefaultPreferences(userId)
      if (newPrefs) {
        setUserPreferences(newPrefs)
        applyTheme(false)
        applyContext('salvalucro')
        return newPrefs
      }
      
      return null
      
    } catch (error) {
      console.error('❌ Error loading user preferences from API:', error)
      return null
    }
  }, [loadUserPrefs, createDefaultPreferences, applyTheme, applyContext])

  // ===== TOGGLE THEME =====
  const toggleTheme = useCallback(async () => {
    const newTheme = !theme
    const userId = localStorage.getItem('userID')
    const token = localStorage.getItem('token')
    
    // For non-logged in users, just toggle locally
    if (!userId || !token) {
      applyTheme(newTheme)
      return
    }

    try {
      // Get current preferences or create new ones
      let currentPrefs = userPreferences
      
      if (!currentPrefs) {
        currentPrefs = await loadUserPreferences(userId)
        if (!currentPrefs) {
          // If still no preferences, create default
          currentPrefs = await createDefaultPreferences(userId)
        }
      }

      const now = new Date().toISOString().split('T')[0]
      
      // Build update payload
      const payload = {
        USUCODIGO: parseInt(userId),
        TEMA: newTheme,
        ICONE: currentPrefs?.ICONE || 1,
        ESQUEMACORES: currentPrefs?.ESQUEMACORES || 'salvalucro',
        USUARIOMODIFICACAO: parseInt(userId),
        DATAMODIFICACAO: now,
        USUARIOINSERCAO: parseInt(userId),
        DATAINSERCAO: currentPrefs?.DATAINSERCAO || now,
        ATIVO: true
      }

      if (currentPrefs?.CODIGO) {
        payload.CODIGO = currentPrefs.CODIGO
        await api.put('PreferenciasUsuario', payload)
      } else {
        await api.post('PreferenciasUsuario', payload)
      }

      // Update local state
      applyTheme(newTheme)
      
      // Update userPreferences state
      setUserPreferences(prev => ({
        ...prev,
        TEMA: newTheme
      }))

      // Update user data for components that still use it
      const userData = JSON.parse(localStorage.getItem('user'))
      if (userData) {
        userData.TEMA = newTheme
        localStorage.setItem('user', JSON.stringify(userData))
      }

      //toast.success(`Tema alterado para ${newTheme ? 'escuro' : 'claro'}`)

    } catch (error) {
      console.error('Failed to save theme:', error)
      toast.error('Erro ao salvar preferência de tema')
      // Revert on error
      applyTheme(theme)
    }
  }, [theme, userPreferences, loadUserPreferences, createDefaultPreferences, applyTheme])

  // ===== LOAD LOGO FROM TENANT =====
  const loadLogoFromTenant = useCallback(() => {
    const urlTenant = getTenantFromURL();
    
    if (urlTenant && urlTenant.logo) {
      setCurrentLogo(urlTenant.logo);
      setCurrentContext(urlTenant.contextKey);
      document.documentElement.setAttribute('data-context', urlTenant.contextKey);
      localStorage.setItem('selectedContext', urlTenant.contextKey);
      return;
    }
    
    const savedContext = localStorage.getItem('selectedContext') || 'SL';
    const logo = getLogoByContext(savedContext);
    if (logo) {
      setCurrentLogo(logo);
      setCurrentContext(savedContext);
      document.documentElement.setAttribute('data-context', savedContext);
    } else {
      setCurrentLogo(salvalucro);
      setCurrentContext('SL');
      document.documentElement.setAttribute('data-context', 'SL');
    }
  }, []);

  // ===== INITIALIZE THEME ON APP START =====
  useEffect(() => {
    const initializeTheme = async () => {
      const userId = localStorage.getItem('userID')
      const token = localStorage.getItem('token')
      
      if (userId && token) {
        await loadUserPreferences(userId)
      } else {
        // Not logged in - use light theme
        applyTheme(false)
        applyContext('salvalucro')
      }
      setIsThemeLoaded(true)
    }
    
    initializeTheme()
  }, [loadUserPreferences, applyTheme, applyContext])

  // ===== LOAD TENANT ON INIT =====
  useEffect(() => {
    loadLogoFromTenant();
  }, [loadLogoFromTenant]);

  // ===== LISTEN FOR URL CHANGES (tenant navigation) =====
  useEffect(() => {
    const handleUrlChange = () => {
      const urlTenant = getTenantFromURL();
      if (urlTenant && urlTenant.logo && urlTenant.contextKey !== currentContext) {
        setCurrentLogo(urlTenant.logo);
        setCurrentContext(urlTenant.contextKey);
        document.documentElement.setAttribute('data-context', urlTenant.contextKey);
        localStorage.setItem('selectedContext', urlTenant.contextKey);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [currentContext]);

  // ===== SAVE CONTEXT TO STORAGE =====
  useEffect(() => {
    if (currentContext) {
      localStorage.setItem('appContext', currentContext)
    }
  }, [currentContext])

  // ===== NAVIGATE =====
  const navigate = useNavigate()

  // ===== STATE VARIABLES =====
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

  const [groupsList, setGroupsList] = useState([])
  const [clientsList, setClientsList] = useState([])

  const [btnDisabledSales, setBtnDisabledSales] = useState(false)
  const [btnDisabledCredits, setBtnDisabledCredits] = useState(false)
  const [btnDisabledServices, setBtnDisabledServices] = useState(false)
  const [btnDisabledSysmo, setBtnDisabledSysmo] = useState(false)

  const [isLoadingTaxes, setIsLoadingTaxes] = useState(false)
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)

  // ===== DASHBOARD STATES =====
  const [isLoadedDashboard, setIsLoadedDashboard] = useState(false)
  const [isLoadedSalesDashboard, setIsLoadedSalesDashboard] = useState(false)
  const [isLoadedCreditsDashboard, setIsLoadedCreditsDashboard] = useState(false)
  const [isLoadedServicesDashboard, setIsLoadedServicesDashboard] = useState(false)
  const [canceled, setCanceled] = useState(false)

  const [salesDashboard, setSalesDashboard] = useState({
    sales: [],
    totalLast4: 0,
    totalMonth: 0,
    chart: {
      data: [],
      labels: []
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

  // ===== SALES PAGE STATES =====
  const [salesPageArray, setSalesPageArray] = useState([])
  const [salesPageAdminArray, setSalesPageAdminArray] = useState([])
  const [salesTotal, setSalesTotal] = useState({
    debit: 0,
    credit: 0,
    voucher: 0,
    total: 0,
  })
  const [salesDateRange, setSalesDateRange] = useState([new Date(), new Date()])

  // ===== CREDITS PAGE STATES =====
  const [creditsPageArray, setCreditsPageArray] = useState([])
  const [creditsPageAdminArray, setCreditsPageAdminArray] = useState([])
  const [creditsTotal, setCreditsTotal] = useState({
    debit: 0,
    credit: 0,
    voucher: 0,
    total: 0,
  })
  const [creditsDateRange, setCreditsDateRange] = useState([new Date(), new Date()])

  // ===== SERVICES PAGE STATES =====
  const [servicesPageArray, setServicesPageArray] = useState([])
  const [servicesPageAdminArray, setServicesPageAdminArray] = useState([])
  const [servicesDateRange, setServicesDateRange] = useState([new Date(), new Date()])
  const [servicesTotal, setServicesTotal] = useState({ total: 0 })

  // ===== TAXES PAGE STATES =====
  const [taxesPageArray, setTaxesPageArray] = useState([])

  // ===== GET LOCAL JOYRIDE =====
  const getLocalJoyRide = () => {
    return JSON.parse(localStorage.getItem('joyride'))
  }

  const setLocalJoyride = (item) => {
    localStorage.setItem(JSON.stringify(item), 'joyride')
  }

  // ===== LOGIN FUNCTION =====
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
        setClientUserId(userId)
        let user
        try {
          user = await loadUser(userId)
          localStorage.setItem('user', JSON.stringify(user))
        } catch (error) {
          console.log(error)
        }

        // ===== LOAD PREFERENCES FROM API =====
        await loadUserPreferences(userId)

        // ===== DETERMINE CONTEXT - PRIORITIZE URL TENANT =====
        const urlTenant = getTenantFromURL();
        let context = urlTenant?.contextKey || 'SL';
        let logo = urlTenant?.logo || salvalucro;
        
        if (!urlTenant) {
          context = userPreferences?.ESQUEMACORES || user?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro';
          logo = getLogoByContext(context) || salvalucro;
        }

        // ===== APPLY EVERYTHING TO DOM AND STORAGE =====
        applyContext(context)
        localStorage.setItem('selectedContext', context)
        
        if (logo) {
          setCurrentLogo(logo)
        } else {
          setCurrentLogo(salvalucro)
        }

        // ===== UPDATE USER IF NEEDED =====
        const handleUpdateUser = async () => {
          try {
            if (user.TEMA === undefined || user.TEMA === null) {
              user.TEMA = false
              await updateUser(user)
              localStorage.setItem('user', JSON.stringify(user))
            }
          } catch (error) {
            console.log(error)
          }
        }

        if (user.TEMA === undefined || user.TEMA === null) {
          await handleUpdateUser()
        }

        // ===== SAVE USER DATA =====
        const userData = { NOME: user.NOME, EMAIL: user.EMAIL }
        localStorage.setItem('GRUCODIGO', user.GRUCODIGO)
        localStorage.setItem('isSignedIn', true)
        localStorage.setItem('userData', JSON.stringify(userData))

        // ===== LOGIN LOG =====
        try {
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
          }
          
          await loginLog()
        } catch (error) {
          console.log(error)
        }

        // ===== PLUGGY AUTH =====
        try {
          const response = await fetch('https://api.pluggy.ai/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientId: "7cee8f27-cbfa-4a19-b14d-306f9656787a",
              clientSecret: "01e4edaf-639a-40ae-945a-4a04ab652bad",
              itemOptions: {
                clientUserId: userId
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

          Cookies.set('pluggy_client_id', userId, {
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
        } catch (error) {
          console.error('Pluggy auth failed:', error)
          Cookies.remove('pluggy_api_key')
          Cookies.remove('pluggy_client_id')
        }

        // ===== LOAD OPTIONS AND GROUPS =====
        const opt = await loadOptions()
        localStorage.setItem('options', JSON.stringify(opt))
        
        const gru = await loadGroupsList()
        localStorage.setItem('groupsStorage', JSON.stringify(gru))
        localStorage.setItem('groupCode', gru[0].CODIGOGRUPO)
        localStorage.setItem('cnpj', 'todos')
        
        setIsSignedIn(true)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Erro ao fazer login')
    }
  }

  // ===== LOAD USER =====
  const loadUser = async (userId) => {
    let params = { codigo: userId }
    let config = { params: params }
    
    let userData = null
    try {
      const response = await api.get('usuario', config)
      userData = response.data
    } catch (error) {
      console.error('Error loading user:', error)
      throw error
    }

    try {
      const prefsResponse = await api.get('PreferenciasUsuario', {
        params: { codigo: userId }
      })
      const preferences = prefsResponse.data
      
      if (preferences && preferences.ICONE) {
        const iconPath = getIconPathByCode(preferences.ICONE)
        if (iconPath) {
          setUserImg(iconPath)
          localStorage.setItem('userIconCode', preferences.ICONE)
        }
      }
    } catch (error) {
      console.log('No preferences found or error loading icon:', error)
    }

    return userData
  }

  // ===== LOGOUT =====
  const logout = useCallback(() => {
    clearCookies()
    localStorage.clear()
    cancelOngoingRequests()
    resetAppValues()
    localStorage.removeItem('isSignedIn')
    localStorage.removeItem('selectedContext')
    sessionStorage.removeItem('currentPath')
    localStorage.setItem('isSignedIn', false)
    applyTheme(false)
    applyContext('salvalucro')
    setIsSignedIn(false)
    navigate('/')
  }, [navigate, applyTheme, applyContext])

  // ===== UPDATE USER =====
  const updateUser = useCallback(async (userObj) => {
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
      
      if (responseData && responseData.CODIGO) {
        localStorage.setItem('user', JSON.stringify(responseData))
      }
      
      return responseData
    } catch (error) {
      toast.dismiss()
      toast.error('Erro ao atualizar usuário!')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    }
  }, [logout])

  // ===== LOAD GROUPS LIST =====
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
      throw new Error(error.message)
    }
  }

  // ===== API FUNCTIONS =====

  // Format date to YYYY-MM-DD
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

  // ===== LOAD SALES =====
  const newLoadSales = async (startDate, endDate, additionalFilters = {}) => {
    try {
      setErrorSales(false)
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate)
      const formattedEndDate = formatDateToYYYYMMDD(endDate)
          
      const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
      const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
      const selectedBan = JSON.parse(localStorage.getItem('selectedBan'))
      const selectedAdm = JSON.parse(localStorage.getItem('selectedAdm'))
      
      localStorage.setItem('dataInicial', formattedStartDate)
      localStorage.setItem('dataFinal', formattedEndDate)
      
      let clientesString = "";
      
      if (cliente && cliente.label === 'TODOS') {
        const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || [];
        clientesString = clientCodes.join(', ');
      } else if (cliente && cliente.cod) {
        clientesString = String(cliente.cod);
      } else if (cliente && cliente.value) {
        clientesString = String(cliente.value);
      } else {
        const apiCNPJ = localStorage.getItem('cnpj')
        const apiGroupCode = localStorage.getItem('groupCode')
        clientesString = apiCNPJ === 'todos' ? String(apiGroupCode) : String(apiCNPJ)
      }
      
      const bandeira = selectedBan?.value || additionalFilters.bandeira || "";
      const adquirente = selectedAdm?.value || additionalFilters.adquirente || "";
      const nomeGrupo = grupo?.label || localStorage.getItem('clientName') || "";
      
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

      const response = await api.post('relatorios/detalhado', requestObject)
      
      setBtnDisabledSales(false)
      
      if (response.data.success === true && response.data.dados && response.data.dados.length > 0) {
        return response.data.dados
      } else if (response.data.success === true && (!response.data.dados || response.data.dados.length === 0)) {
        toast.info(response.data.mensagem || "Nenhum dado encontrado para o período selecionado")
        return []
      } else {
        toast.error(response.data.mensagem || "Erro ao carregar dados")
        return []
      }
      
    } catch (error) {
      console.error('Error in newLoadSales:', error)
      setBtnDisabledSales(false)
      
      if (error.code === 'ERR_CANCELED') {
        setErrorSales(false)
      } else if (error.response && error.response.status === 401) {
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

  // ===== LOAD CREDITS =====
  const newLoadCredits = async (startDate, endDate, additionalFilters = {}) => {
    try {
      setErrorCredits(false)
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate)
      const formattedEndDate = formatDateToYYYYMMDD(endDate)
          
      const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
      const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
      const selectedBan = JSON.parse(localStorage.getItem('selectedBanCredits'))
      const selectedAdm = JSON.parse(localStorage.getItem('selectedAdmCredits'))
      
      localStorage.setItem('dataInicial', formattedStartDate)
      localStorage.setItem('dataFinal', formattedEndDate)
      
      let clientesString = "";
      
      if (cliente && cliente.label === 'TODOS') {
        const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || [];
        clientesString = clientCodes.join(', ');
      } else if (cliente && cliente.cod) {
        clientesString = String(cliente.cod);
      } else if (cliente && cliente.value) {
        clientesString = String(cliente.value);
      } else {
        const apiCNPJ = localStorage.getItem('cnpj')
        const apiGroupCode = localStorage.getItem('groupCode')
        clientesString = apiCNPJ === 'todos' ? String(apiGroupCode) : String(apiCNPJ)
      }
      
      const bandeira = selectedBan?.codigoBandeira || additionalFilters.bandeira || "";
      const adquirente = selectedAdm?.codigoAdquirente || additionalFilters.adquirente || "";
      const nomeGrupo = grupo?.label || localStorage.getItem('clientName') || "";
      
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
        modelo: "RECEBIMENTO"
      }
          
      const response = await api.post('relatorios/detalhado', requestObject)
      
      setBtnDisabledCredits(false)
      
      if (response.data.success === true && response.data.dados && response.data.dados.length > 0) {
        return response.data.dados
      } else if (response.data.success === true && (!response.data.dados || response.data.dados.length === 0)) {
        toast.info(response.data.mensagem || "Nenhum dado encontrado para o período selecionado")
        return []
      } else {
        toast.error(response.data.mensagem || "Erro ao carregar dados de créditos")
        return []
      }
      
    } catch (error) {
      console.error('Error in newLoadCredits:', error)
      setBtnDisabledCredits(false)
      
      if (error.code === 'ERR_CANCELED') {
        setErrorCredits(false)
      } else if (error.response && error.response.status === 401) {
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

  // ===== LOAD SERVICES =====
  const newLoadServices = async (startDate, endDate, additionalFilters = {}) => {
    try {
      setErrorServices(false)
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate)
      const formattedEndDate = formatDateToYYYYMMDD(endDate)
          
      const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
      const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
      const selectedBan = JSON.parse(localStorage.getItem('selectedBanServices'))
      const selectedAdm = JSON.parse(localStorage.getItem('selectedAdmServices'))
      
      localStorage.setItem('dataInicial', formattedStartDate)
      localStorage.setItem('dataFinal', formattedEndDate)
      
      let clientesString = "";
      
      if (cliente && cliente.label === 'TODOS') {
        const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || [];
        clientesString = clientCodes.join(', ');
      } else if (cliente && cliente.cod) {
        clientesString = String(cliente.cod);
      } else if (cliente && cliente.value) {
        clientesString = String(cliente.value);
      } else {
        const apiCNPJ = localStorage.getItem('cnpj')
        const apiGroupCode = localStorage.getItem('groupCode')
        clientesString = apiCNPJ === 'todos' ? String(apiGroupCode) : String(apiCNPJ)
      }
      
      const bandeira = selectedBan?.codigoBandeira || additionalFilters.bandeira || "";
      const adquirente = selectedAdm?.codigoAdquirente || additionalFilters.adquirente || "";
      const nomeGrupo = grupo?.label || localStorage.getItem('clientName') || "";
      
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
        modelo: "AJUSTES"
      }
      
      const response = await api.post('relatorios/detalhado', requestObject)
      
      setBtnDisabledServices(false)
      
      if (response.data.success === true && response.data.dados && response.data.dados.length > 0) {
        localStorage.setItem('servicesData', JSON.stringify(response.data.dados))
        return response.data.dados
      } else if (response.data.success === true && (!response.data.dados || response.data.dados.length === 0)) {
        toast.info(response.data.mensagem || "Nenhum serviço/ajuste encontrado para o período selecionado")
        return []
      } else {
        toast.error(response.data.mensagem || "Erro ao carregar dados de serviços/ajustes")
        return []
      }
      
    } catch (error) {
      console.error('Error in newLoadServices:', error)
      setBtnDisabledServices(false)
      
      if (error.code === 'ERR_CANCELED') {
        setErrorServices(false)
      } else if (error.response && error.response.status === 401) {
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

  // ===== LOAD TOTAL SALES =====
  const newLoadTotalSales = (salesArray) => {
    if (!salesArray || salesArray.length === 0) {
      const currentTotal = salesTotal;
      if (currentTotal.debit !== 0 || currentTotal.credit !== 0 || currentTotal.voucher !== 0 || currentTotal.total !== 0) {
        setSalesTotal({ debit: 0, credit: 0, voucher: 0, total: 0 })
      }
      return
    }
      
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
      
    const currentTotal = salesTotal;
    if (currentTotal.debit !== result.debit ||
        currentTotal.credit !== result.credit ||
        currentTotal.voucher !== result.voucher ||
        currentTotal.total !== result.total) {
      setSalesTotal(result)
    }
  }

  // ===== LOAD TOTAL CREDITS =====
  const newLoadTotalCredits = (creditsArray) => {
    if (!creditsArray || creditsArray.length === 0) {
      setCreditsTotal({ debit: 0, credit: 0, voucher: 0, total: 0 })
      return
    }
      
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
    
    setCreditsTotal(result)
  }

  // ===== LOAD TOTAL SERVICES =====
  const newLoadTotalServices = (servicesArray) => {
    if (!servicesArray || servicesArray.length === 0) {
      const currentTotal = servicesTotal;
      if (currentTotal.total !== 0) {
        setServicesTotal({ total: 0 })
      }
      return { total: 0 }
    }
      
    let total = 0
    
    servicesArray.forEach(service => {
      let valor = 0
      
      if (service.valor !== undefined && service.valor !== null) {
        valor = Math.abs(Number(service.valor))
      } else if (service.VALOR !== undefined && service.VALOR !== null) {
        valor = Math.abs(Number(service.VALOR))
      } else if (service.valorLiquido !== undefined && service.valorLiquido !== null) {
        valor = Math.abs(Number(service.valorLiquido))
      } else if (service.VALORLIQUIDO !== undefined && service.VALORLIQUIDO !== null) {
        valor = Math.abs(Number(service.VALORLIQUIDO))
      }
      
      if (isNaN(valor)) {
        valor = 0
      }
      
      total += valor
    })
    
    if (isNaN(total)) {
      total = 0
    }
    
    const result = { total: total }
      
    const currentTotal = servicesTotal;
    if (currentTotal.total !== result.total) {
      setServicesTotal(result)
    }
    
    return result
  }

  // ===== GROUP BY ADMIN =====
  const newGroupByAdmin = (salesArray) => {
    if (!salesArray || salesArray.length === 0) return []
      
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
    
    return result
  }

  // ===== GROUP BY ADMIN CREDITS =====
  const newGroupByAdminCredits = (creditsArray) => {
    if (!creditsArray || creditsArray.length === 0) return []
      
    const adminMap = new Map()
    
    creditsArray.forEach(credit => {
      const adminName = credit.ADMINISTRADORA || 'Unknown'
      const total = Number(credit.VALORLIQUIDO) || 0
      
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
    
    return result
  }

  // ===== GROUP BY ADMIN SERVICES =====
  const newGroupByAdminServices = (servicesArray) => {
    if (!servicesArray || servicesArray.length === 0) return []
      
    const adminMap = new Map()
    
    servicesArray.forEach(service => {
      if (!service) return
      
      const adminName = service.nome_adquirente || 
                       service.ADMINISTRADORA || 
                       service.adquirente || 
                       'Unknown'
      
      let valor = 0
      if (service.valor !== undefined && service.valor !== null) {
        valor = Math.abs(Number(service.valor))
      } else if (service.VALOR !== undefined && service.VALOR !== null) {
        valor = Math.abs(Number(service.VALOR))
      } else if (service.valorLiquido !== undefined && service.valorLiquido !== null) {
        valor = Math.abs(Number(service.valorLiquido))
      } else if (service.VALORLIQUIDO !== undefined && service.VALORLIQUIDO !== null) {
        valor = Math.abs(Number(service.VALORLIQUIDO))
      }
      
      if (isNaN(valor)) return
      
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
    
    return result
  }

  // ===== LOAD DASHBOARD =====
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
      
      if ((apiCNPJ !== 'todos') && (apiCNPJ !== 'TODOS') && (apiCNPJ !== 'Todos')) {
        const params = { cnpj: apiCNPJ }
        const config = { params }
        const response = await api.get('dashboard', config)
        dashboardData = response.data
      } else if ((apiCNPJ === 'todos') || (apiCNPJ === 'TODOS') || (apiCNPJ === 'Todos')) {
        const params = { grupo: localStorage.getItem('groupCode') }
        const config = { params }
        const response = await api.get('dashboard', config)
        dashboardData = response.data
      } else {
        const params = { usuario: localStorage.getItem('userID') }
        const config = { params }
        const response = await api.get('dashboard', config)
        dashboardData = response.data
      }
      
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
      
      const vendasChartData = transformAdquirentesForChart(transformedData.vendas.totalAdquirentes);
      const creditsChartData = transformAdquirentesForChart(transformedData.creditos.totalAdquirentes);
      const ajustesChartData = transformAdquirentesForChart(transformedData.ajustes.totalAdquirentes);
      
      const totalVendas = transformedData.vendas.totalAdquirentes.reduce((sum, item) => sum + item.valor, 0);
      const totalCredits = transformedData.creditos.totalAdquirentes.reduce((sum, item) => sum + item.valor, 0);
      const totalAjustes = transformedData.ajustes.totalAdquirentes.reduce((sum, item) => sum + item.valor, 0);
      
      setSalesDashboard({
        totalLast4: transformedData.vendas.valorTotaldias,
        totalMonth: transformedData.vendas.valorTotalMes,
        chart: {
          data: vendasChartData.data,
          labels: vendasChartData.labels
        },
        sales: transformedData.vendas.totalAdquirentes,
        totalAdmin: totalVendas
      });
      setIsLoadedSalesDashboard(true);
      
      setCreditsDashboard({
        totalCreditsToday: transformedData.creditos.valorTotaldias,
        totalCreditsNext5: transformedData.creditos.valorTotalMes,
        chart: {
          data: creditsChartData.data,
          labels: creditsChartData.labels
        },
        credits: transformedData.creditos.totalAdquirentes,
        totalAdmin: totalCredits
      })
      setIsLoadedCreditsDashboard(true)
      
      setServicesDashboard({
        totalServicesToday: transformedData.ajustes.valorTotaldias,
        totalServicesMonth: transformedData.ajustes.valorTotalMes,
        chart: {
          data: ajustesChartData.data,
          labels: ajustesChartData.labels
        },
        services: transformedData.ajustes.totalAdquirentes,
        totalAdmin: totalAjustes
      })
      setIsLoadedServicesDashboard(true)
      
      setIsLoadedDashboard(true)
      setChangedOption(false)
      setFetchingData(false)
      
      return transformedData
    } catch (error) {
      console.log('Error in dashboard loading:', error)
      setFetchingData(false)
      
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    }
  }

  // ===== TRANSFORM API DATA =====
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

    if (apiData.vendas?.resumo_Adquirentes_vendas) {
      result.vendas.totalAdquirentes = apiData.vendas.resumo_Adquirentes_vendas.map(item => ({
        adquirente: item.adquirente,
        valor: item.valor || 0,
        percentual: item.percentual || 0
      }));
    }

    if (apiData.creditos?.resumo_Adquirentes_recebimentos) {
      result.creditos.totalAdquirentes = apiData.creditos.resumo_Adquirentes_recebimentos.map(item => ({
        adquirente: item.adquirente,
        valor: item.valor || 0,
        percentual: item.percentual || 0
      }));
    }

    if (apiData.ajustes?.resumo_Adquirentes_ajustes) {
      result.ajustes.totalAdquirentes = apiData.ajustes.resumo_Adquirentes_ajustes.map(item => ({
        adquirente: item.adquirente,
        valor: item.valor || 0,
        percentual: item.percentual || 0
      }));
    }

    return result;
  }

  // ===== RESET DASHBOARD =====
  const resetDashboard = () => {
    setSalesDashboard(null)
    setCreditsDashboard(null)
    setServicesDashboard(null)
  }

  // ===== EXPORT FUNCTIONS =====
  const exportSales = (data) => {
    if (!data || data.length === 0) {
      if (salesTableData.length > 0) {
        setSalesTableData([])
      }
      return
    }
        
    const isNewApiData = data[0] && data[0].CNPJ !== undefined
    
    let transformedData = []
    
    if (isNewApiData) {
      transformedData = data.map((item) => {
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
          cnpj: cnpj,
          razaosocial: razaosocial,
          numeroPV: numeroPV,
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
          valorBruto: valorBruto,
          valorLiquido: valorLiquido,
          valorDesconto: desconto,
          taxa: taxa,
          dataVenda: dataVenda,
          dataCredito: dataCredito,
          horaVenda: horaVenda,
          nsu: nsu,
          cartao: cartao,
          codigoAutorizacao: codigoAutorizacao,
          quantidadeParcelas: parseInt(parcela) || 0,
          status: status,
          ro: ro
        }
      })
    } else {
      transformedData = data.map((item) => ({
        ...item,
        adquirente: item.adquirente || { codigoAdquirente: null, nomeAdquirente: '' },
        produto: item.produto || { codigoProduto: null, descricaoProduto: '' },
        bandeira: item.bandeira || { codigoBandeira: null, descricaoBandeira: '' },
        modalidade: item.modalidade || { codigoModalidade: null, descricaoModalidade: '' },
        valorDesconto: item.valorDesconto || 0,
        quantidadeParcelas: item.quantidadeParcelas || 0
      }))
    }
    
    const currentData = salesTableData
    const isDataSame = JSON.stringify(currentData) === JSON.stringify(transformedData)
    
    if (!isDataSame) {
      setSalesTableData(transformedData)
    }
  }

  const exportCredits = (data) => {
    if (!data || data.length === 0) {
      return []
    }

    const transformedData = data.map(item => ({
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
    }))

    localStorage.setItem('creditsTableData', JSON.stringify(transformedData))
    
    if (typeof setCreditsTableData === 'function') {
      setCreditsTableData(transformedData)
    }
    
    return transformedData
  }

  const exportServices = (array) => {
    if (array.length === 0) {
      setServicesTableData([])
      return
    }
    
    let arrayTemp = []
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
    return servicesTableData
  }

  // ===== LEGACY FUNCTIONS (keeping for compatibility) =====
  const loadSales = async (startDate, endDate) => {
    // Legacy function - kept for compatibility
    try {
      const response = await api.get('vendas', {
        params: { datainicial: startDate, datafinal: endDate }
      })
      return response.data.VENDAS
    } catch (error) {
      console.error('Error in loadSales:', error)
      return []
    }
  }

  const loadCredits = async (startDate, endDate) => {
    try {
      const response = await api.get('recebimentos', {
        params: { dataInicial: startDate, dataFinal: endDate }
      })
      return response.data
    } catch (error) {
      console.error('Error in loadCredits:', error)
      return []
    }
  }

  const loadServices = async (startDate, endDate) => {
    try {
      const response = await api.get('ajustes', {
        params: { dataInicial: startDate, dataFinal: endDate }
      })
      return response.data
    } catch (error) {
      console.error('Error in loadServices:', error)
      return []
    }
  }

  const loadTotalSales = (array) => {
    // Legacy function
    if (array && array.length > 0) {
      newLoadTotalSales(array)
    }
  }

  const loadTotalCredits = (array) => {
    if (array && array.length > 0) {
      newLoadTotalCredits(array)
    }
  }

  const groupByAdmin = (array) => {
    return newGroupByAdmin(array)
  }

  const groupServicesByAdmin = (array) => {
    return newGroupByAdminServices(array)
  }

  // ===== OTHER API FUNCTIONS =====
  const loadTaxes = async () => {
    setIsLoadingTaxes(true)
    try {
      const apiClientCode = localStorage.getItem('clientCode')
      if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
        const response = await api.get('taxas', { params: { codigo: apiClientCode } })
        return response.data
      }
      return []
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

  const addTax = async (tax) => {
    setIsLoadingTaxes(true)
    try {
      const apiClientCode = localStorage.getItem('clientCode')
      if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
        await api.post('taxas', tax)
        toast.success('Taxa cadastrada com sucesso')
      }
    } catch (error) {
      console.error('Error adding tax:', error)
      toast.error('Erro ao cadastrar taxa')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    } finally {
      setIsLoadingTaxes(false)
    }
  }

  const editTax = async (tax) => {
    setIsLoadingTaxes(true)
    try {
      const body = JSON.stringify(tax)
      const response = await fetch('https://app.salvalucro.com.br/api/v1/taxas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: body,
      })
      if (response.ok) {
        toast.success('Taxa alterada com sucesso!')
      } else {
        toast.error('Erro ao alterar taxa!')
      }
    } catch (error) {
      console.error('Error updating tax:', error)
      toast.error('Erro ao alterar taxa!')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    } finally {
      setIsLoadingTaxes(false)
    }
  }

  const deleteTax = async (tax) => {
    setIsLoadingTaxes(true)
    try {
      await api.delete('taxas', { data: tax })
      toast.success('Taxa deletada com sucesso!')
    } catch (error) {
      console.error('Error deleting tax:', error)
      toast.error('Erro ao deletar taxa!')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    } finally {
      setIsLoadingTaxes(false)
    }
  }

  const loadBanks = async () => {
    setIsLoadingBanks(true)
    try {
      const apiClientCode = localStorage.getItem('clientCode')
      if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
        const response = await api.get('banco', { params: { codigo: apiClientCode } })
        return response.data
      }
      return []
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

  const addBank = async (bank) => {
    setIsLoadingBanks(true)
    try {
      const apiClientCode = localStorage.getItem('clientCode')
      if (apiClientCode && apiClientCode.toLowerCase() !== 'todos') {
        const response = await api.post('banco', bank)
        if (response.data.success) {
          toast.success(response.data.mensagem)
        } else {
          toast.error('Erro ao adicionar Banco!')
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar banco:', error)
      toast.error('Erro ao adicionar banco')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    } finally {
      setIsLoadingBanks(false)
    }
  }

  const editBank = async (editedBank) => {
    setIsLoadingBanks(true)
    try {
      const body = JSON.stringify(editedBank)
      const response = await fetch('https://app.salvalucro.com.br/api/v1/banco', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: body,
      })
      if (response.ok) {
        toast.success('Banco alterado com sucesso!')
      } else {
        toast.error('Erro ao alterar Banco!')
      }
    } catch (error) {
      console.error('Erro ao Alterar Banco:', error)
      toast.error('Erro ao alterar banco!')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    } finally {
      setIsLoadingBanks(false)
    }
  }

  const deleteBank = async (bankToDelete) => {
    setIsLoadingBanks(true)
    try {
      await api.delete('banco', { data: bankToDelete })
      toast.success('Banco deletado com sucesso!')
    } catch (error) {
      console.error('Error deleting bank:', error)
      toast.error('Erro ao deletar banco!')
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    } finally {
      setIsLoadingBanks(false)
    }
  }

  const loadCliAdq = async () => {
    try {
      const params = {
        codigoCliente: localStorage.getItem('clientCode'),
        codigoAdquirente: localStorage.getItem('admCode')
      }
      const response = await api.get('clienteAdquirente', { params })
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
      const params = { codigoAdquirente: localStorage.getItem('admCode') }
      const response = await api.get('Subproduto', { params })
      return response.data
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    }
  }

  const loadBanners = async () => {
    try {
      const response = await api.get('bandeira')
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const loadAdmins = async () => {
    try {
      const response = await api.get('adquirente')
      return response.data
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 401) {
        logout()
        return
      }
    }
  }

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

  const loadSysmo = async (obj) => {
    setBtnDisabledSysmo(true)
    try {
      const params = {
        tipo: obj.TIPO,
        bandeira: obj.Bandeira,
        adquirente: obj.Adquirente,
        data: obj.Data
      }
      const response = await api.get('Sysmo', { params })
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

  const refreshSession = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
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
        logout()
      }
    }
  }

  const loadOptions = async () => {
    try {
      const params = { codigo: localStorage.getItem('userID') }
      const response = await api.get('Menu', { params })
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

  // ===== UTILITY FUNCTIONS =====
  const dateConvert = (date) => {
    if (!date) return ''
    if (typeof date !== 'string') {
      if (date instanceof Date && !isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      }
      return ''
    }
    if (!date.includes('-')) return date
    try {
      const parts = date.split('-')
      if (parts.length !== 3) return date
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      return day + '/' + month + '/' + year
    } catch (error) {
      console.error('Error in dateConvert:', error)
      return ''
    }
  }

  const timeConvert = (time) => {
    if (!time) return ''
    try {
      const cleanTime = time.replace(/undefined/g, '')
      const parts = cleanTime.split('-').filter(part => part.trim() !== '')
      if (parts.length >= 3) {
        return `${parts[0]}:${parts[1]}:${parts[2]}`
      } else if (parts.length === 2) {
        return `${parts[0]}:${parts[1]}`
      } else if (parts.length === 1) {
        return parts[0]
      }
      return time
    } catch (error) {
      console.error('Error converting time:', error, time)
      return time
    }
  }

  const dateConvertSearch = (date) => {
    const newDate = dateConvertYYYYMMDD(date)
    const parts = newDate.split('-')
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    return day + '-' + month + '-' + year
  }

  const dateConvertYYYYMMDD = (date) => {
    return date.toISOString().split('T')[0]
  }

  const converteData = (data) => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  }

  const alerta = (text) => {
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

  const sortArray = (arrayAdq) => {
    const sortedArray = [...arrayAdq].sort((a, b) => {
      const nameA = a.adminName.toUpperCase()
      const nameB = b.adminName.toUpperCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })
    return sortedArray
  }

  const safeToFixed = (value, decimals = 2) => {
    if (value === undefined || value === null) {
      return (0).toFixed(decimals)
    }
    let numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) {
      return (0).toFixed(decimals)
    }
    return numValue.toFixed(decimals)
  }

  const safeCurrencyFormat = (value) => {
    if (value === undefined || value === null) {
      return 'R$ 0,00'
    }
    let numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) {
      return 'R$ 0,00'
    }
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const clearCookies = () => {
    Cookies.remove('apiKey')
    Cookies.remove('accessToken')
    Cookies.remove('id')
    Cookies.remove('accounts')
    Cookies.remove('itemID')
  }

  // ===== RESET APP VALUES =====
  const resetAppValues = useCallback(() => {
    setIsLoadedDashboard(false)
    setIsLoadedSalesDashboard(false)
    setIsLoadedCreditsDashboard(false)
    setIsLoadedServicesDashboard(false)
    setSalesPageArray([])
    setSalesPageAdminArray([])
    setSalesTotal({ debit: 0, credit: 0, voucher: 0, total: 0 })
    setSalesDateRange([new Date(), new Date()])
    setCreditsPageArray([])
    setCreditsPageAdminArray([])
    setCreditsTotal({ debit: 0, credit: 0, voucher: 0, total: 0 })
    setCreditsDateRange([new Date(), new Date()])
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setServicesDateRange([new Date(), new Date()])
    setServicesTotal({ total: 0 })
    setSalesDashboard({
      sales: [],
      totalLast4: 0,
      totalMonth: 0,
      chart: { data: [], labels: [] }
    })
    setCreditsDashboard({
      credits: [],
      predictToday: 0,
      predictNext5: 0,
      chart: { data: [], labels: [] }
    })
    setServicesDashboard({
      services: [],
      totalToday: 0,
      totalMonth: 0,
      chart: { data: [], labels: [] }
    })
    setChartSales({ data: [], labels: [] })
    setChartCredits({ data: [], labels: [] })
    setChartServices({ data: [], labels: [] })
    setErrorSales(false)
    setErrorCredits(false)
    setErrorServices(false)
    setCanceled(false)
    setCanceledSales(false)
    setCanceledCredits(false)
    setCanceledServices(false)
    setIsSignedIn(false)
  }, [])

  // ===== CONTEXT VALUE =====
  const contextValue = useMemo(() => ({
    // Auth
    isSignedIn,
    setIsSignedIn,
    logout,
    accessToken,
    setAccessToken,
    refreshSession,
    loadUser,
    updateUser,
    loginApp,
    clientUserId,
    
    // Theme & Preferences
    theme,
    toggleTheme,
    userPreferences,
    isThemeLoaded,
    loadUserPreferences,
    
    // UI
    userImg,
    setUserImg,
    currentLogo,
    currentContext,
    
    // Dashboard
    loadDashboard,
    isLoadedDashboard,
    setIsLoadedDashboard,
    salesDashboard,
    isLoadedSalesDashboard,
    setIsLoadedSalesDashboard,
    creditsDashboard,
    isLoadedCreditsDashboard,
    setIsLoadedCreditsDashboard,
    servicesDashboard,
    isLoadedServicesDashboard,
    setIsLoadedServicesDashboard,
    canceledSales,
    setCanceledSales,
    canceledCredits,
    setCanceledCredits,
    canceledServices,
    setCanceledServices,
    
    // Sales
    loadSales,
    loadTotalSales,
    newLoadSales,
    newLoadTotalSales,
    salesDateRange,
    setSalesDateRange,
    salesPageArray,
    setSalesPageArray,
    salesPageAdminArray,
    setSalesPageAdminArray,
    salesTotal,
    setSalesTotal,
    btnDisabledSales,
    setBtnDisabledSales,
    salesTableData,
    setSalesTableData,
    exportSales,
    errorSales,
    
    // Credits
    loadCredits,
    loadTotalCredits,
    newLoadCredits,
    newLoadCreditsDataBanco: newLoadCredits,
    newGroupByAdminCredits,
    newLoadTotalCredits,
    creditsPageArray,
    setCreditsPageArray,
    creditsPageAdminArray,
    setCreditsPageAdminArray,
    creditsDateRange,
    setCreditsDateRange,
    creditsTotal,
    setCreditsTotal,
    btnDisabledCredits,
    setBtnDisabledCredits,
    creditsTableData,
    setCreditsTableData,
    exportCredits,
    errorCredits,
    
    // Services
    loadServices,
    newLoadServices,
    newGroupByAdminServices,
    newLoadTotalServices,
    servicesPageArray,
    setServicesPageArray,
    servicesPageAdminArray,
    setServicesPageAdminArray,
    servicesDateRange,
    setServicesDateRange,
    btnDisabledServices,
    setBtnDisabledServices,
    servicesTableData,
    setServicesTableData,
    exportServices,
    errorServices,
    
    // Taxes
    loadTaxes,
    isLoadingTaxes,
    setIsLoadingTaxes,
    addTax,
    editTax,
    deleteTax,
    taxesTableData,
    setTaxesTableData,
    exportTaxes: (array) => {},
    taxesPageArray,
    setTaxesPageArray,
    
    // Banks
    loadBanks,
    isLoadingBanks,
    setIsLoadingBanks,
    addBank,
    editBank,
    deleteBank,
    loadCliAdq,
    
    // Sysmo
    loadSysmo,
    btnDisabledSysmo,
    setBtnDisabledSysmo,
    
    // Others
    loadBanners,
    loadAdmins,
    loadMods,
    loadProducts,
    loadSubproducts,
    groupByAdmin,
    newGroupByAdmin,
    groupServicesByAdmin,
    exportName,
    setExportName,
    isCheckedCalendar,
    setIsCheckedCalendar,
    converteData,
    dateConvert,
    dateConvertSearch,
    dateConvertYYYYMMDD,
    fetchingData,
    setFetchingData,
    groupsList,
    clientsList,
    loadGroupsList,
    setGroupsList,
    displayClient,
    displayGroup,
    setDisplayGroup,
    setDisplayClient,
    changedOption,
    setChangedOption,
    canceled,
    setCanceled,
    resetAppValues,
    safeToFixed,
    safeCurrencyFormat,
    alerta,
    sortArray,
  }), [
    isSignedIn,
    accessToken,
    userImg,
    salesTableData,
    creditsTableData,
    servicesTableData,
    taxesTableData,
    exportName,
    isCheckedCalendar,
    changedOption,
    errorSales,
    errorCredits,
    errorServices,
    fetchingData,
    displayGroup,
    displayClient,
    canceledSales,
    canceledCredits,
    canceledServices,
    groupsList,
    clientsList,
    btnDisabledSales,
    btnDisabledCredits,
    btnDisabledServices,
    btnDisabledSysmo,
    isLoadingTaxes,
    isLoadingBanks,
    isLoadedDashboard,
    isLoadedSalesDashboard,
    isLoadedCreditsDashboard,
    isLoadedServicesDashboard,
    canceled,
    salesDashboard,
    creditsDashboard,
    servicesDashboard,
    chartSales,
    chartCredits,
    chartServices,
    salesPageArray,
    salesPageAdminArray,
    salesTotal,
    salesDateRange,
    creditsPageArray,
    creditsPageAdminArray,
    creditsTotal,
    creditsDateRange,
    servicesPageArray,
    servicesPageAdminArray,
    servicesDateRange,
    servicesTotal,
    taxesPageArray,
    logout,
    updateUser,
    theme,
    toggleTheme,
    userPreferences,
    isThemeLoaded,
    loadUserPreferences,
    currentLogo,
    currentContext,
    resetAppValues,
  ])

  // ===== EFFECT FOR CANCELED REQUESTS =====
  useEffect(() => {
    if (canceled) {
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
  }, [canceled, resetAppValues])

  // ===== EFFECT FOR DASHBOARD LOAD COMPLETION =====
  useEffect(() => {
    if (isLoadedSalesDashboard && isLoadedCreditsDashboard && isLoadedServicesDashboard) {
      setFetchingData(false)
    }
  }, [isLoadedSalesDashboard, isLoadedCreditsDashboard, isLoadedServicesDashboard])

  // ===== EFFECT FOR THEME TOGGLE COMPLETION =====
  useEffect(() => {
    if (isLoadedSalesDashboard && isLoadedCreditsDashboard && isLoadedServicesDashboard) {
      setFetchingData(false)
    }
  }, [isLoadedSalesDashboard, isLoadedCreditsDashboard, isLoadedServicesDashboard])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider