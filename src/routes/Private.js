import { React, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Layout from '../components/Layout'

export default function Private({children}){

  const navigate = useNavigate()
  
  useEffect(()=>{
    if(sessionStorage.getItem('isSignedIn') !== 'true'){
      navigate('/')
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