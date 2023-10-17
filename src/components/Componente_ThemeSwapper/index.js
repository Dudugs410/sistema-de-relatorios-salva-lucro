import react, { useState } from 'react'
import '../../styles/_variables.scss'

const ThemeSwapper = () =>{

    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleTheme = () => {
      setIsDarkTheme(!isDarkTheme);
    };
  
    return (
      <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
    );

}

export default ThemeSwapper