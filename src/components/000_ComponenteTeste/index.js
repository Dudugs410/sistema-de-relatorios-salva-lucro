import { pdfjs } from 'react-pdf';
import api from '../../services/api';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// PDF Viewer Component
function Base64PDFViewer({ base64String }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (base64String) {
      try {
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error creating PDF blob:', error);
      }
    }
  }, [base64String]);

  if (!pdfUrl) {
    return <div>Preparing PDF viewer...</div>;
  }

  return (
    <iframe
      src={pdfUrl}
      title="PDF Viewer"
      width="100%"
      height="600px"
      style={{ border: '1px solid #ddd', borderRadius: '4px' }}
    />
  );
}

// Excel Viewer Component
function Base64ExcelViewer({ base64String }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);

  useEffect(() => {
    if (base64String) {
      try {
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const workbook = XLSX.read(bytes, { type: 'array' });
        const sheetNameList = workbook.SheetNames;
        setSheetNames(sheetNameList);
        
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

// Main Component
const Teste = () => {
  const [fileBase64, setFileBase64] = useState(null);
  const [fileFormat, setFileFormat] = useState(null); // 'PDF' or 'XLSX'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return '';
    
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    }
    
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return '';
  };

  const Testar = async () => {
    console.log('executou funcao');
    setLoading(true);
    setError(null);
    setFileBase64(null);
    setFileFormat(null);
    setResponseMessage(null);

    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'));
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'));
    const dataInicial = localStorage.getItem('dataInicial');
    const dataFinal = localStorage.getItem('dataFinal');
    
    let clientesString;
    
    if (cliente && cliente.label === 'TODOS') {
      const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || [];
      clientesString = clientCodes.join(', ');
      console.log('All client codes (TODOS):', clientesString);
    } else if (cliente && cliente.cod) {
      clientesString = String(cliente.cod);
      console.log('Single client code:', clientesString);
    } else {
      clientesString = "";
    }

    const nomeGrupo = grupo?.label || "";
    const bandeira = JSON.parse(localStorage.getItem('selectedBan')) || '';
    const adquirente = JSON.parse(localStorage.getItem('selectedAdm')) || '';
    const produto = '';
    const modalidade = '';
    const arquivo = 'PDF'; // PDF, XLSX ou JSON
    const modelo = 'VENDA';

    let ban = bandeira?.codigoBandeira || '';
    let adq = adquirente?.codigoAdquirente || '';

    const object = {
      dataInicial: formatDateToYYYYMMDD(dataInicial),
      dataFinal: formatDateToYYYYMMDD(dataFinal),
      clientes: clientesString,
      nomeGrupo: nomeGrupo,
      bandeira: ban,
      adquirente: adq,
      produto: produto,
      modalidade: modalidade,
      arquivo: arquivo,
      modelo: modelo
    };
    
    try {
      const response = await api.post('relatorios/detalhado', object);
      console.log('response:', response.data);
      
      if (response.data.success === true) {
        if (response.data.formato === 'PDF') {
          console.log('Setting PDF base64 data...');
          setFileBase64(response.data.base64);
          setFileFormat('PDF');
          setResponseMessage(response.data.mensagem);
        } else if (response.data.formato === 'XLSX') {
          console.log('Setting Excel base64 data...');
          setFileBase64(response.data.base64);
          setFileFormat('XLSX');
          setResponseMessage(response.data.mensagem);
        } else {
          setError(`Unsupported format: ${response.data.formato}`);
        }
      } else {
        setError(response.data.mensagem || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error fetching file:', err);
      setError(err.response?.data?.mensagem || err.message || 'An error occurred while fetching the file');
    } finally {
      setLoading(false);
    }
  };

  // Function to download the file (optional)
  const downloadFile = () => {
    if (!fileBase64 || !fileFormat) return;
    
    const binaryData = atob(fileBase64);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    
    const mimeType = fileFormat === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = fileFormat === 'PDF' ? 'pdf' : 'xlsx';
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `report.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          type="button" 
          onClick={Testar}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div>

      {responseMessage && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#d4edda', 
          color: '#155724',
          borderRadius: '4px'
        }}>
          {responseMessage}
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px'
        }}>
          Error: {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading {fileFormat || 'report'}...</p>
        </div>
      )}

      {fileBase64 && !loading && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>{fileFormat} Preview</h3>
            <button
              onClick={downloadFile}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Download {fileFormat}
            </button>
          </div>
          
          {fileFormat === 'PDF' ? (
            <Base64PDFViewer base64String={fileBase64} />
          ) : fileFormat === 'XLSX' ? (
            <Base64ExcelViewer base64String={fileBase64} />
          ) : null}
        </div>
      )}
      
      {/* Debug info */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
        <strong>Debug:</strong> File Base64 exists: {fileBase64 ? 'YES (length: ' + fileBase64.length + ')' : 'NO'} | 
        Format: {fileFormat || 'None'} | 
        Loading: {loading ? 'YES' : 'NO'}
      </div>
    </div>
  );
};

export default Teste;