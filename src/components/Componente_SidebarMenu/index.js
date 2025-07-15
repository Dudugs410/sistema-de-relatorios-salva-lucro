import React, { useContext, useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Sidebar.scss'
import salvaLucroLogoBranco from '../../assets/LogoTopo.png'
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink } from "react-icons/fi"
import { Collapse, Nav, Navbar, NavItem, NavLink, Button } from 'reactstrap'
import { AuthContext } from '../../contexts/auth'
import { FiMenu } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const [optionsWithIcons, setOptionsWithIcons] = useState([])
    const [activeParent, setActiveParent] = useState(null)
    const [lastClicked, setLastClicked] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(false)

    const navigate = useNavigate()

    const toggleDropdown = (parent) => {
        if (activeParent === parent) {
            setActiveParent(null)
            
        } else {
            setActiveParent(parent)
            setLastClicked(parent)
        }
    }

    const handleChildClick = (child, navigationLink, parent) => {
        setLastClicked(child)
        setActiveParent(parent)
        navigate(navigationLink)
        setSidebarVisible(false)
    }

    const handleParentClickWithoutChildren = (parent, navigationLink) => {
        setActiveParent(parent)
        setLastClicked(parent)
        navigate(navigationLink)
        setSidebarVisible(false)
    }

    const handleLogo = () => {
        navigate('/dashboard')
    }

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    }

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
        }

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard' },
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas' },
            { nome: 'Créditos', icone: icones['FiCreditCard'], rota: '/creditos' },
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos' },
            { nome: 'Taxas', icone: icones['FiTable'], rota: '/taxas' },
            { nome: 'Extrato Bancário', icone: icones['FiCreditCard'], rota: '/extrato'},
        ]

        setOptionsWithIcons(orderedOptions)
    }, [])

    {/*
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
    */}

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