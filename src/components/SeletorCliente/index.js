import { useState, useEffect, useContext } from "react"

import { AuthContext } from "../../contexts/auth"
import { ToastContainer } from 'react-toastify'

import LoadingModal from '../LoadingModal'


import 'react-toastify/dist/ReactToastify.css';

const SeletorCliente = () => {
    const { loading } = useContext(AuthContext)

    const [gruSelecionado, setGruSelecionado] = useState('')
    const [listaClientes, setListaClientes] = useState('')

    const [loadClientes, setLoadClientes] = useState(loading)

    const { grupos, cnpj, setCnpj } = useContext(AuthContext)

      useEffect(()=>{
        const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado));
        let cli = grupoObj ? grupoObj.CLIENTES : []
        setListaClientes(cli)
      },[gruSelecionado])

      useEffect(()=>{
        console.log(grupos.length)
      },[grupos])


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
                <form className='date-container'>
                    <div className='date-column'>
                        <div className='select-card'>
                            <span>Grupo de Clientes</span>
                            <select id='grupo' value={gruSelecionado} onChange={(e) => {setGruSelecionado(e.target.value.cod)}}>
                                { !gruSelecionado ? <option defaultValue=''>selecione</option> : <option defaultValue='gruSelecionado'>{gruSelecionado.nome}</option>}
                                {grupos.map((GRU)=>(
                                    <option key={GRU.CODIGOGRUPO} value={ {cod :GRU.CODIGOGRUPO, nome: GRU.NOMECLIENTE} } >{GRU.NOMEGRUPO}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div  className='date-column'>
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