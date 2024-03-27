import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiList, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiMenu } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import salvaLucroLogoBranco from '../../assets/LogoTopo.png';
import './header.scss';
import '../../index.scss';
import Cookies from "js-cookie";
import Relogio from "../Componente_Relogio";

const Header = () => {
    const { logout, isDarkTheme, setIsDarkTheme, isCheckedCalendar, setIsCheckedCalendar,} = useContext(AuthContext)

    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') === 'true')
    
    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false)
    const [showExportacoesDropdown, setShowExportacoesDropdown] = useState(false)

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1231);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1231);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
            'FiSettings': FiSettings,
            'FiTruck': FiTruck,
            'FiShoppingBag': FiShoppingBag,
        };

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard'},
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas'},
            { nome: 'Créditos', icone: icones['FiCreditCard'], rota: '/creditos'},
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos'},
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

const SideBar = () =>{
    useEffect(() => {
        function handleClickOutside(event) {
            const sidebarButton = document.querySelector('.side-bar-container .btn-primary');
            const collapseElement = document.getElementById('multiCollapseExample1');
            
            // Check if click occurred outside the collapsed sidebar and the sidebar button is not clicked
            if (collapseElement && !collapseElement.contains(event.target) && event.target !== sidebarButton) {
                const collapse = bootstrap.Collapse.getInstance(collapseElement);
                if (collapse && !collapse._isTransitioning) {
                    collapse.hide();
                }
            }
        }

        // Add event listener to detect clicks on document body
        document.addEventListener('click', handleClickOutside);

        return () => {
            // Remove event listener when component unmounts
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className='side-bar-container'>
            <p className='p-side-bar'>
                <a className={`btn btn-primary btn-global a-side-bar ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} data-bs-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><FiMenu size={30}/></a>
            </p>
            <div>
                <div>
                    <div className="collapse multi-collapse" id="multiCollapseExample1">
                        <div>
                            <ul className={`mobile ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                                {optionsWithIcons.map((option, index) => (
                                    <li className="li-sidebar" key={index}>
                                        {option.children ? (
                                            <div className="dropend">
                                                <button className={`px-2 me-1 btn-mobile dropdown-toggle ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} type="button" id={`dropdownMenuButton${index}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                    {option.icone && React.createElement(option.icone)}
                                                    <span className="mb-auto mobile">{option.nome}</span>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-mobile" aria-labelledby={`dropdownMenuButton${index}`} style={{left: 'auto', right: 0}}>
                                                    {option.children.map((childOption, childIndex) => (
                                                        <li className='li-side-bar' key={childIndex}>
                                                            <Link to={childOption.rota} className={`dropdown-item ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                                                                <button className={`px-2 btn-mobile ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                                    {childOption.icone && React.createElement(childOption.icone)}
                                                                    <span className="mb-auto mobile">{childOption.nome}</span>
                                                                </button>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <Link to={option.rota} className="nav-hover active text-shadow">
                                                <button className={`px-2 me-1 btn-mobile ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                    {option.icone && React.createElement(option.icone)}
                                                    <span className="mb-auto mobile">{option.nome}</span>
                                                </button>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }

    const navigate = useNavigate()

    const handleLogo = () => {
        navigate('/dashboard')
    }

    return (
        <>
            <div className="header-bg-image">
                <div className={`header-bg ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className='navbar-title'>
                        <img className='img-header' src={salvaLucroLogoBranco} alt='logo salva lucro' onClick={handleLogo}/>
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

                <SideBar/>

                <div className='header-content'>
                    <div className={`barra-header ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                        <div className="li-container px-3">
                            <ul className={`navbar-nav pe-2 ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                            {optionsWithIcons.length > 0 && optionsWithIcons.map((opcao, index) => (
                                <li className="nav-item" key={index}>
                                    {opcao.children ? (
                                        <div className="nav-hover dropdown" onMouseEnter={() => {
                                            if(opcao.nome === 'Relatórios') {
                                                setShowRelatoriosDropdown(true);
                                            } else if (opcao.nome === 'Exportações') {
                                                setShowExportacoesDropdown(true);
                                            }
                                        }} onMouseLeave={() => {
                                            if(opcao.nome === 'Relatórios') {
                                                setShowRelatoriosDropdown(false);
                                            } else if (opcao.nome === 'Exportações') {
                                                setShowExportacoesDropdown(false);
                                            }
                                        }}>
                                            <button className={`px-2 me-1 li-button-content nav-hover-button dropdown-button ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                                                {opcao.icone && React.createElement(opcao.icone)}
                                                <span className="ms-1 mt-2 mb-auto li-btn-text">{opcao.nome}</span>
                                            </button>
                                            <div className={`dropdown-menu-normal ${isDarkTheme ? 'dark-theme' : 'light-theme'} ${opcao.nome === 'Relatórios' ? (showRelatoriosDropdown ? 'show' : '') : (opcao.nome === 'Exportações' ? (showExportacoesDropdown ? 'show' : '') : '')}`} aria-labelledby="dropdownMenuButton" style={{ position: 'absolute', top: '100%', left: 0 }}>
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
