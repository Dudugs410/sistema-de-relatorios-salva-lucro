import React, { useEffect } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"

import Private from "./Private"

import Login from '../pages/Login'
import Usuario from "../pages/00 - PaginaUsuario"
import Dashboard from '../pages/Dashboard'
import Vendas from '../pages/Vendas'
import Recebiveis from '../pages/Creditos'
import Servicos from '../pages/Servicos'
import CadastroDeBancos from '../pages/CadastroDeBancos'
import Financeiro from '../pages/Financeiro'
import Gerenciais from '../pages/Gerenciais'
import ExportacaoSysmo from '../pages/ExportacaoSysmo'
import ExportacaoMeta from '../pages/ExportacaoMeta'
import ExportacaoMetaSapiranga from '../pages/ExportacaoMetaSapiranga'
import Administracao from '../pages/Administracao'
import Suporte from '../pages/Suporte'
import OutrosRelatorios from '../pages/OutrosRelatorios'
import VendasDelivery from '../pages/VendasDelivery'
import ConciliacaoBancaria from '../pages/ConciliacaoBancaria'
import Taxas from '../pages/Taxas'
import Extrato from "../pages/Extrato"

function RoutesApp() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname !== '/') {
      sessionStorage.setItem('currentPath', location.pathname)
    }
  }, [location.pathname])

  useEffect(() => {
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
    const savedPath = sessionStorage.getItem('currentPath')
    
    if (!isSignedIn) {
      navigate('/')
    } else {
      if (savedPath && savedPath !== '/' && savedPath !== location.pathname) {
        navigate(savedPath)
      } else if (!savedPath || savedPath === '/') {
        navigate('/dashboard')
      }
    }
  }, [])

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/usuario' element={<Private><Usuario /></Private>} />
      <Route path='/dashboard' element={<Private><Dashboard /></Private>} />
      <Route path='/vendas' element={<Private><Vendas /></Private>} />
      <Route path='/creditos' element={<Private><Recebiveis /></Private>} />
      <Route path='/servicos' element={<Private><Servicos /></Private>} />
      <Route path='/taxas' element={<Private><Taxas /></Private>} />
      <Route path='/extrato' element={<Private><Extrato /></Private>} />
      <Route path='/cadastrodebancos' element={<Private><CadastroDeBancos /></Private>} />
      
      {/* Commented routes for future use */}
      {/* <Route path='/financeiro' element={<Private><Financeiro /></Private>} />
      <Route path='/gerenciais' element={<Private><Gerenciais /></Private>} />
      <Route path='/outrosrelatorios' element={<Private><OutrosRelatorios /></Private>} />
      <Route path='/sysmo' element={<Private><ExportacaoSysmo /></Private>} />
      <Route path='/meta' element={<Private><ExportacaoMeta /></Private>} />
      <Route path='/metasapiranga' element={<Private><ExportacaoMetaSapiranga /></Private>} />
      <Route path='/administracao' element={<Private><Administracao /></Private>} />
      <Route path='/suporte' element={<Private><Suporte /></Private>} />
      <Route path='/vendasdelivery' element={<Private><VendasDelivery /></Private>} />
      <Route path='/conciliacao' element={<Private><ConciliacaoBancaria /></Private>} /> */}
    </Routes>
  )
}

export default RoutesApp