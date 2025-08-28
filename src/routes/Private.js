import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/auth'
import { useUserActivity } from '../util/userActivity'
import ModalUserActivity from '../components/ModalUserActivity'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode' // Correct import syntax

export default function Private({ children }) {
  const { logout, refreshSession } = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(null)

  const navigate = useNavigate()

  // Function to validate the token
  const validateToken = (token) => {
    try {
      if (!token) return false;
      
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check expiration
      if (decoded.exp < currentTime) {
        return false;
      }
      
      // Check required claims (adjust based on your token structure)
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
    
    // Check if user is signed in but token is invalid
    if (isSignedIn && (!token || !validateToken(token))) {
      console.log('Token invalid or expired, logging out');
      logout();
      navigate('/');
      return;
    }
    
    // Check if user is not signed in
    if (!isSignedIn) {
      navigate('/');
      return;
    }
    
    // Token is valid
    setIsTokenValid(true);
  }, [logout, navigate])

  const stayLoggedIn = async () => {
    try {
      await refreshSession();
      setShowModal(false);
    } catch (error) {
      logout();
    }
  }

  const handleInactivity = () => {
    setShowModal(true)
  }

  const handleExpiryWarning = () => {
    setShowModal(true)
  }

  useUserActivity(stayLoggedIn, handleInactivity, 10 * 60 * 1000, handleExpiryWarning)

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
                    Você está inativo faz um tempo. Deseja continuar logado?
                  </p>
                </div>
                <div className="btn-container-private">
                  <button className="btn btn-global" onClick={stayLoggedIn}>
                    Sim
                  </button>
                  <button className="btn btn-global" onClick={logout}>
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