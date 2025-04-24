import React, { useContext } from "react"
import './LazyLoader.scss'
import LoadingIcons from 'react-loading-icons'
import { AuthContext } from "../../contexts/auth"

const LazyLoader = () => {

    return(
        <div className='lazy-loader'>
            <div className="lazy-loading-animation">
                <div className='lazy-loading-spinner'></div>
                <div className='lazy-loading-text'></div>
            </div>
        </div>
    )
}

export default LazyLoader