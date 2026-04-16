import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function Base64ExcelViewer({ base64String }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);

  React.useEffect(() => {
    if (base64String) {
      try {
        // Convert base64 to binary string
        const binaryString = atob(base64String);
        // Convert to array buffer
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Parse with SheetJS
        const workbook = XLSX.read(bytes, { type: 'array' });
        const sheetNameList = workbook.SheetNames;
        setSheetNames(sheetNameList);
        
        // Get first sheet data
        const firstSheet = workbook.Sheets[sheetNameList[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        setData(jsonData);
      } catch (err) {
        console.error('Error parsing Excel:', err);
        setError('Failed to parse Excel file');
      }
    }
  }, [base64String]);

  const switchSheet = (index) => {
    setActiveSheet(index);
    if (base64String) {
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const workbook = XLSX.read(bytes, { type: 'array' });
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[index]], { header: 1 });
      setData(sheetData);
    }
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data) return <div>Loading Excel data...</div>;

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Sheet Tabs */}
      {sheetNames.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          {sheetNames.map((name, idx) => (
            <button
              key={idx}
              onClick={() => switchSheet(idx)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeSheet === idx ? '#007bff' : '#f0f0f0',
                color: activeSheet === idx ? 'white' : 'black',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0'
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      
      {/* Data Table */}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    backgroundColor: rowIndex === 0 ? '#f5f5f5' : 'white',
                    fontWeight: rowIndex === 0 ? 'bold' : 'normal'
                  }}
                >
                  {cell !== undefined && cell !== null ? String(cell) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main component integrating with your API
const Teste = () => {
  const [excelBase64, setExcelBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const object = {
    dataInicial: "2026-04-01",
    dataFinal: "2026-04-03",
    clientes: "4496",
    nomeGrupo: "3 AMORES",
    arquivo: "XLSX", // Changed to XLSX
    modelo: "VENDA"
  };

  const Testar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('relatorios/detalhado', object);
      
      if (response.data.success && response.data.formato === 'XLSX') {
        setExcelBase64(response.data.base64);
      } else {
        setError(response.data.mensagem || 'Failed to generate report');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={Testar} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Excel Report'}
      </button>
      
      {excelBase64 && !loading && (
        <div style={{ marginTop: '20px' }}>
          <h3>Excel Preview</h3>
          <Base64ExcelViewer base64String={excelBase64} />
        </div>
      )}
    </div>
  );
};