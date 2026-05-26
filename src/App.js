import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-icons'
import AuthProvider from './contexts/auth'
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'

import './index.scss'
import PluggyProvider from './contexts/pluggyContext'
import { initializeContext } from './util/contextInitializer';
import useSessionTimeout from './hooks/useSessionTimeout/useSessionTimeout'
import ThemeSync from './components/ThemeSync' // Import your existing ThemeSync

initializeContext()

// Component that uses the hook
function AppContent() {
  useSessionTimeout(30) // 30 minutes timeout
  
  return (
    <>
      <AuthProvider>
        <PluggyProvider>
          <ThemeSync> {/* Wrap RoutesApp with ThemeSync */}
            <RoutesApp/>
          </ThemeSync>
        </PluggyProvider>
      </AuthProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

function App() {
  // Tab close / page hide handler
  useEffect(() => {
    const handlePageHide = () => {
      const sensitiveData = ['token', 'refreshToken', 'user']
      sensitiveData.forEach(key => sessionStorage.removeItem(key))
    }
    
    window.addEventListener('pagehide', handlePageHide)
    
    return () => {
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [])

  return (
    <BrowserRouter basename='/salvalucro3'>
      <AppContent />
    </BrowserRouter>
  )
}

export default App