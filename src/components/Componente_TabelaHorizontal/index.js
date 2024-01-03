import React, { useContext, useEffect } from "react";

import './tabelaHorizontal.scss';
import { AuthContext } from "../../contexts/auth";

function TabelaHorizontal({header, valor}){

    const { isDarkTheme } = useContext(AuthContext)

    return(
        <div className="horizontal-table">
            <div className={`table-row ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <div className={`header ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>{header}:</div>
                <div className={`value ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>{Number(valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
            </div>
        </div>
    )
}

export default TabelaHorizontal