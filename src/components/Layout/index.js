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

function Layout({ children }) {
  const [tenantInfo, setTenantInfo] = useState(null)

  useEffect(() => {
    const tenant = getCurrentTenant()
    setTenantInfo(tenant)
    
    if (tenant) {
      document.documentElement.setAttribute('data-context', tenant.contextKey)
    }
    
    console.log('🏢 Layout - Tenant:', tenant)
  }, [])

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
      <div className='layout-content'>
        <div className='sidebar-content'>
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