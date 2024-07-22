import { React, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Layout from '../components/Layout'
import { AuthContext } from '../contexts/auth'

export default function Private({children}){

  const navigate = useNavigate()

  const { logout } = useContext(AuthContext)
  
  useEffect(()=>{
    if(sessionStorage.getItem('isSignedIn') !== 'true'){
      alert('isSignedIn = false')
      logout()
    }
  },[])
  
  if(sessionStorage.getItem('isSignedIn') === 'true'){
    return (
      <>
        <Layout>{ children }</Layout> 
      </>  
    )
  }
}