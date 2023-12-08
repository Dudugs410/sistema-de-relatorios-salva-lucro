import { useState, useEffect, useContext } from "react"

import { AuthContext } from "../../contexts/auth"
import { ToastContainer } from 'react-toastify'
import Cookies from "js-cookie";

import 'react-toastify/dist/ReactToastify.css';
import './Seletor.scss'

const SeletorCliente = () => {
    const { 
        gruSelecionado, 
        setGruSelecionado, 
        listaClientes, 
        setListaClientes, 
        setGrupos, 
        resetaSomatorios, 
        alerta, 
        isDarkTheme,
        grupos,
        cnpj, 
        setCnpj, 
        setInicializouAux,
    } = useContext(AuthContext)

    const [cliSelecionado, setCliSelecionado] = useState('')

    useEffect(()=>{
        setCnpj(sessionStorage.getItem('cnpj'))
        setGrupos(JSON.parse(sessionStorage.getItem('grupos')))
    },[])

    useEffect(()=>{
    const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado));
    let cli = grupoObj ? grupoObj.CLIENTES : []
    setListaClientes(cli)
    },[gruSelecionado])

    /*useEffect(()=>{
    sessionStorage.setItem('cnpj', cnpj)
    Cookies.set('cnpj', cnpj)
    },[cnpj])*/

    function handleCnpj(e){
        e.preventDefault()
        console.log(cliSelecionado)
        console.log('CNPJ antes: ', cnpj)
        if((cliSelecionado !== cnpj) && (cliSelecionado !== '') && (cliSelecionado !== 'selecione')){
            resetaSomatorios()
            setCnpj(cliSelecionado)
            setInicializouAux(false)
            sessionStorage.setItem('inicializou', false)
            sessionStorage.setItem('codigoGrupo', gruSelecionado)
            Cookies.set('cnpj', cliSelecionado)
        } 
        else if((cliSelecionado === '') || (cliSelecionado ==='selecione')){
            alerta('Selecione um cliente válido')
        }  
    }

    return(
        <>
        { grupos === null ? <></> : 
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='search-bar-seletor'>
                <form className={`date-container-seletor ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className='date-column-seletor'>
                        <div className='select-card-seletor'>
                            <span>Grupo de Clientes</span>
                            <select className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} id='grupo' value={gruSelecionado} onChange={(e) => {setGruSelecionado(e.target.value)}}>
                                { !gruSelecionado ? <option defaultValue=''>selecione</option> : <option defaultValue='gruSelecionado'>{gruSelecionado.nome}</option>}
                                {grupos.map((GRU)=>(
                                    <option key={GRU.CODIGOGRUPO} value={GRU.CODIGOGRUPO} >{GRU.NOMEGRUPO}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div  className='date-column-seletor'>
                        <div className='select-card-seletor'>
                            <span>Cliente</span>
                            { listaClientes.length > 0 ?
                            <select className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} id='cliente' value={cliSelecionado} onChange={(e) => {setCliSelecionado(e.target.value)}}>
                                <option defaultValue=''>selecione</option>
                                { listaClientes.map((CLI)=>(
                                        <option key={CLI.CODIGOCLIENTE} value={CLI.CNPJ}>{CLI.NOMECLIENTE}</option>
                                    ))}
                            </select> : 
                            <select className={`${isDarkTheme === true ? 'dark-theme-disabled' : 'light-theme-disabled'} select-disabled`} disabled>
                                <option defaultValue=''>Selecione o Cliente / Filial</option>
                            </select>}
                        </div>
                    </div>

                    <div className="select-btn-seletor">
                        <button className={`btn btn-primary btn-seletor ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleCnpj}>Selecionar</button>
                    </div>
                </form>
            </div>
        </>
        }
        </>
    )
}

export default SeletorCliente