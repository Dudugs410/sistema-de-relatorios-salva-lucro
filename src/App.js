import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-icons'
import AuthProvider from './contexts/auth'
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import React from 'react'

import './index.scss'

function App() {

  return (
    <BrowserRouter basename='/salvalucro3'>
      <AuthProvider>
            <RoutesApp/>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
