import React from "react"
import './loadingModal.css'

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