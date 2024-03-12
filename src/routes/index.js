import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Private from "./Private";

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Vendas from "../pages/Vendas";
import Recebiveis from "../pages/Creditos";
import Servicos from "../pages/Servicos";
import Relatorios from "../pages/Relatorios";
import Financeiro from "../pages/Financeiro";
import Gerenciais from "../pages/Gerenciais";
import PageTeste from "../pages/000TESTE";
import ExportacaoSysmo from "../pages/ExportacaoSysmo";

function RoutesApp(){
    return(
    <Routes>
        <Route path='/' element = {<Login/>}/>
        <Route path='/dashboard' element = { <Private><Dashboard/></Private> }/>
        <Route path='/vendas' element = { <Private><Vendas/></Private> }/>
        <Route path='/creditos' element = { <Private><Recebiveis/></Private> }/>
        <Route path='/servicos' element = { <Private><Servicos/></Private> }/>
        <Route path='/relatorios' element = { <Private><Relatorios/></Private> }/>
        <Route path='/financeiro' element = { <Private><Financeiro/></Private> }/>
        <Route path='/gerenciais' element = { <Private><Gerenciais/></Private> }/>
        <Route path='/sysmo' element = {<Private><ExportacaoSysmo/></Private> }/>

        <Route path='/TESTE' element = {<PageTeste/>} />
    </Routes>
    )
}

export default RoutesApp
