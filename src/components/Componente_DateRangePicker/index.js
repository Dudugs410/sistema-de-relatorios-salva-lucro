import React, { useContext, useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './date-picker.css'

import { AuthContext } from '../../contexts/auth'

export default function DateRangePicker() {

    const { dataInicial, dataFinal, setDataFinal, setDataInicial } = useContext(AuthContext)

    const handleStartDateChange = date => {
      setDataInicial(date)
    }
  
    const handleEndDateChange = date => {
      setDataFinal(date)
    }

    const [selectedDate, setSelectedDate] = useState(null)

    // Custom date format for Brazilian format (dd/MM/yyyy)
    const brazilianDateFormat = 'dd/MM/yyyy'

    // Handle date change
    const handleDateChange = (date) => {
      setSelectedDate(date)
    }
  
    return (
      <div className='date-picker-component'>
        <div className='picker-container'>
          <label className='label-picker'>Data Inicial:</label>
            <DatePicker className='date-picker-css'
              selected={dataInicial}
              onChange={handleStartDateChange}
              dateFormat={brazilianDateFormat} // Set the desired date format
              placeholderText="Selecione uma data"
              selectsStart
              startDate={dataInicial}
              endDate={dataFinal}
            />
        </div>
        
        <div className='picker-container'>
          <label className='label-picker'>Data Final:</label>
            <DatePicker className='date-picker-css'
              selected={dataFinal}
              onChange={handleEndDateChange}
              dateFormat={brazilianDateFormat} // Set the desired date format
              placeholderText="Selecione uma data"
              selectsEnd
              startDate={dataInicial}
              endDate={dataFinal}
              minDate={dataInicial}
            />
        </div>
      </div>
    )
  }