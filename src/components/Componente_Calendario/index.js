import React, { useContext } from "react"
import Calendar from "react-calendar"
import { AuthContext } from "../../contexts/auth"

import './Calendar.scss'
import '../../styles/global.scss'

const MyCalendar = ({dataInicialExibicao, dataFinalExibicao, dataBusca, handleDateChange }) => {
    const { isDarkTheme } = useContext(AuthContext)

    return (
      <div>
        <Calendar
          style={{ color:'white' }}
          className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
          onChange={ handleDateChange }
          selectRange={true}
          value={ dataBusca }
          tileClassName={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
        />
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