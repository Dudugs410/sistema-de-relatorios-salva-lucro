export const DOMICILIO_COLUMNS = [
  { key: 'ESTABELECIMENTO', label: 'Estabelecimento' },
  { key: 'ADQUIRENTE', label: 'Adquirente' },
  { key: 'BANDEIRA', label: 'Bandeira' },
  { key: 'MODALIDADE', label: 'Modalidade' },
  { key: 'PROPAGAR', label: 'Propagar', format: (value) => (value ? 'Sim' : 'Não') },
]

export const formatDomicilioCell = (domicilio, column) => {
  const value = domicilio[column.key]
  if (column.format) return column.format(value)
  return value === undefined || value === null || value === '' ? 'N/A' : value
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
