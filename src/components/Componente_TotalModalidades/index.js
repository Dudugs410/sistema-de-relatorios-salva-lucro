/* eslint-disable react/react-in-jsx-scope */
import './totalModalidade.scss'

// Helper function for safe number conversion
const safeNumber = (value) => {
  if (value === undefined || value === null) return 0
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const TotalModalidadesComp = ({totals, type}) => {
  // Early return if totals is undefined
  if (!totals) return null
  
  if (type === 'servicos') {
    const total = safeNumber(totals?.total)
    return (
      <>
        <hr className="hr-global"/>
        <div data-tour="modalidade-section" className='content-container-modalidade single-box'>
          <div className='total-container-modalidade'>
            <div className='text-container-modalidade'>
              <h1 className='title-modalidade'>Total de Serviços/Ajustes</h1>
              <p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
            </div>
          </div>
        </div>
        <hr className="hr-global"/>
      </>
    )
  }

  const debit = safeNumber(totals?.debit)
  const credit = safeNumber(totals?.credit)
  const voucher = safeNumber(totals?.voucher)
  const total = safeNumber(totals?.total)

  return(
    <>
      <hr className="hr-global"/>
      <div data-tour="modalidade-section" className='content-container-modalidade'>
        <div className='total-container-modalidade'>
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>Débito</h1>
            <p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{debit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
          </div>
        </div>
        <div className='total-container-modalidade'>
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>Crédito</h1>
            <p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{credit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
          </div>
        </div>
        <div className='total-container-modalidade'> 
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>Voucher</h1>
            <p className='text-modalidade'>TOTAL: <span className='green-modalidade span-modalidade'>{voucher.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
          </div>
        </div>
        <div className='total-container-modalidade'> 
          <div className='text-container-modalidade'>
            <h1 className='title-modalidade'>{localStorage.getItem('currentPath') === '/vendas' ? 'Total Bruto' : 'Total Líquido'}</h1>
            <p className='text-modalidade'>TOTAL: <span className='green-modalidade'>{total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></p>
          </div>
        </div>
      </div>
      <hr className="hr-global"/>
    </>
  )
}

export default TotalModalidadesComp