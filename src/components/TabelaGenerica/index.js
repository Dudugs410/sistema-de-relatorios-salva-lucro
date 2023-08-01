import React from "react"

import './tabelaGenerica.css'
import { adqTabela } from "../../contexts/static"

export default function TabelaGenerica({Array}) {

    return (
        <div>
        { 
            Array.length > 0 ?
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
            :

            <div className='content'>
                <table className="table det-table elemento-table">
                    <thead className='thead-admin'>
                        <tr tbody-sticky>
                            <th className='det-td' data-label='Adquirente'>Adquirente</th>
                            <th className='det-td' data-label='Total'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adqTabela.map((elemento) => {
                            return (
                                <tr key={elemento.id}>
                                    <td className='det-td' data-label="Adquirente">{elemento.nomeAdquirente}</td>
                                    <td className='det-td' data-label="Total">R$ {`${elemento.total}`}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            
            }

        </div>
    )
}