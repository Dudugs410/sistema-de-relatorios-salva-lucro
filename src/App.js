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

// Import icons for mapping
import icon1 from './assets/user_icons/ICON_LOGO_AZUL.png'
import icon2 from './assets/user_icons/ICON_LOGO_BRANCO.png'
import icon3 from './assets/user_icons/ICON_LOGO_PRETO.png'
import icon4 from './assets/user_icons/ICON_LOGO_ROSA.png'
import icon5 from './assets/user_icons/ICON_LOGO_VERDE.png'
import icon6 from './assets/user_icons/ICON_MG_SOLUCOES.png'
import icon7 from './assets/user_icons/ICON_SIFRA.png'
import icon8 from './assets/user_icons/ICON_SUPERJUR.png'
import icon9 from './assets/user_icons/ICON_CARD_DIGITAL.png'
import adminIcon1 from './assets/user_icons/ADMIN_ICON_1.png'
import adminIcon2 from './assets/user_icons/ADMIN_ICON_2.png'
import adminIcon3 from './assets/user_icons/ADMIN_ICON_3.png'

initializeContext()

// Icon mapping function
const getIconPathByCode = (code) => {
  const icons = {
    1: icon1,
    2: icon2,
    3: icon3,
    4: icon4,
    5: icon5,
    6: icon6,
    7: icon7,
    8: icon8,
    9: icon9,
    10: adminIcon1,
    11: adminIcon2,
    12: adminIcon3,
  }
  return icons[code] || icon1
}

// Component that loads user preferences on app start
function PreferenceLoader({ children }) {
  const { loadUserPrefs } = useUserPreferences()
  const { setUserImg } = useContext(AuthContext) || {}
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)

  useEffect(() => {
    const loadPreferencesFromAPI = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userID')
      
      if (token && userId) {
        console.log('🔄 Loading user preferences from API on app initialization...')
        
        const prefs = await loadUserPrefs()
        
        if (prefs) {
          console.log('✅ Preferences loaded from API:', prefs)
          
          // Apply color scheme to document
          if (prefs.ESQUEMACORES) {
            document.documentElement.setAttribute('data-context', prefs.ESQUEMACORES)
          }
          
          // Apply theme to document
          if (prefs.TEMA !== undefined) {
            const themeValue = prefs.TEMA === true || prefs.TEMA === 'true'
            document.documentElement.setAttribute('data-theme', themeValue ? 'dark' : 'light')
          }
          
          // Apply icon to header
          if (prefs.ICONE && setUserImg) {
            const iconPath = getIconPathByCode(prefs.ICONE)
            setUserImg(iconPath)
            localStorage.setItem('userIconCode', prefs.ICONE)
            console.log('🖼️ Applied icon from PreferenceLoader:', prefs.ICONE, iconPath)
          }
        } else {
          console.log('📝 No preferences found, using defaults')
          // Set default icon
          setUserImg(icon1)
        }
      }
      setPreferencesLoaded(true)
    }
    
    loadPreferencesFromAPI()
  }, [loadUserPrefs, setUserImg])

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
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📱 Page became visible, checking for preference updates...')
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userID')
        
        if (token && userId) {
          loadUserPrefs().then(prefs => {
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
          })
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
  useEffect(() => {
    const handlePageHide = () => {
      const sensitiveData = ['token', 'refreshToken', 'user']
      sensitiveData.forEach(key => sessionStorage.removeItem(key))
    }
    
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [])

  return (
    <BrowserRouter basename='/salvalucro3'>
      <AppContent />
    </BrowserRouter>
  )
}

export default App