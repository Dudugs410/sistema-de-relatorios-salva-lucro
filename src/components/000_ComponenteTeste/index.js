import { pdfjs } from 'react-pdf';
import api from '../../services/api';
import React, { useState, useEffect } from 'react';

// Alternative PDF Viewer using iframe (more reliable)
function Base64PDFViewer({ base64String }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (base64String) {
      try {
        // Convert base64 to blob
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        // Cleanup
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

// Main Component (same as above, just replace the PDF viewer)
const Teste = () => {
  const [pdfBase64, setPdfBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  const Testar = async () => {
    console.log('executou funcao')
    setLoading(true)
    setError(null)
    setPdfBase64(null)
    setResponseMessage(null)

    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))

    const dataInicial = localStorage.getItem('dataInicial')
    const dataFinal = localStorage.getItem('dataFinal')
    let clientes;

    if (selectedCliente === 'todos') {
      clientes = gruposBodyData.clients;
    } else {
      clientes = gruposBodyData.clients.filter(c => c.CODIGOCLIENTE === selectedCliente);
    }

    const nomeGrupo = grupo.label
    const bandeira = JSON.parse(localStorage.getItem('selectedBan')) || {};
    const adquirente = JSON.parse(localStorage.getItem('selectedAdm')) || {};
    const produto = ''
    const modalidade = ''
    const arquivo = 'PDF'
    const modelo = 'VENDA'

    const object = {
      dataInicial: dataInicial,
      dataFinal: dataFinal,
      clientes: clientes,
      nomeGrupo: nomeGrupo,
      bandeira: bandeira,
      adquirente: adquirente,
      produto: produto,
      modalidade: modalidade,
      arquivo: arquivo,
      modelo: modelo
    }
    
    try {
      const response = await api.post('relatorios/detalhado', object);
      console.log('response:', response.data);
      
      if (response.data.success === true && response.data.formato === 'PDF') {
        console.log('Setting PDF base64 data...');
        setPdfBase64(response.data.base64);
        setResponseMessage(response.data.mensagem);
      } else {
        setError(response.data.mensagem || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error fetching PDF:', err);
      setError(err.response?.data?.mensagem || err.message || 'An error occurred while fetching the PDF');
    } finally {
      setLoading(false);
    }
  }

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
          <p>Loading PDF...</p>
        </div>
      )}

      {pdfBase64 && !loading && (
        <div style={{ 
          marginTop: '20px'
        }}>
          <h3>PDF Preview</h3>
          <Base64PDFViewer base64String={pdfBase64} />
        </div>
      )}
      
      {/* Debug info */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
        <strong>Debug:</strong> PDF Base64 exists: {pdfBase64 ? 'YES (length: ' + pdfBase64.length + ')' : 'NO'} | Loading: {loading ? 'YES' : 'NO'}
      </div>
    </div>
  );
};

export default Teste;