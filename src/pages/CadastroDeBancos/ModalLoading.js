import React, { useContext } from "react"
import './modalLoading.scss'
import LoadingIcons from 'react-loading-icons'
import { AuthContext } from "../../contexts/auth"

const ModalLoading = () => {
    return(
        <div className='lazy-loader'>
            <div className="lazy-loading-animation">
                <div className='lazy-loading-spinner'></div>
                <div className='lazy-loading-text'></div>
            </div>
        </div>
    )
}

export default ModalLoading