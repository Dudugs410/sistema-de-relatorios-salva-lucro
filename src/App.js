import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-icons';
import AuthProvider, { AuthContext } from './contexts/auth';
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { ToastContainer } from 'react-toastify';

import './index.scss';
import PluggyProvider from './contexts/pluggyContext';
import useSessionTimeout from './hooks/useSessionTimeout/useSessionTimeout';
import ThemeSync from './components/ThemeSync';

const PREFS_REFRESH_AFTER_MS = 60 * 1000;

function PreferenceLoader({ children }) {
  const { isThemeLoaded } = useContext(AuthContext) || {};
  if (!isThemeLoaded) return null;
  return <>{children}</>;
}

function PageVisibilityHandler({ children }) {
  const { loadUserPreferences } = useContext(AuthContext) || {};
  const hiddenAt = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
        return;
      }
      const hiddenFor = hiddenAt.current ? Date.now() - hiddenAt.current : 0;
      hiddenAt.current = null;
      if (hiddenFor < PREFS_REFRESH_AFTER_MS) return;

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userID');
      if (token && userId && loadUserPreferences) {
        loadUserPreferences(userId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadUserPreferences]);

  return <>{children}</>;
}

function AppContent() {
  useSessionTimeout(30);

  return (
    <>
      <AuthProvider>
        <PluggyProvider>
          <PreferenceLoader>
            <PageVisibilityHandler>
              <ThemeSync>
                <RoutesApp />
              </ThemeSync>
            </PageVisibilityHandler>
          </PreferenceLoader>
        </PluggyProvider>
      </AuthProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

const getBasename = () => {
  const segments = window.location.pathname.split('/').filter((seg) => seg.length > 0);
  return `/${segments[0] || 'salvalucro3'}`;
};

function App() {
  const [basename] = useState(getBasename);

  useEffect(() => {
    const handlePageHide = () => {
      ['token', 'refreshToken', 'user'].forEach((key) => sessionStorage.removeItem(key));
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;