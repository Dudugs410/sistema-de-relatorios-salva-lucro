import React, { useEffect, useState, useContext } from "react"
import { useLocation } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import SeletorCliente from "../SeletorCliente"
import '../../styles/global.scss'
import './layout.scss'
import '../../pages/CadastroDeBancos/cadastroDeBancos.scss'
import SidebarMenu from '../Componente_SidebarMenu'
import DadosGrupoCliente from "../Componente_DadosGrupoCliente"
import { getCurrentTenant } from '../../util/tenant'
import { FiMenu } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'

function Layout({ children }) {
  const location = useLocation()
  const [tenantInfo, setTenantInfo] = useState(null)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 946)
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)
  
  // Get user preferences from context
  const { 
    userPreferences,
    loadUserPreferences,
    currentContext,
    currentTheme
  } = useContext(AuthContext)

  // Function to apply theme and context
  const applyThemeAndContext = (context, theme) => {
    // Apply context
    if (context) {
      document.documentElement.setAttribute('data-context', context)
      localStorage.setItem('userContext', context)
    }
    
    // Apply theme
    if (theme !== undefined && theme !== null) {
      const themeValue = theme ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', themeValue)
      localStorage.setItem('userTheme', String(theme))
    }
  }

  // Load user preferences on mount
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const userId = localStorage.getItem('userID')
        if (userId) {
          await loadUserPreferences(userId)
        }
        // Mark theme as loaded even if there's no user ID
        setIsThemeLoaded(true)
      } catch (error) {
        // Silently fail - preferences will use defaults
        setIsThemeLoaded(true)
      }
    }
    
    loadPrefs()
  }, [])

  // Apply tenant context
  useEffect(() => {
    const tenant = getCurrentTenant()
    setTenantInfo(tenant)
    
    if (tenant) {
      document.documentElement.setAttribute('data-context', tenant.contextKey)
    }
  }, [])

  // Apply theme and context preferences when they change
  useEffect(() => {
    applyThemeAndContext(currentContext, currentTheme)
  }, [currentContext, currentTheme])

  // Re-apply theme on route changes (handles browser back/forward)
  useEffect(() => {
    // Get cached values from localStorage
    const cachedTheme = localStorage.getItem('userTheme')
    const cachedContext = localStorage.getItem('userContext')
    
    // Re-apply if we have cached values
    if (cachedContext || cachedTheme) {
      // Only re-apply if currentContext/currentTheme aren't set yet
      if (!currentContext && !currentTheme) {
        applyThemeAndContext(
          cachedContext || 'salvalucro',
          cachedTheme !== null ? cachedTheme === 'true' : false
        )
      }
    }
    
    // Also check sessionStorage as backup
    const sessionTheme = sessionStorage.getItem('themeMode')
    const sessionContext = sessionStorage.getItem('themeContext')
    
    if (sessionTheme || sessionContext) {
      if (!currentContext && !currentTheme) {
        applyThemeAndContext(
          sessionContext || 'salvalucro',
          sessionTheme === 'dark'
        )
      }
    }
    
    // Force a re-application of the theme from context if available
    if (currentContext || currentTheme !== undefined) {
      applyThemeAndContext(currentContext, currentTheme)
    }
    
    // Ensure the theme-applied attribute is present
    document.documentElement.setAttribute('data-theme-applied', 'true')
    
  }, [location.pathname]) // This triggers on every route change

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 946;
      setIsMobile(mobile);
      if (!mobile && sidebarVisible) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarVisible]);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && 
          sidebarVisible && 
          !event.target.closest('.sidebar-content') && 
          !event.target.closest('.hamburger-button')) {
        setSidebarVisible(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && sidebarVisible) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [sidebarVisible, isMobile]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarVisible && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarVisible, isMobile]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // Show loading while theme is being loaded
  if (!isThemeLoaded) {
    return (
      <div className="layout-loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-color, #ffffff)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="spinner"></div>
        <p>Carregando preferências...</p>
      </div>
    )
  }

  if (!tenantInfo) {
    return (
      <div className="layout-loading">
        <div className="spinner"></div>
        <p>Carregando ambiente...</p>
      </div>
    )
  }

  return (
    <div className='layout'>
      {/* Hamburger Button - Shows only on mobile */}
      {isMobile && (
        <button 
          className="hamburger-button"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>
      )}
      
      {/* Overlay for mobile */}
      {isMobile && sidebarVisible && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
        />
      )}
      
      <div className='layout-content'>
        <div 
          className={`sidebar-content ${isMobile && sidebarVisible ? 'visible' : ''}`}
        >
          <SidebarMenu />
        </div>
        <div className='column-container'>
          <div className='header-container-fixed'>
            <Header />
          </div>
          <DadosGrupoCliente />
          <main className="layout-main">
            {children}
          </main>
        </div>
        {/*<Footer/>*/}
      </div>
    </div>
  )
}

export default Layout