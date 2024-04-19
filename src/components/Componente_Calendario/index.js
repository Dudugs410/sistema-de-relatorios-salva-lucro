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
              <span className={`span-picker ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>Data Inicial</span>
              <DatePicker className={`input-picker ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
                selected={dateRange[0]}
                onChange={(date) => setDateRange([date, dateRange[1]])}
              />
            </div>
            <div className='container-select'>
              <span className={`span-picker ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>Data Final</span>
              <DatePicker className={`input-picker ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
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
        <Calendar
          style={{ color:'white' }}
          className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
          onChange={ handleDateChange }
          selectRange={true}
          value={ dateRange }
          tileClassName={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
        />
 
        </>
        : 
        <>
          <MyDatePicker />
        </>}
        <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
        <div className='container-busca'>
          <span className={`span-busca ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            {dateRange[0].toLocaleDateString('pt-BR') !== dateRange[1].toLocaleDateString('pt-BR') ? 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dateRange[0].toLocaleDateString('pt-BR')}</strong> ao dia <strong>${dateRange[1].toLocaleDateString('pt-BR')}</strong>`}} /> : 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dateRange[0].toLocaleDateString('pt-BR')}</strong>`}} />
            }
          </span>
        </div>
        <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
        <button className={`btn btn-primary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ onLoadData }>Pesquisar</button>
        <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
      </div>
    )
  }

  export default MyCalendar