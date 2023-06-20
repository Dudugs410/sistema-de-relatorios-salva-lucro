import { React, useEffect, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../contexts/auth'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'
import LoadingModal from '../components/LoadingModal'


export default function Private({children}){

  const { setIsSignedIn, setAccessToken, loading } = useContext(AuthContext)

  useEffect(()=>{
    console.log('Private.js')
  },[])

  useEffect(() => {
    setAccessToken(Cookies.get('token'))
    setIsSignedIn(sessionStorage.getItem('isSignedIn'))

  },[])

  if(localStorage.getItem('isSignedIn') === (false || undefined)){
    //expired()
  }

  
  return (
    <>
      <Layout>{ children }</Layout> 
      { loading ? <LoadingModal/> : <></>} 
    </>
  )
}
