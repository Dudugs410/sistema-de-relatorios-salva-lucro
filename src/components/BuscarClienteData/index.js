import { useState, useEffect, useContext } from "react"

import './buscar.css'
import { AuthContext } from "../../contexts/auth"
import { VendasContext } from "../../pages/Vendas"

import './reactdatepicker.css'

const BuscarClienteData = () => {
    const [cliente, setCliente] = useState('')
    const [banSelecionada, setBanSelecionada] = useState('')
    const [gruSelecionado, setGruSelecionado] = useState('')
    const [adqSelecionada, setAdqSelecionada] = useState('')
    const [listaClientes, setListaClientes] = useState('')

    const [buscou, setBuscou] = useState(false)

    const { vendas, setLoading, loadVendas, bandeiras, grupos, adquirentes } = useContext(AuthContext)
    const { detalhes, setDetalhes, setShowAdmin, dataBusca, cnpjBusca, setCnpjBusca, banBusca, setBanBusca, adqBusca, setAdqBusca, setTotalDebito, setTotalCredito, setTotalVoucher, setTotalLiquido, gerarDados, tableData} = useContext(VendasContext)
    
    async function handleBusca(e){
        console.log('handleBusca()')
        e.preventDefault()
        await buscar()
        await gerarDados()
    }

    async function buscar() {
        console.log('buscar()')
        await loadVendas(dataBusca, cnpjBusca, adqBusca, banBusca)
        .then(() =>{
            if(dataBusca === '' || cnpjBusca === ''){
                return 0
            }
            else{
                alert(`executou a busca do dia ${dataBusca}`)
                setBuscou(true)
            }
            
        })
        setLoading(false)
      }

      useEffect(()=>{
        console.log('buscou: ', buscou)
        if(buscou === true){
            if((vendas === null) || (vendas.length === 0)){
                alert('não existem vendas para a data selecionada')
                setBuscou(false)
            }
            else{
                setDetalhes(true)
                setBuscou(false)
            }
        }
      },[buscou])

      useEffect(()=>{
        const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(gruSelecionado));
        let cli = grupoObj ? grupoObj.CLIENTES : [];
        setListaClientes(cli)
      },[gruSelecionado])

      useEffect(()=>{
        setBanBusca(banSelecionada)
      },[banSelecionada])

      useEffect(()=>{
        setAdqBusca(adqSelecionada)
      },[adqSelecionada])

      useEffect(()=>{
        setCnpjBusca(cliente)
      },[cliente])

      function handleVoltar(e){
        e.preventDefault()
        setDetalhes(false)
        setShowAdmin(false)
        setTotalLiquido(0.00)
        setTotalCredito(0.00)
        setTotalDebito(0.00)
        setTotalVoucher(0.00)
        setCnpjBusca('')
        setBanBusca('')
        setAdqBusca('')
      }

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
                            <span>Adquirente</span>
                            <select id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
                                    <option defaultValue=''>selecione</option>
                                    {adquirentes.map((ADQ)=>(
                                        <option key={ADQ.codigoAdquirente} value = {ADQ.codigoAdquirente}>{ADQ.nomeAdquirente}</option>
                                    ))}
                                </select>
                        </div>
                    </div>
                    <div  className='date-column'>
                        <div className='select-card'>
                            <span>Bandeira</span>
                                <select id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                    <option defaultValue=''>selecione</option>
                                    {bandeiras.map((BAN)=>(
                                        <option key={BAN.codigoBandeira} value = {BAN.codigoBandeira}>{BAN.descricaoBandeira}</option>
                                    ))}
                                </select>
                        </div>
                    </div>
                                        
                    <div className='submit-container'>
                        { detalhes ? <button className="btn btn-secondary btn-submit" onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className="btn btn-primary btn-submit" onClick={handleBusca}>Pesquisar</button>}
                    </div>      
                </form>
            </div>
        </>
    )
}

export default BuscarClienteData