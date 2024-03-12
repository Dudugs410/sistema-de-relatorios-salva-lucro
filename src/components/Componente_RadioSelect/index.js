import React, { useState } from 'react';
import './radio.scss'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

const RadioSelect = ({ options, onSelect }) => {
  // State to hold the selected option
  const [selectedOption, setSelectedOption] = useState(null);

  const { isDarkTheme } = useContext(AuthContext)

  // Function to handle option selection
  const handleOptionChange = (optionValue) => {
    setSelectedOption(optionValue);
    onSelect(optionValue) // executa a função passada como prop, nesse caso servirá para passar a optionValue para o componente pai
    //No caso deste component, onSelect é uma arrow function que seta o valor da const 'tipo' de acordo com a opção clicada
  };

  return (
    <div className='radio-container-exportacao'>
      {options.map((option) => (
        <div className='radio' key={option.value}>
          <input
            type="radio"
            id={option.value}
            name="radioSelect"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
          <div className='label-container'>
            <label className={`radio-label ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} htmlFor={option.value}>{option.label}</label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RadioSelect;