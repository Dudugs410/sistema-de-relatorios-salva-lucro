import Header from "../Header"
import Footer from "../Footer"

import './layout.css'

function Layout({ children }){
    return(
        <div className='layout'>
            <div className='appPage'>
                <Header />
                { children }
                <Footer />
            </div>
        </div>

    )
}

export default Layout