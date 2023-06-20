import React, { useContext, useState, useEffect } from "react"

import { AuthContext } from "../../contexts/auth"

export default function DetalhesAdministradoras(administradoras){

    return(
        <div>
            <table className="table table-striped det-table">
                    <thead>
                        <tr>
                            <th className='det-td'data-label='Adquirente'>Adquirente</th>
                            <th className='det-td'data-label='Total'>Total</th>
                        </tr>
                    </thead>
                <tbody>
                    {administradoras.map((venda, index)=>{
                    return(
                        <tr key={administradoras.nomeAdministradora}>
                            <td className='det-td'data-label="Adquirente">{administradoras.nomeAdministradora}</td>
                            <td className='det-td'data-label="Total">{administradoras.valorLiquido}</td>
                        </tr>
                    )
                    })}
                </tbody>
            </table>
        </div>
    )
}