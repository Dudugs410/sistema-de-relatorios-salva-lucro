import React, { useEffect } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"

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
    // Salva o caminho atual (relativo ao basename)
    const currentPath = location.pathname
    if (currentPath !== '/' && currentPath !== '/login') {
      sessionStorage.setItem('currentPath', currentPath)
    }
  }, [location.pathname])

  useEffect(() => {
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
    const savedPath = sessionStorage.getItem('currentPath')
    const currentPath = location.pathname

    if (!isSignedIn) {
      // Se não está logado, vai para login (relativo ao basename)
      if (currentPath !== '/' && currentPath !== '/login') {
        navigate('/login')
      }
    } else {
      // Se está logado
      if (currentPath === '/' || currentPath === '/login') {
        // Se está na página de login ou raiz, redireciona para dashboard
        navigate('/dashboard')
      } else if (savedPath && savedPath !== currentPath) {
        // Se tem um caminho salvo e é diferente do atual, navega para ele
        navigate(savedPath)
      }
    }
  }, [navigate, location.pathname])

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rotas privadas */}
      <Route path="/usuario" element={<Private><Usuario /></Private>} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/vendas" element={<Private><Vendas /></Private>} />
      <Route path="/creditos" element={<Private><Recebiveis /></Private>} />
      <Route path="/creditos-data-banco" element={<Private><CreditosDataBanco /></Private>} />
      <Route path="/previsao-recebimento" element={<Private><PrevisaoRecebimentos /></Private>} />
      <Route path="/servicos" element={<Private><Servicos /></Private>} />
      <Route path="/resumo-mensal" element={<Private><ResumoMensal /></Private>} />
      <Route path="/taxas" element={<Private><Taxas /></Private>} />
      <Route path="/extrato" element={<Private><Extrato /></Private>} />
      <Route path="/cadastrodebancos" element={<Private><CadastroDeBancos /></Private>} />
      <Route path="/openfinance" element={<Private><OpenFinance/></Private>} />

      {/* Rotas comentadas para uso futuro */}
      {/*
      <Route path="/financeiro" element={<Private><Financeiro /></Private>} />
      <Route path="/gerenciais" element={<Private><Gerenciais /></Private>} />
      <Route path="/outrosrelatorios" element={<Private><OutrosRelatorios /></Private>} />
      <Route path="/sysmo" element={<Private><ExportacaoSysmo /></Private>} />
      <Route path="/meta" element={<Private><ExportacaoMeta /></Private>} />
      <Route path="/metasapiranga" element={<Private><ExportacaoMetaSapiranga /></Private>} />
      <Route path="/administracao" element={<Private><Administracao /></Private>} />
      <Route path="/suporte" element={<Private><Suporte /></Private>} />
      <Route path="/vendasdelivery" element={<Private><VendasDelivery /></Private>} />
      <Route path="/conciliacao" element={<Private><ConciliacaoBancaria /></Private>} />
      */}
      
      {/* Rota de fallback para 404 */}
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  )
}

export default RoutesApp