// hooks/useSessionTimeout.js
import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

const useSessionTimeout = (timeoutMinutes = 30) => {
  const navigate = useNavigate()
  const location = useLocation()
  const timerRef = useRef(null)
  
  const clearSessionAndLogout = useCallback(() => {
    const isSignedIn = sessionStorage.getItem('isSignedIn') === 'true'
    const currentPath = location.pathname
    
    // Clear all session storage
    sessionStorage.clear()
    
    // Clear cookies
    Cookies.remove('userID')
    Cookies.remove('pluggy_client_id')
    Cookies.remove('pluggy_api_key')
    
    // Notify user only if they were logged in
    if (isSignedIn && currentPath !== '/login') {
      toast.info(`Sessão expirada por inatividade de ${timeoutMinutes} minutos`)
    }
    
    // Redirect to login
    if (currentPath !== '/login') {
      navigate('/login')
    }
  }, [navigate, location, timeoutMinutes])
  
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    const isSignedIn = sessionStorage.getItem('isSignedIn') === 'true'
    const isLoginPage = location.pathname === '/login'
    
    if (isSignedIn && !isLoginPage) {
      timerRef.current = setTimeout(clearSessionAndLogout, timeoutMinutes * 60 * 1000)
    }
  }, [location.pathname, clearSessionAndLogout, timeoutMinutes])
  
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove']
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer)
    })
    
    resetTimer()
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [resetTimer])
  
  // Check token expiration on route change
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        const expTime = decoded.exp * 1000
        if (Date.now() >= expTime) {
          clearSessionAndLogout()
        }
      } catch (error) {
        console.error('Token validation error:', error)
      }
    }
  }, [location.pathname, clearSessionAndLogout])
}

export default useSessionTimeout