/* eslint-disable react/react-in-jsx-scope */
import './totalModalidade.scss'

// Safe formatting function
const formatCurrency = (value) => {
  // Check for undefined, null, or empty values
  if (value === undefined || value === null || value === '') {
    return 'R$ 0,00'
  }
  
  // Convert to number safely
  let numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
  
  // Check if conversion was successful
  if (isNaN(numValue)) {
    return 'R$ 0,00'
  }
  
  // Format the currency
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const TotalModalidadesComp = ({ totals, type }) => {
  // Safe check for totals object
  if (!totals) {
    return null
  }

  // Safely extract values with defaults
  const debit = totals?.debit !== undefined && totals?.debit !== null ? Number(totals.debit) : 0
  const credit = totals?.credit !== undefined && totals?.credit !== null ? Number(totals.credit) : 0
  const voucher = totals?.voucher !== undefined && totals?.voucher !== null ? Number(totals.voucher) : 0
  const total = totals?.total !== undefined && totals?.total !== null ? Number(totals.total) : 0

  // For services type - show only total
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

  // For vendas and creditos types - show all breakdowns
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