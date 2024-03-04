import React from "react"
import '../LoadingModal/loadingModal.scss'

const LoadingScreen = () => {
    return(
        <>
            <div className="loadingModal">
                <div className='spinner-container'>
                    <span className='modal-text'> CARREGANDO ELEMENTO </span>
                    <div className='spinner'></div>
                </div>
            </div>
        </>
    )
}

export default LoadingScreen