import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import { recebimentosStatic } from "../../contexts/static"

import './detalhesCredito.css'

const DetalhesCredito = ({array}) =>{

    const { dateConvert, setVendas, setCnpj, teste } = useContext(AuthContext)
    
    useEffect(()=>{
        if(teste === true){
            setVendas(recebimentosStatic)
            setCnpj('000000000000')
        }
    },[])

    return(
        <>
            <div className='dropShadow vendas-view'>
                <div className='table-wrapper'>
                    <table className="table table-striped det-table">
                            <thead>
                                <tr className='det-tr-top' >
                                    <th className='det-th'scope="col">Adquirente</th>
                                    <th className='det-th'scope="col">Bandeira</th>
                                    <th className='det-th'scope="col">Valor Bruto</th>
                                    <th className='det-th'scope="col">Valor Líquido</th>
                                    <th className='det-th'scope="col">Valor Desconto</th>
                                    <th className='det-th'scope="col">Produto</th>
                                    <th className='det-th'scope="col">Data da Venda</th>
                                    <th className='det-th'scope="col">Hora da Venda</th>
                                    <th className='det-th'scope="col">Data do Crédito</th>
                                    <th className='det-th'scope="col">NSU</th>
                                    <th className='det-th'scope="col">Código da Autorização</th>
                                    <th className='det-th'scope="col">Número PV</th>
                                </tr>
                            </thead>
                        <tbody>
                            {array.length > 0 && array.map((venda, index)=>{
                            return(
                                <tr key={index} className='det-tr' >
                                    <td className='det-td-vendas'data-label="Adquirente">{venda.adquirente.nomeAdquirente}</td>
                                    <td className='det-td-vendas'data-label="Bandeira">{venda.bandeira.descricaoBandeira}</td>
                                    <td className='det-td-vendas'data-label="Valor Bruto">R$<span className='green'>{`${venda.valorBruto.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Valor Líquido">R$<span className='green'>{`${venda.valorLiquido.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Valor Desconto">R$ <span className='red'>{`${venda.valorDesconto.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Produto">{venda.produto.descricaoProduto}</td>
                                    <td className='det-td-vendas'data-label="Data da Venda">{dateConvert(venda.dataVenda)}</td>
                                    <td className='det-td-vendas'data-label="Hora da Venda">{ venda.horaVenda?.replaceAll('-', ':')}</td>
                                    <td className='det-td-vendas'data-label="Data do Crédito">{dateConvert(venda.dataCredito)}</td>
                                    <td className='det-td-vendas'data-label="NSU">{venda.nsu}</td>
                                    <td className='det-td-vendas'data-label="Código da Autorização">{venda.codigoAutorizacao}</td>
                                    <td className='det-td-vendas'data-label="Numero PV">{venda.numeroPV}</td>
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

export default DetalhesCredito