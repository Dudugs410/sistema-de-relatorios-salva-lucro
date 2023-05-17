import { React, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'
import LoadingModal from '../components/LoadingModal'

export default function Private({children}){

  const { signed, isSignedIn, accessToken, setIsSignedIn, setAccessToken, loading, setLoading, setUserData } = useContext(AuthContext)

  
  useEffect(()=>{
    console.log('Private.js')
  },[])

  useEffect(() => {
      setAccessToken(Cookies.get('token'))
      setIsSignedIn(sessionStorage.getItem('isSignedIn'))
      setLoading(sessionStorage.getItem('loading'))
      setUserData(JSON.parse(sessionStorage.getItem('userData')))
  },[])



  if(localStorage.getItem('isSignedIn') === (false || undefined)){
    console.log('clearing')
    sessionStorage.clear()
    Cookies.remove('token')
    return <Navigate to="/"/>
  }

  
  return (
    <Layout>{ children }</Layout>)
}
