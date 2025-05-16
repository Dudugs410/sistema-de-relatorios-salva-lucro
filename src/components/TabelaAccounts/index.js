import '../Componente_TabelaVendasCreditos/detalhesCredito.scss'
import '../../styles/global.scss'
import '../Tabela/tabelaPluggy.scss'
import { useEffect, useState } from 'react'

const TabelaAccounts = ({ data, clickRow }) => {
  const [rows, setRows] = useState([])

  // Format currency based on currency code (e.g., BRL, USD)
  const formatCurrency = (value, currencyCode) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode || 'BRL', // Default to BRL if not provided
    }).format(value || 0) // Default to 0 if value is missing
  }

  // Format date in Brazilian format (dd/MM/yyyy HH:mm)
  const formatBrazilianDateTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  useEffect(() => {
    if (data && data.length > 0) {
      const newRows = data.map((item, index) => ({
        id: index, // or use item.id if available
        tipo: item.type,
        subtipo: item.subtype,
        banco: item.name,
        titular: item.owner,
        taxNumber: item.taxNumber,
        saldo: formatCurrency(item.balance, item.currencyCode), // Format balance
        moeda: item.currencyCode,
        ultimaAtualizacao: formatBrazilianDateTime(item.updatedAt), // Format date
      }));
      setRows(newRows)
    }
  }, [data])

  const headers = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'subtipo', label: 'Subtipo' },
    { key: 'banco', label: 'Banco' },
    { key: 'titular', label: 'Titular' },
    { key: 'taxNumber', label: 'CPF / CNPJ' },
    { key: 'saldo', label: 'Saldo' },
    { key: 'moeda', label: 'Moeda' },
    { key: 'ultimaAtualizacao', label: 'Atualizado por último' },
  ];

  if (!data || data.length === 0) {
    return <div>No data available</div>
  }

  return (
    <div className='dropShadow vendas-view'>
      {rows.length > 0 && (
        <div className='table-wrapper'>
          <table className='table table-striped table-hover det-table-global'>
            <thead>
              <tr className='det-tr-top-global'>
                {headers.map((header) => (
                  <th className='det-th-global' key={header.key}>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  className='det-tr-global row-pluggy'
                  key={row.id}
                  onClick={() => clickRow(row)}
                >
                  {headers.map((header) => (
                    <td className='det-td-vendas-global' key={`${row.id}-${header.key}`}>
                      {row[header.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TabelaAccounts