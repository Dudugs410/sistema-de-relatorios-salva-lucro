import { Link } from "react-router-dom"
import { FiMoon, FiSun, FiHome, FiDollarSign, FiCreditCard, FiRefreshCcw, FiTool, FiFileText } from "react-icons/fi"
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
    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') === 'true')
    const [headerNome, setHeaderNome] = useState('Selecione o Grupo e Cliente')
    const [headerCnpj, setHeaderCnpj] = useState('')

    useEffect(()=>{
        if(Cookies.get('headerNome') !== undefined){
            setHeaderNome(decodeURIComponent(Cookies.get('HeaderNome')))
            setHeaderCnpj(Cookies.get('cnpj'))
        }
    },[])

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

        setHeaderNome(Cookies.get('headerNome'))
        setHeaderCnpj(Cookies.get('headerCnpj'))

        setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
    },[])

    useEffect(()=>{
        if(cnpj === 'todos'){
            if(grupoSelecionado.label !== '-'){
                setHeaderNome(grupoSelecionado.label)
                setHeaderCnpj('Todas as Filiais')
                Cookies.set('headerNome', grupoSelecionado.label)
                Cookies.set('headerCnpj', 'Todas as Filiais')
            }
        } else {
            if(grupoSelecionado.label !== '-'){
                setHeaderNome(clienteSelecionado.label)
                setHeaderCnpj(clienteSelecionado.value)
                Cookies.set('headerNome', clienteSelecionado.label)
                Cookies.set('headerCnpj', clienteSelecionado.value)
            }
        }
    },[trocarHeader])

    useEffect(()=>{
        if(headerNome === 'Selecione o Grupo e o Cliente'){
            setHeaderCnpj('')
            Cookies.set('headerCnpj', '')
        }
    },[headerNome])

    ////////////////////////////////////////////////////////////////////////////////////
    
    const [optionsWithIcons, setOptionsWithIcons] = useState([])
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
        }

        let arrayOpcoes = []

        optionsTemp.forEach((obj) => {
            switch (obj.nome) {
                case 'Dashboard':
                    arrayOpcoes.push({ rota: '/dashboard', nome: 'Início', id: obj.id, icone: icones['FiHome'] })
                    break
                case 'Vendas':
                    arrayOpcoes.push({ rota: '/vendas', nome: 'Vendas', id: obj.id, icone: icones['FiDollarSign'] })
                    break
                case 'Créditos':
                    arrayOpcoes.push({ rota: '/creditos', nome: 'Créditos', id: obj.id, icone: icones['FiCreditCard'] })
                    break
                case 'Serviços':
                    arrayOpcoes.push({ rota: '/servicos', nome: 'Serviços', id: obj.id, icone: icones['FiTool'] })
                    break
                default:
            }
        })
        setOptionsWithIcons(arrayOpcoes)
    }, [optionsTemp])

    ////////////////////////////////////////////////////////////////////////////////////

    return(
        <>
            <div className="header-bg-image">
                <div className={`header-bg ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className='navbar-title'>
                        <img className='img-header' src={salvaLucroLogoBranco} alt='logo salva lucro'/>
                    </div>
                    <div className="header-info-wrapper px-4 py-3" >
                        <div className='navbar-customer-wrapper me-2 text-truncate'>
                            <div className='navbar-customer '>
                                <span className="d-inline-block">{headerNome === (undefined || '-' || '') ? 'Selecione o Grupo e o Cliente' : headerNome}</span>
                                <span>{ headerNome === undefined ? '' : headerCnpj }</span>
                            </div>
                            <div className='navbar-customer'>
                                <span className='client-name pe-2'>{`${nome}`}</span>
                            </div>              
                        </div>
                        <div className='btn-container'>
                            <button type='button' className='btn btn-outline-danger px-2 py-1' onClick={logout}>Sair</button> {/* <FiPower color="#dc3545" size={24}/> */}
                        </div>
                    </div>
                </div>

                <div className='header-content'>
                    <div className={`barra-header ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                        <div className="li-container px-3">
                            <ul className={`navbar-nav pe-2 ${isDarkTheme ? 'dark-theme' : 'light-theme' }`}>
                                {optionsWithIcons.length > 0 && optionsWithIcons.map((opcao) => (
                                    <li className="nav-item " key={opcao.id}>
                                        <Link to={opcao.rota} className="nav-hover active text-shadow" aria-current="page"> {/* nav-text */}
                                            <button className={`px-2 me-1 li-button-content ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                                {opcao.icone && React.createElement(opcao.icone)}
                                                <span className="ms-1 mt-2 mb-auto li-btn-text">{opcao.nome}</span>
                                            </button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="toggle-container me-1">
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

export default Header