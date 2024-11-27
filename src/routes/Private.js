import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/auth'
import { useUserActivity } from '../util/userActivity'
import ModalUserActivity from '../components/ModalUserActivity'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Private({ children }) {
  const { logout, refreshSession } = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()

  useEffect(()=>{
    if(localStorage.getItem('isSignedIn') !== 'true'){
      navigate('/')
    }
  },[])

  const stayLoggedIn = async () => {
    try {
      await refreshSession(); // Refresh token on activity if allowed by throttle
      console.log('Token refreshed successfully')
      setShowModal(false); // Close modal on successful refresh
    } catch (error) {
      console.error('Failed to refresh token:', error)
      logout();
    }
  }

  const handleInactivity = () => {
    console.log('User inactivity detected, showing modal...')
    setShowModal(true)
  }

  const handleExpiryWarning = () => {
    setShowModal(true)
  }

  useUserActivity(stayLoggedIn, handleInactivity, 10 * 60 * 1000, handleExpiryWarning)

  if (localStorage.getItem('isSignedIn') === 'true') {
    return (
      <>
        { /*<button onClick={() => setShowModal(true)}>Modal Inatividade</button>*/}
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
    );
  } else {
    logout()
  }
  return null;
}
