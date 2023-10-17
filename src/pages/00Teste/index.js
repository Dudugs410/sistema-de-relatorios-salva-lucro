
import React, { useState } from 'react';
import '../../styles/_variables.scss'
import './teste.scss'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useEffect } from 'react';

const Teste = () =>{

    const {isDarkTheme, setIsDarkTheme} = useContext(AuthContext)

    useEffect(()=>{
        setIsDarkTheme(localStorage.getItem('isDark'))
    },[])

    const toggleTheme = (e) => {
      e.preventDefault()
      setIsDarkTheme(!isDarkTheme);
      
    };

    useEffect(()=>{
        localStorage.setItem('isDark', isDarkTheme)
    },[isDarkTheme])
  
    return (
      <div className={`teste ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <button onClick={toggleTheme}>Toggle Theme</button>
        <p>This is a sample text.</p>
      </div>
    );
}

export default Teste