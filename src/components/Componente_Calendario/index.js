import React, { useContext, useEffect, useState } from "react"
import Calendar from "react-calendar"
import { AuthContext } from "../../contexts/auth"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.scss'
import '../../styles/global.scss'

const MyCalendar = ({ onLoadData, getCalendarDate }) => {
    const { isDarkTheme, isCheckedCalendar } = useContext(AuthContext)
    
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);

    useEffect(()=>{
      getCalendarDate(dateRange)
    },[dateRange])

    const handleDateChange = (date) =>{
      setDateRange(date)
    }

    //date-range-picker
    const MyDatePicker = () => {
      return (
        <div className='form-container-picker'>
          <div className='select-elements-container-picker'>
            <div className='container-select'>
              <span className='span-picker'>Data Inicial</span>
              <DatePicker className='input-picker'
                selected={dateRange[0]}
                onChange={(date) => setDateRange([date, dateRange[1]])}
              />
            </div>
            <div className='container-select'>
              <span className='span-picker'>Data Final</span>
              <DatePicker className='input-picker'
                selected={dateRange[1]}
                onChange={(date) => setDateRange([dateRange[0], date])}
              />
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className='component-container'>
        { isCheckedCalendar ? <>
        <hr className='hr-global'/>
        <Calendar
          style={{ color:'white' }}
          onChange={ handleDateChange }
          selectRange={true}
          value={ dateRange }
        />
 
        </>
        : 
        <>
          <MyDatePicker />
        </>}
        <hr className='hr-global'/>
        <div className='container-busca'>
          <span className='span-busca'>
            {dateRange[0].toLocaleDateString('pt-BR') !== dateRange[1].toLocaleDateString('pt-BR') ? 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dateRange[0].toLocaleDateString('pt-BR')}</strong> ao dia <strong>${dateRange[1].toLocaleDateString('pt-BR')}</strong>`}} /> : 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dateRange[0].toLocaleDateString('pt-BR')}</strong>`}} />
            }
          </span>
        </div>
        <hr className='hr-global'/>
        <button className='btn btn-primary btn-global btn-pesquisar' onClick={ onLoadData }>Pesquisar</button>
        <hr className='hr-global'/>
      </div>
    )
  }

  export default MyCalendar