// src/components/ThemeSync.jsx
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';


const ThemeSync = ({ children }) => {
  const { currentContext } = useContext(AuthContext);
  
  // This effect runs whenever currentContext changes in React
  useEffect(() => {
    if (currentContext) {
      // Get current HTML attribute value
      const htmlContext = document.documentElement.getAttribute('data-context');
      
      // If they don't match, force sync
      if (htmlContext !== currentContext) {
        document.documentElement.setAttribute('data-context', currentContext);
      }
      
      // Also ensure theme is synced from localStorage
      const savedTheme = localStorage.getItem('appTheme');
      if (savedTheme) {
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        if (htmlTheme !== savedTheme) {
          document.documentElement.setAttribute('data-theme', savedTheme);
        }
      }
    }
  }, [currentContext]);
  
  return children;
};

export default ThemeSync;