import { applyContext, applyTheme, getStoredContext, getStoredTheme } from './contextUtils';

export const initializeContext = () => {
  const storedContext = getStoredContext();
  const storedTheme = getStoredTheme();
  applyContext(storedContext);
  applyTheme(storedTheme === 'dark');
};