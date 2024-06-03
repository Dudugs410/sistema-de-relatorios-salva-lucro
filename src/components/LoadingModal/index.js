import React, { useContext, useEffect, useState } from "react"
import './loadingModal.scss'
import LoadingIcons from 'react-loading-icons'
import { AuthContext } from "../../contexts/auth"
import { ProgressBar } from "react-bootstrap"

const LoadingModal = () => {

    const { isDarkTheme } = useContext(AuthContext)

    return(
        <>
            <div className='loading-modal'>
                {/*<LoadingIcons.TailSpin stroke='white'/>*/}
                {/*<br/>*/}
                <ProgressBar animated now={100} label={'Carregando'}/>
            </div>
        </>
    )
}

export default LoadingModal