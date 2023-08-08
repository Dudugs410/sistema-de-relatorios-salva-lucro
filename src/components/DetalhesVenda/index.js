import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import { vendasStatic } from "../../contexts/static"

import './detalhesVenda.css'

const DetalhesVenda = () =>{

    const { vendas, dateConvert, setVendas, setCnpj, teste } = useContext(AuthContext)
    const [vendasTeste, setVendasTeste] = useState([])
    useEffect(()=>{
        if(teste === true){
            setVendas(vendasStatic)
            setCnpj('000000000000')

        }
    },[])

    useEffect(()=>{
        async function init(){
            await setVendasTeste(vendas)
        }
        init()
    },[vendas])

    useEffect(()=>{
        console.log('teste: ', vendasTeste)
    },[vendasTeste])

  
    
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
                                    <th className='det-th'scope="col">Taxa</th>
                                    <th className='det-th'scope="col">Produto</th>
                                    <th className='det-th'scope="col">Data da Venda</th>
                                    <th className='det-th'scope="col">Hora da Venda</th>
                                    <th className='det-th'scope="col">Data do Crédito</th>
                                    <th className='det-th'scope="col">NSU</th>
                                    <th className='det-th'scope="col">CNPJ</th>
                                    <th className='det-th'scope="col">Código da Venda</th>
                                    <th className='det-th'scope="col">Código da Autorização</th>
                                    <th className='det-th'scope="col">Número PV</th>
                                    <th className='det-th'scope="col">Qtd Parcelas</th>
                                </tr>
                            </thead>
                        <tbody>
                            {vendasTeste.length > 0 && vendasTeste.map((venda)=>{
                            return(
                                <tr className='det-tr' key={venda.codigoVenda}>
                                    <td className='det-td-vendas'data-label="Adquirente">{venda.adquirente.nomeAdquirente}</td>
                                    <td className='det-td-vendas'data-label="Bandeira">{venda.bandeira.descricaoBandeira}</td>
                                    <td className='det-td-vendas'data-label="Valor Bruto">R$<span className='green'>{`${venda.valorBruto.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Valor Líquido">R$<span className='green'>{`${venda.valorLiquido.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Taxa">R$ <span className='red'>{`${venda.taxa.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Produto">{venda.produto.descricaoProduto}</td>
                                    <td className='det-td-vendas'data-label="Data da Venda">{dateConvert(venda.dataVenda)}</td>
                                    <td className='det-td-vendas'data-label="Hora da Venda">{ venda.horaVenda?.replaceAll('-', ':')}</td>
                                    <td className='det-td-vendas'data-label="Data do Crédito">{dateConvert(venda.dataCredito)}</td>
                                    <td className='det-td-vendas'data-label="NSU">{venda.nsu}</td>
                                    <td className='det-td-vendas'data-label="CNPJ">{venda.cnpj}</td>
                                    <td className='det-td-vendas'data-label="Código da Venda">{venda.codigoVenda}</td>
                                    <td className='det-td-vendas'data-label="Código da Autorização">{venda.codigoAutorizacao}</td>
                                    <td className='det-td-vendas'data-label="Numero PV">{venda.numeroPV}</td>
                                    <td className='det-td-vendas'data-label="Qtd Parcelas">{venda.quantidadeParcelas}</td>
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