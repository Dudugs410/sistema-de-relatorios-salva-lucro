import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals'

// Keep only minimal initialization - AuthContext will handle the rest
// Only set defaults if nothing exists
const initializeTheme = () => {
  try {
    const hasContext = document.documentElement.hasAttribute('data-context')
    const hasTheme = document.documentElement.hasAttribute('data-theme')
    
    if (!hasContext) {
      document.documentElement.setAttribute('data-context', 'salvalucro')
    }
    if (!hasTheme) {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  } catch(e) {
    console.error('Theme initialization error:', e)
    document.documentElement.setAttribute('data-context', 'salvalucro')
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

initializeTheme()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <App />
)

serviceWorkerRegistration.unregister()
reportWebVitals()