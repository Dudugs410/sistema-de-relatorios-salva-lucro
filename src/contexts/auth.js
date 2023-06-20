/* eslint-disable default-case */
import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import jwtDecode from 'jwt-decode';

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
  const [vendaAtual, setVendaAtual] = useState([])
  const [vendaDias, setVendaDias] = useState([])

  const [bandeiras, setBandeiras] = useState([])
  const [clientes, setClientes] = useState([])

  const [buscou, setBuscou] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() =>{
    setDataInicial(new Date())
    console.log('auth.js')
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
          const response = await api.get('/usuario', config(Cookies.get('token')));
          const userList = response.data;
          const userMatch = userList.find((user) => user.LOGIN === login && user.SENHA === md5(password));
        
          if (userMatch) {
            console.log('User found:', userMatch);
            sessionStorage.setItem('isSignedIn', true);
            sessionStorage.setItem('userData', JSON.stringify(userMatch));
            localStorage.setItem('isSignedIn', true)
            setIsSignedIn(true);
          } else {
            console.log('User not found');
          }
        } catch (error) {
          console.error(error);
        }
    })
    .catch(error =>{
        console.log('catch: ')
        console.log(error)
        alert(error.message)
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
      .then( async response => {
        setBandeiras(response)
      })
      .catch(error =>{
        console.log(error)
      })
      setLoading(false)
    }
  
    //loadVendas melhorias

    // retorna as vendas da data e cliente específicos.

    async function loadVendas(dataInicial, cnpj){
      setLoading(true)
      let params = {
          data: dataInicial,
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
            return response.data.VENDAS
          })
          .catch((error) => {
          console.log(error)
          })
      setLoading(false)
    }

    //refresh

    async function refresh(){
      await api.post('/token/refresh/' + Cookies.get('refreshToken'), config(accessToken))
      .then((response) => {
        console.log (response)
        if(response.success){
          console.log(response)
          setAccessToken(response.acessToken)
          Cookies.set('token', accessToken)
          setRefreshToken(response.refreshToken)
          Cookies.set('refreshToken', refreshToken)
        }
        else{
          //expired()
          console.log('erro')
        }
      }).catch(error => console.log(error))
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
        bandeiras,
        setBandeiras,
        loadBandeiras,
        clientes,
        setClientes,
        loadVendas,
        vendaAtual,
        setVendaAtual,
        vendaDias,
        setVendaDias,
        buscou,
        setBuscou,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

