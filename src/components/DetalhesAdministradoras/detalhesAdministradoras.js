import React, { useContext, useState, useEffect } from "react"

import { AuthContext } from "../../contexts/auth"

const DetalhesAdministradoras = () =>{

    const { vendas } = useContext(AuthContext)

    const [admins, setAdmins] = useState([])

    function adminsVenda(){

    }

    useEffect(() => {
        adminsVenda()
    })

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
                    {admins.map((venda, index)=>{
                    return(
                        <tr key={admins.administradora}>
                            <td className='det-td'data-label="Adquirente">{admins.administradora}</td>
                            <td className='det-td'data-label="Total">{admins.valorLiquido}</td>
                        </tr>
                    )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default DetalhesAdministradoras