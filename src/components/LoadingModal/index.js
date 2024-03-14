import React, { useContext } from "react"
import './loadingModal.scss'
import LoadingIcons from 'react-loading-icons'
import { AuthContext } from "../../contexts/auth"

const LoadingModal = () => {

    const { isDarkTheme } = useContext(AuthContext)

    return(
        <>
            <div className={`loadingModal ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                { isDarkTheme ? <LoadingIcons.TailSpin stroke='white'/> : <LoadingIcons.Oval stroke='white'/> }
            </div>
        </>
    )
}

export default LoadingModal