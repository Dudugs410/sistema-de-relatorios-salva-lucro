import { useState, useEffect, useContext } from "react"

import { AuthContext } from "../../contexts/auth"
import { ToastContainer } from 'react-toastify'

import LoadingModal from '../LoadingModal'


import 'react-toastify/dist/ReactToastify.css';

const SeletorCliente = () => {
    const { loading, gruSelecionado, setGruSelecionado, listaClientes, setListaClientes } = useContext(AuthContext)

    const [loadClientes, setLoadClientes] = useState(loading)

    const { grupos, cnpj, setCnpj } = useContext(AuthContext)

      useEffect(()=>{
        const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado));
        let cli = grupoObj ? grupoObj.CLIENTES : []
        setListaClientes(cli)
      },[gruSelecionado])

      useEffect(()=>{
        sessionStorage.setItem('cnpj', cnpj)
      },[cnpj])

    return(
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
            <div className='search-bar'>
                <form className='date-container date-container-seletor'>
                    <div className='date-column date-column-seletor'>
                        <div className='select-card'>
                            <span>Grupo de Clientes</span>
                            <select id='grupo' value={gruSelecionado} onChange={(e) => {setGruSelecionado(e.target.value)}}>
                                { !gruSelecionado ? <option defaultValue=''>selecione</option> : <option defaultValue='gruSelecionado'>{gruSelecionado.nome}</option>}
                                {grupos.map((GRU)=>(
                                    <option key={GRU.CODIGOGRUPO} value={GRU.CODIGOGRUPO} >{GRU.NOMEGRUPO}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div  className='date-column date-column-seletor'>
                        <div className='select-card'>
                            <span>Cliente</span>
                            { listaClientes.length > 0 ?
                            <select id='cliente' value={cnpj} onChange={(e) => {setCnpj(e.target.value)}}>
                                <option defaultValue=''>selecione</option>
                                { listaClientes.map((CLI)=>(
                                        <option key={CLI.CODIGOCLIENTE} value={CLI.CNPJ}>{CLI.NOMECLIENTE}</option>
                                    ))}
                            </select> : 
                            <select className='select-disabled' disabled>
                                <option defaultValue=''>Selecione o Cliente / Filial</option>
                            </select>}
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SeletorCliente