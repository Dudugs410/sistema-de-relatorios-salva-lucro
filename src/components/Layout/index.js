import Header from "../Header"
import Footer from "../Footer"
import SeletorCliente from "../SeletorCliente"
import '../../styles/global.scss'
import './layout.scss'
import '../../pages/CadastroDeBancos/cadastroDeBancos.scss'
import SidebarMenu from '../Componente_SidebarMenu'

function Layout({ children }) {
  return (
    <div className='layout'>
      <div className='layout-content'>
        <div className='sidebar-content'>
          <SidebarMenu />
        </div>
        <div className='column-container'>
          <Header />
          <SeletorCliente />
          {children}
        </div>
        <Footer/>
      </div>

    </div>
  )
}

export default Layout
