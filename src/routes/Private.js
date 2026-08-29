// src/components/Private.js
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
  const [hasMenuAccess, setHasMenuAccess] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const tenant = getTenantFromURL()

  // DEFINE ROUTES THAT ARE ALWAYS ACCESSIBLE (system routes, not in menu)
  const alwaysAccessibleRoutes = ['/usuario']

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

  // Check if the current route is accessible based on menu permissions
  const checkMenuAccess = (path) => {
    try {
      // Always allow system routes
      if (alwaysAccessibleRoutes.includes(path)) {
        return true;
      }

      // Get user's menu permissions from localStorage
      const menus = JSON.parse(localStorage.getItem('userMenus') || '[]');
      
      // If no menus are loaded yet, allow access (will be checked again after menus load)
      if (menus.length === 0) {
        return true;
      }
      
      // Check if the route matches any menu item
      const hasPermission = menus.some(menu => {
        // Check if the route matches directly
        if (menu.rota === path) {
          return true;
        }
        // Check if any child has the route
        if (menu.children && menu.children.length > 0) {
          return menu.children.some(child => child.rota === path);
        }
        return false;
      });
      
      return hasPermission;
    } catch (error) {
      console.error('Error checking menu access:', error);
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
      if (currentPath !== '/login' && currentPath !== '/') {
        sessionStorage.setItem('currentPath', currentPath);
      }
      navigate('/login');
      return;
    }
    
    // Token is valid
    setIsTokenValid(true);
    
    // Check menu access for the current route
    const hasAccess = checkMenuAccess(currentPath);
    setHasMenuAccess(hasAccess);
    
    // If user doesn't have access to the current route, redirect to dashboard
    if (!hasAccess && currentPath !== '/dashboard' && !alwaysAccessibleRoutes.includes(currentPath)) {
      console.warn('Access denied to:', currentPath);
      navigate('/dashboard');
      return;
    }
    
    // If user is on login page but authenticated, redirect to dashboard
    if (currentPath === '/login' || currentPath === '/') {
      navigate('/dashboard');
    }
    
  }, [logout, navigate, location.pathname, tenant])

  // Listen for menu updates
  useEffect(() => {
    const handleMenuUpdate = () => {
      const currentPath = location.pathname;
      const hasAccess = checkMenuAccess(currentPath);
      setHasMenuAccess(hasAccess);
      
      if (!hasAccess && currentPath !== '/dashboard' && !alwaysAccessibleRoutes.includes(currentPath)) {
        navigate('/dashboard');
      }
    };

    window.addEventListener('menu-updated', handleMenuUpdate);
    return () => window.removeEventListener('menu-updated', handleMenuUpdate);
  }, [location.pathname, navigate]);

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

  if (isTokenValid === null || hasMenuAccess === null) {
    return (
      <div className="loading-container">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (isTokenValid && localStorage.getItem('isSignedIn') === 'true' && hasMenuAccess) {
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