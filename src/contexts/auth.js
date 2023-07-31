/* eslint-disable default-case */
import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api, { config } from '../services/api'

import md5 from 'md5'

export const AuthContext = createContext({})

function AuthProvider({ children }){
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(null)
  const [accessToken, setAccessToken] = useState(undefined)
  const [refreshToken, setRefreshToken] = useState(undefined)

////////////////////////////////////////////////////////////////

  const [dataInicial, setDataInicial] = useState(new Date())
  const [dataFinal, setDataFinal] = useState(null)
  const [cnpj, setCnpj] = useState('')
  
  const [vendas, setVendas] = useState([])
  const [vendasDash, setVendasDash] = useState([])

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

  const [modalCliente, setModalCliente] = useState(true)

  const [buscou, setBuscou] = useState(false)
  
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
          sessionStorage.setItem('isSignedIn', true)
        }
        try {
          const response = await api.get('/usuario')
          const userList = response.data
          const userMatch = userList.find((user) => user.LOGIN === login && user.SENHA === md5(password))
        
          if (userMatch) {
            sessionStorage.setItem('isSignedIn', true);
            sessionStorage.setItem('userData', JSON.stringify(userMatch))
            localStorage.setItem('isSignedIn', true)
            setIsSignedIn(true)
            setCnpj(null)
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
        sessionStorage.setItem('isSignedIn', true);
        sessionStorage.setItem('userData', JSON.stringify({
          "CODIGO": 167561,
          "GRUCODIGO": 5,
          "SEDCODIGO": 0,
          "NOME": "EDUARDO GUERREIRO",
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
    setIsSignedIn(true)
    setCnpj('03953552000102')
    console.log('************fim submitLogin()************')
    navigate('/dashboard')
  }
  
  /////desloga usuário
  function logout(){
    setLoading(true)
    console.log('logout()')
    sessionStorage.clear()
    setIsSignedIn(false)
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    localStorage.setItem('isSignedIn', false)
    setLoading(false)
    navigate('/')
    console.log('************fim logout()************')
  }

  function expired(){
    alert('Sessão expirada. Faça o Login novamente')
    sessionStorage.clear()
    setIsSignedIn(false)
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    localStorage.setItem('isSignedIn', false)
    navigate('/')
    console.log('************fim sessão expirada************')
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

    async function loadGrupos(){
      setLoading(true)
      await api.get('/grupo')
      .then( response => {
        setGrupos(response.data)
        setLoading(false)
      })
      .catch(error =>{
        console.log(error)
        setLoading(false)
      })
    }

    async function loadAdquirentes(){
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
    }
  
    //loadVendas melhorias

    // retorna as vendas da data e cliente específicos.

    async function loadVendas(dataInicial, cnpj, adquirente, bandeira){

      console.log('Data Inicial: ', dataInicial)
      console.log('CNPJ: ', cnpj)

      if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
        alert('Favor selecionar uma data e cliente válidos')
        return 0
      }

      setLoading(true)
      let params = {}

      if(((adquirente !== '') && (bandeira !== '')) && (buscou === false)){
          console.log('adquirente e bandeira')
          params = {
          dataInicial: dataInicial,
          datafinal: dataInicial,
          cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
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
        console.log('bandeira sem adquirente')
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
          console.log('config: ',config)
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

  async function loadRecebimentos(cnpj, datainicial, datafinal){
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
      console.log('adquirente e bandeira')
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
      console.log('adquirente sem bandeira')
      params = {
        datainicial: datainicial,
        datafinal: datafinal,
        cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
        adquirente: adquirente,
      }
      setBuscou(true)
    }

    else if(((bandeira !== '') && (adquirente === '')) && (buscou === false)){
      console.log('bandeira sem adquirente')
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
        console.log('config: ',config)
        console.log(error)
        })
}

async function returnTotalMes(cnpj, data) {
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

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
////////////////////////////////////////////////////////////////////////

  return(
    <AuthContext.Provider
      value={{
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
        returnTotalMes,
        gruSelecionado,
        setGruSelecionado,
        listaClientes, 
        setListaClientes
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

