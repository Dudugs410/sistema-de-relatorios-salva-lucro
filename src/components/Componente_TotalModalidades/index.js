/* eslint-disable react/react-in-jsx-scope */

import { useContext, useEffect } from 'react'
import './totalModalidade.scss'
import { AuthContext } from '../../contexts/auth'

const TotalModalidadesComp = ({tipo}) =>{
	const { totaisGlobal, setTotaisGlobal, totaisGlobalVendas, totaisGlobalCreditos, isDarkTheme, detalhes } = useContext(AuthContext)


	// Verifica o tipo passado como parâmetro, para definir quais totais serão mostrados, e também para definir se o texto mostrado
	// no último bloco será 'Total Bruto'(vendas) ou 'Total Líquido'(créditos)

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


	// Utilizo a const detalhes como condição para zerar os valores totais apresentados na parte superior da página.
	// Se o valor for verdadeiro são renderizados os gráficos com as informações referentes ao período selecionado.
	// Se o valor for falso, os totais são zerados e são renderizados o Gráfico e botão 'Pesquisar'
	useEffect(()=>{
		if(detalhes === false){
			setTotaisGlobal({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
		}
	},[detalhes])

	useEffect(()=>{
		if(tipo === 'vendas'){
			setTotaisGlobal(totaisGlobalVendas)
		} else if(tipo === 'creditos'){
			setTotaisGlobal(totaisGlobalCreditos)
		}
	},[totaisGlobalCreditos, totaisGlobalVendas])

	return(
		<>
			<hr className="hr-global"/>
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
			<hr className="hr-global"/>
		</>
	)
}

export default TotalModalidadesComp
    