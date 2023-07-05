import { useState, useEffect, useContext } from "react"

import './buscar.css'
import { AuthContext } from "../../contexts/auth"
import { VendasContext } from "../../pages/Vendas"

import './reactdatepicker.css'
import { Background } from "victory"

const BuscarClienteData = () => {
    const [cliente, setCliente] = useState('')
    const [adm, setAdm] = useState('')
    const [banSelecionada, setBanSelecionada] = useState('')
    const [gruSelecionado, setGruSelecionado] = useState('')
    const [cliSelecionado, setCliSelecionado] = useState('')
    const [listaClientes, setListaClientes] = useState('')

    const { vendas, setLoading, loadVendas, bandeiras, grupos } = useContext(AuthContext)
    const { detalhes, setDetalhes, setShowAdmin, dataBusca, cnpjBusca, setCnpjBusca, setTotalDebito, setTotalCredito, setTotalVoucher, setTotalLiquido, gerarDados, tableData} = useContext(VendasContext)

    useEffect(() => {
        setCnpjBusca('03.953.552/0001-02')
      }, [])
    
    async function handleBusca(e){
        e.preventDefault()
        setLoading(true)
        await buscar()
        await gerarDados()
        setLoading(false)
    }

    async function buscar() {
        await loadVendas(dataBusca, cnpjBusca)
        .then(() =>{
            alert(`executou a busca do dia ${dataBusca}`)
            setDetalhes(true)
        })
        setLoading(false)
        console.log(vendas)
      }

      useEffect(()=>{
        console.log('gruSelecionado', gruSelecionado)

        const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado));
        let cli = grupoObj ? grupoObj.CLIENTES : [];
        setListaClientes(cli)
      },[gruSelecionado])

      useEffect(()=>{
        console.log(listaClientes)
      },[listaClientes])

      useEffect(()=>{
        console.log(cliente)
        setCnpjBusca(cliente)
        
      },[cliente])

    return(
        <>
            <div className='search-bar'>
                <form className='date-container'>
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

                    <div className='date-column'>
                        <div className='select-card'>
                            <span>Administradora</span>
                            <select id='administradora' defaultValue={adm} onChange={(e) => {setAdm(e.target.value)}}>
                                <option defaultValue=''>selecione</option>
                                <option>place_holder_01</option>
                                <option>place_holder_02</option>
                                <option>place_holder_03</option>
                                <option>place_holder_04</option>
                            </select>
                        </div>
                    </div>
                    <div  className='date-column'>
                        <div className='select-card'>
                            <span>Bandeira</span>
                                <select id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                    <option defaultValue=''>selecione</option>
                                    {bandeiras.map((BAN)=>(
                                        <option key={BAN.codigoBandeira} value = {BAN.descricaoBandeira}>{BAN.descricaoBandeira}</option>
                                    ))}
                                </select>
                        </div>
                    </div>
                                        
                    <div className='submit-container'>
                        { detalhes ? <button className="btn btn-secondary btn-submit" onClick={ () => { setDetalhes(false); setShowAdmin(false); setTotalLiquido(0.00); setTotalCredito(0.00); setTotalDebito(0.00); setTotalVoucher(0.00) }}>Voltar</button> : <button className="btn btn-primary btn-submit" onClick={handleBusca}>Pesquisar</button>}
                    </div>      
                </form>
            </div>
        </>
    )
}

export default BuscarClienteData