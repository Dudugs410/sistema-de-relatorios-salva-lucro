import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './date-picker.css'

function DateRangePicker({ onDateChange }) {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  

  const handleStartDateChange = date => {
    setStartDate(date)
    onDateChange({ startDate: date, endDate }) // Notify parent about the change
  }

  const handleEndDateChange = date => {
    setEndDate(date)
    onDateChange({ startDate, endDate: date }) // Notify parent about the change
  }

  return (
    <div className='picker'>
      <div className='pickerContainer'>
        <label className='label-picker'>Start Date:</label>
          <DatePicker className='date-picker-css'
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
      </div>
      
      <div className='pickerContainer'>
        <label className='label-picker'>End Date:</label>
          <DatePicker className='date-picker-css'
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
      </div>
    </div>
  )
}

export default DateRangePicker