import React, { useContext } from "react";

import './tabelaHorizontal.scss';
import { AuthContext } from "../../contexts/auth";

function TabelaHorizontal({header, valor}){

    const { isDarkTheme } = useContext(AuthContext)

    return(
        <div className="horizontal-table">
            <div className={`table-row ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <div className="header">{header}:</div>
                <div className="value">R${valor}</div>
            </div>
        </div>
    )
}

export default TabelaHorizontal