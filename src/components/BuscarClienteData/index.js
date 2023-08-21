import { useState, useEffect, useContext } from "react"

import './buscar.css'
import { AuthContext } from "../../contexts/auth"
import { VendasContext } from "../../pages/Vendas"

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify'

import { vendasStatic } from "../../contexts/static";

import 'react-toastify/dist/ReactToastify.css'
import './reactdatepicker.css'

const BuscarClienteData = () => {
    const [banSelecionada, setBanSelecionada] = useState('')
    const [gruSelecionado, setGruSelecionado] = useState('')
    const [adqSelecionada, setAdqSelecionada] = useState('')
    const [listaClientes, setListaClientes] = useState('')

    const [buscou, setBuscou] = useState(false)

    const { 
        cnpj, 
        vendas, 
        setLoading, 
        loadVendas, 
        bandeiras, 
        grupos, 
        adquirentes,
        dateConvertSearch,
        teste,
        setVendas, 
    } = useContext(AuthContext)

    const { 
        detalhes, 
        setDetalhes, 
        setShowAdmin, 
        dataBusca, 
        cnpjBusca, 
        setCnpjBusca, 
        banBusca, 
        setBanBusca, 
        adqBusca, 
        setAdqBusca, 
        setTotalDebito, 
        setTotalCredito, 
        setTotalVoucher, 
        setTotalLiquido, 
        gerarDados,
        tableData,
    } = useContext(VendasContext)
    
    useEffect(()=>{
        console.log('Detalhes: ',detalhes)
    },[detalhes])

    useEffect(()=>{
        sessionStorage.setItem('cnpj', cnpj)
      },[cnpj])
    
    useEffect(()=>{
        setCnpjBusca(sessionStorage.getItem('cnpj'))
    },[])

    function alerta(text){
        toast.info(text, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            })
    }

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
                alerta(`executou a busca do dia ${dateConvertSearch(dataBusca)}`)
                setBuscou(true)
            }    
        })
        setLoading(false)
    }

    useEffect(()=>{
    console.log('buscou: ', buscou)
    if(buscou === true){
            if((vendas === null) || (vendas.length === 0)){
                alerta('não existem vendas para a data selecionada')
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

    function handleVoltar(e){
    e.preventDefault()
    setDetalhes(false)
    setShowAdmin(false)
    setTotalLiquido(0.00)
    setTotalCredito(0.00)
    setTotalDebito(0.00)
    setTotalVoucher(0.00)

    console.log('voltar:')
    console.log('cnpj: ', cnpj)
    console.log('adquirente: ',adqBusca)
    console.log('bandeira: ', banBusca)
    }

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
                            <span>Adquirente</span>
                            { detalhes ? 
                                <select disabled className='select-disabled' id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {adquirentes.map((ADQ)=>(
                                        <option key={ADQ.codigoAdquirente} value = {ADQ.codigoAdquirente}>{ADQ.nomeAdquirente}</option>
                                    ))}
                                </select>
                            : 
                                <select  id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {adquirentes.map((ADQ)=>(
                                        <option key={ADQ.codigoAdquirente} value = {ADQ.codigoAdquirente}>{ADQ.nomeAdquirente}</option>
                                    ))}
                                </select>
                            }
                        </div>
                    </div>
                    <div  className='date-column'>
                        <div className='select-card'>
                            <span>Bandeira</span>
                            { detalhes ? 
                                <select disabled className='select-disabled' id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {bandeiras.map((BAN)=>(
                                        <option key={BAN.codigoBandeira} value = {BAN.codigoBandeira}>{BAN.descricaoBandeira}</option>
                                    ))}
                                </select>  
                            :
                                <select id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {bandeiras.map((BAN)=>(
                                        <option key={BAN.codigoBandeira} value = {BAN.codigoBandeira}>{BAN.descricaoBandeira}</option>
                                    ))}
                                </select>
                                 }
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