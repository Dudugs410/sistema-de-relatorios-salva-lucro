import React, { useEffect, useState, useContext } from "react"
import Header from "../Header"
import Footer from "../Footer"
import SeletorCliente from "../SeletorCliente"
import '../../styles/global.scss'
import './layout.scss'
import '../../styles/page.scss'
import '../../pages/CadastroDeBancos/Bancos.scss'
import SidebarMenu from '../Componente_SidebarMenu'
import DadosGrupoCliente from "../Componente_DadosGrupoCliente"
import { applyTheme } from '../../util/contextUtils'
import { FiMenu } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'

function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 946)

  const { theme, isThemeLoaded } = useContext(AuthContext)

  useEffect(() => {
    if (isThemeLoaded) {
      applyTheme(!!theme)
    }
  }, [theme, isThemeLoaded])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 946
      setIsMobile(mobile)
      if (!mobile && sidebarVisible) {
        setSidebarVisible(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarVisible])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile &&
          sidebarVisible &&
          !event.target.closest('.sidebar-content') &&
          !event.target.closest('.hamburger-button')) {
        setSidebarVisible(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && sidebarVisible) {
        setSidebarVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [sidebarVisible, isMobile])

  useEffect(() => {
    if (sidebarVisible && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarVisible, isMobile])

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible)
  const closeSidebar = () => setSidebarVisible(false)

  if (!isThemeLoaded) {
    return (
      <div className="layout-loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Carregando ambiente...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className='layout'>
      {isMobile && (
        <button
          className="hamburger-button"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--text-color, #333)'
          }}
        >
          <FiMenu size={24} />
        </button>
      )}

      {isMobile && sidebarVisible && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
        />
      )}

      <div className='layout-content' style={{
        display: 'flex',
        minHeight: '100vh'
      }}>
        <div
          className={`sidebar-content ${isMobile && sidebarVisible ? 'visible' : ''}`}
          style={{
            width: isMobile ? '280px' : '250px',
            flexShrink: 0,
            backgroundColor: 'var(--sidebar-bg, #fff)',
            borderRight: '1px solid var(--border-color, #e0e0e0)',
            transition: 'transform 0.3s ease',
            position: isMobile ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 999,
            transform: isMobile && !sidebarVisible ? 'translateX(-100%)' : 'translateX(0)',
            overflowY: 'auto'
          }}
        >
          <SidebarMenu />
        </div>
        <div className='column-container' style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          <div className='header-container-fixed' style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'var(--header-bg, #fff)',
            borderBottom: '1px solid var(--border-color, #e0e0e0)'
          }}>
            <Header />
          </div>
          <DadosGrupoCliente />
          <main className="layout-main" style={{
            flex: 1,
            padding: '20px',
            backgroundColor: 'var(--background-color)'
          }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout