import React, { useContext } from "react"
import './loadingModal.scss'
import { AuthContext } from "../../contexts/auth"
import { ProgressBar } from "react-bootstrap"

const LoadingModal = () => {

    const { isDarkTheme } = useContext(AuthContext)

    return(
        <>
            <div className='loading-modal'>
                <ProgressBar animated now={100} label={'Carregando'}/>
            </div>
        </>
    )
}

export default LoadingModal