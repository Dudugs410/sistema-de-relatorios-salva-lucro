import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import { getCurrentTenant, getLogoByContext } from '../../util/tenant'
import './login.css'
import { useContext } from "react"
import LoadingModal from "./LoadingModal"

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

    // Função para carregar o tenant e logo
    const loadTenant = () => {
        // Tenta pegar o contexto do localStorage (para compatibilidade)
        const savedContext = localStorage.getItem('selectedContext');
        let logo;
        let tenant;
        
        if (savedContext) {
            // Se tem contexto salvo, usa ele
            logo = getLogoByContext(savedContext);
            tenant = getCurrentTenant();
            console.log('🖼️ Logo carregada do contexto salvo:', savedContext);
        } else {
            // Senão, detecta da URL
            tenant = getCurrentTenant();
            logo = tenant.logo;
            // Salva o contexto para consistência
            localStorage.setItem('selectedContext', tenant.contextKey);
            console.log('🖼️ Logo carregada da URL:', tenant.contextKey);
        }
        
        setTenantInfo(tenant);
        setCurrentLogo(logo);
        
        // Aplica o contexto no DOM
        const contextToApply = savedContext || tenant?.contextKey || 'SL';
        document.documentElement.setAttribute('data-context', contextToApply);
    };

    // Listen for context changes
    useEffect(() => {
        const handleContextChange = (event) => {
            console.log('🔄 Contexto alterado, recarregando logo...');
            loadTenant();
        };

        // Carrega logo inicial
        loadTenant();

        window.addEventListener('contextChange', handleContextChange);
        
        return () => {
            window.removeEventListener('contextChange', handleContextChange);
        };
    }, []);

    useEffect(() => {
        if (localStorage.getItem('isSignedIn')) {
            setIsSignedIn(JSON.parse(localStorage.getItem('isSignedIn')));
        }
    }, []);

    useEffect(() => {
        if (isSignedIn === true) {
            const path = localStorage.getItem('currentPath');
            if (path !== '/') {
                navigate(`/${path}`);
            }
        }
    }, [isSignedIn]);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        await loginApp(login, password);
        setLoading(false);
    }

    // Se logo ainda não carregou, mostra placeholder
    if (!currentLogo) {
        return <div>Carregando...</div>;
    }

    return(
        <div className='appPage'>
            <div className='body-login'> 
                <div className='bg-login'></div>
                
                <div className='form-wrapper'>
                    <form type='submit' className='form-login' onSubmit={handleLogin}>
                        <img 
                            className='img-login' 
                            src={currentLogo} 
                            alt='logo' 
                            onError={(e) => {
                                console.error('❌ Erro ao carregar logo:', currentLogo);
                                // Fallback para logo padrão
                                e.target.src = require('../../assets/LogoTopo.png');
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
        </div>
    );
};

export default Login;