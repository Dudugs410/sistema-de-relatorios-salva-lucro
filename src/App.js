import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-icons'
import AuthProvider from './contexts/auth'
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import React from 'react'
import { ToastContainer } from 'react-toastify'

import './index.scss'
import PluggyProvider from './contexts/pluggyContext'
import { initializeContext } from './util/contextInitializer';

initializeContext()

function App() {

  return (
    <BrowserRouter basename='/salvalucro3'>
      <AuthProvider>
        <PluggyProvider>
          <RoutesApp/>
        </PluggyProvider>
      </AuthProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  )
}

export default App
