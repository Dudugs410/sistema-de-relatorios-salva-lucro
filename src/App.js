// App.js - Simplified
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-icons'
import AuthProvider from './contexts/auth'
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

import './index.scss'
import PluggyProvider from './contexts/pluggyContext'
import { initializeContext } from './util/contextInitializer';
import useSessionTimeout from './hooks/useSessionTimeout/useSessionTimeout'
import ThemeSync from './components/ThemeSync'

import { getTenantFromURL } from './util/tenant';

initializeContext()

function AppContent() {
  useSessionTimeout(30)
  
  return (
    <>
      <AuthProvider>
        <PluggyProvider>
          <ThemeSync>
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
  const [basename, setBasename] = useState('/salvalucro3');

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(seg => seg.length > 0);
    const tenantPath = pathSegments[0] || 'salvalucro3';
    setBasename(`/${tenantPath}`);
  }, []);

  useEffect(() => {
    const handlePageHide = () => {
      const sensitiveData = ['token', 'refreshToken', 'user']
      sensitiveData.forEach(key => sessionStorage.removeItem(key))
    }
    
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [])

  return (
    <BrowserRouter basename={basename}>
      <AppContent />
    </BrowserRouter>
  )
}

export default App