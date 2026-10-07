import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import { applyContext, applyTheme, getStoredContext, getStoredTheme } from '../../util/contextUtils';

const ThemeSync = ({ children }) => {
  const { currentContext } = useContext(AuthContext) || {};

  useEffect(() => {
    const stored = getStoredContext();
    if (currentContext && currentContext !== stored) {
      applyContext(currentContext);
      return;
    }
    if (!currentContext) {
      applyContext(stored);
    }
  }, [currentContext]);

  useEffect(() => {
    const theme = getStoredTheme();
    applyTheme(theme === 'dark');
  }, []);

  return children;
};

export default ThemeSync;