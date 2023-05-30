import { React, useEffect, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../contexts/auth'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'
import LoadingModal from '../components/LoadingModal'
import api from '../services/api'

export default function Private({children}){

  const { setIsSignedIn, setAccessToken, loading, setLoading, setUserData, expired, accessToken, refreshToken, setRefreshToken, refresh } = useContext(AuthContext)

  /*
  function isTokenExpired(token) {
    if (!token) {
      // Token is not provided
      return true
    }
  
    const decodedToken = jwtDecode(token)
    const tokenExp = decodedToken.exp * 1000 // Convert expiration time to milliseconds
    const currentDateTime = new Date().getTime()
  
    // Compare the token's expiration time with the current time
    return tokenExp < currentDateTime
  }
  
  // Usage example
  const isExpired = isTokenExpired(accessToken)
  console.log(`Is token expired? ${isExpired}`)

  if(isTokenExpired(accessToken)){
    refresh(accessToken)
  }
  */

  
  useEffect(()=>{
    console.log('Private.js')
  },[])

  useEffect(() => {
      setAccessToken(Cookies.get('token'))
      setIsSignedIn(sessionStorage.getItem('isSignedIn'))
      setLoading(sessionStorage.getItem('loading'))
      setUserData(JSON.parse(sessionStorage.getItem('userData')))
  },[])

  if(loading)
  {
    return(
      <LoadingModal/>
    )
  }


  if(localStorage.getItem('isSignedIn') === (false || undefined)){
    expired()
  }

  
  return (
    <Layout>{ children }</Layout>)
}
