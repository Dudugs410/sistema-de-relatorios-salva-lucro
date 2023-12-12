import { useState, useEffect, useContext, useRef } from "react"

import './buscarVendas.scss'
import { AuthContext } from "../../contexts/auth"
import { VendasContext } from "../../pages/Vendas"

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify'

import '../../styles/global.scss'
import 'react-toastify/dist/ReactToastify.css'
import './reactdatepicker.css'
import Cookies from "js-cookie";
import { useCallback } from "react";

const BuscarClienteVendas = () => {
    const [buscou, setBuscou] = useState(false)
    const [arrayDados, setArrayDados] = useState([])

    const { 
        setCnpj,  
        setLoading,
        loadVendas,
        loadRecebimentos, 
        returnVendas,
        returnCreditos,
        setVendas,
        setRecebimentos,
        dateConvertSearch,
        setTotaisGlobal,
        isDarkTheme,
        vendas,
        banBusca,
        adqBusca,
        gerarDados,
    } = useContext(AuthContext)

    const {
        detalhes,
        setDetalhes,
        dataBusca,
        cnpjBusca,
        setCnpjBusca,
        setTotalDebito,
        setTotalCredito,
        setTotalVoucher,
        setTotalLiquido,
        setArrayAdm,
    } = useContext(VendasContext)
    
    useEffect(()=>{
        console.log('Detalhes: ',detalhes)
    },[detalhes])
    
    useEffect(()=>{
        setCnpj(Cookies.get('cnpj'))
        setCnpjBusca(Cookies.get('cnpj'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const alerta = useCallback((text) => {
        toast.info(text, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }, [])

      async function handleBusca(e){
        console.log('handleBusca()')
        e.preventDefault()
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
                if(vendas.length === 0){
                    setDetalhes(false)
                }
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
                setDetalhes(false)
            }
            else{
                setDetalhes(true)
                setBuscou(false)
            }
        }
    },[buscou])

    const alertaRef = useRef()
    const setDetalhesRef = useRef()
    const arrayDadosRef = useRef()

    useEffect(()=>{
        alertaRef.current = alerta
        setDetalhesRef.current = setDetalhes
        arrayDadosRef.current = arrayDados                   
    },[alerta, setDetalhes, arrayDados])

    useEffect(()=>{
    console.log('buscou: ', buscou)
    if(buscou === true){
            if((arrayDadosRef === null) || (arrayDadosRef.length === 0)){
                alertaRef.current('não existem vendas para a data selecionada')
                setBuscou(false)
            }
            else{
                setDetalhesRef.current(true)
                setBuscou(false)
            }
        }
    },[buscou])

    function handleVoltar(e){
        e.preventDefault()
        setDetalhes(false)
        setBuscou(false)
        setTotalLiquido(0.00)
        setTotalCredito(0.00)
        setTotalDebito(0.00)
        setTotalVoucher(0.00)
        setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
        setArrayAdm()
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
                <form className={`date-container-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>       
                    <div className='submit-container select-align'>
                        { (detalhes) && (vendas.length > 0) ? <button className={`btn btn-secondary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleBusca}>Pesquisar</button>}
                    </div>      
                </form>
            </div>
        </>
    )
}

export default BuscarClienteVendas