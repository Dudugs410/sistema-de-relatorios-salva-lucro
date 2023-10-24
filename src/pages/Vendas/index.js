import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'

import BuscarClienteData from '../../components/Componente_BuscarClienteData'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import DetalhesVenda from '../../components/DetalhesVenda'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'

import GerarRelatorio from "../../components/Componente_GerarRelatorio"

import './vendas.scss'
import './Calendar.scss'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'

export let VendasContext = createContext({})

let Vendas = () =>{

  let {
    cnpj,
    setCnpj,
    bandeiras, 
    loadBandeiras,
    grupos,
    loadGrupos,
    adquirentes,
    loadAdquirentes,
    vendas,
    dateConvert,
    dateConvertSearch,
    loadVendas,
  } = useContext(AuthContext)

  const [totalCredito, setTotalCredito] = useState(0.00)
  const [totalDebito, setTotalDebito] = useState(0.00)
  const [totalVoucher, setTotalVoucher] = useState(0.00)
  const [totalLiquido, setTotalLiquido] = useState(0.00)

  let [arrayAdm, setArrayAdm] = useState([])
  const [arrayRelatorio, setArrayRelatorio] = useState([])

  let [detalhes, setDetalhes] = useState(false)
  let [showAdmin, setShowAdmin] = useState(false)

  const [dataBusca, setDataBusca] = useState(new Date())

  // possivelmente utilizar estes parametros para realizar busca por período

  const [cnpjBusca, setCnpjBusca] = useState(Cookies.get('cnpj'))
  const [banBusca, setBanBusca] = useState('')
  const [adqBusca, setAdqBusca] = useState('')

  const [vendasTotais, setVendasTotais] = useState([])

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

  useEffect(()=>{
    vendas.length = 0
    setTotalCredito(0.00)
    setTotalDebito(0.00)
    setTotalVoucher(0.00)
    setTotalLiquido(0.00)
  },[])
  
  useEffect(()=>{
    console.log(vendasTotais)
  },[vendasTotais])

  useEffect(()=>{
    setCnpj(Cookies.get('cnpj'))
  },[])

  const [tableData, setTableData] = useState([])

  function gerarDados(array){
    tableData.length = 0
    console.log('vendas ao gerar Dados: ', array)
    if (array.length > 0) {
      array.map((venda) => {
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
        console.log('tableData: ', tableData)
        return tableData
      })
    }
    console.log('arrayRelatorio: ', arrayRelatorio)
  }

  useEffect(()=>{
    if(vendas.length === 0){
      setTotalCredito(0.00)
      setTotalDebito(0.00)
      setTotalVoucher(0.00)
      setTotalLiquido(0.00)
    }
    else if(vendas.length > 0){
      console.log(vendas)
      setArrayRelatorio(gerarDados(vendas))
      setArrayAdm(separaAdm(vendas))
    }
  },[vendas])

  useEffect(()=>{
    console.log('arrayRelatorio: ', arrayRelatorio)
  },[arrayRelatorio])

  useEffect(()=>{
    setCnpjBusca(cnpj)
  },[cnpj])

  function handleDateChange(date){
    setDataBusca(date)
  }

  function separaAdm(array){
    console.log('array: ', array)
    if(array.length > 0){
      let temp = []
      let totalCreditoTemp = 0
      let totalDebitoTemp = 0
      let totalVoucherTemp = 0
      let totalLiquidoTemp = 0

      array.forEach((venda)=>{
        if(temp.length === 0){
          let novoObj = {
              nomeAdquirente: venda.adquirente.nomeAdquirente,
              total: venda.valorLiquido,
              id: 0,
              vendas: []
          }
          temp.push(novoObj)
        }else{
          let novoObj = {
              nomeAdquirente: venda.adquirente.nomeAdquirente,
              total: venda.valorLiquido,
              id: 0,
              vendas: []
          }

          if(!(temp.find((objeto) => objeto.nomeAdquirente === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
              novoObj.id = (temp.length)
              temp.push(novoObj)
          }

          else{
              for(let i = 0; i < temp.length; i++){
                  if(temp[i].nomeAdquirente === venda.adquirente.nomeAdquirente){
                      temp[i].total += venda.valorLiquido
                  }
              }
          }
        }
        // eslint-disable-next-line default-case
        switch(venda.produto.descricaoProduto){
          case 'Crédito':
            totalCreditoTemp += venda.valorLiquido
            break;

          case 'Débito':
            totalDebitoTemp += venda.valorLiquido
            break;

          case 'Voucher':
            totalVoucherTemp += venda.valorLiquido
            break;
        }
        totalLiquidoTemp += venda.valorLiquido
      })
        temp.forEach((adq) => {
            let vendasTemp = []
            vendasTemp.length = 0
            array.forEach((vendasDia) => {
                if(vendasDia.length > 0){
                    vendasDia.forEach((venda) => {
                        if(venda.adquirente.nomeAdquirente === adq.nomeAdquirente){
                            vendasTemp.push(venda)
                        }
                        adq.vendas = vendasTemp
                    })
                }
            })
        })
        
        console.log('TEPM: ', temp)

        setTotalCredito(totalCreditoTemp)
        setTotalDebito(totalDebitoTemp)
        setTotalVoucher(totalVoucherTemp)
        setTotalLiquido(totalLiquidoTemp)

        console.log('total Credito:', totalCredito)
        console.log('total Debito:', totalDebito)
        console.log('total Voucher:', totalVoucher)
        console.log('total Liquido:', totalLiquido)
      return temp
    }
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
      cnpjBusca,
      setCnpjBusca,
      banBusca,
      setBanBusca,
      adqBusca,
      setAdqBusca,
      }}>

      <div className='appPage app-page-vendas'>
        <div className='page-vendas-background'>
          <div className='page-content-vendas'>
            <div className='vendas-title-container'>
              <h1 className='vendas-title'>Calendário de Vendas</h1>
            </div>
            <hr className="hr-recebimentos"/>
            <TotalModalidadesComp texto1={'Débito'} valor1={totalDebito} texto2={'Crédito'} valor2={totalCredito} texto3={'Voucher'} valor3={totalVoucher} texto4={'Total Líquido'} valor4={totalLiquido} />
            <hr className="hr-recebimentos"/>
            { detalhes ? <GerarRelatorio className='export' tableData={tableData} dataAtual={dateConvertSearch(dataBusca)} detalhes={detalhes}/> : <></> }
            <div className='component-container-vendas'>
              { detalhes ?  <DetalhesVenda/> : <MyCalendar/> }
              { detalhes ? <TabelaGenericaAdm Array={arrayAdm}/> : <></> }
              { detalhes ? <hr className='hr-recebimentos'/> : <></> }
              <BuscarClienteData funcao={loadVendas} />
            </div>
          </div>
        </div>
      </div>
    </VendasContext.Provider>
  )
}

export default Vendas