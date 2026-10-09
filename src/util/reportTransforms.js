export const EMPTY_PRODUCT_TOTALS = { debit: 0, credit: 0, voucher: 0, total: 0 }

export const getServiceValue = (service) => {
  const raw = [service.valor, service.VALOR, service.valorLiquido, service.VALORLIQUIDO].find((v) => v !== undefined && v !== null)
  return raw === undefined ? 0 : Math.abs(Number(raw))
}

export const computeSalesTotals = (sales) =>
  sales.reduce((totals, sale) => {
    const value = sale.VALORBRUTO || 0
    const product = (sale.PRODUTO || '').trim()
    totals.total += value
    if (product === 'Crédito') totals.credit += value
    else if (product === 'Débito') totals.debit += value
    else totals.voucher += value
    return totals
  }, { ...EMPTY_PRODUCT_TOTALS })

export const computeCreditsTotals = (credits) =>
  credits.reduce((totals, credit) => {
    const value = Number(credit.VALORLIQUIDO) || 0
    const product = (credit.PRODUTO || '').trim()
    totals.total += value
    if (product === 'Crédito') totals.credit += value
    else if (product === 'Débito') totals.debit += value
    else if (product === 'Voucher') totals.voucher += value
    return totals
  }, { ...EMPTY_PRODUCT_TOTALS })

export const computeServicesTotal = (services) => {
  const total = services.reduce((sum, service) => {
    const value = getServiceValue(service)
    return sum + (isNaN(value) ? 0 : value)
  }, 0)
  return { total: isNaN(total) ? 0 : total }
}

const groupByAdmin = (items, getName, getValue, itemsKey) => {
  if (!items || items.length === 0) return []
  const totals = new Map()
  items.forEach((item) => {
    if (!item) return
    const value = getValue(item)
    if (isNaN(value)) return
    const name = getName(item)
    totals.set(name, (totals.get(name) || 0) + value)
  })
  return [...totals].map(([adminName, total], id) => ({ id, adminName, total, [itemsKey]: [] }))
}

export const groupSalesByAdmin = (sales) =>
  groupByAdmin(sales, (s) => s.ADMINISTRADORA || 'Unknown', (s) => s.VALORBRUTO || 0, 'sales')

export const groupCreditsByAdmin = (credits) =>
  groupByAdmin(credits, (c) => c.ADMINISTRADORA || 'Unknown', (c) => Number(c.VALORLIQUIDO) || 0, 'credits')

export const groupServicesByAdmin = (services) =>
  groupByAdmin(
    services,
    (s) => s.nome_adquirente || s.ADMINISTRADORA || s.adquirente || 'Unknown',
    getServiceValue,
    'services'
  )

const mapAcquirers = (list) =>
  (list || []).map((item) => ({
    adquirente: item.adquirente,
    valor: item.valor || 0,
    percentual: item.percentual || 0,
  }))

const summarize = (section, acquirers) => ({
  valorTotaldias: section?.valorTotaldias || 0,
  valorTotalMes: section?.valorTotalMes || 0,
  totalAdquirentes: mapAcquirers(acquirers),
})

export const transformDashboardData = (apiData) => ({
  vendas: summarize(apiData.vendas, apiData.vendas?.resumo_Adquirentes_vendas),
  creditos: summarize(apiData.creditos, apiData.creditos?.resumo_Adquirentes_recebimentos),
  ajustes: summarize(apiData.ajustes, apiData.ajustes?.resumo_Adquirentes_ajustes),
})

export const toChartData = (acquirers) => ({
  labels: acquirers.map((item) => item.adquirente),
  data: acquirers.map((item) => item.valor),
})

export const sumAcquirers = (acquirers) => acquirers.reduce((sum, item) => sum + item.valor, 0)

