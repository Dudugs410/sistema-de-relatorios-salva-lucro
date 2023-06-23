import React, { useContext, useState, useEffect } from "react"

import { AuthContext } from "../../contexts/auth"
import './detalhesAdministradoras.css'

export default function DetalhesAdministradoras(administradoras){
console.log(administradoras)
    return(
        <div>
            <div className='content'>
                <h1 className='title'>Detalhes por Adquirente:</h1>
                <table className="table table-striped det-table adm-table">
                        <thead>
                            <tr>
                                <th className='det-td'data-label='Adquirente'>Adquirente</th>
                                <th className='det-td'data-label='Total'>Total</th>
                            </tr>
                        </thead>
                    <tbody>
                        {administradoras.adquirentes.map((adm)=>{
                            console.log(adm)
                        return(
                            <tr key={adm.id}>
                                <td className='det-td'data-label="Adquirente">{adm.nomeAdquirente}</td>
                                <td className='det-td'data-label="Total">R$ {`${adm.total.toFixed(2).toString().replace('.',',')}`}</td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}