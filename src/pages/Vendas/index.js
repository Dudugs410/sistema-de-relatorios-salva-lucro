import { useEffect, useContext } from 'react'
import Calendar from 'react-calendar'

import { AuthContext } from '../../contexts/auth'

import BuscarClienteData from '../../components/BuscarClienteData'
import DetalhesData from '../../components/DetalhesData'
import DetalhesVenda from '../../components/DetalhesVenda'

import './vendas.css'
import './Calendar.css'

const Vendas = () =>{
  
  const { dataInicial, setDataInicial, detalhes, setDetalhes, loadBandeiras, setTotalLiquido, setTotalCredito, setTotalDebito, setTotalVoucher, vendas  } = useContext(AuthContext)

  function zerarValores(){
    if(vendas){
      setDetalhes(false)
      setTotalLiquido(0.00)
      setTotalCredito(0.00)
      setTotalDebito(0.00)
      setTotalVoucher(0.00)
    }
  }

  useEffect(()=>{
    loadBandeiras()
    setDataInicial(new Date())
    setDetalhes(false)
    zerarValores()
  },[])

  function handleDateChange(date){
    setDataInicial(date)
  }

  function MyCalendar() {
    return (
      <div>
        <Calendar
          onChange={ handleDateChange }
          value={ dataInicial }
          onClickDay={console.log(dataInicial)}
        />
      </div>
    )
  }

    return(
        <div className='appPage'>
            <div className='page-content'>
                <BuscarClienteData/>
                { detalhes ?  <DetalhesVenda/> : <MyCalendar/> }
                <DetalhesData/>
            </div>
        </div>
    )
}

export default Vendas