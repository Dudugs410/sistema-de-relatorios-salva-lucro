import Calendar from "react-calendar"
import './recebimentos.css'
import { useState } from "react"
import BuscarClienteRecebimentos from "../../components/BuscarClienteRecebimentos"
import BuscarClienteData from "../../components/BuscarClienteData"

const Recebiveis = () =>{

    const [dataBusca, setDataBusca] = useState(new Date())

    function handleDateChange(date){
      setDataBusca(date)
    }

    function MyCalendar() {
        return (
          <div>
            <Calendar
              onChange={ handleDateChange }
              value={ dataBusca }
              onClick={ console.log(dataBusca) }
            />
          </div>
        )
      }


    return(
        <div className='appPage'>
            <div>
                <h1 className='recebimentos-title'>Calendário de Recebimentos</h1>
            </div>
            <MyCalendar/> 
        </div>
    )
}

export default Recebiveis