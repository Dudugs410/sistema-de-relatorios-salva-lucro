import React from "react"
import './tabelaGenerica.scss'
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

import '../../styles/global.scss'

export default function TabelaGenericaAdm({Array}) {

    const { isDarkTheme } = useContext(AuthContext)

    return (
        <div>
            { 
                Array ?
                    <div className='content tabela-adm-content'>
                        <table className={`table table-striped det-table-global elemento-table ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                            <thead className='thead-global'>
                                <tr className={`det-tr-top-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} tbody-sticky>
                                    <th className='det-td-global' data-label='Adquirente'>Adquirente</th>
                                    <th className='det-td-global' data-label='Total'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.map((elemento) => {
                                    return (
                                        <tr key={elemento.id}>
                                            <td className='det-td-global det-adm-global' data-label="Adquirente">{elemento.nomeAdquirente}</td>
                                            <td className='det-td-global det-adm-global' data-label="Total">R$ <span className={`green-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>{`${elemento.total.toFixed(2).toString().replace('.', ',')}`}</span></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                :
                <></>
                }

        </div>
    )
}