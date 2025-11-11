import { Link, useNavigate } from "react-router-dom"
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink, FiHelpCircle } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import React, { useContext, useEffect, useState, useCallback } from "react"
import './header.scss'
import '../../index.scss'
import Relogio from "../Componente_Relogio"

import './header.scss'

const useTheme = (updateUser) => {
    const [isChecked, setIsChecked] = useState(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('=== THEME INIT DEBUG ===');
        console.log('User data:', userData);
        console.log('User TEMA:', userData?.TEMA);
        console.log('User TEMA type:', typeof userData?.TEMA);
        
        if (userData && userData.TEMA !== undefined && userData.TEMA !== null) {
            // CONVERT STRING TO BOOLEAN
            const temaBoolean = userData.TEMA === 'true' || userData.TEMA === true;
            console.log('Using user TEMA preference:', userData.TEMA, '→', temaBoolean);
            return temaBoolean;
        }
        
        console.log('No TEMA preference found, defaulting to false (light theme)');
        return false;
    });

    const toggleTheme = useCallback(() => {
        const updatedChecked = !isChecked;
        console.log('Toggling theme from', isChecked, 'to', updatedChecked);
        setIsChecked(updatedChecked);
      
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            userData.TEMA = updatedChecked;
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (updateUser) {
                console.log('Updating database TEMA to:', updatedChecked);
                updateUser(userData);
            }
        }

        document.documentElement.setAttribute('data-theme', updatedChecked ? 'dark' : 'light');
        console.log('Set data-theme to:', updatedChecked ? 'dark' : 'light');
        
        return updatedChecked;
    }, [isChecked, updateUser]);

    useEffect(() => {
        console.log('=== APPLYING THEME ===');
        console.log('isChecked:', isChecked);
        console.log('Setting data-theme to:', isChecked ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isChecked ? 'dark' : 'light');
    }, [isChecked]); // FIXED: Added isChecked dependency

    return {
        isChecked,
        toggleTheme,
        setIsChecked
    };
};

const Header = () => {
    const { logout, isCheckedCalendar, setIsCheckedCalendar, userImg, updateUser } = useContext(AuthContext)
    
    // Use the custom hook with memoized updateUser
    const { isChecked, toggleTheme } = useTheme(updateUser);

    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false)
    const [showExportacoesDropdown, setShowExportacoesDropdown] = useState(false)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const userData = JSON.parse(localStorage.getItem('userData'))
    
    const handleCheckboxChangeCalendar = useCallback(() => {
        setIsCheckedCalendar(!isCheckedCalendar)
    }, [isCheckedCalendar, setIsCheckedCalendar])

    const handleCheckboxChange = useCallback(() => {
        toggleTheme();
    }, [toggleTheme])
    
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
        if (userImg) return userImg;
        
        const localUser = JSON.parse(localStorage.getItem('user'));
        return localUser?.IMAGEMBASE64 || '';
    }, [userImg])

    return (  
        <div className="header-container">
            <div className='header-bg-image'>
                <div className="header-info-wrapper header-bg">
                    <div className='navbar-customer-wrapper me-2 text-truncate'>
                        <div className="toggle-container me-1">
                            <label className="switch">
                                <input 
                                    type="checkbox" 
                                    id="toggleButton" 
                                    checked={isChecked} 
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
                    <div className='btn-container'>
                        <img 
                            className='image'
                            src={getImageSource()}
                            alt="User profile"
                            onClick={() => {navigate('/usuario')}}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNEOEQ4RDgiLz4KPHBhdGggZD0iTTIwIDIyQzIyLjIwOTEgMjIgMjQgMjAuMjA5MSAyNCAxOEMyNCAxNS43OTA5IDIyLjIwOTEgMTQgMjAgMTRDMTcuNzkwOSAxNCAxNiAxNS43OTA5IDE2IDE4QzE2IDIwLjIwOTEgMTcuNzkwOSAyMiAyMCAyMloiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTIwIDguNUMxOC44OTU0IDguNSAxOC4wMzU3IDkuMzU5NzQgMTguMDM1NyAxMC40NjQzQzE8LjAzNTcgMTEuNTY4OSAxOC44OTU0IDEyLjQyODYgMjAgMTIuNDI4NkMyMS4xMDQ2IDEyLjQyODYgMjEuOTY0MyAxMS41Njg5IDIxLjk2NDMgMTAuNDY0M0MyMS45NjQzIDkuMzU5NzQgMjEuMTA0NiA4LjUgMjAgOC41WiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K';
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header