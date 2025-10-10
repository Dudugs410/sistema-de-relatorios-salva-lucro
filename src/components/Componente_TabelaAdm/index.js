/* eslint-disable react/prop-types */
import React from 'react'
import './tabelaGenerica.scss'

import '../../styles/global.scss'

export default function TabelaGenericaAdm({Array, textColor}) {
	return (
		<div data-tour="totaladq-section" className="tabela-generica-container">
			{ 
				Array ?
					<div className='content tabela-adm-content'>
						<div className='table-responsive-md'>
							<table className='table table-striped table-hover det-table-global elemento-table'>
								<thead className='thead-global'>
									<tr className='det-tr-top-global'>
										<th className='det-td-global' data-label='Adquirente'>Adquirente</th>
										<th className='det-td-global' data-label='Total'>Total</th>
									</tr>
								</thead>
								<tbody>
									{Array.map((elemento) => {
										return (
											<tr key={elemento.id}>
												<td className='det-td-global det-vendas-global' data-label="Adquirente">{elemento.adminName}</td>
												<td className='det-td-global det-vendas-global' data-label="Total"><span className={`${Number(elemento.total) >= 0 ? 'span-table-servicos-green' : 'span-table-servicos-red'} ${textColor? textColor: 'green-global'} `}>{Number(elemento.total).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
					:
					<></>
			}
		</div>
	)
}