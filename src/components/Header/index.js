import { Link } from "react-router-dom"
import { FiPower } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import React, { useContext, useEffect, useState } from "react"


import { FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText } from "react-icons/fi"

import salvaLucroLogoBranco from '../../assets/LogoTopo.png'
import { gruposStatic } from "../../contexts/static"

import './header.scss'
import Cookies from "js-cookie"

const Header = () =>{

    const {refresh} = useContext(AuthContext) 

    const { cnpj, logout } = useContext(AuthContext)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')

    const [nomeCliente, setNomeCliente] = useState('-')
    const [codCliente, setCodCliente] = useState('-')
    const [headerCnpj, setHeaderCnpj] = useState('-')
    
    useEffect(()=>{
        setNome(JSON.parse(sessionStorage.getItem('userData')).NOME)
        setEmail(JSON.parse(sessionStorage.getItem('userData')).EMAIL)
        setCodCliente(sessionStorage.getItem('codigoCliente'))
    
    },[])

    useEffect(()=>{
        setHeaderCnpj(Cookies.get('cnpj'))
        if(sessionStorage.getItem('cnpj') === null || ''){
            setHeaderCnpj(cnpj)
        }
        gruposStatic.map((element) => {
            element.CLIENTES.map((cli)=>{
                if(cli.CNPJ === cnpj){
                    setNomeCliente(cli.RAZAOSOCIAL)
                    setHeaderCnpj(cli.CNPJ)
                }
            })
        })
    },[cnpj])

    async function handleRefresh(e){
        e.preventDefault()
        await refresh()
    }
    ////////////////////////////////////////////////////////////////////////////////////

    let tipoCliente = 0

    const [arrayOpcoes, setArrayOpcoes] = useState([])
    const icones = {
        'FiHome': FiHome,
        'FiDollarSign': FiDollarSign,
        'FiCreditCard': FiCreditCard,
        'FiRefreshCcw': FiRefreshCcw,
        'FiTool': FiTool,
        'FiFileText': FiFileText,
        
    }

    const [optionsWithIcons, setOptionsWithIcons] = useState({})

    useEffect(()=>{
        arrayOpcoes.length = 0
        if(tipoCliente === 0){
            setArrayOpcoes([
                {rota: '/dashboard', nome: 'Início', id: 0, icone: 'FiHome'},
                {rota: '/vendas', nome: 'Vendas', id: 1, icone: 'FiDollarSign'},
                {rota: '/recebiveis', nome: 'Recebíveis', id: 2, icone: 'FiCreditCard'},
                {rota: '/servicos', nome: 'Serviços', id: 3, icone: 'FiRefreshCcw'},
                {rota: '/antecipacoes', nome: 'Antecipações', id: 4, icone: 'FiTool'},
                {rota: '/relatorios', nome: 'Relatórios', id: 5, icone: 'FiFileText'},
                {rota: '/teste', nome: 'TESTE', id: 6, icone: 'FiHome'}])
        } else if(tipoCliente === 1){
            setArrayOpcoes([
                {rota: '/dashboard', nome: 'Início', id: 0, icone: 'FiHome'},
                {rota: '/vendas', nome: 'Vendas', id: 1, icone: 'FiDollarSign'},
                {rota: '/recebiveis', nome: 'Recebíveis', id: 2, icone: 'FiCreditCard'},
            ])
        }
    },[])

    useEffect(()=>{
        console.log('opcoes disponiveis: ', arrayOpcoes)
        let temp = arrayOpcoes.map(option => ({
            ...option,
            icone: icones[option.icone],
          }))
          setOptionsWithIcons(temp)          
    },[arrayOpcoes])

    useEffect(()=>{
        console.log('opcoes com icones: ', optionsWithIcons)

    },[optionsWithIcons])

    ////////////////////////////////////////////////////////////////////////////////////

    return(
        <>
        <div className="header-bg-image">
                <div className='header-bg'>
                    <div className='navbar-title'>
                        <img className='img-header' src={salvaLucroLogoBranco} alt='logo salva lucro'/>
                    </div>
                    <div className='navbar-customer-wrapper'>
                        <div className='navbar-customer'>
                            <span>{`${nomeCliente}`}</span>
                            <span>{`${headerCnpj}`}</span>
                        </div>
                        <div className='navbar-customer'>
                            <span className='client-name'>{`${nome}`}</span>
                            <span className='client-code'>{`${email}`}</span> 
                        </div>              
                    </div>
                    <div className='btn-container'>
                        <button type='button' className='btn-exit' onClick={logout}><FiPower color="#000000" size={24}/></button>
                        <div class="toggle-container">
                            <label class="switch">
                                <input type="checkbox" id="toggleButton" />
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='header-content'>
                    <div className="li-container">
                        <ul className="navbar-nav">
                            { optionsWithIcons.length > 0 && optionsWithIcons.map((opcao) => {
                                return(
                                    <li className="nav-item" key={opcao.id}>
                                        <Link to={opcao.rota} className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                            <button className="li-button-content">
                                            <span className="li-btn-text">{opcao.nome}</span>&nbsp;&nbsp;&nbsp;{optionsWithIcons.length > 0 ? React.createElement(optionsWithIcons[opcao.id].icone) : null}
                                            </button>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
    ////////////////////////////////////////////////////////////////////////////////////
}

export default Header;