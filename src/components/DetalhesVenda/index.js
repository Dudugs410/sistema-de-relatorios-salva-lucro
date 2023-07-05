import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/auth"

import './detalhesVenda.css'

const DetalhesVenda = () =>{

    const { vendas, dateConvert } = useContext(AuthContext)

    useEffect(()=>{
        console.log(vendas)
        console.log(vendas.horaVenda)
        alert('useEffect detalhes venda')
    },[])
    
    return(
        <>
            <div className='dropShadow vendas-view'>
                <div className='table-wrapper'>
                    <table className="table table-striped det-table">
                            <thead>
                                <tr className='det-tr'>
                                    <th className='det-th'scope="col">Adquirente</th>
                                    <th className='det-th'scope="col">Bandeira</th>
                                    <th className='det-th'scope="col">Produto</th>
                                    <th className='det-th'scope="col">NSU</th>
                                    <th className='det-th'scope="col">CNPJ</th>
                                    <th className='det-th'scope="col">Código da Venda</th>
                                    <th className='det-th'scope="col">Código da Autorização</th>
                                    <th className='det-th'scope="col">Número PV</th>
                                    <th className='det-th'scope="col">Valor Bruto</th>
                                    <th className='det-th'scope="col">Valor Líquido</th>
                                    <th className='det-th'scope="col">Taxa</th>
                                    <th className='det-th'scope="col">Data da Venda</th>
                                    <th className='det-th'scope="col">Hora da Venda</th>
                                    <th className='det-th'scope="col">Data do Crédito</th>
                                    <th className='det-th'scope="col">Qtd Parcelas</th>
                                </tr>
                            </thead>
                        <tbody>
                            {vendas.map((venda)=>{
                            return(
                                <tr className='det-tr' key={venda.codigoVenda}>
                                    <td className='det-td'data-label="Adquirente">{venda.adquirente.nomeAdquirente}</td>
                                    <td className='det-td'data-label="Bandeira">{venda.bandeira.descricaoBandeira}</td>
                                    <td className='det-td'data-label="Produto">{venda.produto.descricaoProduto}</td>
                                    <td className='det-td'data-label="NSU">{venda.nsu}</td>
                                    <td className='det-td'data-label="CNPJ">{venda.cnpj}</td>
                                    <td className='det-td'data-label="Código da Venda">{venda.codigoVenda}</td>
                                    <td className='det-td'data-label="Código da Autorização">{venda.codigoAutorizacao}</td>
                                    <td className='det-td'data-label="Numero PV">{venda.numeroPV}</td>
                                    <td className='det-td'data-label="Valor Bruto">R${`${venda.valorBruto.toFixed(2)}`.toString().replace('.',',')}</td>
                                    <td className='det-td'data-label="Valor Líquido">R${`${venda.valorLiquido.toFixed(2)}`.toString().replace('.',',')}</td>
                                    <td className='det-td'data-label="Taxa">R$ {`${venda.taxa.toFixed(2)}`.toString().replace('.',',')}</td>
                                    <td className='det-td'data-label="Data da Venda">{dateConvert(venda.dataVenda)}</td>
                                    <td className='det-td'data-label="Hora da Venda">{ venda.horaVenda?.replaceAll('-', ':')}</td>
                                    <td className='det-td'data-label="Data do Crédito">{dateConvert(venda.dataCredito)}</td>
                                    <td className='det-td'data-label="Qtd Parcelas">{venda.quantidadeParcelas}</td>
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

export default DetalhesVenda