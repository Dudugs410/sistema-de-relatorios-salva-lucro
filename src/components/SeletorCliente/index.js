import { useState, useEffect, useContext } from "react"
import Select from 'react-select';

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
        resetaDashboard,
    } = useContext(AuthContext)

    const [cliSelecionado, setCliSelecionado] = useState('')

    useEffect(()=>{
        setCnpj(sessionStorage.getItem('cnpj'))
        setGrupos(JSON.parse(sessionStorage.getItem('grupos')))
    },[])

    useEffect(()=>{
        const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado.value));
        let cli = grupoObj ? grupoObj.CLIENTES : []
        setListaClientes(cli)
    },[gruSelecionado])

    /*useEffect(()=>{
    sessionStorage.setItem('cnpj', cnpj)
    Cookies.set('cnpj', cnpj)
    },[cnpj])*/

    function handleCnpj(e){
        e.preventDefault()
        resetaDashboard()
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

    /// React Select

    // grupos

    const listaGrupos = grupos.map((GRU) => ({
        value: GRU.CODIGOGRUPO,
        label: GRU.NOMEGRUPO,
    }));
    
    const handleSelectChangeGrupo = (selected) => {
        setGruSelecionado(selected);
    };

    const handleSelectChangeCLI = (selected) => {
        setCliSelecionado(selected ? selected.value : null); // Set cliSelecionado to selected value (CNPJ)
      };

    // clientes

    const [listaCli, setListaCli] = useState([])

    useEffect(()=>{
        if((listaClientes.length > 0) && (listaClientes !== undefined)){
            setListaCli(listaClientes.map((CLI) => ({
                value: CLI.CNPJ,
                label: CLI.NOMECLIENTE,
            })))
        }
    },[listaClientes])

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
                    <div className='cli-container'>
                        <div className='date-column-seletor'>
                            <div className='select-card-seletor'>
                            <span>Grupo</span>
                            <Select
                                options={listaGrupos}
                                onChange={handleSelectChangeGrupo}
                                value={listaGrupos.GRUCODIGO}
                                placeholder="Selecione ou digite para filtrar"
                            />
                            </div>
                        </div>

                        <div className='date-column-seletor'>
                            <div className='select-card-seletor'>
                            <span>Cliente</span>
                            {listaClientes.length > 0 ? (
                                <Select
                                className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
                                options={listaCli}
                                onChange={handleSelectChangeCLI}
                                value={listaCli.CNPJ}
                                placeholder="Selecione o Cliente"
                                />
                            ) : (
                                <Select
                                className={`${isDarkTheme === true ? 'dark-theme-disabled' : 'light-theme-disabled'} select-disabled`}
                                options={[]}
                                isDisabled
                                placeholder="Selecione o Cliente / Filial"
                                />
                            )}
                            </div>
                        </div>
                    </div>
                    <div className="select-btn-seletor">
                        <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleCnpj} disabled={cliSelecionado === cnpj}>Selecionar</button>
                    </div>
                </form>
            </div>
        </>
        }
        </>
    )
}

export default SeletorCliente