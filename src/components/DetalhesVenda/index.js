import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

import { FiZoomIn } from "react-icons/fi"

import './detalhesVenda.css'

const DetalhesVenda = ({ close }) =>{

    const { vendas } = useContext(AuthContext)

    function handleCurrentVenda(){
        console.log('handleCurrentVenda()')
    }

    return(
        <>
            <div className='dropShadow vendas-view'>
                <table className="table table-striped det-table">
                    <thead>
                        <tr>
                            <th className='det-th'scope="col">Adquirente</th>
                            <th className='det-th'scope="col">Bandeira</th>
                            <th className='det-th'scope="col">Produto</th>
                            <th className='det-th'scope="col">NSU</th>
                            <th className='det-th'scope="col">CNPJ</th>
                            <th className='det-th'scope="col">Código da Venda</th>
                            <th className='det-th'scope="col">Código da Autorização</th>
                            <th className='det-th'scope="col">Número PV</th>
                            <th className='det-th'scope="col">Status</th>
                            <th className='det-th'scope="col">Valor Bruto</th>
                            <th className='det-th'scope="col">Valor Líquido</th>
                            <th className='det-th'scope="col">Taxa</th>
                            <th className='det-th'scope="col">Data do Crédito</th>
                            <th className='det-th'scope="col">Data da Venda</th>
                            <th className='det-th'scope="col">Hora da Venda</th>
                            <th className='det-th'scope="col">Qtd Parcelas</th>
                            <th className='det-th'scope="col">Detalhes</th>
                        </tr>
                    </thead>
                <tbody>
                    {vendas.map((venda, index)=>{
                    return(
                        <tr key={venda.codigoVenda}>
                            <td className='det-td'data-label="Adquirente">{venda.adquirenteNome}</td>
                            <td className='det-td'data-label="Bandeira">{venda.bandeiraNome}</td>
                            <td className='det-td'data-label="Produto">{venda.produtoNome}</td>
                            <td className='det-td'data-label="NSU">{venda.nsu}</td>
                            <td className='det-td'data-label="CNPJ">{venda.codigoVenda}</td>
                            <td className='det-td'data-label="Código da Venda">{venda.codigoVenda}</td>
                            <td className='det-td'data-label="Código da Autorização">{venda.codigoAutorizacao}</td>
                            <td className='det-td'data-label="Numero PV">{venda.numeroPV}</td>
                            <td className='det-td'data-label="Status">{venda.status}</td>
                            <td className='det-td'data-label="Valor Bruto">R${venda.valorBruto.toString().replace('.',',')}</td>
                            <td className='det-td'data-label="Valor Líquido">R${venda.valorLiquido.toString().replace('.',',')}</td>
                            <td className='det-td'data-label="Taxa">R${venda.taxa.toString().replace('.',',')}</td>
                            <td className='det-td'data-label="Data do Crédito">{venda.dataCredito.replaceAll('-', '/')}</td>
                            <td className='det-td'data-label="Data da Venda">{venda.dataVenda.replaceAll('-', '/')}</td>
                            <td className='det-td'data-label="Hora da Venda">{venda.horaVenda.replaceAll('-', ':')}</td>
                            <td className='det-td'data-label="Qtd Parcelas">{venda.quantidadeParcelas}</td>
                            <td className='det-td'data-label="Detalhes"><button className='btn btn-primary' onClick={() => handleCurrentVenda(index)}><FiZoomIn color={'#FFF'} size={25}/></button></td>
                        </tr>
                    )
                    })}
                </tbody>
            </table>
      </div>
        </>
    )
}

export default DetalhesVenda