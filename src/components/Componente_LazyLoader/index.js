import React, { useContext } from "react"
import './LazyLoader.scss'
import LoadingIcons from 'react-loading-icons'
import { AuthContext } from "../../contexts/auth"

const LazyLoader = () => {

    const { isDarkTheme } = useContext(AuthContext)

    return(
        <div className={`lazy-loader ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <div className="lazy-loading-animation">
                <div className={`lazy-loading-spinner ${ isDarkTheme ? 'dark-theme' : 'light-theme' }`}></div>
                <div className="lazy-loading-text"></div>
            </div>
        </div>
    )
}

export default LazyLoader