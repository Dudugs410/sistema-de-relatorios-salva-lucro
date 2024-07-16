import React, { useContext } from "react"
import './modalLoading.scss'
import LoadingIcons from 'react-loading-icons'
import { AuthContext } from "../../contexts/auth"

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