import React, { useState, useEffect } from 'react';
import { getAvailableTenants, getTenantFromURL } from '../../util/tenant';
import { applyContext, getStoredContext } from '../../util/contextUtils';
import './ContextSelector.scss';

const ContextSelector = () => {
  const contexts = getAvailableTenants().map((t) => ({
    id: t.contextKey,
    label: t.label,
    path: t.path,
  }));

  const [selectedContext, setSelectedContext] = useState(getStoredContext());

  useEffect(() => {
    const urlTenant = getTenantFromURL();
    const target = urlTenant ? urlTenant.contextKey : getStoredContext();
    setSelectedContext(target);
    applyContext(target);
  }, []);

  const handleContextChange = (event) => {
    const newContext = event.target.value;
    setSelectedContext(newContext);
    applyContext(newContext);

    const tenant = getAvailableTenants().find((t) => t.contextKey === newContext);
    if (tenant) {
      window.location.href = `/${tenant.path}`;
    }

    window.dispatchEvent(new CustomEvent('contextChange', {
      detail: { context: newContext },
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