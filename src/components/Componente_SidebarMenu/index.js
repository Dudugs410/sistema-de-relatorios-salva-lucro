// src/components/Sidebar/Sidebar.js
import React, { useContext, useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Sidebar.scss'
import { FiPercent, FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText, FiClipboard, FiDownload, FiCalendar, FiPaperclip, FiSettings, FiTruck, FiShoppingBag, FiTable, FiLink, FiDatabase } from "react-icons/fi"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { Collapse, Nav, Navbar, NavItem, NavLink } from 'reactstrap'
import { AuthContext } from '../../contexts/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api';
import { getTenantFromURL } from '../../util/tenant';

// Icon mapping object - maps icon names from API to React Icon components
const iconComponentMap = {
    'FiHome': FiHome,
    'FiDollarSign': FiDollarSign,
    'FiCreditCard': FiCreditCard,
    'FiCalendar': FiCalendar,
    'FiTool': FiTool,
    'FiTable': FiTable,
    'FiFileText': FiFileText,
    'FiPercent': FiPercent,
    'FiMoon': FiMoon,
    'FiSun': FiSun,
    'FiRefreshCcw': FiRefreshCcw,
    'FiClipboard': FiClipboard,
    'FiDownload': FiDownload,
    'FiPaperclip': FiPaperclip,
    'FiSettings': FiSettings,
    'FiTruck': FiTruck,
    'FiShoppingBag': FiShoppingBag,
    'FiLink': FiLink,
    'FiDatabase': FiDatabase,
    'LiaFileInvoiceDollarSolid': LiaFileInvoiceDollarSolid,
};

const Sidebar = () => {
    const [optionsWithIcons, setOptionsWithIcons] = useState([])
    const [activeParent, setActiveParent] = useState(null)
    const [lastClicked, setLastClicked] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentTenant, setCurrentTenant] = useState(null)
    const [logoError, setLogoError] = useState(false)
    
    const { currentLogo, currentContext, user } = useContext(AuthContext)

    const navigate = useNavigate()
    const location = useLocation()

    // Get current tenant on mount
    useEffect(() => {
        const tenant = getTenantFromURL();
        setCurrentTenant(tenant);
        
        const currentContextAttr = document.documentElement.getAttribute('data-context');
        if (!currentContextAttr) {
            const defaultContext = 'salvalucro';
            document.documentElement.setAttribute('data-context', defaultContext);
            localStorage.setItem('userContext', defaultContext);
        }
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (!currentTheme) {
            const defaultTheme = 'light';
            document.documentElement.setAttribute('data-theme', defaultTheme);
            localStorage.setItem('userTheme', defaultTheme);
        }
    }, []);

    // Function to get icon component from API icon name
    const getIconFromApi = (iconName) => {
        if (!iconName || iconName.trim() === '') {
            return null;
        }
        
        let icon = iconComponentMap[iconName];
        
        if (!icon) {
            icon = iconComponentMap[`Fi${iconName}`];
        }
        
        if (!icon) {
            icon = iconComponentMap[`Lia${iconName}`];
        }
        
        if (!icon) {
            const capitalized = iconName.charAt(0).toUpperCase() + iconName.slice(1);
            icon = iconComponentMap[capitalized];
        }
        
        return icon || null;
    }

    // Fallback icon mapping for when API doesn't provide icons
    const getFallbackIconForMenu = (menuName) => {
        const fallbackIconMap = {
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
        
        return fallbackIconMap[menuName] || FiLink
    }

    const isOnUsuarioPage = () => {
        return location.pathname === '/usuario'
    }

    const safeNavigate = (path) => {
        if (!path) return;
        
        // Check if user has access to this route
        const userRoutes = JSON.parse(localStorage.getItem('userRoutes') || '[]');
        if (!userRoutes.includes(path)) {
            console.warn('Access denied to:', path);
            return;
        }
        
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
    }

    const handleParentClickWithoutChildren = (parent, navigationLink) => {
        setLastClicked(parent)
        setActiveParent(parent)
        safeNavigate(navigationLink)
    }

    const handleLogo = () => {
        safeNavigate('/dashboard')
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
                
                let parentIcon = null;
                if (parent.icone) {
                    parentIcon = getIconFromApi(parent.icone);
                }
                if (!parentIcon) {
                    parentIcon = getFallbackIconForMenu(parent.nome);
                }
                
                if (childrenCount === 0) {
                    return null
                } else if (childrenCount === 1) {
                    const child = validChildren[0]
                    return {
                        nome: parent.nome,
                        icone: parentIcon,
                        rota: child.rota,
                        id: parent.id
                    }
                } else {
                    const childrenWithIcons = validChildren.map(child => {
                        let childIcon = null;
                        if (child.icone) {
                            childIcon = getIconFromApi(child.icone);
                        }
                        return {
                            nome: child.nome,
                            rota: child.rota,
                            icone: childIcon,
                            id: child.id
                        };
                    });
                    
                    return {
                        nome: parent.nome,
                        icone: parentIcon,
                        children: childrenWithIcons,
                        id: parent.id
                    }
                }
            })
            .filter(item => item !== null)
    }

    // Helper function to store menus in localStorage
    const storeMenusInLocalStorage = (transformedMenus) => {
        // Store full menu structure
        localStorage.setItem('userMenus', JSON.stringify(transformedMenus))
        
        // Store flat routes for easier checking
        const flatRoutes = transformedMenus.flatMap(item => {
            if (item.children && item.children.length > 0) {
                return item.children.map(child => child.rota).filter(Boolean)
            }
            return item.rota ? [item.rota] : []
        }).filter(Boolean)
        localStorage.setItem('userRoutes', JSON.stringify(flatRoutes))
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('menu-updated'))
    }

    const testDirectFetch = () => {
        const testUserId = localStorage.getItem('userId') || '167561'
        
        fetch(`https://app.salvalucro.com.br/api/v1/Menu?codigo=${testUserId}`)
            .then(response => response.json())
            .then(data => {
                const transformed = transformMenuData(data)
                setOptionsWithIcons(transformed)
                storeMenusInLocalStorage(transformed)
                setLoading(false)
            })
            .catch(error => {
                console.error('TEST: Direct fetch failed:', error)
                setLoading(false)
            })
    }

    const fetchMenus = async () => {
        try {
            setLoading(true)
            
            let userId = null
            
            if (user && user.id) {
                userId = user.id
            } else if (localStorage.getItem('userId')) {
                userId = localStorage.getItem('userId')
            } else if (localStorage.getItem('user')) {
                try {
                    const userObj = JSON.parse(localStorage.getItem('user'))
                    userId = userObj.id || userObj.userId
                } catch (e) {
                    console.error('Error parsing user from localStorage', e)
                }
            }
            
            if (!userId) {
                userId = '167561'
            }
            
            const response = await api.get(`/Menu?codigo=${userId}`)
            
            if (response.data && Array.isArray(response.data)) {
                const transformedMenus = transformMenuData(response.data)
                setOptionsWithIcons(transformedMenus)
                storeMenusInLocalStorage(transformedMenus)
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                const transformedMenus = transformMenuData(response.data.data)
                setOptionsWithIcons(transformedMenus)
                storeMenusInLocalStorage(transformedMenus)
            } else {
                setOptionsWithIcons([])
                localStorage.setItem('userMenus', JSON.stringify([]))
                localStorage.setItem('userRoutes', JSON.stringify([]))
            }
        } catch (error) {
            console.error('Error fetching menus:', error)
            testDirectFetch()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMenus()
    }, [])

    const renderIcon = (iconComponent, menuName) => {
        if (!iconComponent) {
            return null;
        }
        return React.createElement(iconComponent, { 
            size: 18,
            style: { marginRight: '5px' }
        });
    };

    // ===== LOGO RENDERING LOGIC =====
    const shouldUseColorMask = () => {
        return currentTenant?.path === 'salvalucro3';
    };

    const renderLogo = () => {
        if (!currentLogo || logoError) {
            return (
                <div 
                    className='img-header text-logo'
                    onClick={handleLogo}
                    style={{
                        width: '160px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--sidebar-font-color, #ffffff)',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}
                >
                    {currentContext?.toUpperCase() || 'APP'}
                </div>
            );
        }

        const isColorMask = shouldUseColorMask();
        
        if (isColorMask) {
            return (
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
            );
        } else {
            return (
                <img 
                    className='img-header' 
                    src={currentLogo} 
                    alt='logo'
                    onClick={handleLogo}
                    onError={() => setLogoError(true)}
                    style={{
                        width: '160px',
                        height: 'auto',
                        cursor: 'pointer',
                        objectFit: 'contain'
                    }}
                />
            );
        }
    };

    if (loading) {
        return (
            <div className={`d-flex flex-column bg-sidebar sidebar`}>
                <div className='navbar-title'>
                    {renderLogo()}
                </div>
                <div className="loading-placeholder text-center p-4" style={{ color: 'var(--sidebar-font-color, #ffffff)' }}>
                    Carregando menu...
                </div>
            </div>
        )
    }

    return (
        <div className={`d-flex flex-column bg-sidebar sidebar`}>
            <div className='navbar-title'>
                {renderLogo()}
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
                                    {renderIcon(option.icone, option.nome)}
                                    <b>&nbsp;{option.nome}</b>
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
                                                        {renderIcon(child.icone, child.nome)}
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
                            <div className="text-muted" style={{ color: 'var(--sidebar-font-color, #ffffff)' }}>
                                Nenhum menu disponível
                            </div>
                            <button onClick={testDirectFetch} className="btn btn-sm btn-primary mt-2">
                                Recarregar Menu
                            </button>
                        </div>
                    )}
                </Nav>
            </Navbar>
        </div>
    )
}

export default Sidebar