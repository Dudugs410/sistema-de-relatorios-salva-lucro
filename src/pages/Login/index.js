import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import { getTenantFromURL, getLogoByContext } from '../../util/tenant'
import { applyContext, getStoredContext } from '../../util/contextUtils'
import './login.css'
import LoadingModal from "./LoadingModal"
import AccountBlockedModal from "./AccountBlockedModal"

const Login = () => {
    const {
        loginApp,
        isSignedIn,
        setIsSignedIn,
    } = useContext(AuthContext)
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentLogo, setCurrentLogo] = useState(null)
    const [tenantInfo, setTenantInfo] = useState(null)
    const [accountBlocked, setAccountBlocked] = useState(false)

    const loadTenant = () => {
        const urlTenant = getTenantFromURL()
        const storedContext = getStoredContext()

        let resolvedContext
        let resolvedLogo
        let resolvedTenant = null

        if (urlTenant) {
            resolvedContext = urlTenant.contextKey
            resolvedLogo = urlTenant.logo
            resolvedTenant = urlTenant
        } else {
            resolvedContext = storedContext
            resolvedLogo = getLogoByContext(storedContext)
        }

        setTenantInfo(resolvedTenant)
        setCurrentLogo(resolvedLogo)
        if (!localStorage.getItem('token')) {
            applyContext(resolvedContext)
        }
    }

    useEffect(() => {
        const handleContextChange = () => loadTenant()
        loadTenant()
        window.addEventListener('contextChange', handleContextChange)
        return () => window.removeEventListener('contextChange', handleContextChange)
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem('isSignedIn')
        if (stored !== null) {
            setIsSignedIn(JSON.parse(stored))
        }
    }, [setIsSignedIn])

    useEffect(() => {
        if (isSignedIn === true) {
            const path = localStorage.getItem('currentPath') || '/dashboard'
            const target = path.startsWith('/') ? path : `/${path}`
            navigate(target === '/' ? '/dashboard' : target)
        }
    }, [isSignedIn, navigate])

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await loginApp(login, password)
            if (result?.status === 'blocked') {
                setPassword('')
                setAccountBlocked(true)
            }
        } finally {
            setLoading(false)
        }
    }

    const getLogoClass = () => {
        if (!tenantInfo) return 'img-login'
        const tenantId = tenantInfo.id
        if (tenantId === 'SuperJur' || tenantId === 'MG') {
            return 'img-login img-login-large'
        }
        return 'img-login'
    }

    if (!currentLogo) {
        return <div>Carregando...</div>
    }

    const logoClass = getLogoClass()

    return (
        <div className='appPage'>
            <div className='body-login'>
                <div className='bg-login'></div>

                <div className='form-wrapper'>
                    <form type='submit' className='form-login' onSubmit={handleLogin}>
                        <img
                            className={logoClass}
                            src={currentLogo}
                            alt='logo'
                            onError={(e) => {
                                e.target.src = require('../../assets/LogoTopo.png')
                            }}
                        />
                        <div className='input-container-login'>
                            <input
                                id='login'
                                className='input-login'
                                type='text'
                                placeholder='usuário'
                                value={login}
                                autoComplete="username"
                                onChange={(e) => setLogin(e.target.value)}
                            />
                            <input
                                id='senha'
                                className='input-login'
                                type='password'
                                placeholder='senha'
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <hr className='hr-global' />
                            {!loading ?
                                <button type='submit' className='btn btn-primary'>Login</button> :
                                <button type='submit' className='btn btn-primary' disabled>Login</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
            {loading && <LoadingModal />}
            {accountBlocked && <AccountBlockedModal onClose={() => setAccountBlocked(false)} />}
        </div>
    )
}

export default Login