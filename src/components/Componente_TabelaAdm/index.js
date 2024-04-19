/* eslint-disable react/prop-types */
import React from 'react'
import './tabelaGenerica.scss'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import '../../styles/global.scss'

export default function TabelaGenericaAdm({Array, textColor}) {
	const { isDarkTheme } = useContext(AuthContext)
	return (
		<div>
			{ 
				Array ?
					<div className='content tabela-adm-content'>
						<table className={`table table-striped table-hover det-table-global elemento-table ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<thead className='thead-global'>
								<tr className={`det-tr-top-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
									<th className='det-td-global' data-label='Adquirente'>Adquirente</th>
									<th className='det-td-global' data-label='Total'>Total</th>
								</tr>
							</thead>
							<tbody>
								{Array.map((elemento) => {
									return (
										<tr key={elemento.id}>
											<td className='det-td-global det-adm-global' data-label="Adquirente">{elemento.adminName}</td>
											<td className='det-td-global det-adm-global' data-label="Total"><span className={`${Number(elemento.total) >= 0 ? 'span-table-servicos-green' : 'span-table-servicos-red'} ${textColor? textColor: 'green-global'} ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>{Number(elemento.total).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
					:
					<></>
			}
		</div>
	)
}