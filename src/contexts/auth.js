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
  const [admCreditosAux, setAdmCreditosAux] = useState([])
  const [somatorioCreditosHojeAux, setSomatorioCreditosHojeAux] = useState(0)
  const [totalCreditos5diasAux, setTotalCreditos5diasAux] = useState(0)
  const [somatorioVendasMesAux, setSomatorioVendasMesAux] = useState(0)
  const [totalVendas4diasAux, setTotalVendas4diasAux] = useState(0)
  const [graficoVendasAux, setGraficoVendasAux] = useState({data: [], labels: []})
  const [graficoCreditosAux, setGraficoCreditosAux] = useState({data: [], labels: []})
  const [inicializouAux, setInicializouAux] = useState(false)


  const navigate = useNavigate()

  useEffect(() =>{
    setDataInicial(new Date())
    setAccessToken('')
  },[])

  /////Login do usuário
  async function submitLogin(login, password){
    setLoading(true)
    await api.post('/token', { client_id: login, client_secret: md5(password) })
    .then(async response => {
        Cookies.set('token', response.data.acess_token)
        Cookies.set('refreshToken', response.data.refresh_token)
        setAccessToken(Cookies.get('token'))
        setRefreshToken(Cookies.get('refreshToken'))
        
        if(response.data.sucess === true){
          setCnpj('')
          Cookies.set('cnpj', '')
          setTeste(false)
          sessionStorage.setItem('teste', false)
          sessionStorage.setItem('isSignedIn', true)
          await loadGrupos()
          .then(
            sessionStorage.setItem('grupos', JSON.stringify(grupos))
          )
        }
        try {
          const response = await api.get('/usuario')
          const userList = response.data
          const userMatch = userList.find((user) => user.LOGIN === login && user.SENHA === md5(password))
        
          if (userMatch) {
            sessionStorage.setItem('isSignedIn', true);
            const userData = { NOME: userMatch.NOME, EMAIL: userMatch.EMAIL }
            sessionStorage.setItem('userData', JSON.stringify(userData))
            localStorage.setItem('isSignedIn', true)
            if(localStorage.getItem('isDark') && (localStorage.getItem('isDark') !== undefined)){
              setIsDarkTheme(localStorage.getItem('isDark'))
            }
            else{
              localStorage.setItem('isDark', false)
            }
            setIsSignedIn(true)
          } else {
            console.log('User not found')
          }
          setLoading(false)
        } catch (error) {
          console.error(error)
          setLoading(false)
        }
    })
    .catch(error =>{
        console.log('catch: ')
        console.log(error)
        alert(error.message)
        setLoading(false)
    })
    
    setLoading(false)
    console.log('************fim submitLogin()************')
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
    sessionStorage.clear()
    setIsSignedIn(false)
    
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    Cookies.remove('cnpj')

    setVendas([])
    setRecebimentos([])

    localStorage.setItem('isSignedIn', false)

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
    setSomatorioCreditosHojeAux(0)
    setTotalCreditos5diasAux(0)
    setSomatorioVendasMesAux(0)
    setTotalVendas4diasAux(0)
    setGraficoVendasAux({data: [], labels: []})
    setGraficoCreditosAux({data: [], labels: []})
    setInicializouAux(false)

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

  /////desloga usuário
  function logout(){
    setLoading(true)
    resetaValores()
    setLoading(false)
    navigate('/')
  }

  function expired(){
    alert('Sessão expirada. Faça o Login novamente')
    sessionStorage.clear()
    setIsSignedIn(false)
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    localStorage.setItem('isSignedIn', false)
    navigate('/')
  }

  //////////////////////////////////////////////////////////////////

  //Vendas**********************************************************


    //Bandeiras
    
    async function loadBandeiras(){
      if(teste !== true){
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
      }else{
        setBandeiras(bandeirasStatic)
      }
    }

    //Grupo de Clientes

    async function loadGrupos(){
      if((teste !== true) && (!inicializouGruposAux)){
        setLoading(true)
        await api.get('/grupo')
        .then( response => {
          setGrupos(response.data)
          sessionStorage.setItem('grupos', JSON.stringify(response.data))
          setInicializouGruposAux(true)
          setLoading(false)
        })
        .catch(error =>{
          console.log(error)
          setLoading(false)
        })
      } 
      else if((teste !== true) && (inicializouGruposAux)){
        setGrupos(JSON.parse(sessionStorage.getItem('grupos')))
      } else {
        setGrupos(gruposStatic)
      }
    }

    async function loadAdquirentes(){
      if(teste !== true){
        setLoading(true)
        await api.get('/adquirente')
        .then( response => {
          setAdquirentes(response.data)
          setLoading(false)
        })
        .catch(error =>{
          console.log(error)
          setLoading(false)
        })
      }else{
        setAdquirentes(adquirentesStatic)
      }
    }
  
    //loadVendas melhorias

    // retorna as vendas da data e cliente específicos.

    async function loadVendas(dataInicial, cnpj, adquirente, bandeira){
      if(teste !== true){
  
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
              console.log('adquirente sem bandeira')
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
      }else{
        setVendas(vendasStatic.VENDAS)
        setLoading(false)
        setBuscou(false)
        return vendasStatic.VENDAS
      }
    }

    //Consulta de vendas, com intervalo de datas

    async function loadPeriodo(datainicial, datafinal, cnpj, adquirente, bandeira){
      if(teste !== true){
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
        }else{
          setVendasDash(vendasStatic)
        }
      }
      


  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  async function loadRecebimentos(cnpj, datainicial, datafinal){
    if(teste !== true){
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
        setRecebimentosDash(recebimentosData)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }else{
      setRecebimentosDash(recebimentosStatic)
      setRecebimentos(recebimentosStatic)
    }

}

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

   //Consulta de vendas, com intervalo de datas

   async function retornaVendasPeriodo(datainicial, datafinal, cnpj, adquirente, bandeira){
    if(teste !== true){
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
    }else{
      return vendasStatic
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

async function retornaRecebimentos(cnpj, datainicial, datafinal){
  if(teste !== true){
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
  }else{
    return recebimentosStatic
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Ajustes

    async function loadAjustes(cnpj, dataInicial, dataFinal){
      if(teste !== true){
        setLoading(true)

      let params = {
        cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
        data: dateConvertSearch(dataInicial),
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
    } else{
      setLoading(false)
      return ajustesStatic;
    }
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //refresh

    async function refresh(){
      if(teste){
        return
      }
      await api.post('/token/refresh/' + Cookies.get('refreshToken'), config(accessToken))
      .then((response) => {
          setAccessToken(response.acessToken)
          Cookies.set('token', accessToken)
          setRefreshToken(response.refreshToken)
          Cookies.set('refreshToken', refreshToken)        
      }).catch(error => {
          console.log(error)
          //expired()
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

async function returnVendas(datainicial, datafinal, cnpj, adquirente, bandeira){
  if(teste !== true){
    setLoading(true)
    let buscou
    buscou = false

    if((datainicial === '' || undefined) || (cnpj === '' || undefined)){
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
      buscou = true
    }

    else if(((adquirente !== '') && (bandeira === '')) && (buscou === false)){

      params = {
        datainicial: datainicial,
        datafinal: datafinal,
        cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
        adquirente: adquirente,
      }
      buscou = true
    }

    else if(((bandeira !== '') && (adquirente === '')) && (buscou === false)){

      params = {
        datainicial: datainicial,
        datafinal: datafinal,
        cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
        bandeira: bandeira,
      }
      buscou = true
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

      try {
        const response = await api.get('vendas', config)
        const vendasData = response.data.VENDAS
        setLoading(false)
        setBuscou(false)
        return vendasData
      } catch (error) {
        console.log(error.response.status)
        if(error.response.status === 401){
          alerta('Sessão expirada. Você deve fazer o Login novamente para continuar a utilizar o sistema')
          setLoading(false)
          navigate('/')
          return
        }
        setLoading(false)
      }
  }else{
    return vendasStatic.VENDAS
  }
}

async function returnCreditos(datainicial, datafinal, cnpj){
  if(teste !== true){
    try {
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
          setRecebimentos(recebimentosData)
          return recebimentosData
      } catch (error) {
        console.log(error)
        if(error.status === 401){
          alerta('Sessão expirada. Você deve fazer o Login novamente para continuar a utilizar o sistema')
          setLoading(false)
          navigate('/')
        }
        setLoading(false)
      }
    } catch (error) {
      console.log('error')
      setLoading(false)}
    } else{
      return(recebimentosStatic)
    } 
}

async function returnTotalDia(cnpj, data) {
  if(teste !== true){
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
      console.log(error)
    }
  }else{
    return(totaisStatic)
  }
}

async function returnTotalMes(cnpj){
  
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  let mes = []
  setLoading(true)
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const data = new Date(currentYear, currentMonth, day)
    try{
      const total = await returnTotalDia(cnpj, data)
      mes.push(total)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  setLoading(false)
  return mes
}

async function returnCreditosBanco(cnpj, dataInicial, dataFinal, codigoBanco){
  if(teste !== true){
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
  }else{
    setLoading(false)
    return bancosStatic
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
      console.log(response)
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
        vendasDash,
        setVendasDash,
        recebimentos,
        recebimentosDash,
        setRecebimentosDash,
        loadRecebimentos,
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
        teste,
        setTeste,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

