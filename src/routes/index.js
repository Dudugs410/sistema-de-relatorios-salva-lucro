import React, { useEffect } from "react"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"

import Private from "./Private"

import Login from '../pages/Login'
import Usuario from "../pages/00 - PaginaUsuario"
import Dashboard from '../pages/Dashboard'
import Vendas from '../pages/Vendas'
import Recebiveis from '../pages/Creditos'
import CreditosDataBanco from '../pages/CreditosDataBanco'
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
import PrevisaoRecebimentos from "../pages/PrevisaoRecebimentos"
import ResumoMensal from "../pages/ResumoMensal"
import OpenFinance from "../pages/OpenFinance"

function RoutesApp() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
    const isPublicPath = location.pathname === '/' || location.pathname === '/login'

    if (!isSignedIn && !isPublicPath) navigate('/login')
    if (isSignedIn && isPublicPath) navigate('/dashboard')
  }, [navigate, location.pathname])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/usuario" element={<Private><Usuario /></Private>} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/vendas" element={<Private><Vendas /></Private>} />
      <Route path="/creditos" element={<Private><Recebiveis /></Private>} />
      <Route path="/creditos-data-banco" element={<Private><CreditosDataBanco /></Private>} />
      <Route path="/previsao-recebimento" element={<Private><PrevisaoRecebimentos /></Private>} />
      <Route path="/servicos" element={<Private><Servicos /></Private>} />
      <Route path="/resumo-mensal" element={<Private><ResumoMensal /></Private>} />
      <Route path="/taxas" element={<Private><Taxas /></Private>} />
      <Route path="/cadastro" element={<Private><CadastroDeBancos /></Private>} />
      <Route path="/extrato" element={<Private><OpenFinance /></Private>} />

      <Route path="/cadastrodebancos" element={<Navigate to="/cadastro" replace />} />
      <Route path="/openfinance" element={<Navigate to="/extrato" replace />} />

      <Route path="*" element={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '24px',
          color: 'var(--font-color, #666)'
        }}>
          Página não encontrada
        </div>
      } />
    </Routes>
  )
}

export default RoutesApp