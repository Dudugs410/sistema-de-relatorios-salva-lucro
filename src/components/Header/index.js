import { Link } from "react-router-dom"
import { FiMoon, FiPower, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import React, { useContext, useEffect, useState } from "react"


import salvaLucroLogoBranco from '../../assets/LogoTopo.png'
import { gruposStatic } from "../../contexts/static"

import './header.scss'
import '../../index.scss'
import Cookies from "js-cookie"
import InstallPWAButton from "../Componente_BotaoPWA"

const Header = () =>{
    const { cnpj, logout, grupoSelecionado, clienteSelecionado, trocarHeader, setTrocarHeader } = useContext(AuthContext)
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
        
        if(localStorage.getItem('localUsers') !== null){
            let localUsersTemp = JSON.parse(localStorage.getItem('localUsers'))
            localUsersTemp.map(user => {
                if(user.id === Cookies.get('userID')){
                    user.theme = updatedChecked
                }
            })
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp))
        } else {
            let localUsersTemp = []
            let userTemp = { id: Cookies.get('userID'), theme: updatedChecked } 

            localUsersTemp.push(userTemp)
            localStorage.setItem('localUsers', JSON.stringify(localUsersTemp))
        }
    }
    

/////////////////////////////////////////////////////////////////////////////
    
    useEffect(()=>{
        setNome(JSON.parse(sessionStorage.getItem('userData')).NOME)
        setEmail(JSON.parse(sessionStorage.getItem('userData')).EMAIL)
        setCodCliente(sessionStorage.getItem('codigoCliente'))
    },[])

    useEffect(()=>{
        console.log('GRUPOSELECIONADO: ', grupoSelecionado)
        console.log('CLIENTESELECIONADO: ', clienteSelecionado)

        if(cnpj === 'todos'){
            setNomeCliente(grupoSelecionado.label)
            setHeaderCnpj('Todas as Filiais')
        } else {
            setNomeCliente(clienteSelecionado.label)
            setHeaderCnpj(clienteSelecionado.value)
        }
    },[trocarHeader])

    ////////////////////////////////////////////////////////////////////////////////////

    const [optionsWithIcons, setOptionsWithIcons] = useState([]);
    const [optionsTemp, setOptionsTemp] = useState([])
    useEffect(()=>{
        if(sessionStorage.getItem('options')){
            setOptionsTemp(JSON.parse(sessionStorage.getItem('options')))
        }
    },[])

    useEffect(() => {
        const icones = {
            'FiHome': FiHome,
            'FiDollarSign': FiDollarSign,
            'FiCreditCard': FiCreditCard,
            'FiRefreshCcw': FiRefreshCcw,
            'FiTool': FiTool,
            'FiFileText': FiFileText,
        };

        let arrayOpcoes = [];

        optionsTemp.forEach((obj) => {
            switch (obj.nome) {
                case 'Dashboard':
                    arrayOpcoes.push({ rota: '/dashboard', nome: 'Início', id: obj.id, icone: icones['FiHome'] });
                    break;
                case 'Vendas':
                    arrayOpcoes.push({ rota: '/vendas', nome: 'Vendas', id: obj.id, icone: icones['FiDollarSign'] });
                    break;
                case 'Créditos':
                    arrayOpcoes.push({ rota: '/creditos', nome: 'Créditos', id: obj.id, icone: icones['FiCreditCard'] });
                    break;
                // Add other cases here if needed
                default:
                    console.log('Opção Não encontrada ou ainda não implementada...');
            }
        });

        setOptionsWithIcons(arrayOpcoes);

    }, [optionsTemp]);

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
                        </div>              
                    </div>
                    <div className='btn-container'>
                        <button type='button' className='btn-exit' onClick={logout}><FiPower color="#000000" size={24}/></button>
                    </div>
                </div>
                <div className='header-content'>
                    <div className={`barra-header ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                        <div className="li-container">
                            <ul className={`navbar-nav ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                                {optionsWithIcons.length > 0 && optionsWithIcons.map((opcao) => (
                                    <li className="nav-item" key={opcao.id}>
                                        <Link to={opcao.rota} className="nav-hover nav-text nav-link active text-shadow" aria-current="page">
                                            <button className={`li-button-content ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                                <span className="li-btn-text">{opcao.nome} &nbsp;&nbsp;&nbsp;</span>
                                                {opcao.icone && React.createElement(opcao.icone)}
                                            </button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="toggle-container">
                                <label className="switch" >
                                    <input type="checkbox" id="toggleButton" checked={isChecked} onChange={handleCheckboxChange}/>
                                    <span className="slider"><FiMoon/><FiSun/></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    ////////////////////////////////////////////////////////////////////////////////////
}

export default Header;