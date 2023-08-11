import React from "react"
import './tabelaGenerica.css'

export default function TabelaGenericaAdm({Array}) {

    return (
        <div>
            { 
                Array ?
                    <div className='content tabela-adm-content'>
                        <table className="table table-striped det-table elemento-table">
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
                                            <td className='det-td det-adm' data-label="Total">R$ {`${elemento.total.toFixed(2).toString().replace('.', ',')}`}</td>
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