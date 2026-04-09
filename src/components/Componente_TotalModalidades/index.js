/* eslint-disable react/react-in-jsx-scope */
import './totalModalidade.scss'

const TotalModalidadesComp = ({totals, type}) => {
	if (type === 'servicos') {
		const total = totals?.total || 0
		return (
			<>
				<hr className="hr-global"/>
				<div data-tour="modalidade-section" className='content-container-modalidade single-box'>
					<div className='total-container-modalidade'>
						<div className='text-container-modalidade'>
							<h1 className='title-modalidade'>Total de Serviços/Ajustes</h1>
							<p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{Number(total).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
						</div>
					</div>
				</div>
				<hr className="hr-global"/>
			</>
		)
	}

	const debit = totals?.debit || 0
	const credit = totals?.credit || 0
	const voucher = totals?.voucher || 0
	const total = totals?.total || 0

	return(
		<>
			<hr className="hr-global"/>
			<div data-tour="modalidade-section" className='content-container-modalidade'>
				<div className='total-container-modalidade'>
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>Débito</h1>
						<p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{Number(debit).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
				<div className='total-container-modalidade'>
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>Crédito</h1>
						<p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{Number(credit).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
				<div className='total-container-modalidade'> 
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>Voucher</h1>
						<p className='text-modalidade'>TOTAL: <span className='green-modalidade span-modalidade'>{Number(voucher).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
				<div className='total-container-modalidade'> 
					<div className='text-container-modalidade'>
						<h1 className='title-modalidade'>{localStorage.getItem('currentPath') === '/vendas' ? 'Total Bruto' : 'Total Líquido'}</h1>
						<p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{Number(total).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
					</div>
				</div>
			</div>
			<hr className="hr-global"/>
		</>
	)
}

export default TotalModalidadesComp