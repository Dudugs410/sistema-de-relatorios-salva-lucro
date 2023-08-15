import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'

import BuscarClienteData from '../../components/BuscarClienteData'
import DetalhesData from '../../components/DetalhesData'
import DetalhesVenda from '../../components/DetalhesVenda'
import TotalModalidades from '../../components/TotalModalidades'

import GerarRelatorio from '../../components/GerarRelatorio'

import './vendas.css'
import './Calendar.css'
import { AuthContext } from '../../contexts/auth'

export let VendasContext = createContext({})

let Vendas = () =>{
  
  let {
    cnpj,
    bandeiras, 
    loadBandeiras,
    grupos,
    loadGrupos,
    adquirentes,
    loadAdquirentes,
    vendas,
    dateConvert,
    dateConvertSearch,
    returnTotalMes,
    loadVendas,
  } = useContext(AuthContext)

  let [totalCredito, setTotalCredito] = useState(0.00)
  let [totalDebito, setTotalDebito] = useState(0.00)
  let [totalVoucher, setTotalVoucher] = useState(0.00)
  let [totalLiquido, setTotalLiquido] = useState(0.00)

  let [detalhes, setDetalhes] = useState(false)
  let [showAdmin, setShowAdmin] = useState(false)

  let [dataBusca, setDataBusca] = useState('')

  // possivelmente utilizar estes parametros para realizar busca por período

  let [dataBusca1, setDataBusca1] = useState('')
  let [dataBusca2, setDataBusca2] = useState('')

  let [cnpjBusca, setCnpjBusca] = useState(cnpj)
  let [banBusca, setBanBusca] = useState('')
  let [adqBusca, setAdqBusca] = useState('')

  const [vendasTotais, setVendasTotais] = useState([])
  

  let tableData = []

    async function gerarDados() {
        tableData.length = 0
        console.log('vendas ao gerar Dados: ', vendas)
        if (vendas.length > 0) {
          vendas.map((venda) => {
            tableData.push({
              adquirente: venda.adquirente.nomeAdquirente,
              bandeira: venda.bandeira.descricaoBandeira,
              produto: venda.produto.descricaoProduto,
              nsu: venda.nsu,
              cnpj: venda.cnpj,
              codigoVenda: venda.codigoVenda,
              codigoAutorizacao: venda.codigoAutorizacao,
              numeroPV: venda.numeroPV,
              valorBruto: 'R$' + venda.valorBruto.toFixed(2).replaceAll('.', ','),
              valorLiquido: 'R$' + venda.valorLiquido.toFixed(2).replaceAll('.', ','),
              taxa: 'R$' + venda.taxa.toFixed(2).replaceAll('.', ','),
              dataVenda: dateConvert(venda.dataVenda),
              horaVenda: venda.horaVenda,
              dataCredito: dateConvert(venda.dataCredito),
              parcelas: venda.quantidadeParcelas,
            })
            return 0
          })
        }
        console.log('tableData: ', tableData)
      }

  useEffect(()=>{
    async function inicializar(){
      if(bandeiras.length === 0){
        await loadBandeiras()
      }
      
      if(grupos.length === 0){
        await loadGrupos()        
      }
      
      if(adquirentes.length === 0){
        await loadAdquirentes()
      }
      
    }
    inicializar()
  },[])
  /*
  useEffect(()=>{
    let dataInicial = new Date()
    dataInicial.setDate(1)
    let currentDate = new Date();
    let nextMonthFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    let dataFinal = new Date(nextMonthFirstDay.getTime() - 1);

    console.log('dataInicial: ', dataInicial, 'dataFinal: ', dataFinal)

    async function loadTotais(){
      let totais = [] 
      let dataAtual = new Date()
      console.log('dataAtual', dataAtual)
      dataAtual.setDate(1)
      console.log('dataAtual após setDate(1)',dataAtual)
      let i = dataAtual
      console.log('i: ', i)

      let resp = []
      

      for(i; i<= dataFinal; i.setDate(i.getDate() + 1)){
        console.log('FOR i: ', i)
        await returnTotalMes(cnpjBusca, i)
        .then((response) => {
          let obj = (response)
          resp.push(obj)
        })
      }
      setVendasTotais(resp)
    }
    loadTotais()
  },[]) */

  

  useEffect(()=>{
    console.log(vendasTotais)
  },[vendasTotais])

  useEffect(()=>{
    gerarDados()
  },[vendas])

  useEffect(()=>{
    setCnpjBusca(cnpj)
  },[cnpj])

  function handleDateChange(date){
    setDataBusca(date)
  }

  function MyCalendar() {

    return (
      <div>
        <Calendar
          onChange={ handleDateChange }
          value={ dataBusca }
          //tileContent={}
        />
      </div>
    )
  }

  return(
    <VendasContext.Provider 
    value={{
      detalhes, 
      setDetalhes,
      showAdmin,
      setShowAdmin, 
      dataBusca, 
      setDataBusca, 
      totalDebito,
      setTotalDebito,
      totalCredito,
      setTotalCredito,
      totalVoucher,
      setTotalVoucher,
      totalLiquido,
      setTotalLiquido,
      gerarDados,
      cnpjBusca,
      setCnpjBusca,
      banBusca,
      setBanBusca,
      adqBusca,
      setAdqBusca,
      tableData
      }}>
      <div className='appPage'>
          <div className='page-content'>
              <TotalModalidades/>
              { detalhes ?  <DetalhesVenda/> : <MyCalendar/> }
              <BuscarClienteData funcao={loadVendas} />
              { detalhes ? <GerarRelatorio className='export' tableData={tableData} dataAtual={dateConvertSearch(dataBusca)} detalhes={detalhes}/> : <></>}
              <DetalhesData/>
          </div>
      </div>
    </VendasContext.Provider>
  )
}

export default Vendas