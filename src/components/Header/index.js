import { Link } from "react-router-dom";
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth";
import React, { useContext, useEffect, useState } from "react";
import salvaLucroLogoBranco from '../../assets/LogoTopo.png';
import './header.scss';
import '../../index.scss';
import Cookies from "js-cookie";
import Relogio from "../Componente_Relogio";

const Header = () => {
    const { logout, isDarkTheme, setIsDarkTheme } = useContext(AuthContext);

    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') === 'true');
    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false);

    const handleCheckboxChange = () => {
        const updatedChecked = !isChecked;
        setIsChecked(updatedChecked);
        setIsDarkTheme(updatedChecked);
        localStorage.setItem('isChecked', updatedChecked);
        localStorage.setItem('isDark', updatedChecked);

        if (localStorage.getItem('localUsers') !== null) {
            let localUsersTemp = JSON.parse(localStorage.getItem('localUsers'));
            localUsersTemp.map(user => {
                if (user.id === Cookies.get('userID')) {
                    user.theme = updatedChecked;
                }
            });
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp));
        } else {
            let localUsersTemp = [];
            let userTemp = { id: Cookies.get('userID'), theme: updatedChecked };
            localUsersTemp.push(userTemp);
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp));
        }
    }

    useEffect(() => {
        setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')));
    }, []);

    const [optionsWithIcons, setOptionsWithIcons] = useState([]);

    useEffect(() => {
        const icones = {
            'FiHome': FiHome,
            'FiDollarSign': FiDollarSign,
            'FiCreditCard': FiCreditCard,
            'FiRefreshCcw': FiRefreshCcw,
            'FiTool': FiTool,
            'FiFileText': FiFileText,
            'FiClipboardSign': FiClipboard,
        };

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard' },
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas' },
            { nome: 'Créditos', icone: icones['FiCreditCard'], rota: '/creditos' },
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos' },
            { nome: 'Relatórios', icone: icones['FiFileText'], children: [
                { nome: 'Financeiro', rota: '/financeiro' },
                { nome: 'Gerenciais', rota: '/gerenciais' }
            ]}
        ];

        let arrayOpcoes = [];

        orderedOptions.forEach((option, index) => {
            if (option.children) {
                arrayOpcoes.push(option);
            } else {
                arrayOpcoes.push(option);
            }
        });

        setOptionsWithIcons(arrayOpcoes);
    }, []);

    return (
        <>
            <div className="header-bg-image">
                <div className={`header-bg ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className='navbar-title'>
                        <img className='img-header' src={salvaLucroLogoBranco} alt='logo salva lucro'/>
                    </div>
                    <div className="header-info-wrapper px-4 py-3">
                        <div className='navbar-customer-wrapper me-2 text-truncate'>
                            <Relogio/>
                        </div>
                        <div className='btn-container'>
                            <button type='button' className='btn btn-outline-danger px-2 py-1' onClick={logout}>Sair</button>
                        </div>
                    </div>
                </div>

                <div className='header-content'>
                    <div className={`barra-header ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                        <div className="li-container px-3">
                            <ul className={`navbar-nav pe-2 ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                                {optionsWithIcons.length > 0 && optionsWithIcons.map((opcao, index) => (
                                    <li className="nav-item" key={index}>
                                    {opcao.children ? (
                                        <div className="nav-hover dropdown" onMouseEnter={() => setShowRelatoriosDropdown(true)} onMouseLeave={() => setShowRelatoriosDropdown(false)}>
                                            <button className={`px-2 me-1 li-button-content nav-hover-button dropdown-button ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} style={{ width: '120px' }}>
                                                {opcao.icone && React.createElement(opcao.icone)}
                                                <span className="ms-1 mt-2 mb-auto li-btn-text">{opcao.nome}</span>
                                            </button>
                                            <div className={`dropdown-menu ${isDarkTheme ? 'dark-theme' : 'light-theme'} ${showRelatoriosDropdown ? 'show' : ''}`} aria-labelledby="dropdownMenuButton" style={{ position: 'absolute', top: '100%', left: 0 }}>
                                                {opcao.children.map((childOption, childIndex) => (
                                                    <Link key={childIndex} to={childOption.rota} className={`dropdown-item ${isDarkTheme ? 'dark-theme' : 'light-theme'} relatorios-child`}>
                                                        <button className={`px-2 me-1 li-button-content nav-hover-button dropdown-button ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                            <span className="ms-1 mt-2 mb-auto li-btn-text ">{childOption.nome}</span>
                                                        </button>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={opcao.rota} className="nav-hover active text-shadow">
                                            <button className={`px-2 me-1 li-button-content nav-hover-button ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                {opcao.icone && React.createElement(opcao.icone)}
                                                <span className="ms-1 mt-2 mb-auto li-btn-text">{opcao.nome}</span>
                                            </button>
                                        </Link>
                                    )}
                                    </li>
                                ))}
                            </ul>
                            <div className="toggle-container me-1">
                                <label className="switch">
                                    <input type="checkbox" id="toggleButton" checked={isChecked} onChange={handleCheckboxChange}/>
                                    <span className="slider"><FiMoon/><FiSun/></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;
