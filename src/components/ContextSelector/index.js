// components/ContextSelector.js
import React, { useState, useEffect } from 'react';
import { getAvailableTenants, getCurrentTenant } from '../util/tenant';
import './ContextSelector.scss';

const ContextSelector = () => {
  const [selectedContext, setSelectedContext] = useState('SL');
  
  // Get available contexts from tenant config
  const contexts = getAvailableTenants().map(tenant => ({
    id: tenant.contextKey,
    label: tenant.label,
    path: tenant.path
  }));

  // Function to apply context to DOM
  const applyContext = (contextId) => {
    // Remove all context attributes
    document.documentElement.removeAttribute('data-context');
    // Add the new context
    document.documentElement.setAttribute('data-context', contextId);
  };

  // Load saved context from localStorage on component mount
  useEffect(() => {
    const savedContext = localStorage.getItem('selectedContext');
    
    // Try to get from URL first, then localStorage, then default
    const currentTenant = getCurrentTenant();
    
    if (currentTenant) {
      setSelectedContext(currentTenant.contextKey);
      applyContext(currentTenant.contextKey);
      localStorage.setItem('selectedContext', currentTenant.contextKey);
    } else if (savedContext) {
      setSelectedContext(savedContext);
      applyContext(savedContext);
    } else {
      // Set default
      const defaultTenant = getAvailableTenants()[0];
      if (defaultTenant) {
        setSelectedContext(defaultTenant.contextKey);
        applyContext(defaultTenant.contextKey);
        localStorage.setItem('selectedContext', defaultTenant.contextKey);
      }
    }
  }, []);

  // Handle context change
  const handleContextChange = (event) => {
    const newContext = event.target.value;
    setSelectedContext(newContext);
    localStorage.setItem('selectedContext', newContext);
    applyContext(newContext);
    
    // Navigate to the corresponding tenant path
    const tenant = getAvailableTenants().find(t => t.contextKey === newContext);
    if (tenant) {
      // Redirect to the tenant's path
      window.location.href = `/${tenant.path}`;
    }
    
    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('contextChange', { 
      detail: { context: newContext }
    }));
  };

  return (
    <div className="context-selector">
      <div className="context-selector__title">Contexto Selecionado:</div>
      <div className="context-selector__options">
        {contexts.map((context) => (
          <label key={context.id} className="context-selector__option">
            <input
              type="radio"
              value={context.id}
              checked={selectedContext === context.id}
              onChange={handleContextChange}
              className="context-selector__radio"
            />
            <span className="context-selector__label">{context.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ContextSelector;