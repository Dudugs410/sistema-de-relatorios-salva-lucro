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

    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') === 'true');

/////////////////////////////////////////////////////////////////////////////

    const {isDarkTheme, setIsDarkTheme} = useContext(AuthContext)

    const handleCheckboxChange = () => {
        const updatedChecked = !isChecked

        setIsChecked(updatedChecked)
        setIsDarkTheme(updatedChecked)
        localStorage.setItem('isChecked', updatedChecked)
        localStorage.setItem('isDark', updatedChecked)
    };

    useEffect(() =>{
        console.log('isChecked: ', isChecked)
    },[isChecked])

    useEffect(() =>{
        console.log('isDarkTheme: ', isDarkTheme)
    },[isDarkTheme])

    useEffect(() => {
        const savedState = localStorage.getItem('isChecked')
        if (savedState !== null) {
          setIsChecked(savedState === 'true')
          setIsDarkTheme(savedState === 'true')
        }
      }, [])
    

/////////////////////////////////////////////////////////////////////////////
    
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

    ////////////////////////////////////////////////////////////////////////////////////

    let tipoCliente = 1

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
    let optionsTemp = JSON.parse(sessionStorage.getItem('options'))

    useEffect(()=>{
        arrayOpcoes.length = 0

        optionsTemp.map((obj)=>{
            switch (obj.nome) {
                case 'Dashboard':
                    arrayOpcoes.push({rota: '/dashboard', nome: 'Início', id: obj.id, icone: 'FiHome'})
                    break;
                case 'Vendas':
                    arrayOpcoes.push({rota: '/vendas', nome: 'Vendas', id: obj.id, icone: 'FiDollarSign'},)
                    break;
                case 'Créditos':
                    arrayOpcoes.push({rota: '/recebiveis', nome: 'Recebíveis', id: obj.id, icone: 'FiCreditCard'},)
                    break;
                case 'Serviços':
                    arrayOpcoes.push({rota: '/servicos', nome: 'Serviços', id: obj.id, icone: 'FiRefreshCcw'},)
                    break;
                case 'Antecipações':
                    arrayOpcoes.push({rota: '/antecipacoes', nome: 'Antecipações', id: obj.id, icone: 'FiTool'},)
                    break;
                case 'Relatório de Importação':
                    arrayOpcoes.push({rota: '/relatorios', nome: 'Relatórios', id: obj.id, icone: 'FiFileText'},)
                    break;
                default:
                    console.log('Não encontrado ou não implementado...')
                }
        })
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
                        <div className="toggle-container">
                            <label className="switch" >
                                <input type="checkbox" id="toggleButton" checked={isChecked} onChange={handleCheckboxChange}/>
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='header-content'>
                    <div className="li-container">
                        <ul className="navbar-nav">
                            {optionsWithIcons.length > 0 && optionsWithIcons.map((opcao) => (
                                <li className="nav-item" key={opcao.id}>
                                    <Link to={opcao.rota} className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                        <button className={`li-button-content ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                            <span className="li-btn-text">{opcao.nome}</span>
                                            {optionsWithIcons[opcao.id]?.icone && React.createElement(optionsWithIcons[opcao.id].icone)}
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
    ////////////////////////////////////////////////////////////////////////////////////
}

export default Header;