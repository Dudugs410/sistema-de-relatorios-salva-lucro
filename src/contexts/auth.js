/* eslint-disable default-case */
import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
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
  const [cnpj, setCnpj] = useState('03.953.552/0001-02')
  
  const [vendas, setVendas] = useState([])
  const [vendasDash, setVendasDash] = useState([])

  const [vendaAtual, setVendaAtual] = useState([])
  const [vendaDias, setVendaDias] = useState([])

  const [bandeiras, setBandeiras] = useState([])
  const [grupos, setGrupos] = useState([]) 
  const [clientes, setClientes] = useState([])
  const [adquirentes, setAdquirentes] = useState([])

  const [buscou, setBuscou] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() =>{
    setDataInicial(new Date())
    console.log('auth.js')
    setAccessToken('')
  },[])

  useEffect(()=>{
    console.log(accessToken)
  },[accessToken])

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
            console.log('User found:', userMatch);
            sessionStorage.setItem('isSignedIn', true);
            sessionStorage.setItem('userData', JSON.stringify(userMatch))
            localStorage.setItem('isSignedIn', true)
            setIsSignedIn(true)
          } else {
            console.log('User not found')
          }
          setLoading(false)
        } catch (error) {
          console.error(error)
          setLoading(false)
        }
        setLoading(false)
    })
    .catch(error =>{
        console.log('catch: ')
        console.log(error)
        alert(error.message)
        setLoading(true)
    })
    
    setLoading(false)
    console.log('************fim submitLogin()************')
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
      if((dataInicial === '' || undefined) || (cnpj === '' || undefined)){
        alert('Favor selecionar uma data e cliente válidos')
        return 0
      }

      setLoading(true)
      let params = {}
      
      console.log('cnpj: ', cnpj)
      console.log('adquirente: ', adquirente)
      console.log('bandeira: ', bandeira)

      if(((adquirente !== '') && (bandeira !== '')) && (buscou === false)){
          console.log('adquirente e bandeira')
          params = {
          data: dataInicial,
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
    };

    let config = {
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: params
    };

    try {
      const response = await api.get('vendas', config);
      const vendasData = response.data.VENDAS; // Access the array using response.data.VENDAS
      setVendasDash(vendasData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

    //refresh

    async function refresh(){
      await api.post('/token/refresh/' + Cookies.get('refreshToken'), config(accessToken))
      .then((response) => {
          console.log (response)
          console.log(response)
          setAccessToken(response.acessToken)
          Cookies.set('token', accessToken)
          setRefreshToken(response.refreshToken)
          Cookies.set('refreshToken', refreshToken)        
      }).catch(error => {
          console.log(error)
          expired()
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

