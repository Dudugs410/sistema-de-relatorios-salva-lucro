import api from './api'
import { formatDateToYYYYMMDD } from '../util/formatters'

const readJSON = (key) => JSON.parse(localStorage.getItem(key))

const resolveClients = (cliente, grupo) => {
  if (cliente && cliente.label === 'TODOS') {
    return (grupo?.clients?.map((client) => client.CODIGOCLIENTE) || []).join(', ')
  }
  if (cliente && cliente.cod) return String(cliente.cod)
  if (cliente && cliente.value) return String(cliente.value)
  const cnpj = localStorage.getItem('cnpj')
  return cnpj === 'todos' ? String(localStorage.getItem('groupCode')) : String(cnpj)
}

export const REPORT_MODELS = {
  sales: { modelo: 'VENDA', banKey: 'selectedBan', admKey: 'selectedAdm', banField: 'value', admField: 'value' },
  credits: { modelo: 'RECEBIMENTO', banKey: 'selectedBanCredits', admKey: 'selectedAdmCredits', banField: 'codigoBandeira', admField: 'codigoAdquirente' },
  services: { modelo: 'AJUSTES', banKey: 'selectedBanServices', admKey: 'selectedAdmServices', banField: 'codigoBandeira', admField: 'codigoAdquirente' },
}

export const fetchDetailedReport = async (model, startDate, endDate, additionalFilters = {}) => {
  const { modelo, banKey, admKey, banField, admField } = REPORT_MODELS[model]
  const dataInicial = formatDateToYYYYMMDD(startDate)
  const dataFinal = formatDateToYYYYMMDD(endDate)

  const cliente = readJSON('selectedClientBody')
  const grupo = readJSON('selectedGroupBody')
  const selectedBan = readJSON(banKey)
  const selectedAdm = readJSON(admKey)

  localStorage.setItem('dataInicial', dataInicial)
  localStorage.setItem('dataFinal', dataFinal)

  const response = await api.post('relatorios/detalhado', {
    dataInicial,
    dataFinal,
    clientes: resolveClients(cliente, grupo),
    nomeGrupo: grupo?.label || localStorage.getItem('clientName') || '',
    bandeira: selectedBan?.[banField] || additionalFilters.bandeira || '',
    adquirente: selectedAdm?.[admField] || additionalFilters.adquirente || '',
    produto: additionalFilters.produto || '',
    modalidade: additionalFilters.modalidade || '',
    arquivo: 'JSON',
    modelo,
  })
  return response.data
}

export const fetchDashboard = async () => {
  const cnpj = localStorage.getItem('cnpj')
  const isAllClients = ['todos', 'TODOS', 'Todos'].includes(cnpj)
  const params = isAllClients ? { grupo: localStorage.getItem('groupCode') } : { cnpj }
  const response = await api.get('dashboard', { params })
  return response.data
}

const getOrEmpty = async (request, label) => {
  try {
    return await request()
  } catch (error) {
    console.error(`Error in ${label}:`, error)
    return []
  }
}

export const fetchLegacySales = (startDate, endDate) =>
  getOrEmpty(async () => (await api.get('vendas', { params: { datainicial: startDate, datafinal: endDate } })).data.VENDAS, 'loadSales')

export const fetchLegacyCredits = (startDate, endDate) =>
  getOrEmpty(async () => (await api.get('recebimentos', { params: { dataInicial: startDate, dataFinal: endDate } })).data, 'loadCredits')

export const fetchLegacyServices = (startDate, endDate) =>
  getOrEmpty(async () => (await api.get('ajustes', { params: { dataInicial: startDate, dataFinal: endDate } })).data, 'loadServices')
