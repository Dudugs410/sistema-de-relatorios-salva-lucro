import { React, useEffect, useContext } from 'react'
import jwtDecode from 'jwt-decode'

import { AuthContext } from '../contexts/auth'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'
import LoadingModal from '../components/LoadingModal'


export default function Private({children}){

  const { isSignedIn, setIsSignedIn, setAccessToken, accessToken, loading, refresh, expired } = useContext(AuthContext)

  useEffect(()=>{
    setAccessToken(Cookies.get('token'))
  },[accessToken])

  const handleTokenExpiration = () => {
    refresh()
  };

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken)
      const expirationTime = decodedToken.exp * 1000;

      if (expirationTime < Date.now()) {
        handleTokenExpiration()
        setIsSignedIn(false)
      }
    }
  }, [accessToken]);
  
  return (
    <>
      <Layout>{ children }</Layout> 
      {loading && (
            <LoadingModal />
        )}
    </>
  )
}
