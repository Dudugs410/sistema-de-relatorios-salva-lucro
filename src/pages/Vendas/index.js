import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'

import BuscarClienteData from '../../components/BuscarClienteData'
import DetalhesData from '../../components/DetalhesData'
import DetalhesVenda from '../../components/DetalhesVenda'

import GerarRelatorio from '../../components/GerarRelatorio'

import './vendas.css'
import './Calendar.css'
import { AuthContext } from '../../contexts/auth'

export const VendasContext = createContext({})

const Vendas = () =>{
  
  const { vendas, dateConvert } = useContext(AuthContext)

  const [totalCredito, setTotalCredito] = useState(0.00)
  const [totalDebito, setTotalDebito] = useState(0.00)
  const [totalVoucher, setTotalVoucher] = useState(0.00)
  const [totalLiquido, setTotalLiquido] = useState(0.00)

  const [detalhes, setDetalhes] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const [dataBusca, setDataBusca] = useState(new Date())
  const [cnpjBusca, setCnpjBusca] = useState('3.953.552/0001-02')

  const tableData = []

    async function gerarDados() {
        tableData.length = 0
        console.log('estado das vendas: ', vendas)
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
              horaVenda: venda.horaVenda.replaceAll('-', ':'),
              dataCredito: dateConvert(venda.dataCredito),
              parcelas: venda.quantidadeParcelas,
            })
            return 0
          })
        }
        console.log(tableData)
      }
  useEffect(()=>{
    gerarDados()
  },[vendas])


  function handleDateChange(date){
    setDataBusca(date)
  }

  function MyCalendar() {
    return (
      <div>
        <Calendar
          onChange={ handleDateChange }
          value={ dataBusca }
          onClickDay={console.log(dataBusca)}
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
      cnpjBusca, 
      setCnpjBusca,
      totalDebito,
      setTotalDebito,
      totalCredito,
      setTotalCredito,
      totalVoucher,
      setTotalVoucher,
      totalLiquido,
      setTotalLiquido,
      gerarDados,
      tableData
      }}>
      <div className='appPage'>
          <div className='page-content'>
              <BuscarClienteData />
              { detalhes ?  <DetalhesVenda/> : <MyCalendar/> }
              { detalhes ? <GerarRelatorio className='export' tableData={tableData} detalhes={detalhes}/> : <></>}
              <DetalhesData/>
          </div>
      </div>
    </VendasContext.Provider>
  )
}

export default Vendas