/* eslint-disable react/prop-types */
import React, { useContext } from 'react'

import './tabelaHorizontal.scss'
import { AuthContext } from '../../contexts/auth'

function TabelaHorizontal({header, valor}){

	return(
		<div className="horizontal-table">
			<div className='table-row'>
				<div className='header'>{header}:</div>
				<div className='value'>{Number(valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
			</div>
		</div>
	)
}

export default TabelaHorizontal