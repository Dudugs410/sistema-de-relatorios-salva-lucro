const Tabela = ({ data, clickRow }) => {
  // Determine if we're dealing with a single object or array
  const isSingleObject = !Array.isArray(data) && typeof data === 'object';
  const displayData = isSingleObject ? [data] : data || [];

  // Get headers from the first item's keys (if available)
  const headers = displayData[0] ? Object.keys(displayData[0]) : [];

  const renderCellValue = (value) => {
    if (value === null || value === undefined) return '';
    
    // Handle dates
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value).toLocaleDateString('pt-BR');
    }
    
    // Handle arrays and objects
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value.toString();
  };

  if (headers.length === 0) {
    return <div className="p-3 text-center">No data available</div>;
  }

  return (
    <div className='dropShadow vendas-view'>
      <div className='table-wrapper'>
        <table className='table table-striped table-hover det-table-global'>
          <thead>
            <tr className='det-tr-top-global'>
              {headers.map(header => (
                <th className='det-th-global' key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, index) => (
              <tr 
                className='det-tr-global row-pluggy' 
                key={row.id || index}
                onClick={() => clickRow?.(row)}
              >
                {headers.map(header => (
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

export default Tabela;