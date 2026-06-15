import React, { useContext, useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Sidebar.scss'
import { FiPercent, FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink, FiDatabase } from "react-icons/fi"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { Collapse, Nav, Navbar, NavItem, NavLink, Button } from 'reactstrap'
import { AuthContext } from '../../contexts/auth'
import { FiMenu } from 'react-icons/fi'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api';

const Sidebar = () => {
    const [optionsWithIcons, setOptionsWithIcons] = useState([])
    const [activeParent, setActiveParent] = useState(null)
    const [lastClicked, setLastClicked] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    
    const { currentLogo, currentContext, user } = useContext(AuthContext)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        console.log('Sidebar component mounted')
    }, [])

    const getIconForMenu = (menuName) => {
        const iconMap = {
            'Dashboard': FiHome,
            'Vendas': FiDollarSign,
            'Créditos': FiCreditCard,
            'Resumo de Créditos': FiCreditCard,
            'Créditos por Data e Banco': FiCalendar,
            'Previsão de Recebimentos': FiCalendar,
            'Ajustes': FiTool,
            'Gerenciais': FiTable,
            'Resumo Mensal': FiFileText,
            'Serviços': FiTool,
        }
        
        return iconMap[menuName] || FiLink
    }

    const isOnUsuarioPage = () => {
        return location.pathname === '/usuario'
    }

    const safeNavigate = (path) => {
        if (!path) return;
        
        if (isOnUsuarioPage()) {
            const event = new CustomEvent('sidebar-navigate', { detail: { path } })
            window.dispatchEvent(event)
        } else {
            navigate(path)
        }
    }

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
        safeNavigate(navigationLink)
        setSidebarVisible(false)
    }

    const handleParentClickWithoutChildren = (parent, navigationLink) => {
        setLastClicked(parent)
        setActiveParent(parent)
        safeNavigate(navigationLink)
        setSidebarVisible(false)
    }

    const handleLogo = () => {
        safeNavigate('/dashboard')
    }

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    }

    const transformMenuData = (menuData) => {
        if (!menuData || !Array.isArray(menuData)) return []
        
        return menuData
            .filter(item => item.parentId === 0)
            .map(parent => {
                const validChildren = parent.Menus && Array.isArray(parent.Menus) 
                    ? parent.Menus.filter(child => child.rota)
                    : []
                
                const childrenCount = validChildren.length
                
                if (childrenCount === 0) {
                    return null
                } else if (childrenCount === 1) {
                    const child = validChildren[0]
                    return {
                        nome: parent.nome,
                        icone: getIconForMenu(parent.nome),
                        rota: child.rota
                    }
                } else {
                    return {
                        nome: parent.nome,
                        icone: getIconForMenu(parent.nome),
                        children: validChildren.map(child => ({
                            nome: child.nome,
                            rota: child.rota
                        }))
                    }
                }
            })
            .filter(item => item !== null)
    }

    const testDirectFetch = () => {
        console.log('TEST: Attempting direct fetch with hardcoded ID')
        const testUserId = localStorage.getItem('userId') || '167561'
        console.log('TEST: Using user ID:', testUserId)
        
        fetch(`https://app.salvalucro.com.br/api/v1/Menu?codigo=${testUserId}`)
            .then(response => response.json())
            .then(data => {
                console.log('TEST: Direct fetch successful!', data)
                const transformed = transformMenuData(data)
                console.log('TEST: Transformed data:', transformed)
                setOptionsWithIcons(transformed)
                setLoading(false)
            })
            .catch(error => {
                console.error('TEST: Direct fetch failed:', error)
                setLoading(false)
            })
    }

    const fetchMenus = async () => {
        console.log('fetchMenus function called')
        
        try {
            setLoading(true)
            
            let userId = null
            
            console.log('Checking user context:', user)
            console.log('localStorage userId:', localStorage.getItem('userId'))
            console.log('localStorage user:', localStorage.getItem('user'))
            
            if (user && user.id) {
                userId = user.id
                console.log('Found user.id:', userId)
            } else if (localStorage.getItem('userId')) {
                userId = localStorage.getItem('userId')
                console.log('Found localStorage userId:', userId)
            } else if (localStorage.getItem('user')) {
                try {
                    const userObj = JSON.parse(localStorage.getItem('user'))
                    userId = userObj.id || userObj.userId
                    console.log('Found parsed user object:', userObj, 'userId:', userId)
                } catch (e) {
                    console.error('Error parsing user from localStorage', e)
                }
            }
            
            if (!userId) {
                console.error('No user ID found. Using fallback test ID 167561')
                userId = '167561'
            }
            
            console.log('Attempting API call with userId:', userId)
            console.log('API endpoint:', `/Menu?codigo=${userId}`)
            
            // Try using the api service
            const response = await api.get(`/Menu?codigo=${userId}`)
            
            console.log('API Response received:', response)
            console.log('Response data:', response.data)
            
            if (response.data && Array.isArray(response.data)) {
                console.log('Processing menu data array')
                const transformedMenus = transformMenuData(response.data)
                console.log('Transformed menus:', transformedMenus)
                setOptionsWithIcons(transformedMenus)
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                console.log('Processing wrapped menu data')
                const transformedMenus = transformMenuData(response.data.data)
                console.log('Transformed menus:', transformedMenus)
                setOptionsWithIcons(transformedMenus)
            } else {
                console.warn('Unexpected response format:', response)
                setOptionsWithIcons([])
            }
        } catch (error) {
            console.error('Error fetching menus with api service:', error)
            console.log('Falling back to direct fetch...')
            testDirectFetch()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('Sidebar useEffect - attempting to fetch menus')
        
        fetchMenus()
        
        setTimeout(() => {
            if (optionsWithIcons.length === 0 && loading) {
                console.log('Still loading after 3 seconds, checking api service...')
                console.log('api service object:', api)
            }
        }, 3000)
    }, [])

    if (loading) {
        return (
            <>
                <Button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FiMenu />
                </Button>
                <div className={`d-flex flex-column bg-sidebar sidebar ${sidebarVisible ? 'visible' : ''}`}>
                    <div className='navbar-title'>
                        {currentContext?.startsWith('ALT-') ? (
                        <div 
                            className='img-header logo-mask'
                            style={{ 
                            backgroundColor: 'var(--secondary-color)',
                            maskImage: `url(${currentLogo})`,
                            WebkitMaskImage: `url(${currentLogo})`,
                            maskSize: '160px 30px',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                            width: '160px',
                            height: '40px',
                            cursor: 'pointer'
                            }}
                            onClick={handleLogo}
                        />
                        ) : (
                        <img 
                            className='img-header' 
                            src={currentLogo} 
                            alt='logo'
                            onClick={handleLogo} 
                        />
                        )}
                    </div>
                    <div className="loading-placeholder text-center p-4">
                        Carregando menu...
                        <button onClick={testDirectFetch} style={{marginLeft: '10px'}}>
                            Test Fetch
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Button className="sidebar-toggle" onClick={toggleSidebar}>
                <FiMenu />
            </Button>
            <div className={`d-flex flex-column bg-sidebar sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <div className='navbar-title'>
                    {currentContext?.startsWith('ALT-') ? (
                    <div 
                        className='img-header logo-mask'
                        style={{ 
                        backgroundColor: 'var(--secondary-color)',
                        maskImage: `url(${currentLogo})`,
                        WebkitMaskImage: `url(${currentLogo})`,
                        maskSize: '160px 30px',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        width: '160px',
                        height: '40px',
                        cursor: 'pointer'
                        }}
                        onClick={handleLogo}
                    />
                    ) : (
                    <img 
                        className='img-header' 
                        src={currentLogo} 
                        alt='logo'
                        onClick={handleLogo} 
                    />
                    )}
                </div>
                <Navbar color="light" light expand="md">
                    <Nav navbar className="flex-column w-100">
                        {optionsWithIcons.length > 0 ? (
                            optionsWithIcons.map((option, index) => (
                                <NavItem key={index}>
                                    <NavLink 
                                        className={`b-links navlink-parent ${lastClicked === option.nome || activeParent === option.nome ? 'active-parent' : ''}`} 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault()
                                            option.children ? toggleDropdown(option.nome) : handleParentClickWithoutChildren(option.nome, option.rota)
                                        }}
                                    >
                                        &nbsp;<option.icone /><b>&nbsp;{option.nome}</b>
                                    </NavLink>
                                    {option.children && option.children.length > 0 && (
                                        <Collapse isOpen={activeParent === option.nome}>
                                            <Nav navbar className="flex-column ml-3">
                                                {option.children.map((child, childIndex) => (
                                                    <NavItem key={childIndex}>
                                                        <NavLink 
                                                            className={`navlink-child ${lastClicked === child.nome ? 'active-child' : ''}`} 
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleChildClick(child.nome, child.rota, option.nome)
                                                            }}
                                                        >
                                                            {child.nome}
                                                        </NavLink>
                                                    </NavItem>
                                                ))}
                                            </Nav>
                                        </Collapse>
                                    )}
                                </NavItem>
                            ))
                        ) : (
                            <div className="text-center p-4">
                                <div className="text-muted">Nenhum menu disponível</div>
                                <button onClick={testDirectFetch} className="btn btn-sm btn-primary mt-2">
                                    Recarregar Menu
                                </button>
                            </div>
                        )}
                    </Nav>
                </Navbar>
            </div>
        </>
    )
}

export default Sidebar