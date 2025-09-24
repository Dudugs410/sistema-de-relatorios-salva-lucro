import { Link, useNavigate } from "react-router-dom"
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink, FiHelpCircle } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import React, { useContext, useEffect, useState } from "react"
import salvaLucroLogoBranco from '../../assets/LogoTopo.png'
import './header.scss'
import '../../index.scss'
import Cookies from "js-cookie"
import Relogio from "../Componente_Relogio"
import SideBar from "../Componente_SideBar"
import Modal from "../Modal"
import './header.scss'
import SeletorCliente from "../SeletorCliente"

const Header = () => {
    const { logout, isCheckedCalendar, setIsCheckedCalendar, userImg, updateUser } = useContext(AuthContext)
    let user = JSON.parse(localStorage.getItem('user'))

    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') ? false : true )
    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false)
    const [showExportacoesDropdown, setShowExportacoesDropdown] = useState(false)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const userData = JSON.parse(localStorage.getItem('userData'))
    
    // Use the global userImg directly from context - no local image state needed

    const handleCheckboxChangeCalendar = () => {
        setIsCheckedCalendar(!isCheckedCalendar)
    }
  
    useEffect(() => {
        if (localStorage.getItem('localUsers') !== null) {
            let localUsersTemp = JSON.parse(localStorage.getItem('localUsers'))
            localUsersTemp.map(user => {
                if (user.id === localStorage.getItem('userID')) {
                    user.calendar = isCheckedCalendar
                }
            })
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp))
        } else {
            let localUsersTemp = []
            let userTemp = { id: localStorage.getItem('userID'), calendar: isCheckedCalendar }
            localUsersTemp.push(userTemp)
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp))
        }
    },[isCheckedCalendar])

    const handleCheckboxChange = () => {
        const updatedChecked = !isChecked
        setIsChecked(updatedChecked)
        localStorage.setItem('isChecked', updatedChecked)
      
        if (localStorage.getItem('user') !== null) {
            user = JSON.parse(localStorage.getItem('user'))
            user.TEMA = updatedChecked
            localStorage.setItem('user', JSON.stringify(user))
            updateUser(user)
        }
    }

    useEffect(() => {
        setIsChecked(JSON.parse(localStorage.getItem('isChecked')))
    }, [])

    useEffect(() => {
        // atualiza _variables.scss com as propriedades do tema selecionado
        const root = document.documentElement
        if (isChecked) {
            root.style.setProperty('--primary-color', 'var(--primary-color-dark)')
            root.style.setProperty('--secondary-color', 'var(--secondary-color-dark)')
            root.style.setProperty('--background-color', 'var(--background-color-dark)')
            root.style.setProperty('--font-color', 'var(--font-color-dark)')
            root.style.setProperty('--table-background', 'var(--table-background-dark)')
            root.style.setProperty('--header-text-color', 'var(--header-text-color-dark)')
            root.style.setProperty('--modalidades-border', 'var(--modalidades-border-dark)')
            root.style.setProperty('--table-row-hover-color', 'var(table-row-hover-color-dark)')
            root.style.setProperty('--table-row-hover-bg', 'var(--table-row-hover-bg-dark)')
            root.style.setProperty('--header-bg', 'var(--header-bg-dark)')
            root.style.setProperty('--calendar-cell-color', 'var(--calendar-cell-color-dark)')                  
            root.style.setProperty('--calendar-now-color', 'var(--calendar-now-color-dark)')
            root.style.setProperty('--calendar-neighbor-color', 'var(--calendar-neighbor-color-dark)')
            root.style.setProperty('--calendar-btn-navigation-color', 'var(--calendar-btn-navigation-color-dark)')
            root.style.setProperty('--calendar-neighbor-bg', 'var(--calendar-neighbor-bg-dark)')
            root.style.setProperty('--subtitle-color', 'var(--subtitle-dark)')
            root.style.setProperty('--sidebar-font-color', 'var(sidebar-font-color-dark)')   
        } else { 
            root.style.setProperty('--primary-color', 'var(--primary-color-light)')
            root.style.setProperty('--secondary-color', 'var(--secondary-color-light)')
            root.style.setProperty('--background-color', 'var(--background-color-light)')
            root.style.setProperty('--font-color', 'var(--font-color-light)')
            root.style.setProperty('--table-background', 'var(--table-background-light)')
            root.style.setProperty('--header-text-color', 'var(--header-text-color-light)')
            root.style.setProperty('--modadlidades-border', 'var(modalidades-border-light)')
            root.style.setProperty('--table-row-hover-color', 'var(table-row-hover-color-light)')
            root.style.setProperty('--table-row-hover-bg', 'var(--table-row-hover-bg-light)')
            root.style.setProperty('--header-bg', 'var(--header-bg-light)')
            root.style.setProperty('--calendar-cell-color', 'var(--calendar-cell-color-light)')                  
            root.style.setProperty('--calendar-now-color', 'var(--calendar-now-color-light)')
            root.style.setProperty('--calendar-neighbor-color', 'var(--calendar-neighbor-color-light)')
            root.style.setProperty('--calendar-btn-navigation-color', 'var(--calendar-btn-navigation-color-light)')
            root.style.setProperty('--calendar-neighbor-bg', 'var(--calendar-neighbor-bg-light)')
            root.style.setProperty('--subtitle-color', 'var(--subtitle-light)')
            root.style.setProperty('--sidebar-font-color', 'var(sidebar-font-color-light)')
        }
    },[isChecked])
    
    const [optionsWithIcons, setOptionsWithIcons] = useState([])

    useEffect(() => {
        const icones = {
            'FiHome': FiHome,
            'FiDollarSign': FiDollarSign,
            'FiCreditCard': FiCreditCard,
            'FiRefreshCcw': FiRefreshCcw,
            'FiTool': FiTool,
            'FiFileText': FiFileText,
            'FiClipboardSign': FiClipboard,
            'FiDownload': FiDownload,
            'FiPaperClip': FiPaperclip,
            'FiSettings': FiSettings,
            'FiTruck': FiTruck,
            'FiShoppingBag': FiShoppingBag,
            'FiTable': FiTable,
            'FiLink': FiLink,
        }

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard' },
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas' },
            { nome: 'Créditos', icone: icones['FiCreditCard'], rota: '/creditos' },
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos' },
            { nome: 'Bancos', icone: icones['FiLink'], rota: '/cadastrodebancos' },
            { nome: 'Taxas', icone: icones['FiTable'], rota: '/taxas'},
            { nome: 'Extratos', icone: icones['FiCreditCard'], rota: '/extrato'},
            { nome: 'Relatórios', icone: icones['FiFileText'], children: [
            { nome: 'Financeiro', rota: '/financeiro' },
            { nome: 'Gerenciais', rota: '/gerenciais' },
            { nome: 'Outros', rota: '/outrosrelatorios'},
            ]},
            { nome: 'Exportações', icone: icones['FiDownload'], children: [
                { nome: 'Sysmo', rota: '/sysmo' },
                { nome: 'Meta', rota: '/meta' },
                { nome: 'Meta Sapiranga', rota: '/metasapiranga' },
            ]},
           { nome: 'Administração', icone: icones['FiPaperClip'], rota: '/administracao'},
            { nome: 'Suporte', icone: icones['FiSettings'], rota: '/suporte'},
            { nome: 'Delivery', icone: icones['FiTruck'], rota: '/vendasdelivery'},
            { nome: 'Conciliacao', icone: icones['FiShoppingBag'], rota: '/conciliacao'},
        ]

        let arrayOpcoes = []

        orderedOptions.forEach((option, index) => {
            if (option.children) {
                arrayOpcoes.push(option)
            } else {
                arrayOpcoes.push(option)
            }
        })
        setOptionsWithIcons(arrayOpcoes)
    }, [])

    const CustomCheckbox = ({ isChecked, handleCheckboxChange }) => {
        return (
            <label className="checkbox-label">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className='checkbox-input'
            />
            <span className='checkbox-custom'></span>
            <span className='checkbox-icon'>
                <FiCalendar className={`calendar-icon ${isCheckedCalendar ? 'isCheckedCalendar' : ''}`} size={20} />
            </span>
            </label>
        )
    }

    const navigate = useNavigate()
    const handleLogo = () => {
        navigate('/dashboard')
    }

    // Get fallback image from localStorage if userImg is not available
    const getImageSource = () => {
        if (userImg) return userImg;
        
        // Fallback to localStorage user image
        const localUser = JSON.parse(localStorage.getItem('user'));
        return localUser?.IMAGEMBASE64 || '';
    }

    return (  
        <div className="header-container">
            <div className='header-bg-image'>
                <div className="header-info-wrapper header-bg">
                    <div className='navbar-customer-wrapper me-2 text-truncate'>
                        <div className="toggle-container me-1">
                            <label className="switch">
                                <input type="checkbox" id="toggleButton" checked={isChecked} onChange={handleCheckboxChange}/>
                                <span className="slider"><FiMoon/><FiSun/></span>
                            </label>
                        </div>
                        <div className='user-data'>
                            <div>{userData?.NOME || 'Usuário'}</div>
                            <div>{userData?.EMAIL || ''}</div>
                            <Relogio/>
                        </div>
                    </div>
                    <div className='btn-container'>
                        <img 
                            className='image'
                            src={getImageSource()}
                            alt="User profile"
                            onClick={() => {navigate('/usuario')}}
                            onError={(e) => {
                                // Final fallback if image fails to load
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNEOEQ4RDgiLz4KPHBhdGggZD0iTTIwIDIyQzIyLjIwOTEgMjIgMjQgMjAuMjA5MSAyNCAxOEMyNCAxNS43OTA5IDIyLjIwOTEgMTQgMjAgMTRDMTcuNzkwOSAxNCAxNiAxNS43OTA5IDE2IDE4QzE2IDIwLjIwOTEgMTcuNzkwOSAyMiAyMCAyMloiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTIwIDguNUMxOC44OTU0IDguNSAxOC4wMzU3IDkuMzU5NzQgMTguMDM1NyAxMC40NjQzQzE4LjAzNTcgMTEuNTY4OSAxOC44OTU0IDEyLjQyODYgMjAgMTIuNDI4NkMyMS4xMDQ2IDEyLjQyODYgMjEuOTY0MyAxMS41Njg5IDIxLjk2NDMgMTAuNDY0M0MyMS45NjQzIDkuMzU5NzQgMjEuMTA0NiA4LjUgMjAgOC41WiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K';
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header