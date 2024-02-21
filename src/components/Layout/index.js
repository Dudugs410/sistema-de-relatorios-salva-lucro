import Header from "../Header"
import Footer from "../Footer"
import SeletorCliente from "../SeletorCliente"

import './layout.css'
import SeletorClienteDev from "../SeletorCliente dev"


function Layout({ children }){
    return(
        <div className='layout'>
            <div className='appPage'>
                <Header />
                <SeletorClienteDev/>
                { children }
                <Footer />
            </div>
        </div>

    )
}

export default Layout

//<Footer />