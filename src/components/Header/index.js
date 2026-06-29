import { Link, useNavigate } from "react-router-dom"
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink, FiHelpCircle, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import React, { useContext, useEffect, useState, useCallback, useRef } from "react"
import './header.scss'
import '../../index.scss'
import Relogio from "../Componente_Relogio"
import defaultImg from '../../assets/LOGO AZUL.png'

const Header = () => {
    const { logout, isCheckedCalendar, setIsCheckedCalendar, userImg, theme, toggleTheme } = useContext(AuthContext)

    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false)
    const [showExportacoesDropdown, setShowExportacoesDropdown] = useState(false)
    const [showUserDropdown, setShowUserDropdown] = useState(false)
    const userDropdownRef = useRef(null)
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const userData = JSON.parse(localStorage.getItem('userData'))
    
    const handleCheckboxChangeCalendar = useCallback(() => {
        setIsCheckedCalendar(!isCheckedCalendar)
    }, [isCheckedCalendar, setIsCheckedCalendar])

    const handleCheckboxChange = useCallback(() => {
        toggleTheme();
    }, [toggleTheme])
    
    const [optionsWithIcons, setOptionsWithIcons] = useState([])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

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

    const CustomCheckbox = React.memo(({ isChecked, handleCheckboxChange }) => {
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
    })

    const navigate = useNavigate()
    const handleLogo = useCallback(() => {
        navigate('/dashboard')
    }, [navigate])

    // Fixed: No fallback to localStorage Base64
    const getImageSource = useCallback(() => {
        return userImg || defaultImg
    }, [userImg])

    const handleUserProfileClick = () => {
        setShowUserDropdown(!showUserDropdown)
    }

    const handleNavigateToUserPage = () => {
        setShowUserDropdown(false)
        navigate('/usuario')
    }

    const handleLogout = () => {
        setShowUserDropdown(false)
        if (logout) {
            logout()
        }
    }

    return (  
        <div className="header-wrapper">
            <div className="header-container">
                <div className='header-bg-image'>
                    <div className="header-info-wrapper header-bg">
                        <div className='navbar-customer-wrapper me-2 text-truncate'>
                            <div className="toggle-container me-1">
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        id="toggleButton" 
                                        checked={theme} 
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="slider">
                                        <FiMoon/>
                                        <FiSun/>
                                    </span>
                                </label>
                            </div>
                            <div className='user-data'>
                                <div>{userData?.NOME || 'Usuário'}</div>
                                <div>{userData?.EMAIL || ''}</div>
                                <Relogio/>
                            </div>
                        </div>
                        <div className='btn-container' ref={userDropdownRef} onClick={handleUserProfileClick}>
                            <div className="user-profile-wrapper">
                                <img 
                                    className='image'
                                    src={getImageSource()}
                                    alt="User profile"
                                    onError={(e) => {
                                        console.log('Image failed to load, using default')
                                        e.target.src = defaultImg
                                    }}
                                />
                                <FiChevronDown className={`dropdown-chevron ${showUserDropdown ? 'rotated' : ''}`} />
                            </div>
                            
                            {showUserDropdown && (
                                <div className="user-dropdown-menu">
                                    <button 
                                        className="dropdown-item"
                                        onClick={handleNavigateToUserPage}
                                    >
                                        <FiUser className="dropdown-icon" />
                                        <span>Meu Perfil</span>
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button 
                                        className="dropdown-item logout-item"
                                        onClick={handleLogout}
                                    >
                                        <FiLogOut className="dropdown-icon" />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header