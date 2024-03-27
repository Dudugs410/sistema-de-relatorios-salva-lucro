import Header from "../Header"
import Footer from "../Footer"
import SeletorClienteDev from "../SeletorCliente dev"
import './layout.scss'
import { FiMail, FiPlusCircle } from "react-icons/fi"
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

function Layout({ children }){
    const { isDarkTheme } = useContext(AuthContext)

    const handleClick = () => {
        console.log('handleClick')
    }

    return(
        <div className='layout'>
            <div className='appPage'>
                <Header />
                <SeletorClienteDev/>
                { children }
                <div className={`btn-contato-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <button className={`btn-global btn-contato ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} onClick={handleClick}>
                        <span><FiMail size={30}/></span>
                    </button>
                </div>
                <span className={`span-plus ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}><FiPlusCircle size={20}/></span>
                <Footer />
            </div>
        </div>

    )
}

export default Layout