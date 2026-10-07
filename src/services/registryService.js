import api from './api'

const API_BASE_URL = 'https://app.salvalucro.com.br/api/v1'

const putJSON = (path, body) =>
  fetch(`${API_BASE_URL}/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(body),
  })

export const getSelectedClientCode = () => {
  const code = localStorage.getItem('clientCode')
  return code && code.toLowerCase() !== 'todos' ? code : null
}

export const fetchTaxes = async (clientCode) => (await api.get('taxas', { params: { codigo: clientCode } })).data
export const createTax = (tax) => api.post('taxas', tax)
export const updateTax = (tax) => putJSON('taxas', tax)
export const removeTax = (tax) => api.delete('taxas', { data: tax })

export const fetchBanks = async (clientCode) =>
  (await api.get('banco/cliente', { params: { codigoCliente: clientCode } })).data || []
export const fetchBanksByCNPJ = async (cnpj) => (await api.get('banco/cnpj', { params: { cnpj } })).data || []
export const fetchBanksByCodigo = async (codigoBanco) =>
  (await api.get('banco/codigo', { params: { codigoBanco } })).data || []
export const fetchBankList = async () => (await api.get('banco/lista')).data || []
export const createBank = ({ CODIGO, ...bank }) => api.post('banco', bank)
export const updateBank = (bank) => api.put('banco', bank)
export const removeBank = (bank) => api.delete('banco', { data: bank })

export const fetchClientAcquirers = async () =>
  (await api.get('clienteAdquirente', {
    params: {
      codigoCliente: localStorage.getItem('clientCode'),
      codigoAdquirente: localStorage.getItem('admCode'),
    },
  })).data

export const fetchDomiciliosByBanco = async (codigoBanco) =>
  (await api.get('domiciliobancario/banco', { params: { codigoBanco } })).data || []
export const createDomicilio = (domicilio) => api.post('domiciliobancario', domicilio)
export const fetchEstablishments = async (codigoCliente, codigoAdquirente) =>
  (await api.get('clienteAdquirente', { params: { codigoCliente, codigoAdquirente } })).data || []

export const fetchProducts = async () => (await api.get('produto')).data
export const fetchSubproducts = async () =>
  (await api.get('Subproduto', { params: { codigoAdquirente: localStorage.getItem('admCode') } })).data
export const fetchBanners = async () => (await api.get('bandeira')).data
export const fetchAcquirers = async () => (await api.get('adquirente')).data
export const fetchModalities = async () => (await api.get('Modalidade')).data

export const fetchSysmo = async (obj) =>
  (await api.get('Sysmo', {
    params: { tipo: obj.TIPO, bandeira: obj.Bandeira, adquirente: obj.Adquirente, data: obj.Data },
  })).data
