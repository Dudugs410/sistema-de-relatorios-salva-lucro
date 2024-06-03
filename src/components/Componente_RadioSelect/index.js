import React, { useState } from 'react';
import './radio.scss'; // Import the SCSS file with the custom radio styles
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

const RadioSelect = ({ options, onSelect }) => {
  // State to hold the selected option
  const [selectedOption, setSelectedOption] = useState(null);

  // Function to handle option selection
  const handleOptionChange = (optionValue) => {
    setSelectedOption(optionValue);
    onSelect(optionValue); // Execute the function passed as prop
  };

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
  );
};

export default RadioSelect;