// App.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-icons'
import AuthProvider from './contexts/auth'
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import React, { useEffect, useState, useContext } from 'react'
import { ToastContainer } from 'react-toastify'

import './index.scss'
import PluggyProvider from './contexts/pluggyContext'
import { initializeContext } from './util/contextInitializer';
import useSessionTimeout from './hooks/useSessionTimeout/useSessionTimeout'
import ThemeSync from './components/ThemeSync'
import { AuthContext } from './contexts/auth'
import { useUserPreferences } from './hooks/useUserPreferences/useUserPreferences'

import { getIconPathByCode, getDefaultIconByVisualIdentity } from './util/iconRegistry'
import { getTenantFromURL } from './util/tenant';

initializeContext()

// Component that loads user preferences on app start
function PreferenceLoader({ children }) {
  const { loadUserPrefs } = useUserPreferences()
  const { setUserImg, isSignedIn, setIsSignedIn } = useContext(AuthContext) || {}
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)

  useEffect(() => {
    const loadPreferencesFromAPI = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userID')
      const storedIsSignedIn = localStorage.getItem('isSignedIn') === 'true'
      
      const isLoggedIn = token && userId && (isSignedIn === true || storedIsSignedIn === true)
      
      if (isLoggedIn) {
        console.log('🔄 User is logged in, loading preferences on refresh...')
        
        const prefs = await loadUserPrefs()
        
        if (prefs && setUserImg) {
          console.log('✅ Preferences loaded on refresh:', prefs)
          
          if (prefs.ESQUEMACORES) {
            document.documentElement.setAttribute('data-context', prefs.ESQUEMACORES)
          }
          
          if (prefs.TEMA !== undefined) {
            const themeValue = prefs.TEMA === true || prefs.TEMA === 'true'
            document.documentElement.setAttribute('data-theme', themeValue ? 'dark' : 'light')
          }
          
          if (prefs.ICONE && setUserImg) {
            const iconPath = getIconPathByCode(prefs.ICONE)
            console.log('🖼️ Setting userImg from refresh to code:', prefs.ICONE)
            setUserImg(iconPath)
            localStorage.setItem('userIconCode', prefs.ICONE)
          }
        } else if (setUserImg) {
          console.log('📝 No preferences found on refresh, setting default icon')
          const userData = JSON.parse(localStorage.getItem('user'))
          const identidadeVisual = userData?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro'
          const defaultIcon = getDefaultIconByVisualIdentity(identidadeVisual)
          setUserImg(defaultIcon.path)
        }
      } else {
        console.log('🔒 No user logged in, skipping preference loading')
        // Set default theme for login page based on tenant
        const tenant = getTenantFromURL();
        document.documentElement.setAttribute('data-context', tenant.contextKey || 'SL');
        document.documentElement.setAttribute('data-theme', 'light')
      }
      setPreferencesLoaded(true)
    }
    
    loadPreferencesFromAPI()
  }, [])

  if (!preferencesLoaded) {
    return null
  }

  return <>{children}</>
}

// Component that handles page visibility and preference reload
function PageVisibilityHandler({ children }) {
  const { loadUserPrefs } = useUserPreferences()
  const { setUserImg } = useContext(AuthContext) || {}

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('📱 Page became visible, checking for preference updates...')
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userID')
        
        if (token && userId) {
          const prefs = await loadUserPrefs()
          if (prefs) {
            if (prefs.ESQUEMACORES) {
              document.documentElement.setAttribute('data-context', prefs.ESQUEMACORES)
            }
            if (prefs.TEMA !== undefined) {
              const themeValue = prefs.TEMA === true || prefs.TEMA === 'true'
              document.documentElement.setAttribute('data-theme', themeValue ? 'dark' : 'light')
            }
            if (prefs.ICONE && setUserImg) {
              const iconPath = getIconPathByCode(prefs.ICONE)
              setUserImg(iconPath)
            }
          }
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [loadUserPrefs, setUserImg])

  return <>{children}</>
}

// Component that uses the hook
function AppContent() {
  useSessionTimeout(30)
  
  return (
    <>
      <AuthProvider>
        <PluggyProvider>
          <PreferenceLoader>
            <PageVisibilityHandler>
              <ThemeSync>
                <RoutesApp/>
              </ThemeSync>
            </PageVisibilityHandler>
          </PreferenceLoader>
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
  // Detecta o tenant para definir o basename dinamicamente
  const [basename, setBasename] = useState('/salvalucro3');

  useEffect(() => {
    const tenant = getTenantFromURL();
    // O basename deve ser o caminho do tenant
    if (tenant) {
      setBasename(`/${tenant.path}`);
    }
    
    console.log('🏷️ Basename definido:', basename);
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