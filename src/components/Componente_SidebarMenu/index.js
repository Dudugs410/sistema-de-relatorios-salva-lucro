import React, { useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.scss';
import salvaLucroLogoBranco from '../../assets/LogoTopo.png';
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink } from "react-icons/fi"
import { Collapse, Nav, Navbar, NavItem, NavLink, Button } from 'reactstrap';
import { AuthContext } from '../../contexts/auth';
import { FiMenu } from 'react-icons/fi'; // Import the menu icon
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [activeChild, setActiveChild] = useState(null);
    const [optionsWithIcons, setOptionsWithIcons] = useState([]);
    const [activeParent, setActiveParent] = useState(null);
    const [lastClicked, setLastClicked] = useState(null); // Track the last clicked option
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const navigate = useNavigate();

    const toggleDropdown = (parent) => {
        if (activeParent === parent) {
            setActiveParent(null); // Close the dropdown if it's already open
            setActiveChild(null); // Reset any active child when closing the parent
        } else {
            setActiveParent(parent);
            setActiveChild(null); // Reset any active child when a new parent is selected
            setLastClicked(parent); // Track this parent as the last clicked
        }
    }

    const handleChildClick = (child, navigationLink, parent) => {
        setActiveChild(child);
        setLastClicked(child); // Track this child as the last clicked
        setActiveParent(parent); // Keep the parent active
        navigate(navigationLink);
        setSidebarVisible(false); // Optionally close the sidebar after navigation
    };

    const handleParentClickWithoutChildren = (parent, navigationLink) => {
        setActiveParent(parent); // Mark this parent as active
        setActiveChild(null); // Reset the active child
        setLastClicked(parent); // Track this parent as the last clicked
        navigate(navigationLink);
        setSidebarVisible(false); // Optionally close the sidebar after navigation
    };

    const handleLogo = () => {
        navigate('/dashboard');
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
    };

    useEffect(() => {
        const icones = {
            'FiHome': FiHome,
            'FiDollarSign': FiDollarSign,
            'FiCreditCard': FiCreditCard,
            'FiTool': FiTool,
            'FiLink': FiLink,
            'FiFileText': FiFileText,
            'FiDownload': FiDownload,
            'FiPaperClip': FiPaperclip,
            'FiSettings': FiSettings,
            'FiTruck': FiTruck,
            'FiShoppingBag': FiShoppingBag,
            'FiTable': FiTable,
        };

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard' },
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas' },
            { nome: 'Créditos', icone: icones['FiCreditCard'], rota: '/creditos' },
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos' },
            { nome: 'Taxas', icone: icones['FiTable'], rota: '/taxas' },
            { nome: 'Extratos', icone: icones['FiCreditCard'], rota: '/extrato' },
        ];

        setOptionsWithIcons(orderedOptions);
    }, []);

    return (
        <>
            <Button className="sidebar-toggle" onClick={toggleSidebar}>
                <FiMenu />
            </Button>
            <div className={`d-flex flex-column bg-sidebar sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <div className='navbar-title'>
                    <img className='img-header' src={salvaLucroLogoBranco} alt='logo salva lucro' onClick={handleLogo} />
                </div>
                <Navbar color="light" light expand="md">
                    <Nav navbar className="flex-column w-100">
                        {optionsWithIcons.map((option, index) => (
                            <NavItem key={index}>
                                <NavLink 
                                    className={`b-links navlink-parent ${lastClicked === option.nome || activeParent === option.nome ? 'active-parent' : ''}`} 
                                    href="#" 
                                    onClick={() => option.children ? toggleDropdown(option.nome) : handleParentClickWithoutChildren(option.nome, option.rota)}
                                >
                                    &nbsp;<option.icone /><b>&nbsp;{option.nome}</b>
                                </NavLink>
                                {option.children && (
                                    <Collapse isOpen={activeParent === option.nome}>
                                        <Nav navbar className="flex-column ml-3">
                                            {option.children.map((child, childIndex) => (
                                                <NavItem key={childIndex}>
                                                    <NavLink 
                                                        className={`navlink-child ${lastClicked === child.nome ? 'active-child' : ''}`} 
                                                        onClick={() => handleChildClick(child.nome, child.rota, option.nome)}
                                                    >
                                                        {child.nome}
                                                    </NavLink>
                                                </NavItem>
                                            ))}
                                        </Nav>
                                    </Collapse>
                                )}
                            </NavItem>
                        ))}
                    </Nav>
                </Navbar>
            </div>
        </>
    );
}

export default Sidebar;

/*
    { nome: 'Bancos', icone: icones['FiLink'], rota: '/cadastrodebancos' },
    { nome: 'Taxas', icone: icones['FiTable'], rota: '/taxas' },
    { 
        nome: 'Relatórios', 
        icone: icones['FiFileText'], 
        children: [
            { nome: 'Financeiro', rota: '/financeiro' },
            { nome: 'Gerenciais', rota: '/gerenciais' },
            { nome: 'Outros', rota: '/outrosrelatorios' },
        ] 
    },
    { 
        nome: 'Exportações', 
        icone: icones['FiDownload'], 
        children: [
            { nome: 'Sysmo', rota: '/sysmo' },
            { nome: 'Meta', rota: '/meta' },
            { nome: 'Meta Sapiranga', rota: '/metasapiranga' },
        ] 
    },
    { nome: 'Administração', icone: icones['FiPaperClip'], rota: '/administracao' },
    { nome: 'Suporte', icone: icones['FiSettings'], rota: '/suporte' },
    { nome: 'Delivery', icone: icones['FiTruck'], rota: '/vendasdelivery' },
    { nome: 'Conciliação', icone: icones['FiShoppingBag'], rota: '/conciliacao' },
*/