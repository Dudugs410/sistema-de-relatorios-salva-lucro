import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals'

// Initialize theme from localStorage before React renders
const initializeTheme = () => {
  try {
    const savedContext = localStorage.getItem('appContext');
    const savedTheme = localStorage.getItem('appTheme');
    
    if (savedContext) {
      document.documentElement.setAttribute('data-context', savedContext);
      console.log('Index: Applied context', savedContext);
    }
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      console.log('Index: Applied theme', savedTheme);
    }
  } catch(e) {
    console.log('Theme initialization error:', e);
  }
};

initializeTheme();

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()