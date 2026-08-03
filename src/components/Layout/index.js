import React, { useEffect, useState } from "react"
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

function Layout({ children }) {
  const [tenantInfo, setTenantInfo] = useState(null)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 946)

  useEffect(() => {
    const tenant = getCurrentTenant()
    setTenantInfo(tenant)
    
    if (tenant) {
      document.documentElement.setAttribute('data-context', tenant.contextKey)
    }
    
  }, [])

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