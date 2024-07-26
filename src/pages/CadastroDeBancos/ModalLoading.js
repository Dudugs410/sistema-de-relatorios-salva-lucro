import React from "react"
import './modalLoading.scss'

const ModalLoading = () => {
    return(
        <div className='lazy-loader-modal'>
            <div className="lazy-loading-animation-modal">
                <div className='lazy-loading-spinner-modal'></div>
                <div className='lazy-loading-text-modal'></div>
            </div>
        </div>
    )
}

export default ModalLoading