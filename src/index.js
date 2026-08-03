import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals'

// Enhanced theme initialization before React renders
const initializeTheme = () => {
  try {
    // Helper function to get context from user data
    const getContextFromUser = (userData) => {
      if (!userData) return null;
      try {
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        if (user.GRUCODIGO === 'SIFRA') return 'SIFRA';
        if (user.GRUCODIGO === 'MG') return 'MG';
        if (user.GRUCODIGO === 'superjur') return 'superjur';
        if (user.GRUCODIGO === 'carddigital') return 'carddigital';
        if (user.CONTEXT) return user.CONTEXT;
        return null;
      } catch(e) {
        return null;
      }
    };

    // Get saved data from localStorage
    const savedContext = localStorage.getItem('appContext');
    const savedTheme = localStorage.getItem('appTheme');
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Determine the correct context
    let finalContext = 'salvalucro'; // Default
    
    // Priority: savedContext > user.GRUCODIGO > default
    if (savedContext) {
      finalContext = savedContext;
    } else if (token && userData) {
      const contextFromUser = getContextFromUser(userData);
      if (contextFromUser) finalContext = contextFromUser;
    }
    
    // Determine the correct theme
    let finalTheme = 'light'; // Default
    
    if (savedTheme) {
      finalTheme = savedTheme;
    } else if (token && userData) {
      try {
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        if (user.TEMA === true) finalTheme = 'dark';
      } catch(e) {}
    }
    
    // Check if theme is already applied correctly
    const currentContext = document.documentElement.getAttribute('data-context');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Only update if different to avoid unnecessary DOM changes
    if (currentContext !== finalContext) {
      document.documentElement.setAttribute('data-context', finalContext);
    }
    
    if (currentTheme !== finalTheme) {
      document.documentElement.setAttribute('data-theme', finalTheme);
    }
    
    // Verify theme was applied successfully
    const verifyContext = document.documentElement.getAttribute('data-context');
    const verifyTheme = document.documentElement.getAttribute('data-theme');
    
    if (verifyContext !== finalContext || verifyTheme !== finalTheme) {
      console.warn('⚠️ Theme verification failed, reapplying...');
      document.documentElement.setAttribute('data-context', finalContext);
      document.documentElement.setAttribute('data-theme', finalTheme);
    }
    
  } catch(e) {
    console.error('Theme initialization error:', e);
    // Fallback to defaults
    document.documentElement.setAttribute('data-context', 'salvalucro');
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

// Run initialization
initializeTheme();

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
)

// Service worker registration - changed to unregister to prevent caching issues with themes
// If you need offline capabilities, change back to register()
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()