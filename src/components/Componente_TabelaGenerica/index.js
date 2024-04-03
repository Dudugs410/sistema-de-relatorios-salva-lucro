/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'
import '../Componente_TabelaVendasCreditos/detalhesCredito.scss'
import '../../styles/global.scss'

const TabelaGenerica = ({ array }) => {  

	useEffect(()=>{
		console.log('ARRAY SERVIÇOS: ', array)
	},[])

	const {isDarkTheme, dateConvert} = useContext(AuthContext)

	const [nomeAdquirente, setNomeAdquirente] = useState('')
	const [total, setTotal] = useState(0)

	useEffect(()=>{
		setNomeAdquirente(array.nomeAdquirente)
		setTotal(array.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
	},[])

	return(
		<>
			{ sessionStorage.getItem('currentPath') === '/dashboard' ? 
				<div className={`header-tabela-grafico ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
					<div className='total-container'>
						<h3 className='titulo-grafico'>Adquirente: &nbsp;</h3><h3 style={{ fontWeight: 'bold' }}>{nomeAdquirente}</h3>
					</div>
					<div className='total-container'>
						<h3 className='titulo-grafico'>Total: &nbsp;</h3><h3 className={`${total >= 0 ? 'green-global' : 'red-global'} ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>{total}</h3>
					</div>
				</div> : <></>
			}
			<div className='dropShadow vendas-view'>
				<div className={`table-wrapper ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
					<table className={`table table-striped det-table-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						<thead>
							<tr className={`det-tr-top-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
								<th className='det-th-global'scope="col">cnpj</th>
								<th className='det-th-global'scope="col">Razão Social</th>
								<th className='det-th-global'scope="col">Codigo do Estabelecimento</th>
								<th className='det-th-global'scope="col">Data</th>
								<th className='det-th-global'scope="col">Adquirente</th>
								<th className='det-th-global'scope="col">Serviço</th>
								<th className='det-th-global'scope="col">Valor</th>
							</tr>
						</thead>
						<tbody>
							{array.vendas.map((servico, index)=>{
								if(servico.valor !== isNaN){
									return(
										<tr key={index} className={`det-tr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}  >
											<td className='det-td-vendas-global'data-label="cnpj">{servico.cnpj}</td>
											<td className='det-td-vendas-global'data-label="Razão Social">{servico.razao_social}</td>
											<td className='det-td-vendas-global'data-label="Código do Estabelecimento">{servico.codigo_estabelecimento}</td>
											<td className='det-td-vendas-global'data-label="Data">{dateConvert(servico.data)}</td>
											<td className='det-td-vendas-global'data-label="Adquirente">{servico.nome_adquirente}</td>
											<td className='det-td-vendas-global'data-label="Serviço">{servico.descricao}</td>
											<td className='det-td-vendas-global'data-label="Valor"><span className='red-global'>{Number(servico.valor.toFixed(2)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
										</tr>
									)
								}
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default TabelaGenerica