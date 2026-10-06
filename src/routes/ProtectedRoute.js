// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRoute }) => {
  const [hasAccess, setHasAccess] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = () => {
      try {
        // DEFINE ROUTES THAT ARE ALWAYS ACCESSIBLE (system routes, not in menu)
        const alwaysAccessibleRoutes = ['/usuario'];
        
        // If it's an always accessible route, grant access immediately
        if (alwaysAccessibleRoutes.includes(requiredRoute)) {
          setHasAccess(true);
          return;
        }

        // Get user's menu permissions from localStorage
        const menus = JSON.parse(localStorage.getItem('userMenus') || '[]');
        
        // Check if user has access to the required route
        const hasPermission = menus.some(menu => {
          // Check if the route matches directly
          if (menu.rota === requiredRoute) {
            return true;
          }
          // Check if any child has the route
          if (menu.children && menu.children.length > 0) {
            return menu.children.some(child => child.rota === requiredRoute);
          }
          return false;
        });
        
        setHasAccess(hasPermission);
      } catch (error) {
        console.error('Error checking menu access:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [requiredRoute]);

  // Show loading while checking permissions
  if (hasAccess === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Verificando permissões...</div>
      </div>
    );
  }

  // Redirect if user doesn't have access
  if (!hasAccess) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;