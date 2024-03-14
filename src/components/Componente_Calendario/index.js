import React, { useContext, useEffect, useState } from "react"
import Calendar from "react-calendar"
import { AuthContext } from "../../contexts/auth"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.scss'
import '../../styles/global.scss'
import { FiCalendar } from "react-icons/fi";

const MyCalendar = ({dataInicialExibicao, dataFinalExibicao, dataBusca, handleDateChange }) => {
    const { isDarkTheme, isCheckedCalendar, setIsCheckedCalendar } = useContext(AuthContext)

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);



    useEffect(()=>{
      handleDateChange(dateRange)
    },[dateRange])

    //date-range-picker
    const MyDatePicker = () => {
      return (
        <div className="form-container-relatorios">
          <div className='select-elements-container'>
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

    //

    return (
      <div className='component-container'>
        { isCheckedCalendar ? <>
        <Calendar
          style={{ color:'white' }}
          className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
          onChange={ handleDateChange }
          selectRange={true}
          value={ dataBusca }
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
            {dataInicialExibicao !== dataFinalExibicao ? 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong> ao dia <strong>${dataFinalExibicao}</strong>`}} /> : 
              <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong>`}} />
            }
          </span>
        </div>
        <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
      </div>
    )
  }

  export default MyCalendar