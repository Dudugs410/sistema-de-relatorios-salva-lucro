// src/contexts/MenuContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [userMenus, setUserMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMenus = () => {
    try {
      const routes = JSON.parse(localStorage.getItem('userRoutes') || '[]');
      const menus = JSON.parse(localStorage.getItem('userMenus') || '[]');
      setUserRoutes(routes);
      setUserMenus(menus);
    } catch (error) {
      console.error('Error loading menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();

    // Listen for menu updates
    const handleMenuUpdate = () => {
      loadMenus();
    };

    window.addEventListener('menu-updated', handleMenuUpdate);
    return () => window.removeEventListener('menu-updated', handleMenuUpdate);
  }, []);

  const hasAccess = (route) => {
    if (!route) return false;
    return userRoutes.includes(route);
  };

  const refreshMenus = () => {
    setLoading(true);
    loadMenus();
  };

  return (
    <MenuContext.Provider value={{ 
      userRoutes, 
      userMenus, 
      hasAccess, 
      loading,
      refreshMenus 
    }}>
      {children}
    </MenuContext.Provider>
  );
};