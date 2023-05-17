import { React, createContext, useEffect, useState } from 'react'

export const DateContext = createContext({})

function DateProvider({ children }){

    const [dataInicial, setDataInicial] = useState(null)
    const [dataFinal, setDataFinal] = useState(null)

  //////////////////////////////////////////////////////////////////

  return(
    <DateContext.Provider 
      value={{
        dataInicial,
        setDataInicial,
        dataFinal,
        setDataFinal,
      }}
    >
      {children}
    </DateContext.Provider>
  )
}

export default DateProvider