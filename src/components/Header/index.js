import { Link, useNavigate } from "react-router-dom"
import { FiMoon, FiSun, FiCalendar, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import React, { useContext, useEffect, useState, useCallback, useRef } from "react"
import './header.scss'
import '../../index.scss'
import Relogio from "../Componente_Relogio"
import defaultImg from '../../assets/LOGO AZUL.png'

const Header = () => {
    const { logout, isCheckedCalendar, setIsCheckedCalendar, userImg, theme, toggleTheme, isThemeLoaded } = useContext(AuthContext)

    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false)
    const [showExportacoesDropdown, setShowExportacoesDropdown] = useState(false)
    const [showUserDropdown, setShowUserDropdown] = useState(false)
    const userDropdownRef = useRef(null)
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const userData = JSON.parse(localStorage.getItem('userData'))
    
    const handleCheckboxChangeCalendar = useCallback(() => {
        setIsCheckedCalendar(!isCheckedCalendar)
    }, [isCheckedCalendar, setIsCheckedCalendar])

    const handleToggleTheme = useCallback(() => {
        if (toggleTheme) {
            toggleTheme();
        }
    }, [toggleTheme])
    
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

    if (!isThemeLoaded) {
        return (
            <div className="header-wrapper">
                <div className="header-container">
                    <div className='header-bg-image'>
                        <div className="header-info-wrapper header-bg-header">
                            <div className='navbar-customer-wrapper me-2 text-truncate'>
                                <div className="toggle-container me-1">
                                    <label className="switch">
                                        <input 
                                            type="checkbox" 
                                            id="toggleButton" 
                                            checked={false} 
                                            onChange={() => {}}
                                        />
                                        <span className="slider">
                                            <FiMoon/>
                                            <FiSun/>
                                        </span>
                                    </label>
                                </div>
                                <div className='user-data'>
                                    <div>Carregando...</div>
                                    <div></div>
                                    <Relogio/>
                                </div>
                            </div>
                            <div className='btn-container'>
                                <div className="user-profile-wrapper">
                                    <img 
                                        className='image'
                                        src={defaultImg}
                                        alt="User profile"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (  
        <div className="header-wrapper">
            <div className="header-container">
                <div className='header-bg-image'>
                    <div className="header-info-wrapper header-bg-header">
                        <div className='navbar-customer-wrapper me-2 text-truncate'>
                            <div className="toggle-container me-1">
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        id="toggleButton" 
                                        checked={theme} 
                                        onChange={handleToggleTheme}
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