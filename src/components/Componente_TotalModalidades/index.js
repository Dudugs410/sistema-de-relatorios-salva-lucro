/* eslint-disable react/react-in-jsx-scope */

import { useContext } from 'react'
import './totalModalidade.scss'
import { AuthContext } from '../../contexts/auth'

const TotalModalidadesComp = () =>{
	const { totaisGlobal, isDarkTheme } = useContext(AuthContext)    
	return(
		<>
			<div className='content-container-modalidade'>
				<div className={`total-container-modalidade ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>Débito</h1>
						<p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade'>{Number(totaisGlobal.debito).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
				<div className={`total-container-modalidade ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>Crédito</h1>
						<p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade'>{Number(totaisGlobal.credito).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
				<div className={`total-container-modalidade ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}> 
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>Voucher</h1>
						<p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade span-modalidade'>{Number(totaisGlobal.voucher).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
				<div className={`total-container-modalidade ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}> 
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>Total Líquido</h1>
						<p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade'>{Number(totaisGlobal.liquido).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
			</div>
		</>
	)
}

export default TotalModalidadesComp
    