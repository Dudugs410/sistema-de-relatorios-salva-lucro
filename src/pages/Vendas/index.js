import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'

import { AuthContext } from '../../contexts/auth'

import BuscarClienteData from '../../components/BuscarClienteData'
import DetalhesData from '../../components/DetalhesData'
import DetalhesVenda from '../../components/DetalhesVenda'

import './vendas.css'
import './Calendar.css'

export const VendasContext = createContext({})

const Vendas = () =>{
  
  /*
    dataInicial
    detalhes
    cnpj
  */
  const [totalCredito, setTotalCredito] = useState(0.00)
  const [totalDebito, setTotalDebito] = useState(0.00)
  const [totalVoucher, setTotalVoucher] = useState(0.00)
  const [totalLiquido, setTotalLiquido] = useState(0.00)

  const [detalhes, setDetalhes] = useState(false)

  const [dataBusca, setDataBusca] = useState(new Date())
  const [cnpjBusca, setCnpjBusca] = useState('3.953.552/0001-02')

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
      }}>
      <div className='appPage'>
          <div className='page-content'>
              <BuscarClienteData />
              { detalhes ?  <DetalhesVenda/> : <MyCalendar/> }
              <DetalhesData/>
          </div>
      </div>
    </VendasContext.Provider>
  )
}

export default Vendas