import React, { useEffect, useState, useContext } from "react"
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
    // Apply context from preferences if available
    if (currentContext) {
      document.documentElement.setAttribute('data-context', currentContext)
      // Cache context in localStorage
      localStorage.setItem('userContext', currentContext)
    }
    
    // Apply theme from preferences
    if (currentTheme !== undefined && currentTheme !== null) {
      const themeValue = currentTheme ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', themeValue)
      // Cache theme in localStorage
      localStorage.setItem('userTheme', String(currentTheme))
    }
  }, [currentContext, currentTheme])

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