import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/auth'
import { useUserActivity } from '../util/userActivity'
import ModalUserActivity from '../components/ModalUserActivity'
import { useNavigate, useLocation } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import { getTenantFromURL } from '../util/tenant'

export default function Private({ children }) {
  const { logout, refreshSession } = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const tenant = getTenantFromURL()

  const validateToken = (token) => {
    try {
      if (!token) return false;
      
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        return false;
      }
      
      if (!decoded.sub || !decoded.id || !decoded.login) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
    const currentPath = location.pathname;
    
    if (isSignedIn && (!token || !validateToken(token))) {
      console.log('❌ Token inválido ou expirado, fazendo logout');
      logout();
      // Redireciona para login mantendo o tenant
      navigate('/login');
      return;
    }
    
    if (!isSignedIn) {
      console.log('🔒 Usuário não autenticado, redirecionando para login');
      // Salva a rota atual para redirecionar após login
      if (currentPath !== '/login' && currentPath !== '/') {
        sessionStorage.setItem('currentPath', currentPath);
      }
      navigate('/login');
      return;
    }
    
    // Se chegou aqui, token é válido
    setIsTokenValid(true);
    
    // Se o usuário está logado e está na página de login, redireciona para dashboard
    if (currentPath === '/login' || currentPath === '/') {
      console.log('📊 Usuário logado na página de login, redirecionando para dashboard');
      navigate('/dashboard');
    }
    
  }, [logout, navigate, location.pathname, tenant])

  const stayLoggedIn = async () => {
    try {
      await refreshSession();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
      logout();
      navigate('/login');
    }
  }

  const handleInactivity = () => {
    console.log('⏰ Inatividade detectada, mostrando modal');
    setShowModal(true)
  }

  const handleExpiryWarning = () => {
    console.log('⚠️ Aviso de expiração da sessão');
    setShowModal(true)
  }

  // Atualiza o timeout baseado no tenant (opcional)
  const inactivityTimeout = 10 * 60 * 1000; // 10 minutos padrão
  // Você pode ter timeouts diferentes por tenant se quiser
  // const inactivityTimeout = tenant?.timeout || 10 * 60 * 1000;

  useUserActivity(stayLoggedIn, handleInactivity, inactivityTimeout, handleExpiryWarning)

  // Função para logout com redirecionamento para tenant
  const handleLogout = () => {
    logout();
    // Navega para o login do tenant atual
    navigate('/login');
  }

  if (isTokenValid === null) {
    return (
      <div className="loading-container">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (isTokenValid && localStorage.getItem('isSignedIn') === 'true') {
    return (
      <>
        <Layout>{children}</Layout>
        {showModal && (
          <ModalUserActivity onClose={() => setShowModal(false)}>
            <div className="flex-container-private">
              <div className="title-container-global">
                <h2 className="title-global">Manter-se Conectado?</h2>
              </div>
              <div className="container-private-body">
                <div className="text-container-private">
                  <p className="text-private">
                    Sessão inativa. Deseja Manter?
                  </p>
                </div>
                <div className="btn-container-private">
                  <button className="btn btn-global" onClick={stayLoggedIn}>
                    Sim
                  </button>
                  <button className="btn btn-global" onClick={handleLogout}>
                    Não
                  </button>
                </div>
              </div>
            </div>
          </ModalUserActivity>
        )}
      </>
    )
  }

  return null;
}