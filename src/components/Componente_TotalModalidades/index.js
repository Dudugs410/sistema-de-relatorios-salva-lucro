/* eslint-disable react/react-in-jsx-scope */
import './totalModalidade.scss'

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === '') {
    return 'R$ 0,00'
  }
  
  let numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
  
  if (isNaN(numValue)) {
    return 'R$ 0,00'
  }
  
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const TotalModalidadesComp = ({ totals, type }) => {
  if (!totals) {
    return null
  }

  const debit = totals?.debit !== undefined && totals?.debit !== null ? Number(totals.debit) : 0
  const credit = totals?.credit !== undefined && totals?.credit !== null ? Number(totals.credit) : 0
  const voucher = totals?.voucher !== undefined && totals?.voucher !== null ? Number(totals.voucher) : 0
  const total = totals?.total !== undefined && totals?.total !== null ? Number(totals.total) : 0

  if (type === 'openfinance') {
    const saldo = total
    const cards = [
      { title: 'Total de Transações', value: Number(totals.count) || 0, className: 'highlight-modalidade' },
      { title: 'Total Receitas', value: formatCurrency(totals.income), className: 'income-modalidade' },
      { title: 'Total Despesas', value: formatCurrency(totals.expense), className: 'expense-modalidade' },
      { title: 'Saldo', value: formatCurrency(saldo), className: saldo >= 0 ? 'income-modalidade' : 'expense-modalidade' },
    ]
    return (
      <>
        <hr className="hr-global"/>
        <div data-tour="totals-section" className='content-container-modalidade'>
          {cards.map((card) => (
            <div key={card.title} className='total-container-modalidade'>
              <div className='text-container-modalidade'>
                <h1 className='title-modalidade'>{card.title}</h1>
                <p className='text-modalidade'>
                  <span className={card.className}>{card.value}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <hr className="hr-global"/>
      </>
    )
  }

  if (type === 'servicos' || type === 'ajustes') {
    return (
      <>
        <hr className="hr-global"/>
        <div data-tour="modalidade-section" className='content-container-modalidade single-box'>
          <div className='total-container-modalidade'>
            <div className='text-container-modalidade'>
              <h1 className='title-modalidade'>Total de Serviços/Ajustes</h1>
              <p className='text-modalidade'>
                TOTAL: <span className='green-modalidade'>{formatCurrency(total)}</span>
              </p>
            </div>
          </div>
        </div>
        <hr className="hr-global"/>
      </>
    )
  }

  return(
    <>
      <hr className="hr-global"/>
      <div data-tour="modalidade-section" className='content-container-modalidade'>
        <div className='total-container-modalidade'>
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>Débito</h1>
            <p className='text-modalidade'>
              TOTAL: <span className='green-modalidade'>{formatCurrency(debit)}</span>
            </p>
          </div>
        </div>
        <div className='total-container-modalidade'>
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>Crédito</h1>
            <p className='text-modalidade'>
              TOTAL: <span className='green-modalidade'>{formatCurrency(credit)}</span>
            </p>
          </div>
        </div>
        <div className='total-container-modalidade'> 
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>Voucher</h1>
            <p className='text-modalidade'>
              TOTAL: <span className='green-modalidade span-modalidade'>{formatCurrency(voucher)}</span>
            </p>
          </div>
        </div>
        <div className='total-container-modalidade'> 
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>
              {localStorage.getItem('currentPath') === '/vendas' ? 'Total Bruto' : 'Total Líquido'}
            </h1>
            <p className='text-modalidade'>
              TOTAL: <span className='green-modalidade'>{formatCurrency(total)}</span>
            </p>
          </div>
        </div>
      </div>
      <hr className="hr-global"/>
    </>
  )
}

export default TotalModalidadesComp