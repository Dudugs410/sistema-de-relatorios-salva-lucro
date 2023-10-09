import { Link } from "react-router-dom"
import { FiPower } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import { useContext, useEffect, useState } from "react"


import { FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText } from "react-icons/fi"

import salvaLucroLogoBranco from '../../assets/LogoTopo.png'
import { gruposStatic } from "../../contexts/static"

import './header.css'
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
                    <button type='button' className='btn-exit' onClick={logout}><FiPower color="#000000" size={24}/></button>
                </div>
                
                <div className='header-content'>
                    <div className="li-container">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to='/dashboard' className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                    <button className="li-button-content">
                                    <span className="li-btn-text">Início</span>&nbsp;&nbsp;&nbsp;<FiHome/>
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/vendas' className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                    <button className="li-button-content">
                                    <span className="li-btn-text">Vendas</span>&nbsp;&nbsp;&nbsp;<FiDollarSign/>
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/recebiveis' className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                    <button className="li-button-content">
                                    <span className="li-btn-text">Recebíveis</span>&nbsp;&nbsp;&nbsp;<FiCreditCard/>
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/antecipacoes' className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                    <button className="li-button-content">
                                    <span className="li-btn-text">Antecipações</span>&nbsp;&nbsp;&nbsp;&nbsp;<FiRefreshCcw/>
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/servicos' className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                    <button className="li-button-content">
                                    <span className="li-btn-text">Serviços</span>&nbsp;&nbsp;&nbsp;<FiTool/>
                                    </button>
                                </Link>  
                            </li>
                            <li className="nav-item">
                                <Link to='/relatorios' className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                    <div className="li-btn-bg">
                                        <button className="li-button-content">
                                        <span className="li-btn-text">Relatórios</span>&nbsp;&nbsp;&nbsp;<FiFileText/>
                                        </button>
                                    </div>
                                </Link>  
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;