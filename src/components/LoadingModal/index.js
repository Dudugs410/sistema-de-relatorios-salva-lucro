import React from "react"
import './loadingModal.scss'

const LoadingModal = () => {

    return(
        <>
            <div className="loadingModal">
                <div className='spinner-container'>
                    <span className='modal-text'>Loading...</span>
                    <div className='spinner'></div>
                </div>
            </div>
        </>
    )
}

export default LoadingModal