import { useState, useEffect, useContext } from "react"

import './buscarVendas.scss'
import { AuthContext } from "../../contexts/auth"
import { VendasContext } from "../../pages/Vendas"

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify'

import { vendasStatic } from "../../contexts/static";

import 'react-toastify/dist/ReactToastify.css'
import './reactdatepicker.css'
import Cookies from "js-cookie";

const BuscarClienteData = () => {
    const [banSelecionada, setBanSelecionada] = useState('')
    const [gruSelecionado, setGruSelecionado] = useState('')
    const [adqSelecionada, setAdqSelecionada] = useState('')
    const [listaClientes, setListaClientes] = useState('')

    const [buscou, setBuscou] = useState(false)

    const { 
        cnpj,
        setCnpj, 
        vendas, 
        setLoading, 
        loadVendas, 
        bandeiras, 
        grupos, 
        adquirentes,
        dateConvertSearch,
        teste,
        setVendas,
        setTotaisGlobal, 
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
        setCnpj(Cookies.get('cnpj'))
        setCnpjBusca(Cookies.get('cnpj'))
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
        e.preventDefault()
        console.log('handleBusca()')
        setCnpj(Cookies.get('cnpj'))
        await buscar()
        console.log('vendas gerar dados',vendas)
        await gerarDados(vendas)
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
    setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})

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
                    <div className='submit-container select-align'>
                        { detalhes ? <button className="btn btn-secondary btn-submit" onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className="btn btn-primary btn-submit" onClick={handleBusca}>Pesquisar</button>}
                    </div>      
                </form>
            </div>
        </>
    )
}

export default BuscarClienteData