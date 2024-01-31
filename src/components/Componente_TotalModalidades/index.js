/* eslint-disable react/react-in-jsx-scope */

import { useContext, useEffect } from 'react'
import './totalModalidade.scss'
import { AuthContext } from '../../contexts/auth'

const TotalModalidadesComp = ({tipo}) =>{
	const { totaisGlobal, setTotaisGlobal, totaisGlobalVendas, totaisGlobalCreditos, isDarkTheme } = useContext(AuthContext)

	useEffect(()=>{
		switch (tipo) {
			case 'vendas':
				setTotaisGlobal(totaisGlobalVendas)
				break;
			case 'creditos':
				setTotaisGlobal(totaisGlobalCreditos)
				break;
		
			default:
				setTotaisGlobal({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
				break;
		}
	},[])

	useEffect(()=>{
		if(tipo === 'vendas'){
			setTotaisGlobal(totaisGlobalVendas)
		} else if(tipo === 'creditos'){
			setTotaisGlobal(totaisGlobalCreditos)
		}
	},[totaisGlobalCreditos, totaisGlobalVendas])

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
						<h1 className='title-modalidade'>{tipo === 'vendas' ? 'Total Bruto' : 'Total Líquido'}</h1>
						<p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade'>{Number(totaisGlobal.liquido).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
			</div>
		</>
	)
}

export default TotalModalidadesComp
    