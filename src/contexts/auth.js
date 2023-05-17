import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api, { config } from '../services/api'

import md5 from 'md5'

export const AuthContext = createContext({})

function AuthProvider({ children }){
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState(undefined)
  const [userList, setUserList] = useState([])

  const [dataInicial, setDataInicial] = useState(new Date().toLocaleDateString())
  const [dataFinal, setDataFinal] = useState((new Date().toLocaleDateString()))
  const [cnpj, setCnpj] = useState('')

  const navigate = useNavigate()

useEffect(() =>{
  console.log('auth.js')
},[])


  /////API de vendas

  async function loadVendas(){
    await api.get('/vendas',{ 
      params:{
          cnpj: '03.953.552/0001-02',
          dataInicial: `${dataInicial}`,
          dataFinal: `${dataFinal}`
      },
      headers:{
          Authorization:`Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
      }
    })
      .then(response =>{
        console.log(response)
      })
    }

  /////Login do usuário


  async function submitLogin(login, password){
    setLoading(true)
    await api.post('/token', { client_id: login, client_secret: md5(password) })
    .then(async response => {
        Cookies.set('token', response.data.acess_token)
        setAccessToken(Cookies.get('token'))
        if(response.data.sucess === true){
          sessionStorage.setItem('isSignedIn', true)
        }
        try {
          const response = await api.get('/usuario', config(Cookies.get('token')));
          const userList = response.data;
          sessionStorage.setItem('userList', JSON.stringify(userList));
        
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
      setLoading(false)
      
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
  
  /////desloga usuário
  function logout(){
    console.log('logout()')
    sessionStorage.clear()
    setIsSignedIn(false)
    setUserData({})
    Cookies.remove('token')
    localStorage.setItem('isSignedIn', false)
    navigate('/')
    console.log('************fim logout()************')
  }

  //////////////////////////////////////////////////////////////////

  return(
    <AuthContext.Provider 
      value={{
        signed: !!userData,
        isSignedIn,
        setIsSignedIn,
        loading,
        setLoading,
        submitLogin,
        logout,
        userData,
        setUserData,
        accessToken,
        setAccessToken,
        dataInicial,
        setDataInicial,
        dataFinal,
        setDataFinal,
        cnpj,
        setCnpj,
        loadVendas,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider