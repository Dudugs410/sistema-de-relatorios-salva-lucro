import { Link } from "react-router-dom";
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiList, FiPaperclip } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth";
import React, { useContext, useEffect, useState } from "react";
import salvaLucroLogoBranco from '../../assets/LogoTopo.png';
import './header.scss';
import '../../index.scss';
import Cookies from "js-cookie";
import Relogio from "../Componente_Relogio";

const Header = () => {
    const { logout, isDarkTheme, setIsDarkTheme, isCheckedCalendar, setIsCheckedCalendar,} = useContext(AuthContext);

    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') === 'true');
    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false);
    const [showExportacoesDropdown, setShowExportacoesDropdown] = useState(false); // New state variable

    const handleCheckboxChangeCalendar = () => {
		setIsCheckedCalendar(!isCheckedCalendar); // Toggle the state
	  };
  
	  useEffect(()=>{
		console.log('checkbox marcada? ', isCheckedCalendar)
        if (localStorage.getItem('localUsers') !== null) {
            let localUsersTemp = JSON.parse(localStorage.getItem('localUsers'));
            localUsersTemp.map(user => {
                if (user.id === Cookies.get('userID')) {
                    user.calendar = isCheckedCalendar;
                }
            });
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp));
        } else {
            let localUsersTemp = [];
            let userTemp = { id: Cookies.get('userID'), calendar: isCheckedCalendar };
            localUsersTemp.push(userTemp);
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp));
        }
	  },[isCheckedCalendar])

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
            'FiDownload': FiDownload,
            'FiPaperClip': FiPaperclip,
        };

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard' },
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas' },
            { nome: 'Créditos', icone: icones['FiCreditCard'], rota: '/creditos' },
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos' },
            { nome: 'Relatórios', icone: icones['FiFileText'], children: [
                { nome: 'Financeiro', rota: '/financeiro' },
                { nome: 'Gerenciais', rota: '/gerenciais' },
            ]},
            { nome: 'Exportações', icone: icones['FiDownload'], children: [
                { nome: 'Sysmo', rota: '/sysmo' },
                { nome: 'Meta', rota: '/meta' },
                { nome: 'Meta Sapiranga', rota: '/metasapiranga' },
            ]},
            { nome: 'Administração', icone: icones['FiPaperClip'], rota: '/administracao' },
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

const CustomCheckbox = ({ isChecked, handleCheckboxChange }) => {
  return (
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className={`checkbox-input ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
      />
      <span className={`checkbox-custom ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}></span> {/* This is for the custom checkbox appearance */}
      <span className={`checkbox-icon ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <FiCalendar className={`calendar-icon ${isDarkTheme ? 'dark-theme' : 'light-theme'} ${isCheckedCalendar ? 'isCheckedCalendar' : ''}`} size={20} />
      </span>
    </label>
  );
};

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
                                        <div className="nav-hover dropdown" onMouseEnter={() => {
                                            if (opcao.nome === 'Relatórios') {
                                                setShowRelatoriosDropdown(true);
                                            } else if (opcao.nome === 'Exportações') {
                                                setShowExportacoesDropdown(true);
                                            }
                                        }} onMouseLeave={() => {
                                            if (opcao.nome === 'Relatórios') {
                                                setShowRelatoriosDropdown(false);
                                            } else if (opcao.nome === 'Exportações') {
                                                setShowExportacoesDropdown(false);
                                            }
                                        }}>
                                            <button className={`px-2 me-1 li-button-content nav-hover-button dropdown-button ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                {opcao.icone && React.createElement(opcao.icone)}
                                                <span className="ms-1 mt-2 mb-auto li-btn-text">{opcao.nome}</span>
                                            </button>
                                            <div className={`dropdown-menu ${isDarkTheme ? 'dark-theme' : 'light-theme'} ${opcao.nome === 'Relatórios' ? (showRelatoriosDropdown ? 'show' : '') : (showExportacoesDropdown ? 'show' : '')}`} aria-labelledby="dropdownMenuButton" style={{ position: 'absolute', top: '100%', left: 0 }}>
                                                {opcao.children.map((childOption, childIndex) => (
                                                    <Link key={childIndex} to={childOption.rota} className={`dropdown-item ${isDarkTheme ? 'dark-theme' : 'light-theme'} relatorios-child`}>
                                                        <button className={`px-2 me-1 li-button-content nav-hover-button dropdown-button ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                            <span className="ms-1 mt-2 mb-auto li-btn-text span-option">{childOption.nome}</span>
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
                                <CustomCheckbox isChecked={isCheckedCalendar} handleCheckboxChange={handleCheckboxChangeCalendar}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;
