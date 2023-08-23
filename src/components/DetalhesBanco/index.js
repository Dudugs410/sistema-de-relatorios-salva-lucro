import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import { bancosStatic } from "../../contexts/static"

import './detalhesBanco.css'

const DetalhesBanco = ({array}) =>{

    const { dateConvert, setVendas, setCnpj, teste } = useContext(AuthContext)
    
    useEffect(()=>{
        if(teste === true){
            setVendas(bancosStatic)
            setCnpj('000000000000')
        }
    },[])

    return(
        <>
            <div className='dropShadow vendas-view'>
                <div className='table-wrapper'>
                    <table className="table table-striped det-table">
                            <thead>
                                <tr className='det-tr-top'>
                                    <th className='det-th'scope="col">Conta</th>
                                    <th className='det-th'scope="col">Data Prevista</th>
                                    <th className='det-th'scope="col">Valor Bruto</th>
                                    <th className='det-th'scope="col">Valor Líquido</th>
                                    <th className='det-th'scope="col">Valor Taxa</th>
                                </tr>
                            </thead>
                        <tbody>
                            {array.length > 0 && array.map((banco, index)=>{
                            return(
                                <tr key={index} className='det-tr'>
                                    <td className='det-td-vendas'data-label="Conta">{banco.Conta}</td>
                                    <td className='det-td-vendas'data-label="Data Prevista">{banco.DataPrevista}</td>
                                    <td className='det-td-vendas'data-label="Valor Bruto">R$<span className='green'>{banco.ValorBruto.toFixed(2).toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Valor Líquido">R$<span className='green'>{banco.ValorLiquido.toFixed(2).toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Valor Taxa">R$ <span className='red'>{banco.ValorTaxa.toFixed(2).toString().replace('.',',')}</span></td>
                                </tr>
                            )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default DetalhesBanco