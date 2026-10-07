import React, { useState } from 'react'
import './radio.scss'

const RadioSelect = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null)

  const handleOptionChange = (optionValue) => {
    setSelectedOption(optionValue)
    onSelect(optionValue)
  }

  return (
    <div className='radio-container-exportacao'>
      {options.map((option) => (
        <div className='radio' key={option.value} onClick={() => handleOptionChange(option.value)}>
          <input
            className='input-r'
            type="radio"
            id={option.value}
            name="radioSelect"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
          <span className='radio-indicator'></span>
          <label className='radio-label' htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </div>
  )
}

export default RadioSelect