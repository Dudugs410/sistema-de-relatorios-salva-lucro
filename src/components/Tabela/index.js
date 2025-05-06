import '../Componente_TabelaVendasCreditos/detalhesCredito.scss';
import '../../styles/global.scss';
import { useEffect } from 'react';
import './tabelaPluggy.scss'

const Tabela = ({ data, clickRow }) => {
  
  // Check if data exists and has at least one item
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Get the keys from the first item to use as column headers
  const headers = Object.keys(data[0]);

  // Function to safely render cell values
  const renderCellValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      // For nested objects like bankData, creditData
      return '[Object]'; // or JSON.stringify(value) if you prefer
    }
    if (Array.isArray(value)) {
      // For arrays like disaggregatedCreditLimits
      return `[Array (${value.length} items)]`;
    }
    return value.toString();
  };

  useEffect(()=>{
    console.log('Tabela data: ', data)
  },[])

  return (
    <div className='dropShadow vendas-view'>
			<div className='table-wrapper'>
        <table className='table table-striped table-hover det-table-global'>
          <thead>
            <tr className='det-tr-top-global'>
              {headers.map((header) => (
                <th className='det-th-global' key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr className='det-tr-global row-pluggy' key={row.id} onClick={()=>{clickRow(row)}}>
                {headers.map((header) => (
                  <td className='det-td-vendas-global' key={`${row.id}-${header}`}>
                    {renderCellValue(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tabela;