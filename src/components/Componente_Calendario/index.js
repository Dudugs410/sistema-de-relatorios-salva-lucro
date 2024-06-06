import React, { useContext, useEffect, useState } from "react"
import Calendar from "react-calendar"
import { AuthContext } from "../../contexts/auth"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.scss'
import '../../styles/global.scss'
import { useLocation } from "react-router-dom";

const MyCalendar = ({ onLoadData, getCalendarDate, btnDisabled }) => {
    const { isCheckedCalendar } = useContext(AuthContext)

    const location = useLocation();
    
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [dateSysmo, setDateSysmo] = useState(new Date())
    const [allowRange, setAllowRange] = useState(true)
    const [showPesquisar, setShowPesquisar] = useState(true)

    useEffect(()=>{
      if(location.pathname === ('/sysmo') || location.pathname === '/metasapiranga' || location.pathname === '/meta' || location.pathname === ('/vendasdelivery')){
        setAllowRange(false)
        setShowPesquisar(false)
      } else {
        setAllowRange(true)
        setShowPesquisar(true)
      }
    },[location])

    useEffect(()=>{
      getCalendarDate(dateRange)
    },[dateRange])

    const handleDateChange = (date) =>{
      setDateRange(date)
    }

    const handleDateChangeSysmo = (date) =>{
      setDateSysmo(date)
    }

    //date-range-picker
    const MyDatePicker = () => {
      return (
        <div className='form-container-picker'>
          <hr className='hr-global'/>
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

    const MyDatePickerSysmo = () => {
      return (
        <div className='form-container-picker'>
          <hr className='hr-global'/>
          <div className='select-elements-container-picker'>
            <div className='container-select'>
              <span className='span-picker'>Data</span>
              <DatePicker className='input-picker'
                selected={dateSysmo}
                onChange={(date) => setDateSysmo(date)}
              />
            </div>
          </div>
        </div>
      );
    };

    const CalendarDefault = () => {
      return (
        <div className='component-container'>
          { isCheckedCalendar ? <>
          <hr className='hr-global'/>
          <Calendar
            style={{ color:'white' }}
            onChange={ handleDateChange }
            selectRange={allowRange}
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
          { showPesquisar === true ? <button className='btn btn-primary btn-global btn-pesquisar' onClick={ onLoadData } disabled={btnDisabled}>Pesquisar</button> : <></> }
          { showPesquisar === true ? <hr className='hr-global'/> : <></> }
        </div>
      )
    }

    const CalendarSysmo = () => {
      return (
        <div className='component-container'>
          { isCheckedCalendar ? <>
          <hr className='hr-global'/>
          <Calendar
            style={{ color:'white' }}
            onChange={ handleDateChangeSysmo }
            value={ dateSysmo }
          />
          </>
          : 
          <>
            <MyDatePickerSysmo />
          </>}
          <hr className='hr-global'/>
          <div className='container-busca'>
            <span className='span-busca'>
                <span dangerouslySetInnerHTML={{__html: `Executar Exportação do dia <strong>${dateSysmo.toLocaleDateString('pt-BR')}</strong>`}} />
            </span>
          </div>
          <hr className='hr-global'/>
          { showPesquisar === true ? <button className='btn btn-primary btn-global btn-pesquisar' onClick={ onLoadData } disabled={btnDisabled}>Pesquisar</button> : <></> }
          { showPesquisar === true ? <hr className='hr-global'/> : <></> }
        </div>
      )
    }

    return(
      <>
        {
          allowRange === true ?
            <CalendarDefault/>
            :
            <CalendarSysmo/>
        }
      </>
    )
  }

  export default MyCalendar