import React, { useContext } from "react"
import './LazyLoader.scss'
import LoadingIcons from 'react-loading-icons'
import { AuthContext } from "../../contexts/auth"

const LazyLoader = () => {

    const { isDarkTheme } = useContext(AuthContext)

    return(
        <div className={`lazy-loader ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <LoadingIcons.TailSpin stroke='white'/>
        </div>
    )
}

export default LazyLoader