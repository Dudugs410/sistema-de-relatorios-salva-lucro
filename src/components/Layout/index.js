import Header from "../Header"
import Footer from "../Footer"
import SeletorCliente from "../SeletorCliente"

import './layout.css'


function Layout({ children }){
    return(
        <div className='layout'>
            <div className='appPage'>
                <Header />
                <SeletorCliente/>
                { children }
                
            </div>
        </div>

    )
}

export default Layout

//<Footer />