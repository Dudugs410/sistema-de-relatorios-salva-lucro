import React, { useContext, useEffect, useState } from "react"
import './ModalCliente.scss'
import { AuthContext } from "../../contexts/auth"
import LoadingModal from "../LoadingModal"
import Cookies from "js-cookie"



const ModalCliente = () => {
    const{grupos, 
        loadGrupos,
        setCnpj, 
        loading, 
        setModalCliente,
        alerta, 
    } = useContext(AuthContext)
    
    const [cliente, setCliente] = useState('')
    const [listaClientes, setListaClientes] = useState('')
    const [gruSelecionado, setGruSelecionado] = useState('')

    async function iniciaGrupos(){
        await loadGrupos()
    }

    useEffect(()=>{
        async function inicializarGrupos(){
            await iniciaGrupos()
        }
        inicializarGrupos()
    },[])

    useEffect(()=>{
        const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado))
        let cli = grupoObj ? grupoObj.CLIENTES : [];
        setListaClientes(cli)
        sessionStorage.setItem('codigoGrupo', gruSelecionado)
      },[gruSelecionado])

    function handleSubmit(e){
        e.preventDefault()
        Cookies.set('cnpj', cliente)
        if((cliente === 'selecione') || (cliente === '')){
            alerta('Selecione um cliente válido')
        } else {
            setCnpj(cliente)
            setModalCliente(false)
        }
    }
    
    return(
        <>
            {loading ? <LoadingModal/> : 
                <>
                    <div className='modal-cliente'>
                        <div className='modal-window'>
                            <form className='form-modal-cliente' onSubmit={(e)=>handleSubmit(e)}>
                                <div className='select-card-modal-cliente'>
                                    <span>Grupo de Clientes</span>
                                    <select id='grupo' value={gruSelecionado} onChange={(e) => {setGruSelecionado(e.target.value)}}>
                                            <option defaultValue=''>selecione</option>
                                            {grupos.map((GRU)=>(
                                                <option key={GRU.CODIGOGRUPO} value={GRU.CODIGOGRUPO} >{GRU.NOMEGRUPO}</option>
                                            ))}
                                        </select>
                                </div>

                                <div className='select-card-modal-cliente'>
                                    <span>Cliente</span>
                                    { listaClientes.length > 0 ?
                                    <select id='cliente' value={cliente} onChange={(e) => {setCliente(e.target.value)}}>
                                        <option defaultValue=''>selecione</option>
                                        { listaClientes.map((CLI)=>(
                                                <option key={CLI.CODIGOCLIENTE} value={CLI.CNPJ}>{CLI.NOMECLIENTE}</option>
                                            ))}
                                    </select> : 
                                    <select className='select-disabled' disabled>
                                        <option defaultValue=''>Selecione o Grupo</option>
                                    </select>}
                                </div>
                                
                                <div className='btn-container-modal-cliente'>
                                    <button className='btn btn-primary btn-modal' type='submit'>Selecionar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>}
        </>
    )
}

export default ModalCliente