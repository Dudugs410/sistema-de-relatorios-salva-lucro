import { useState, useEffect, useContext } from "react"
import Select from 'react-select';

import { AuthContext } from "../../contexts/auth"
import { ToastContainer } from 'react-toastify'
import Cookies from "js-cookie";

import {  } from "react-icons/fi"
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
    const [selectedCliLabel, setSelectedCliLabel] = useState('Selecione');

    useEffect(()=>{
        setCnpj(sessionStorage.getItem('cnpj'))
        setGrupos(JSON.parse(sessionStorage.getItem('grupos')))
    },[])

    useEffect(()=>{
        const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado.value));
        let cli = grupoObj ? grupoObj.CLIENTES : []
        setListaClientes(cli)
        setListaCli([])
        setSelectedCliLabel('Selecione');
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

    const [gruposFiltrado, setGruposFiltrado] = useState([]);

    useEffect(() => {
        if (grupos && grupos.length > 0) {
            const sortedOptions = grupos
                .map((GRU) => ({
                    value: GRU.CODIGOGRUPO,
                    label: GRU.NOMEGRUPO,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)); // Sort options alphabetically by label
            setGruposFiltrado(sortedOptions);
        } else {
            setGruposFiltrado([]);
        }
    }, [grupos]);
    
    const handleSelectChangeGrupo = (selected) => {
        setGruSelecionado(selected);
    };

    const handleSelectChangeCLI = (selected) => {
        setCliSelecionado(selected ? selected.value : null); // Set cliSelecionado to selected value (CNPJ)
      };

    // clientes

    const [listaCli, setListaCli] = useState([]);

    useEffect(() => {
        if (listaClientes && listaClientes.length > 0) {
            const sortedOptions = listaClientes
                .map((CLI) => ({
                    value: CLI.CNPJ,
                    label: CLI.NOMECLIENTE,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)); // Sort options alphabetically by label
            setListaCli(sortedOptions);
        } else {
            setListaCli([]);
        }
    }, [listaClientes]);

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
                <form className={`date-container-seletor p-4 ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className='cli-container'>
                        <div className='date-column-seletor'>
                            <div className='select-card-seletor'>
                            <span>Grupo</span>
                            <Select
                                className=""
                                options={gruposFiltrado}
                                onChange={handleSelectChangeGrupo}
                                value={gruposFiltrado.value}
                                placeholder="Selecione ou digite para filtrar"
                            />
                            </div>
                        </div>

                        <div className='date-column-seletor '>
                            <div className='select-card-seletor'>
                            <span>Cliente</span>
                            {listaClientes.length > 0 ? (
                                <Select
                                className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
                                options={listaCli}
                                onChange={handleSelectChangeCLI}
                                value={listaCli.CNPJ}
                                placeholder="Selecione o Cliente"
                                defaultValue={selectedCliLabel}
                                key={gruSelecionado ? gruSelecionado.value : 'default'}
                                />
                            ) : (
                                <Select
                                className={`${isDarkTheme === true ? 'dark-theme-disabled' : 'light-theme-disabled'} select-disabled`}
                                options={[]}
                                isDisabled
                                placeholder="Selecione o Cliente / Filial"
                                key={gruSelecionado ? gruSelecionado.value : 'default'}
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