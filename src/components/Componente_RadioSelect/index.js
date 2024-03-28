import React, { useState } from 'react';
import './radio.scss'; // Import the SCSS file with the custom radio styles
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

const RadioSelect = ({ options, onSelect }) => {
  // State to hold the selected option
  const [selectedOption, setSelectedOption] = useState(null);

  const { isDarkTheme } = useContext(AuthContext);

  // Function to handle option selection
  const handleOptionChange = (optionValue) => {
    setSelectedOption(optionValue);
    onSelect(optionValue); // Execute the function passed as prop
  };

  return (
    <div className={`radio-container-exportacao ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {options.map((option) => (
        <div className={`radio ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} key={option.value} onClick={() => handleOptionChange(option.value)}>
          <input
            className={`input-r ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
            type="radio"
            id={option.value}
            name="radioSelect"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
          <span className={`radio-indicator ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}></span>
          <label className={`radio-label ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioSelect;