import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import PageLoader from '../components/PageLoader'
import { AuthContext } from '../contexts/auth'
import { isSignedInStored, isTokenUsable } from '../util/session'

export default function Private({ children }) {
  const { expireSession } = useContext(AuthContext)
  const [status, setStatus] = useState('checking')

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isSignedInStored()) {
      setStatus('denied')
      navigate('/login', { replace: true })
      return
    }

    if (!isTokenUsable()) {
      setStatus('denied')
      expireSession()
      return
    }

    setStatus('allowed')

    if (location.pathname === '/login' || location.pathname === '/') {
      navigate('/dashboard')
    }
  }, [expireSession, navigate, location.pathname])

  if (status === 'checking') {
    return <PageLoader message='Verificando autenticação...' />
  }

  if (status === 'allowed' && isSignedInStored()) {
    return <Layout>{children}</Layout>
  }

  return null
}
