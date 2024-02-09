/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'
import '../Componente_TabelaVendasCreditos/detalhesCredito.scss'
import '../../styles/global.scss'

const TabelaServicos = ({ array }) => {  
	
	const {isDarkTheme, dateConvert} = useContext(AuthContext)

	return(
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
						{array.map((servico, index)=>{
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
	)
}

export default TabelaServicos