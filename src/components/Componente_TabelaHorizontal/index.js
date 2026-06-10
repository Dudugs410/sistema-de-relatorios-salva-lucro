/* eslint-disable react/prop-types */
import React from 'react'

import './tabelaHorizontal.scss'

function TabelaHorizontal({header, valor}){

	return(
		<div className="horizontal-table">
			<div className='table-row table-row-horizontal'>
				<div className='header header-horizontal'>{header}:</div>
				<div className='value value-horizontal'>{Number(valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
			</div>
		</div>
	)
}

export default TabelaHorizontal