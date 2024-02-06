import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Private from "./Private";

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Vendas from "../pages/Vendas";
import Recebiveis from "../pages/Creditos";
import Antecipacoes from "../pages/Antecipacoes";
import Servicos from "../pages/Servicos";
import Relatorios from "../pages/Relatorios";
import DashboardTeste from "../pages/DashboardTeste";

function RoutesApp(){
    return(
    <Routes>
        <Route path='/' element = {<Login/>}/>
        <Route path='/dashboard' element = { <Private><Dashboard/></Private>}/>
        <Route path='/vendas' element = { <Private><Vendas/></Private> } />
        <Route path='/creditos' element = { <Private><Recebiveis/></Private> } />
        <Route path='/servicos' element = { <Private><Servicos/></Private> } />
        <Route path='/relatorios' element = { <Private><Relatorios/></Private> } />
        {/* <Route path='/antecipacoes' element = { <Private><Antecipacoes/></Private> } /> */}
    </Routes>
    )  
}

export default RoutesApp
