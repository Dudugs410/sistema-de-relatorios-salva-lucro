import React from "react"

import './tabelaGenerica.css'

export default function TabelaGenerica({Array}) {

    return (
        <div>
            <div className='content'>
                <table className="table det-table elemento-table">
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
                                    <td className='det-td' data-label="Adquirente">{elemento.nomeAdquirente}</td>
                                    <td className='det-td' data-label="Total">R$ {`${elemento.total.toFixed(2).toString().replace('.', ',')}`}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}