import '../Componente_TabelaVendasCreditos/detalhesCredito.scss';
import '../../styles/global.scss';
import { useEffect } from 'react';
import '../Tabela/tabelaPluggy.scss';

const TabelaItem = ({ item }) => {
  useEffect(() => {
    console.log('TabelaItem item:', item);
  }, [item]); // Now tracks item changes

  // Handle different data formats
  const dataArray = Array.isArray(item) ? item : item?.results ? item.results : [item];
  
  if (!item || dataArray.length === 0) {
    return <div className="no-data-message">No data available</div>;
  }

  // Get headers from first item (handle empty first item)
  const firstItem = dataArray.find(i => i) || {};
  const headers = Object.keys(firstItem).filter(key => key !== 'id');

  const renderCellValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return Array.isArray(value) 
        ? `[${value.length} items]` 
        : '[Object]';
    }
    return value.toString();
  };

  return (
    <div className='dropShadow vendas-view'>
      <div className='table-wrapper'>
        <table className='table table-striped table-hover det-table-global'>
          <thead>
            <tr className='det-tr-top-global'>
              {headers.map((header) => (
                <th className='det-th-global' key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataArray.map((row, index) => (
              <tr 
                className='det-tr-global row-pluggy' 
                key={row.id || index}
              >
                {headers.map((header) => (
                  <td className='det-td-vendas-global' key={`${row.id || index}-${header}`}>
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

export default TabelaItem;