<<<<<<< HEAD
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/auth'

export default function Private({ children }) {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    if (sessionStorage.getItem('isSignedIn') !== 'true') {
      alert('isSignedIn = false')
      logout()
    }
  }, [logout])
=======
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/auth'
import { useUserActivity } from '../util/userActivity'
import Modal from '../components/Modal' // Assumes a modal component is available

export default function Private({ children }) {
  const navigate = useNavigate();
  const { logout, refreshSession } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  // Function to check if the token is about to expire
  const isTokenAboutToExpire = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const isAboutToExpire = expirationTime - currentTime < 5 * 60 * 1000;
    
    console.log('Token expiration check:', {
      expirationTime,
      currentTime,
      isAboutToExpire,
    });
    
    return isAboutToExpire;
  };

  // Refresh token function with a check
  const stayLoggedIn = async () => {
    const token = sessionStorage.getItem('token');
    console.log('Attempting to stay logged in');
    
    if (isTokenAboutToExpire(token)) {
      console.log('Token is about to expire. Refreshing...');
      
      try {
        await refreshSession()
        console.log('Token refreshed successfully');
        setShowModal(false); // Close modal on successful refresh
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
      }
    } else {
      console.log('Token is still valid. No refresh needed.');
    }
  };

  // Handle inactivity by showing the modal
  const handleInactivity = () => {
    console.log('User inactivity detected, showing modal...');
    setShowModal(true); // Show "Stay logged in?" modal when inactive
  };

  useUserActivity(handleInactivity, 10 * 60 * 1000); // 10 min inactivity timeout

  // Check token expiration periodically in the background
  useEffect(() => {
    const token = Cookies.get('token');
    
    console.log('Component mounted, checking token expiration on interval');
    
    if (isTokenAboutToExpire(token)) {
      console.log('Token about to expire on mount, refreshing...');
      stayLoggedIn();
    }

    const intervalId = setInterval(() => {
      console.log('Interval check: verifying if token needs refreshing');
      const token = Cookies.get('token');
      if (isTokenAboutToExpire(token)) {
        console.log('Token is about to expire in interval, refreshing...');
        stayLoggedIn();
      }
    }, 4 * 60 * 1000); // Check every 4 minutes

    return () => {
      clearInterval(intervalId);
      console.log('Component unmounted, clearing interval');
    };
  }, []);
>>>>>>> f687bc9 (feat: refresh token)

  if (sessionStorage.getItem('isSignedIn') === 'true') {
    return (
      <>
<<<<<<< HEAD
        <Layout>{children}</Layout>
      </>
    )
  }
  return null
=======
        <button onClick={() => {setShowModal(true)}}>kek</button>
        <Layout>{children}</Layout>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <div className='flex-container-private'>
              <div className='title-container-global'>
                <h2 className='title-global'>Manter-se Conectado?</h2>
              </div>
              <div className='container-private-body'>
                <p>Você está inativo faz um tempo. Deseja continuar logado?</p>
                <button className='btn btn-global' onClick={stayLoggedIn}>Sim</button>
                <button className='btn btn-global' onClick={logout}>Não</button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
  return null;
>>>>>>> f687bc9 (feat: refresh token)
}
