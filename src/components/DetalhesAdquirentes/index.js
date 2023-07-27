import React, { useContext, } from "react"

import './detalhesAdquirentes.css'

import { VendasContext } from '../../pages/Vendas'

export default function DetalhesAdquirentes(adquirentes) {
    const { setShowAdmin } = useContext(VendasContext)

    function handleVoltar(){
        setShowAdmin(false)
    }

    return (
        <div>
            <div className='content'>
                <h1 className='title-adm'>Detalhes por Adquirente:</h1>
                <table className="table table-striped det-table adm-table">
                    <thead>
                        <tr>
                            <th className='det-td' data-label='Adquirente'>Adquirente</th>
                            <th className='det-td' data-label='Total'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adquirentes &&(adquirentes.adquirentes.map((adm) => {
                            return (
                                <tr key={adm.id}>
                                    <td className='det-td' data-label="Adquirente">{adm.nomeAdquirente}</td>
                                    <td className='det-td' data-label="Total">R$ {`${adm.total.toFixed(2).toString().replace('.', ',')}`}</td>
                                </tr>
                            )
                        }))}
                    </tbody>
                </table>
                <button className='btn btn-primary' onClick={handleVoltar}>Voltar</button>
            </div>
        </div>
    )
}