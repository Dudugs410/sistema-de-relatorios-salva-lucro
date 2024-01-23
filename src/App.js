import 'bootstrap/dist/css/bootstrap.min.css'
import UilReact from '@iconscout/react-unicons/icons/uil-react'
import 'react-icons'
import AuthProvider from './contexts/auth'
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import React, { useEffect } from 'react'

import './index.scss'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <BrowserRouter basename='/salvalucro3'>
      <AuthProvider>
        <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              />
              <RoutesApp/>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
