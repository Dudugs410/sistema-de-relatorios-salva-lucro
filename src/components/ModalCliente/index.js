import React, { useContext, useEffect, useState } from "react"
import './ModalCliente.css'
import { AuthContext } from "../../contexts/auth"
import LoadingModal from "../LoadingModal"



const ModalCliente = () => {
    const{grupos, loadGrupos, setCnpj, loading, modalCliente, setModalCliente} = useContext(AuthContext)
    
    const [cliente, setCliente] = useState('')
    const [listaClientes, setListaClientes] = useState('')
    const [gruSelecionado, setGruSelecionado] = useState('')
    const [carregou, setCarregou] = useState(false)

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
      },[gruSelecionado])

    function handleSubmit(e){
        e.preventDefault()
        setCnpj(cliente)
        setModalCliente(false)
    }
    
    return(
        <>
            {loading ? <LoadingModal/> : 
                <>
                    <div className='modal-cliente'>
                        <div className='modal-window'>
                            <div className='modal-content'>
                                <form className='date-container' onSubmit={(e)=>handleSubmit(e)}>
                                    <div className='date-column'>
                                        <div className='select-card'>
                                            <span>Grupo de Clientes</span>
                                            <select id='grupo' value={gruSelecionado} onChange={(e) => {setGruSelecionado(e.target.value)}}>
                                                    <option defaultValue=''>selecione</option>
                                                    {grupos.map((GRU)=>(
                                                        <option key={GRU.CODIGOGRUPO} value={GRU.CODIGOGRUPO} >{GRU.NOMEGRUPO}</option>
                                                    ))}
                                                </select>
                                        </div>
                                    </div>

                                    <div  className='date-column'>
                                        <div className='select-card'>
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
                                    </div>
                                    <div className='btn-container'>
                                        <button className='btn btn-primary btn-modal' type='submit'>Selecionar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>}
        </>
    )
}

export default ModalCliente