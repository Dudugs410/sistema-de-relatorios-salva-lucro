import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'

import BuscarClienteVendas from '../../components/Componente_BuscarClienteVendas'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'

import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import './Calendar.scss'
import './vendas.scss'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import TabelaVendasCreditos from '../../components/Componente_TabelaVendasCreditos'
import { useLocation } from 'react-router-dom'
import '../../index.scss'

export const VendasContext = createContext({})

const Vendas = () =>{
  const location = useLocation();

  useEffect(() => {
      sessionStorage.setItem('currentPath', location.pathname);
  }, [location]);

  const {
    cnpj,
    setCnpj,
    bandeiras, 
    loadBandeiras,
    grupos,
    setGrupos,
    adquirentes,
    loadAdquirentes,
    vendas,
    loadVendas,
    gerarDados,
    tableData,
    setTotaisGlobalVendas,
    isDarkTheme,
    setIsDarkTheme,
    detalhes
  } = useContext(AuthContext)

  const [totalCredito, setTotalCredito] = useState(0.00)
  const [totalDebito, setTotalDebito] = useState(0.00)
  const [totalVoucher, setTotalVoucher] = useState(0.00)
  const [totalLiquido, setTotalLiquido] = useState(0.00)

  const [arrayAdm, setArrayAdm] = useState([])
  const [arrayRelatorio, setArrayRelatorio] = useState([])
  const [dataBusca, setDataBusca] = useState([new Date(), new Date()])

  const [tipo, setTipo] = useState('vendas')

  useEffect(()=>{
    setTipo('vendas')
    Cookies.set('tipo', 'vendas')
  },[])

  // possivelmente utilizar estes parametros para realizar busca por período

  const [cnpjBusca, setCnpjBusca] = useState(Cookies.get('cnpj'))

  useEffect(()=>{
    setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
},[])

  useEffect(()=>{
    async function inicializar(){
      if(bandeiras.length === 0){
        await loadBandeiras()
      }
      
      if(grupos.length === 0){
        setGrupos(JSON.parse(sessionStorage.getItem('grupos')))     
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
    setTotaisGlobalVendas({debito: 0, credito: 0, voucher: 0, liquido: 0})
  },[])

  useEffect(()=>{
    try {
      if(vendas.length === 0){
        setTotalCredito(0.00)
        setTotalDebito(0.00)
        setTotalVoucher(0.00)
        setTotalLiquido(0.00)
      }
      else if(vendas.length > 0){
        setArrayRelatorio(gerarDados(vendas))
        setArrayAdm(separaAdm(vendas))
      }
    } catch (error) {
      console.log(error)
    }
  },[vendas])

  useEffect(()=>{
    setCnpjBusca(cnpj)
  },[cnpj])

  const [vendasTemp, setVendasTemp] = useState([])

  const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
  const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

  useEffect(()=>{
    if(detalhes){
      setVendasTemp(loadVendas(dataBuscaInicial, dataBuscaFinal, cnpjBusca))
    }

  },[cnpjBusca])

  function handleDateChange(date){
    setDataBusca(date)
  }

  const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
  const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))

  useEffect(()=>{
    if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
      setDataBuscaInicial(dataBusca[0])
      setDataBuscaInicial(dataBusca[1])
      setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
      setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
    }
  },[dataBusca])

  function separaAdm(array){
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
              total: venda.valorBruto,
              id: 0,
              vendas: []
          }
          temp.push(novoObj)
        }else{
          let novoObj = {
              nomeAdquirente: venda.adquirente.nomeAdquirente,
              total: venda.valorBruto,
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
                      temp[i].total += venda.valorBruto
                  }
              }
          }
        }
        // eslint-disable-next-line default-case
        switch(venda.produto.descricaoProduto){
          case 'Crédito':
            totalCreditoTemp += venda.valorBruto
            break;

          case 'Débito':
            totalDebitoTemp += venda.valorBruto
            break;

          case 'Voucher':
            totalVoucherTemp += venda.valorBruto
            break;
        }
        totalLiquidoTemp += venda.valorBruto
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
        let totalTemp = {debito: totalDebitoTemp, credito: totalCreditoTemp, voucher: totalVoucherTemp, liquido: totalLiquidoTemp}
        
        setTotaisGlobalVendas(totalTemp)
        return temp
    }
  }

  function MyCalendar() {
    return (
      <div>
        <Calendar
          style={{ color:'white' }}
          className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
          onChange={ handleDateChange }
          selectRange={true}
          value={ dataBusca }
          tileClassName={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
        />
        <hr/>
        <div className='container-busca'>
          <span className={`span-busca ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            {dataInicialExibicao !== dataFinalExibicao ? 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong> ao dia <strong>${dataFinalExibicao}</strong>`}} /> : 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong>`}} />
            }
          </span>
          <BuscarClienteVendas />
        </div>
      </div>
    )
  }

  return(
    <VendasContext.Provider 
    value={{
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
      setArrayAdm,

      }}>

      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Calendário de Vendas</h1>
            </div>
            <hr className="hr-recebimentos"/>
            <TotalModalidadesComp tipo = 'vendas'/>
            <hr className="hr-recebimentos"/>
            { (detalhes) && (vendas.length > 0) ? <GerarRelatorio className='export' tableData={tableData} detalhes={detalhes} tipo='vendas' /> : <></> }
            <div className='component-container-vendas'>
              { (detalhes) && (vendas.length > 0) ?  <TabelaVendasCreditos array={vendas} tipo = 'vendas'/> : <MyCalendar className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> }
              <hr className="hr-recebimentos"/>
              { (detalhes) && (vendas.length > 0) ? <TabelaGenericaAdm Array={arrayAdm}/> : <></> }
              { (detalhes) && (vendas.length > 0) ? <hr className='hr-recebimentos'/> : <></> }
            </div>
          </div>
        </div>
      </div>
    </VendasContext.Provider>
  )
}

export default Vendas