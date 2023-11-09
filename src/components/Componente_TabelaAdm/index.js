import React from "react"
import './tabelaGenerica.scss'
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

export default function TabelaGenericaAdm({Array}) {

    const { isDarkTheme } = useContext(AuthContext)

    return (
        <div>
            { 
                Array ?
                    <div className='content tabela-adm-content'>
                        <table className={`table table-striped det-table elemento-table ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                            <thead className='thead-admin'>
                                <tr tbody-sticky>
                                    <th className='det-td' data-label='Adquirente'>Adquirente</th>
                                    <th className='det-td' data-label='Total'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.map((elemento) => {
                                    return (
                                        <tr key={elemento.id}>
                                            <td className='det-td det-adm' data-label="Adquirente">{elemento.nomeAdquirente}</td>
                                            <td className='det-td det-adm' data-label="Total">R$ <span className='green-tabela-adm'>{`${elemento.total.toFixed(2).toString().replace('.', ',')}`}</span></td>
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