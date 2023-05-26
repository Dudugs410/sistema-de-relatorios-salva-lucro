import { useEffect, useContext } from 'react'
import Calendar from 'react-calendar'

import { AuthContext } from '../../contexts/auth'

import BuscarClienteData from '../../components/BuscarClienteData'
import DetalhesData from '../../components/DetalhesData'
import DetalhesVenda from '../../components/DetalhesVenda'

import './vendas.css'
import './Calendar.css'

const Vendas = () =>{
  
  const { dataInicial, setDataInicial, detalhes, setDetalhes, loadBandeiras, dataFinal, cnpj, vendas, setCnpj, loadVendas, dateConvert, dateConvertYYYYMMDD } = useContext(AuthContext)

  useEffect(()=>{
    loadBandeiras()
    setDataInicial(new Date())
    setDetalhes(false)
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