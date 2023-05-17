import 'bootstrap/dist/css/bootstrap.min.css'
import UilReact from '@iconscout/react-unicons/icons/uil-react'
import 'react-icons'
import AuthProvider from './contexts/auth'
import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import React from 'react'


import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesApp/>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
