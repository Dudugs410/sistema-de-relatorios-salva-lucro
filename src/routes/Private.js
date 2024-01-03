import { React, useEffect, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

import { AuthContext } from '../contexts/auth'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'
import LoadingModal from '../components/LoadingModal'


export default function Private({children}){

  const navigate = useNavigate()

  const { setIsDarkTheme, isSignedIn, setIsSignedIn, setAccessToken, accessToken, loading, refresh, expired, cnpj, setCnpj } = useContext(AuthContext)


  useEffect(()=>{
    if(sessionStorage.getItem('isSignedIn') !== 'true'){
      setIsSignedIn(false)
      navigate('/')
    }
  },[])

  useEffect(()=>{
    setCnpj(Cookies.get('cnpj'))
  },[])

  useEffect(()=>{
    setAccessToken(Cookies.get('token'))
  },[accessToken])

  const handleTokenExpiration = () => {
    refresh()
  };

  /*useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken)
      const expirationTime = decodedToken.exp * 1000;

      if (expirationTime < Date.now()) {
        handleTokenExpiration()
        setIsSignedIn(false)
        navigate('/')
      }
    }
  }, [accessToken]);*/

  useEffect(()=>{
    if(Cookies.get('cnpj') !== '' && null){
      setCnpj(Cookies.get('cnpj'))
    }
  },[])
  
  if(sessionStorage.getItem('isSignedIn') === 'true'){
    return (
      <>
        <Layout>{ children }</Layout> 
        {loading && (
              <LoadingModal />
          )}
      </>
    )
  }
}