export const transformSalesRows = (data) => {
  const isNewApiData = data[0] && data[0].CNPJ !== undefined
  if (!isNewApiData) {
    return data.map((item) => ({
      ...item,
      adquirente: item.adquirente || { codigoAdquirente: null, nomeAdquirente: '' },
      produto: item.produto || { codigoProduto: null, descricaoProduto: '' },
      bandeira: item.bandeira || { codigoBandeira: null, descricaoBandeira: '' },
      modalidade: item.modalidade || { codigoModalidade: null, descricaoModalidade: '' },
      valorDesconto: item.valorDesconto || 0,
      quantidadeParcelas: item.quantidadeParcelas || 0,
    }))
  }
  return data.map((item) => ({
    cnpj: item.CNPJ || '',
    razaosocial: item.RAZAOSOCIAL || '',
    numeroPV: item.NUMEROPV || '',
    adquirente: { codigoAdquirente: null, nomeAdquirente: item.ADMINISTRADORA || '' },
    produto: { codigoProduto: null, descricaoProduto: (item.PRODUTO || '').trim() },
    bandeira: { codigoBandeira: null, descricaoBandeira: item.BANDEIRA || '' },
    modalidade: { codigoModalidade: null, descricaoModalidade: item.MODALIDADE || '' },
    valorBruto: item.VALORBRUTO || 0,
    valorLiquido: item.VALORLIQUIDO || 0,
    valorDesconto: item.DESCONTO || 0,
    taxa: item.TAXA || 0,
    dataVenda: item.DATAVENDA || '',
    dataCredito: item.DATACREDITO || '',
    horaVenda: item.HORAVENDA || '',
    nsu: item.NSU || '',
    cartao: item.CARTAO || '',
    codigoAutorizacao: item.AUTORIZACAO || '',
    quantidadeParcelas: parseInt(item.PARCELA || '0') || 0,
    status: item.STATUS || '',
    ro: item.RO || '',
  }))
}

export const transformCreditsRows = (data) =>
  data.map((item) => ({
    cnpj: item.CNPJ || '',
    adquirente: item.ADMINISTRADORA || '',
    bandeira: item.BANDEIRA || '',
    produto: (item.PRODUTO || '').trim(),
    modalidade: item.MODALIDADE || '',
    dataCredito: item.DATACREDITO || '',
    dataVenda: item.DATAVENDA || '',
    valorBruto: item.VALORBRUTO || 0,
    valorLiquido: item.VALORLIQUIDO || 0,
    taxa: item.TAXA || 0,
    valorDesconto: item.DESCONTO || 0,
    banco: item.BANCO || '',
    agencia: item.AGENCIA || '',
    conta: item.CONTA || '',
    nsu: item.NSU || '',
    codigoAutorizacao: item.AUTORIZACAO || '',
    parcela: item.PARCELA || '',
    quantidadeParcelas: item.TOTALPARCELA || '',
    cartao: item.CARTAO || '',
    status: item.STATUS || '',
    numeroPV: item.NUMEROPV || '',
    ro: item.RO || '',
    razaoSocial: item.RAZAOSOCIAL || '',
  }))

export const transformServicesRows = (data) =>
  data.map((item) => ({
    cnpj: item.cnpj,
    razao_social: item.razao_social,
    codigo_estabelecimento: item.codigo_estabelecimento,
    adquirente: item.nome_adquirente,
    valor: item.valor,
    data: item.data,
    descricao: item.descricao,
  }))

const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '')
const normalizeCode = (value) => onlyDigits(value).replace(/^0+/, '')
const normalizeName = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

export const getSaleLookupParams = (sale) => {
  const cnpj = onlyDigits(sale?.CNPJ)
  const data = String(sale?.DATAVENDA ?? '').split('T')[0]
  if (!cnpj || !/^\d{4}-\d{2}-\d{2}$/.test(data) || !normalizeCode(sale?.NSU)) return null
  return { data, cnpj }
}

const SALE_TIEBREAKERS = [
  (sale, candidate) => {
    const auth = normalizeCode(sale?.AUTORIZACAO)
    return !auth || normalizeCode(candidate?.codigoAutorizacao) === auth
  },
  (sale, candidate) => {
    const value = Number(sale?.VALORBRUTO)
    return Number.isNaN(value) || Math.abs(Number(candidate?.valorBruto) - value) < 0.005
  },
  (sale, candidate) => {
    const acquirer = normalizeName(sale?.ADMINISTRADORA)
    return !acquirer || normalizeName(candidate?.adquirente?.nomeAdquirente) === acquirer
  },
]

export const findMatchingSales = (sale, candidates) => {
  const nsu = normalizeCode(sale?.NSU)
  let matches = (candidates || []).filter((candidate) => normalizeCode(candidate?.nsu) === nsu)
  for (const matchesTiebreaker of SALE_TIEBREAKERS) {
    if (matches.length <= 1) break
    const narrowed = matches.filter((candidate) => matchesTiebreaker(sale, candidate))
    if (narrowed.length > 0) matches = narrowed
  }
  return matches
}
