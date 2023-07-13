import { React, useEffect, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../contexts/auth'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'
import LoadingModal from '../components/LoadingModal'


export default function Private({children}){

  const { isSignedIn, setIsSignedIn, setAccessToken, accessToken, loading, refresh, expired } = useContext(AuthContext)

  useEffect(()=>{
    console.log('Private.js')
  },[])

  useEffect(()=>{
    setAccessToken(Cookies.get('token'))
  },[accessToken])

  const handleTokenExpiration = () => {
    console.log('acessToken Expirada')
    refresh()
  };

  useEffect(() => {
    console.log('checando se o access token é valido...')
    console.log('accessToken: ', accessToken)
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken)
      const expirationTime = decodedToken.exp * 1000;

      console.log('horário de expiração: ', expirationTime)
      console.log('Date.now(): ', Date.now())

      if (expirationTime < Date.now()) {
        handleTokenExpiration()
      }
    }
  }, [accessToken]);
  
  return (
    <>
      <Layout>{ children }</Layout> 
      { loading ? <LoadingModal/> : <></>} 
    </>
  )
}
