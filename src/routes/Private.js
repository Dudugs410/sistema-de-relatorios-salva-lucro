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
      logout();
      navigate('/login');
      return;
    }
    
    if (!isSignedIn) {
      navigate('/login');
      return;
    }
    
    setIsTokenValid(true);
    
    if (currentPath === '/login' || currentPath === '/') {
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
    setShowModal(true)
  }

  const handleExpiryWarning = () => {
    setShowModal(true)
  }

  const inactivityTimeout = 10 * 60 * 1000;

  useUserActivity(stayLoggedIn, handleInactivity, inactivityTimeout, handleExpiryWarning)

  const handleLogout = () => {
    logout();
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