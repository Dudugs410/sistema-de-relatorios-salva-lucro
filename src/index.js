import './util/installPrompt';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { initializeContext } from './util/contextInitializer';
import { applyTenantManifest } from './util/pwaManifest';

applyTenantManifest();
initializeContext();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

serviceWorkerRegistration.unregister();
reportWebVitals();