export const DOMICILIO_COLUMNS = [
  { key: 'ESTABELECIMENTO', label: 'Estabelecimento' },
  { key: 'ADQUIRENTE', label: 'Adquirente' },
  { key: 'BANDEIRA', label: 'Bandeira' },
  { key: 'MODALIDADE', label: 'Modalidade' },
]

export const fixEncoding = (text) => {
  if (typeof text !== 'string' || !/[ÃÂ]/.test(text)) return text
  try {
    return decodeURIComponent(escape(text))
  } catch {
    return text
  }
}

export const formatDomicilioCell = (domicilio, column) => {
  const value = domicilio[column.key]
  if (column.format) return column.format(value)
  return value === undefined || value === null || value === '' ? 'N/A' : fixEncoding(String(value))
}

export const EMPTY_DOMICILIO_FORM = {
  ADQCODIGO: null,
  CLDCODIGO: null,
  BADCODIGO: null,
  PROCODIGO: null,
  MODCODIGO: null,
  PROPAGAR: false,
}

export const REQUIRED_DOMICILIO_FIELDS = [
  ['ADQCODIGO', 'Selecione um adquirente'],
  ['CLDCODIGO', 'Selecione um estabelecimento'],
  ['BADCODIGO', 'Selecione uma bandeira'],
  ['PROCODIGO', 'Selecione um produto'],
  ['MODCODIGO', 'Selecione uma modalidade'],
]

export const buildDomicilioPayload = (banco, form) => ({
  BANCODIGO: banco?.CODIGO,
  ADQCODIGO: form.ADQCODIGO,
  CLDCODIGO: form.CLDCODIGO,
  BADCODIGO: form.BADCODIGO,
  PROCODIGO: form.PROCODIGO,
  MODCODIGO: form.MODCODIGO,
  PROPAGAR: form.PROPAGAR === true,
})

const firstFilled = (item, keys) => {
  const key = keys.find((k) => item?.[k] !== undefined && item?.[k] !== null && String(item[k]).trim() !== '')
  return key ? item[key] : null
}

export const toEstabelecimentoOptions = (items) => {
  const options = new Map()
  ;(items || []).forEach((item) => {
    const value = firstFilled(item, ['codigoClienteAdquirente', 'CODIGOCLIENTEADQUIRENTE', 'CLDCODIGO', 'codigo', 'CODIGO'])
    if (value === null) return
    const label = firstFilled(item, ['codigoEstabelecimento', 'CODIGOESTABELECIMENTO', 'estabelecimento', 'ESTABELECIMENTO']) ?? value
    if (!options.has(value)) options.set(value, { value, label: String(label) })
  })
  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label))
}
