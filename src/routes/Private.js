import React, { useState, useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { AuthContext } from '../contexts/auth';
import api from '../services/api'; // Assuming this is your API utility

import Layout from '../components/Layout';
import LoadingModal from '../components/LoadingModal';

export default function Private({ children }) {
  const navigate = useNavigate();
  const { setIsSignedIn, setAccessToken, accessToken, setLoading, loading } = useContext(AuthContext);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setIsSignedIn(false);
      navigate('/');
    } else {
      setAccessToken(token);
      setLoading(true);
      loadUser(token);
    }
  }, []);

  useEffect(() => {
    if (userLoaded) {
      setLoading(false);
    }
  }, [userLoaded]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const decodedToken = jwtDecode(accessToken);
      const expirationTime = decodedToken.exp * 1000;
      const timeUntilExpiration = expirationTime - Date.now();

      if (timeUntilExpiration <= 0) {
        handleTokenExpiration();
      } else if (timeUntilExpiration <= 300000) { // Alert when 5 minutes until expiration
        const choice = window.confirm('Sua sessão está perto de expirar. Deseja continuar conectado?');
        if (choice) {
          handleTokenExpiration();
        }
      }
    };

    const tokenExpirationInterval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(tokenExpirationInterval);
  }, [accessToken]);

  const handleTokenExpiration = async () => {
    // Call your token refresh logic here
    try {
      const refreshedToken = await api.post('/refresh-token', { refreshToken: Cookies.get('refreshToken') });
      const newAccessToken = refreshedToken.data.access_token;
      setAccessToken(newAccessToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      alert('Error refreshing token. Please log in again.');
      setIsSignedIn(false);
      navigate('/');
    }
  };

  const loadUser = async (token) => {
    console.log('token: ', token)
    try {
      const userId = jwtDecode(token).id;
      const response = await api.get(`/usuario/${userId}`);
      const user = response.data;

      if (user) {
        const { NOME, EMAIL } = user;
        sessionStorage.setItem('isSignedIn', true);
        sessionStorage.setItem('userData', JSON.stringify({ NOME, EMAIL }));
        localStorage.setItem('isSignedIn', true);
        setIsSignedIn(true);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUserLoaded(true);
    }
  };

  return (
    <>
      <Layout>{children}</Layout>
      {loading && <LoadingModal show={loading} />}
    </>
  );
}
