import React, { useContext, useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Sidebar.scss'
import salvaLucroLogoBranco from '../../assets/LogoTopo.png'
import sifra from '../../assets/logoSifra.png'
import MG from '../../assets/logoMG.png'
import { FiPercent, FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink, FiDatabase } from "react-icons/fi"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { Collapse, Nav, Navbar, NavItem, NavLink, Button } from 'reactstrap'
import { AuthContext } from '../../contexts/auth'
import { FiMenu } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const [optionsWithIcons, setOptionsWithIcons] = useState([])
    const [activeParent, setActiveParent] = useState(null)
    const [lastClicked, setLastClicked] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [contextImg, setContextImg] = useState()

    useEffect(() => {
        let context = localStorage.getItem('selectedContext')
        if (context === 'sifra') {
            setContextImg(sifra)
        } else if (context === 'MG') {
            setContextImg(MG)
        } else {
            setContextImg(salvaLucroLogoBranco)
        }
    }, [])

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
            'FiPercent': FiPercent,
            'FiDatabase': FiDatabase,
            'LiaFileInvoiceDollarSolid': LiaFileInvoiceDollarSolid,
        }

        const orderedOptions = [
            { nome: 'Início', icone: icones['FiHome'], rota: '/dashboard' },
            { nome: 'Vendas', icone: icones['FiDollarSign'], rota: '/vendas' },
            { 
                nome: 'Créditos', 
                icone: icones['FiCreditCard'], 
                children: [
                    { nome: 'Resumo de Créditos', rota: '/creditos' },
                    { nome: 'Créditos por Data e Banco', rota: '/creditos-data-banco' }
                ]
            },
            { nome: 'Serviços', icone: icones['FiTool'], rota: '/servicos' },
        ]
        setOptionsWithIcons(orderedOptions)
    }, [])

    return (
        <>
            <Button className="sidebar-toggle" onClick={toggleSidebar}>
                <FiMenu />
            </Button>
            <div className={`d-flex flex-column bg-sidebar sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <div className='navbar-title'>
                    <img className='img-header' src={contextImg} alt='logo salva lucro' onClick={handleLogo} />
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
    )
}

export default Sidebar