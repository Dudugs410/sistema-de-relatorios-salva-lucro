import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import '../../styles/global.scss'
import '../CadastroDeBancos/cadastroDeBancos.scss'

const OpenFinance = () => {
    return (
        <div className='appPage'>
            <div className='page-background-global'>
                <div className='page-content-global'>
                    <div className='page-content-bancos'>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenFinance