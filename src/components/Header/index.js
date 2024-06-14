import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiList, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiMenu, FiSidebar, FiTable, FiLink } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import salvaLucroLogoBranco from '../../assets/LogoTopo.png';
import './header.scss';
import '../../index.scss';
import Cookies from "js-cookie";
import Relogio from "../Componente_Relogio";
import SideBar from "../Componente_SideBar";

const Header = () => {
    const { logout, isCheckedCalendar, setIsCheckedCalendar } = useContext(AuthContext)

    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') ? false : true )
    
    const [showRelatoriosDropdown, setShowRelatoriosDropdown] = useState(false)
    const [showExportacoesDropdown, setShowExportacoesDropdown] = useState(false)

    // const usada para setar as opções de navagação as quais o usuario logado terá acesso
    const [clientOptions, setClientOptions] = useState([])

    const handleCheckboxChangeCalendar = () => {
		setIsCheckedCalendar(!isCheckedCalendar); // Toggle the state
	  };
  
	  useEffect(()=>{
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
        localStorage.setItem('isChecked', updatedChecked);
      
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
        setIsChecked(JSON.parse(localStorage.getItem('isChecked')));
    }, []);

    useEffect(()=>{
                // atualiza _variables.scss com as propriedades do tema selecionado
                const root = document.documentElement;
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

                }
    },[isChecked])
    
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
            'FiTable': FiTable,
            'FiLink': FiLink,
        };

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard' },
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas' },
            { nome: 'Créditos', icone: icones['FiCreditCard'], rota: '/creditos' },
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos' },
            //{ nome: 'Cadastro de Bancos', icone: icones['FiLink'], rota: '/cadastrodebancos' },
            //{ nome: 'Relatórios', icone: icones['FiFileText'], children: [
            //    { nome: 'Financeiro', rota: '/financeiro' },
            //    { nome: 'Gerenciais', rota: '/gerenciais' },
            //    { nome: 'Outros', rota: '/outrosrelatorios'},
            //]},
            { nome: 'Exportações', icone: icones['FiDownload'], children: [
                { nome: 'Sysmo', rota: '/sysmo' },
                //{ nome: 'Meta', rota: '/meta' },
                //{ nome: 'Meta Sapiranga', rota: '/metasapiranga' },
            ]},
            //{ nome: 'Administração', icone: icones['FiPaperClip'], rota: '/administracao'},
            //{ nome: 'Suporte', icone: icones['FiSettings'], rota: '/suporte'},
            //{ nome: 'Delivery', icone: icones['FiTruck'], rota: '/vendasdelivery'},
            //{ nome: 'Conciliacao', icone: icones['FiShoppingBag'], rota: '/conciliacao'},
            { nome: 'Taxas', icone: icones['FiTable'], rota: '/taxas'}
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
        className='checkbox-input'
      />
      <span className='checkbox-custom'></span> {/* aparencia da checkbox-custom */}
      <span className='checkbox-icon'>
        <FiCalendar className={`calendar-icon ${isCheckedCalendar ? 'isCheckedCalendar' : ''}`} size={20} />
      </span>
    </label>
  );
};

    const navigate = useNavigate()

    const handleLogo = () => {
        navigate('/dashboard')
    }

    return (
        <>
            <div className="header-bg-image">
                <div className='header-bg'>
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

                <SideBar options={ optionsWithIcons }/>

                <div className='header-content'>
                    <div className='barra-header'>
                        <div className="li-container px-3">
                            <ul className='navbar-nav pe-2'>
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
                                            <button className='px-2 me-1 li-button-content nav-hover-button dropdown-button'>
                                                {opcao.icone && React.createElement(opcao.icone)}
                                                <span className="ms-1 mt-2 mb-auto li-btn-text span-header">{opcao.nome}</span>
                                            </button>
                                            <div className={`dropdown-menu-normal ${opcao.nome === 'Relatórios' ? (showRelatoriosDropdown ? 'show' : '') : (opcao.nome === 'Exportações' ? (showExportacoesDropdown ? 'show' : '') : '')}`} aria-labelledby="dropdownMenuButton" style={{ position: 'absolute', top: '100%', left: 0 }}>
                                                {opcao.children.map((childOption, childIndex) => (
                                                    <Link key={childIndex} to={childOption.rota} className='dropdown-item relatorios-child'>
                                                        <button className='px-2 me-1 li-button-content nav-hover-button dropdown-button'>
                                                            <span className="ms-1 mt-2 mb-auto li-btn-text span-option">{childOption.nome}</span>
                                                        </button>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={opcao.rota} className="nav-hover active text-shadow">
                                            <button className='px-2 me-1 li-button-content nav-hover-button' >
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
