import Calendar from "react-calendar"
import './recebimentos.css'

const Recebiveis = () =>{

    const dataBusca = 0

    function handleDateChange(){

    }

    function MyCalendar() {
        return (
          <div>
            <Calendar
              onChange={ handleDateChange }
              value={ dataBusca }
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