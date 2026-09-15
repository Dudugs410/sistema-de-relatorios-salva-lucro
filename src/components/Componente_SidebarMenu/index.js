// src/components/Sidebar/Sidebar.js
import React, { useContext, useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Sidebar.scss'
import {
    FiPercent,
    FiMoon,
    FiSun,
    FiHome,
    FiDollarSign,
    FiCreditCard,
    FiRefreshCcw,
    FiTool,
    FiFileText,
    FiClipboard,
    FiDownload,
    FiCalendar,
    FiPaperclip,
    FiSettings,
    FiTruck,
    FiShoppingBag,
    FiTable,
    FiLink,
    FiDatabase
} from "react-icons/fi"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia"
import { IoReceiptOutline } from "react-icons/io5"
import { FaRegAddressCard } from "react-icons/fa6"
import { RiBankLine } from "react-icons/ri"
import { Collapse, Nav, Navbar, NavItem, NavLink } from 'reactstrap'
import { AuthContext } from '../../contexts/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'
import { getTenantFromURL } from '../../util/tenant'

// Map: API icon string → React icon component
// To add a new icon: import it above and drop it here.
// The key is automatically the variable name (shorthand), so as long as the API
// returns the same string as the variable name, it will resolve.
const iconComponentMap = {
    // Feather (fi)
    FiHome,
    FiDollarSign,
    FiCreditCard,
    FiCalendar,
    FiTool,
    FiTable,
    FiFileText,
    FiPercent,
    FiMoon,
    FiSun,
    FiRefreshCcw,
    FiClipboard,
    FiDownload,
    FiPaperclip,
    FiSettings,
    FiTruck,
    FiShoppingBag,
    FiLink,
    FiDatabase,

    // LIA
    LiaFileInvoiceDollarSolid,

    // Ionicons 5 (io5)
    IoReceiptOutline,

    // Font Awesome 6 (fa6)
    FaRegAddressCard,

    // Remix Icons (ri)
    RiBankLine,
}

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

    useEffect(() => {
        const tenant = getTenantFromURL()
        setCurrentTenant(tenant)

        const currentContextAttr = document.documentElement.getAttribute('data-context')
        if (!currentContextAttr) {
            const defaultContext = 'salvalucro'
            document.documentElement.setAttribute('data-context', defaultContext)
            localStorage.setItem('userContext', defaultContext)
        }

        const currentTheme = document.documentElement.getAttribute('data-theme')
        if (!currentTheme) {
            const defaultTheme = 'light'
            document.documentElement.setAttribute('data-theme', defaultTheme)
            localStorage.setItem('userTheme', defaultTheme)
        }
    }, [])

    const resolveIcon = (iconName) => {
        if (!iconName || typeof iconName !== 'string') return null
        return iconComponentMap[iconName.trim()] || null
    }

    const isOnUsuarioPage = () => {
        return location.pathname === '/usuario'
    }

    const safeNavigate = (path) => {
        if (!path) return

        const userRoutes = JSON.parse(localStorage.getItem('userRoutes') || '[]')
        if (!userRoutes.includes(path)) {
            console.warn('Access denied to:', path)
            return
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

                const parentIcon = resolveIcon(parent.icone)

                const isDashboard = parent.nome?.toLowerCase() === 'dashboard' || parent.rota === '/dashboard'

                if (isDashboard) {
                    return {
                        nome: parent.nome,
                        icone: parentIcon,
                        rota: parent.rota || (validChildren[0] ? validChildren[0].rota : '/dashboard'),
                        id: parent.id,
                    }
                }

                if (validChildren.length === 0 && !parent.rota) {
                    return null
                }

                const childrenWithIcons = validChildren.map(child => ({
                    nome: child.nome,
                    rota: child.rota,
                    icone: resolveIcon(child.icone),
                    id: child.id,
                }))

                return {
                    nome: parent.nome,
                    icone: parentIcon,
                    children: childrenWithIcons,
                    id: parent.id,
                }
            })
            .filter(item => item !== null)
    }

    const storeMenusInLocalStorage = (transformedMenus) => {
        // Save only serializable fields — React components can't be JSON.stringify'd
        const serializable = transformedMenus.map(item => ({
            nome: item.nome,
            rota: item.rota,
            id: item.id,
            children: item.children
                ? item.children.map(child => ({
                    nome: child.nome,
                    rota: child.rota,
                    id: child.id,
                }))
                : undefined,
        }))

        localStorage.setItem('userMenus', JSON.stringify(serializable))

        const flatRoutes = transformedMenus.flatMap(item => {
            if (item.children && item.children.length > 0) {
                return item.children.map(child => child.rota).filter(Boolean)
            }
            return item.rota ? [item.rota] : []
        }).filter(Boolean)

        localStorage.setItem('userRoutes', JSON.stringify(flatRoutes))
        window.dispatchEvent(new Event('menu-updated'))
    }

    const fetchMenus = async () => {
        try {
            setLoading(true)

            let userId = null

            if (user && user.id) {
                userId = user.id
            } else if (localStorage.getItem('userID')) {
                userId = localStorage.getItem('userID')
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

            let rawMenuData = []

            if (response.data && Array.isArray(response.data)) {
                rawMenuData = response.data
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                rawMenuData = response.data.data
            }

            const transformedMenus = transformMenuData(rawMenuData)
            setOptionsWithIcons(transformedMenus)
            storeMenusInLocalStorage(transformedMenus)
        } catch (error) {
            console.error('Error fetching menus:', error)
            setOptionsWithIcons([])
            localStorage.setItem('userMenus', JSON.stringify([]))
            localStorage.setItem('userRoutes', JSON.stringify([]))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMenus()
    }, [])

    const renderIcon = (IconComponent) => {
        if (!IconComponent) return null
        return <IconComponent size={18} style={{ marginRight: '5px' }} />
    }

    const shouldUseColorMask = () => {
        return currentTenant?.path === 'salvalucro3'
    }

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
                        fontSize: '18px',
                    }}
                >
                    {currentContext?.toUpperCase() || 'APP'}
                </div>
            )
        }

        const isColorMask = shouldUseColorMask()

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
                        cursor: 'pointer',
                    }}
                    onClick={handleLogo}
                />
            )
        }

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
                    objectFit: 'contain',
                }}
            />
        )
    }

    if (loading) {
        return (
            <div className={`d-flex flex-column bg-sidebar sidebar`}>
                <div className='navbar-title'>{renderLogo()}</div>
                <div className="loading-placeholder text-center p-4" style={{ color: 'var(--sidebar-font-color, #ffffff)' }}>
                    Carregando menu...
                </div>
            </div>
        )
    }

    return (
        <div className={`d-flex flex-column bg-sidebar sidebar`}>
            <div className='navbar-title'>{renderLogo()}</div>
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
                                        option.children
                                            ? toggleDropdown(option.nome)
                                            : handleParentClickWithoutChildren(option.nome, option.rota)
                                    }}
                                >
                                    {renderIcon(option.icone)}
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
                                                        {renderIcon(child.icone)}
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
                            <button onClick={fetchMenus} className="btn btn-sm btn-primary mt-2">
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