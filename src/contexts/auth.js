/* eslint-disable default-case */
import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api, { config } from '../services/api'

import md5 from 'md5'
import { adquirentesStatic, bandeirasStatic, gruposStatic, recebimentosStatic, totaisStatic, vendasStatic, bancosStatic, ajustesStatic } from './static'

import { toast } from 'react-toastify';
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
  
  const [vendas, setVendas] = useState([])
  const [creditos, setCreditos] = useState([])

  const [vendasDash, setVendasDash] = useState([])
  const [tableData, setTableData] = useState([])

  const [totaisGlobal, setTotaisGlobal] = useState({debito: 0, credito: 0, voucher: 0, liquido: 0})

  const [recebimentos, setRecebimentos] = useState([])
  const [recebimentosDash, setRecebimentosDash] = useState([])

  const [vendaAtual, setVendaAtual] = useState([])
  const [vendaDias, setVendaDias] = useState([])

  const [bandeiras, setBandeiras] = useState([])
  const [grupos, setGrupos] = useState([]) 
  const [clientes, setClientes] = useState([])
  const [adquirentes, setAdquirentes] = useState([])

  const [gruSelecionado, setGruSelecionado] = useState('')
  const [listaClientes, setListaClientes] = useState('')
  const [inicializouGruposAux, setInicializouGruposAux] = useState(false)

  const [modalCliente, setModalCliente] = useState(true)
  const [buscou, setBuscou] = useState(false)

  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [teste, setTeste] = useState(false)

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

  const navigate = useNavigate()

  useEffect(() =>{
    setDataInicial(new Date())
    setAccessToken('')
  },[])

  /////Login do usuário
  async function submitLogin(login, password) {
    try {
      setLoading(true);
  
      const response = await api.post('token', { client_id: login, client_secret: md5(password) });
      const responseData = response.data;
  
      Cookies.set('token', responseData.acess_token);
      Cookies.set('refreshToken', responseData.refresh_token);
      setAccessToken(responseData.acess_token);
      setRefreshToken(responseData.refresh_token);
      
      const userId = jwtDecode(responseData.acess_token).id;
      Cookies.set('userID', userId);
      
      const loggedSuccessfully = JSON.parse(responseData.sucess);
      if (loggedSuccessfully) {
        console.log('>>> entrou <<<');
        Cookies.set('mostrarModal', true)
        let localUsers = [];
        if (localStorage.getItem('localUsers') !== null) {
          localUsers = JSON.parse(localStorage.getItem('localUsers'));
        }
        
        let userTemp = {}

        const userExists = localUsers.some(storedUser => storedUser.id === userId);
  
        if (userExists) {
          // Handle existing user in localUsers
          const updatedUsers = localUsers.map(user => {
            if (user.id === userId) {
              userTemp = {id: userId, theme: JSON.parse(user.theme)}
              setIsDarkTheme(JSON.parse(user.theme));
              localStorage.setItem('isDark', JSON.parse(user.theme));
              localStorage.setItem('isChecked', JSON.parse(user.theme));
              return { ...user, theme: user.theme }; // Update the theme if needed
            }
            return user;
          });
          localStorage.setItem('localUsers', JSON.stringify(updatedUsers));
        } else {
          // Add new user to localUsers
          userTemp = { id: userId, theme: false}
          localUsers.push(userTemp);
          setIsDarkTheme(false);
          localStorage.setItem('isDark', false);
          localStorage.setItem('isChecked', false);
          localStorage.setItem('localUsers', JSON.stringify(localUsers));
        }
  
        setTeste(false);
        setCnpj('');
        Cookies.set('cnpj', '');
        const opt = await loadOptions();
        sessionStorage.setItem('options', JSON.stringify(opt));
        const gru = await loadGrupos();
        sessionStorage.setItem('grupos', JSON.stringify(gru));
      }
  
      const userResponse = await api.get('/usuario');
      const userList = userResponse.data;
      const userMatch = userList.find((user) => (user.LOGIN.toLowerCase() === login.toLowerCase()) && (user.SENHA === md5(password)));
  
      if (userMatch) {
        console.log('Usuário encontrado');
        const userData = { NOME: userMatch.NOME, EMAIL: userMatch.EMAIL };
        sessionStorage.setItem('isSignedIn', true);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isSignedIn', true);
  
        const isDark = localStorage.getItem('isDark');
        setIsDarkTheme(isDark ? isDark : false);
        setIsSignedIn(true);
      } else {
        console.log('Usuario não encontrado');
      }
      sessionStorage.setItem('teste', false);
      sessionStorage.setItem('isSignedIn', true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  }

  async function loadOptions() {
    try {
      let params = {
        codigo: Cookies.get('userID')
      };
  
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        params: params
      };
  
      const response = await api.get('Menu', config);
      return response.data;
    } catch (error) {
      console.error(error);
      return null; // or handle the error as needed
    }
  }

  /////Fake Login

  async function submitFake(){
        Cookies.set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTYWx2YWx1Y3JvU2VydmljZUFjZXNzVG9rZW4iLCJqdGkiOiI3MzRhOGViMi1mMDk5LTQzY2QtOGY2NC0zY2FjNzE2YjNmNGUiLCJpYXQiOiIzMS8wNy8yMDIzIDE0OjIwOjA3IiwiaWQiOiIxNjc1NjEiLCJsb2dpbiI6IkVEVUFSRE8iLCJleHAiOjE2OTA4MjA0MDcsImlzcyI6IlNhbHZhbHVyb0F1dGhlbnRpY2F0aW9uU2VydmVyIiwiYXVkIjoiU2FsdmFsdWNyb1NlcnZpY2VDbGllbnQifQ.2GNP6g6djVXVcWyU6t8Ao87Xe_t1NcIBjUIjy9_Z1AQ')
        Cookies.set('refreshToken', 'kqSzxR/x30fEhCm9L1T+WoLbkqVxS+/PRXW/MSugc58=')
        setAccessToken(Cookies.get('token'))
        setRefreshToken(Cookies.get('refreshToken'))
        sessionStorage.setItem('isSignedIn', true)
        sessionStorage.setItem('userData', JSON.stringify({
          "CODIGO": '000000',
          "GRUCODIGO": 5,
          "SEDCODIGO": 0,
          "NOME": "Teste",
          "EMAIL": "eduardo@salvalucro.com.br",
          "LOGIN": "EDUARDO",
          "SENHA": "227d3332126e730442d8e6596424786f",
          "NECESSITATROCASENHA": false,
          "CONTABLOQUEADA": false,
          "USUARIOINSERCAO": 164385,
          "DATAINSERCAO": "2022-10-11T09:02:25.18",
          "USUARIOMODIFICACAO": 167561,
          "DATAMODIFICACAO": "2022-10-11T09:05:13.707",
          "ATIVO": true
      }))
    setTeste(true)
    sessionStorage.setItem('teste', true)
    setIsSignedIn(true)
    setCnpj('03953552000102')
    setGrupos(gruposStatic)
    sessionStorage.setItem('grupos', JSON.stringify(gruposStatic))
    navigate('/dashboard')
  }
  
  /////Reseta valores globais
  function resetaValores(){
    
    const clearAllCookies = () => {
      const cookies = Cookies.get()
      for (const cookie in cookies) {
        if (cookies.hasOwnProperty(cookie)) {
          Cookies.remove(cookie);
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
    setVendas([])
    setVendasDash([])
    setTableData([])
    setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
  
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
    setTeste(false)
  
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
    setSomatorioCreditosHojeAux(0)
    setTotalCreditos5diasAux(0)
    setSomatorioVendasMesAux(0)
    setTotalVendas4diasAux(0)
  }

  function resetaDashboard(){
    setVendas([])
    setCreditos([])
    setRecebimentos([])
    setVendas([])
    setVendasDash([])
    setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
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
          setLoading(true);
          const response = await api.get('/grupo');
          const gru = response.data;
    
          setGrupos(gru);
          sessionStorage.setItem('grupos', JSON.stringify(gru));
          setInicializouGruposAux(true);
          setLoading(false);
    
          return gru;
        } else if (inicializouGruposAux) {
          setGrupos(JSON.parse(sessionStorage.getItem('grupos')));
          return JSON.parse(sessionStorage.getItem('grupos'));
        } else {
          setGrupos(gruposStatic);
          return gruposStatic;
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        throw new Error(error.message); // Re-throw the error for handling in the caller function
      }
    }

    async function loadAdquirentes(){
      
        setLoading(true)
        await api.get('/adquirente')
        .then( response => {
          setAdquirentes(response.data)
          setLoading(false)
        })
        .catch(error =>{
          setLoading(false)
        })
      }
  
    //loadVendas melhorias

    // retorna as vendas da data e cliente específicos.

    async function loadVendas(dataInicial, cnpj, adquirente, bandeira){
        if(cnpj === null){
          alerta('erro ao ler o cnpj do cliente selecionado. Tente atualizar a página e selecionar o cliente desejado novamente.')
          return
        }
  
        if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
          alert('Favor selecionar uma data e cliente válidos')
          return 0
        }
  
        setLoading(true)
        let params = {}
  
        if(((adquirente !== '') && (bandeira !== '')) && (buscou === false)){
            params = {
            dataInicial: dataInicial,
            datafinal: dataInicial,
            cnpj: Cookies.get('cnpj').replace(/[^a-zA-Z0-9 ]/g, ''),
            adquirente: adquirente,
            bandeira: bandeira,
          }
          setBuscou(true)
        }
  
        else if(((adquirente !== '') && (bandeira === '')) && (buscou === false)){
              params = {
              datainicial: dataInicial,
              datafinal: dataInicial,
              cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
              adquirente: adquirente,
          }
          setBuscou(true)
        }
  
        else if(((bandeira !== '') && (adquirente === '')) && (buscou === false)){
          params = {
          datainicial: dataInicial,
          datafinal: dataInicial,
          cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
          bandeira: bandeira,
          }
          setBuscou(true)
        }
  
        else{
          params = {
          datainicial: dataInicial,
          datafinal: dataInicial,
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
              setVendas(response.data.VENDAS)
              setLoading(false)
              setBuscou(false)
              return response.data.VENDAS
            })
            .catch((error) => {
            setLoading(false)
            console.log(error)
            })
    }

    //Consulta de vendas, com intervalo de datas

    async function loadPeriodo(datainicial, datafinal, cnpj, adquirente, bandeira){
      
          setLoading(true);
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
   
      setLoading(true);
  
      const sanitizedCnpj = cnpj.replace(/[^a-zA-Z0-9 ]/g, '');
  
      const params = {
        cnpj: sanitizedCnpj,
        dataInicial: dataInicial,
        dataFinal: dataFinal,
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        params,
      };
  
      try {
        const response = await api.get('recebimentos', config);
        const recebimentosData = response.data;
  
        setCreditos(recebimentosData);
        setRecebimentosDash(recebimentosData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading creditos:', error);
        setLoading(false);
        // Handle specific errors here, e.g., display a message to the user
      }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

   //Consulta de vendas, com intervalo de datas

   async function retornaVendasPeriodo(datainicial, datafinal, cnpj, adquirente, bandeira){
      setLoading(true);
      if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
        alert('Favor selecionar uma data e cliente válidos')
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
          console.log(error)
          })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

async function retornaRecebimentos(cnpj, datainicial, datafinal){
    setLoading(true);
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
      setLoading(false)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Ajustes

    async function loadAjustes(cnpj, dataInicial, dataFinal){
        setLoading(true)

        console.log(cnpj, dateConvertSearch(dataInicial))

      let params = {
        cnpj: cnpj,
        dataInicial: dateConvertSearch(dataInicial),
        dataFinal: dateConvertSearch(dataFinal)
      }

      let config = {
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        params: params
      }

      try {
        const response = await api.get('/ajustes', config)
        const recebimentosData = response.data
        setLoading(false)
          return recebimentosData
      } catch (error) {
        console.log(error)
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

async function returnVendas(datainicial, datafinal, cnpj, adquirente, bandeira) {
    try {
      setLoading(true);
      let params = {
        datainicial: datainicial,
        datafinal: datafinal,
        cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
        adquirente: adquirente || undefined,
        bandeira: bandeira || undefined,
      };

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
    } catch (error) {
      console.error('Error fetching vendas:', error)
      setShowErrorMessage(true)
      setLoading(false)
      logout()
      return []
    }
}

async function returnCreditos(datainicial, datafinal, cnpj) {
  if(cnpj === ''){
    alerta('Erro no cliente selecionado. Selecione um cliente válido ou atualize a página e tente novamente')
    return
  }
    try {
      setLoading(true);
      let params = {
        cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
        dataInicial: dateConvert(datainicial),
        dataFinal: dateConvert(datafinal),
      };

      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        params: params
      };

      const response = await api.get('recebimentos', config);
      setLoading(false);
      setRecebimentos(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching creditos:', error);
      setShowErrorMessage(true);
      setLoading(false);
      logout();
      return [];
    }
}

async function returnTotalDia(cnpj, data) {
    setLoading(true)
    let params = {
      cnpj: cnpj,
      data: data,
    };

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`,
      },
      params: params,
    };

    try {
      const response = await api.get('vendastotais', config);
      setLoading(false)
      return response.data
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
      });
    });

    const results = await Promise.all(promises)
    mes = results.filter(result => result !== null)
  } catch (error) {
    console.error(error)
  }

  setLoading(false);
  return mes;
}

async function returnCreditosBanco(cnpj, dataInicial, dataFinal, codigoBanco){
    setLoading(true)
    let buscou
    buscou = false

    if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
      alert('Favor selecionar uma data e cliente válidos')
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
      buscou = true
    }else{
      let objTemp = [
          {
              "Banco": "ITAÚ UNIBANCO S.A",
              "Conta": "341/6321/996438",
              "DataPrevista": "23/08/2023",
              "ValorBruto": 18185.83,
              "ValorTaxa": 236.57,
              "ValorLiquido": 17949.26
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
  toast.info(text, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  })
}


function gerarDados(array){
  tableData.length = 0
  if (array.length > 0) {
    array.map((venda) => {
      tableData.push({
        adquirente: venda.adquirente.nomeAdquirente,
        bandeira: venda.bandeira.descricaoBandeira,
        produto: venda.produto.descricaoProduto,
        nsu: venda.nsu,
        cnpj: venda.cnpj,
        codigoVenda: venda.codigoVenda,
        codigoAutorizacao: venda.codigoAutorizacao,
        numeroPV: venda.numeroPV,
        valorBruto: 'R$' + venda.valorBruto.toFixed(2).replaceAll('.', ','),
        valorLiquido: 'R$' + venda.valorLiquido.toFixed(2).replaceAll('.', ','),
        taxa: 'R$' + venda.taxa.toFixed(2).replaceAll('.', ','),
        dataVenda: dateConvert(venda.dataVenda),
        horaVenda: venda.horaVenda,
        dataCredito: dateConvert(venda.dataCredito),
        parcelas: venda.quantidadeParcelas,
      })
    })
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
      return response;
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  async function loadDashboard(){
    let params = {
      usuario: JSON.parse(Cookies.get('cliCodigo')),
      cnpj: JSON.parse(Cookies.get('cnpj'))
    }
    try{
      const response = await api.get('dashboard', config)
      return response;
    } catch (error) {
      setLoading(false)
      console.log(error)
    }

  }
  

  return(
    <AuthContext.Provider
      value={{
        alerta,
        isSignedIn,
        setIsSignedIn,
        loading,
        setLoading,
        submitLogin,
        logout,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        expired,
        dateConvert,
        dateConvertSearch,
        dateConvertYYYYMMDD,
        refresh,
        ////////////////
        dataInicial,
        setDataInicial,
        dataFinal,
        setDataFinal,
        cnpj,
        setCnpj,
        vendas,
        setVendas,
        creditos,
        setCreditos,
        vendasDash,
        setVendasDash,
        recebimentos,
        recebimentosDash,
        setRecebimentosDash,
        loadCreditos,
        bandeiras,
        setBandeiras,
        loadBandeiras,
        grupos,
        setGrupos,
        loadGrupos,
        inicializouGruposAux,
        setInicializouGruposAux,
        clientes,
        setClientes,
        loadVendas,
        adquirentes,
        setAdquirentes,
        loadAdquirentes,
        vendaAtual,
        setVendaAtual,
        vendaDias,
        setVendaDias,
        buscou,
        setBuscou,
        loadPeriodo,
        modalCliente,
        setModalCliente,
        submitFake,
        retornaVendasPeriodo,
        retornaRecebimentos,
        returnTotalDia,
        gruSelecionado,
        setGruSelecionado,
        listaClientes, 
        setListaClientes,
        returnVendas,
        returnCreditos,
        converteData,
        returnTotalMes,
        returnCreditosBanco,
        loadAjustes,
        isDarkTheme,
        setIsDarkTheme,
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
        tableData,
        setTableData,
        gerarDados,
        totaisGlobal,
        setTotaisGlobal,
        resetaSomatorios,
        getCli,
        showErrorMessage,
        setShowErrorMessage,
        resetaDashboard,
        admServicosAux,
        setAdmServicosAux,
        totalServicosHojeAux,
        setTotalServicosHojeAux,
        totalServicosMesAux,
        setTotalServicosMesAux,
        graficoServicosAux,
        setGraficoServicosAux,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

