// components/ContextSelector.js
import React, { useState, useEffect } from 'react';
import './ContextSelector.scss';

const ContextSelector = () => {
  const [selectedContext, setSelectedContext] = useState('SL');

  // Available contexts/companies
  const contexts = [
    { id: 'SL', label: 'Salva Lucro' },
    { id: 'Sifra', label: 'Sifra Finanças' },
    { id: 'MG', label: 'MG Soluções' }
  ];

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
    if (savedContext) {
      setSelectedContext(savedContext);
      applyContext(savedContext);
    } else {
      // Set default if none exists
      setSelectedContext('SL');
      applyContext('SL');
      localStorage.setItem('selectedContext', 'SL');
    }
  }, []);

  // Handle context change
  const handleContextChange = (event) => {
    const newContext = event.target.value;
    setSelectedContext(newContext);
    localStorage.setItem('selectedContext', newContext);
    applyContext(newContext);
    
    // Optional: Dispatch event for other components to listen to
    window.dispatchEvent(new Event('contextChange'));
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