import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Private from "./Private";

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Vendas from "../pages/Vendas";
import Recebiveis from "../pages/Creditos";
import Servicos from "../pages/Servicos";
import Financeiro from "../pages/Financeiro";
import Gerenciais from "../pages/Gerenciais";
import PageTeste from "../pages/000TESTE";
import ExportacaoSysmo from "../pages/ExportacaoSysmo";
import ExportacaoMeta from "../pages/ExportacaoMeta";
import ExportacaoMetaSapiranga from "../pages/ExportacaoMetaSapiranga";
import Administracao from "../pages/Administracao";
import Suporte from "../pages/Suporte";
import OutrosRelatorios from "../pages/OutrosRelatorios";
import VendasDelivery from "../pages/VendasDelivery";
import ConciliacaoBancaria from "../pages/ConciliacaoBancaria";
import DashboardCopy from "../pages/Dashboard copy";

function RoutesApp(){
    useEffect(()=>{
        console.log('routes app')
    },[])
    
    return(
    <Routes>
        <Route path='/' element = {<Login/>}/>
        <Route path='/dashboard' element = { <Private><Dashboard/></Private> }/>
        <Route path='/vendas' element = { <Private><Vendas/></Private> }/>
        <Route path='/creditos' element = { <Private><Recebiveis/></Private> }/>
        <Route path='/servicos' element = { <Private><Servicos/></Private> }/>
        <Route path='/financeiro' element = { <Private><Financeiro/></Private> }/>
        <Route path='/gerenciais' element = { <Private><Gerenciais/></Private> }/>
        <Route path='/outrosrelatorios' element = { <Private><OutrosRelatorios/></Private> }/>
        <Route path='/sysmo' element = { <Private><ExportacaoSysmo/></Private> }/>
        <Route path='/meta' element = { <Private><ExportacaoMeta/></Private> }/>
        <Route path='/metasapiranga' element = { <Private><ExportacaoMetaSapiranga/></Private> }/>
        <Route path='/administracao' element = { <Private><Administracao/></Private> }/>
        <Route path='/suporte' element = { <Private><Suporte/></Private> }/>
        <Route path='/vendasdelivery' element = { <Private><VendasDelivery/></Private> } />
        <Route path='/conciliacao' element = { <Private><ConciliacaoBancaria/></Private> } />

        <Route path= '/DASHTESTE' element = { <Private><DashboardCopy/></Private>} />
        <Route path='/TESTE' element = { <Private><PageTeste/></Private> } />
    </Routes>
    )
}

export default RoutesApp
