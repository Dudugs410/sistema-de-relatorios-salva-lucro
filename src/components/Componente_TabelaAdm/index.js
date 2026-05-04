/* eslint-disable react/prop-types */
import React from 'react'
import './tabelaGenerica.scss'
import '../../styles/global.scss'

export default function TabelaGenericaAdm({ Array: dataArray, textColor }) {
  // Safe formatting function
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

  // Safe check for dataArray
  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
    return null
  }

  return (
    <div data-tour="totaladq-section" className="tabela-generica-container">
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
              {dataArray.map((elemento, index) => {
                // Safe extraction of admin name
                const adminName = elemento?.adminName || elemento?.adquirente || 'Unknown'
                
                // Safe extraction of total value
                let totalValue = 0
                if (elemento?.total !== undefined && elemento?.total !== null) {
                  totalValue = Number(elemento.total)
                } else if (elemento?.valor !== undefined && elemento?.valor !== null) {
                  totalValue = Number(elemento.valor)
                }
                
                // Ensure it's a valid number
                if (isNaN(totalValue)) {
                  totalValue = 0
                }
                
                // Determine CSS class based on value
                const valueClass = totalValue >= 0 ? 'span-table-servicos-green' : 'span-table-servicos-red'
                const finalColorClass = textColor || 'green-global'
                
                return (
                  <tr key={elemento?.id || index}>
                    <td className='det-td-global det-vendas-global' data-label="Adquirente">
                      {adminName}
                    </td>
                    <td className='det-td-global det-vendas-global' data-label="Total">
                      <span className={`${valueClass} ${finalColorClass}`}>
                        {formatCurrency(totalValue)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}