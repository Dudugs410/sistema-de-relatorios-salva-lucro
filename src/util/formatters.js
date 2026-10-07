import { toast } from 'react-toastify'

const pad = (value) => String(value).padStart(2, '0')

const toISODate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const formatDateToYYYYMMDD = (date) => {
  if (!date) return ''
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  if (date instanceof Date) return toISODate(date)
  if (typeof date === 'string' && date.includes('/')) {
    const [day, month, year] = date.split('/')
    return `${year}-${month}-${day}`
  }
  const parsed = new Date(date)
  return isNaN(parsed.getTime()) ? '' : toISODate(parsed)
}

export const dateConvert = (date) => {
  if (!date) return ''
  if (typeof date !== 'string') {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
    }
    return ''
  }
  if (!date.includes('-')) return date
  const parts = date.split('-')
  if (parts.length !== 3) return date
  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}

export const timeConvert = (time) => {
  if (!time) return ''
  try {
    const parts = time.replace(/undefined/g, '').split('-').filter((part) => part.trim() !== '')
    if (parts.length >= 3) return `${parts[0]}:${parts[1]}:${parts[2]}`
    if (parts.length === 2) return `${parts[0]}:${parts[1]}`
    if (parts.length === 1) return parts[0]
    return time
  } catch (error) {
    console.error('Error converting time:', error, time)
    return time
  }
}

export const dateConvertYYYYMMDD = (date) => date.toISOString().split('T')[0]

export const dateConvertSearch = (date) => {
  const [year, month, day] = dateConvertYYYYMMDD(date).split('-')
  return `${day}-${month}-${year}`
}

export const converteData = (date) => toISODate(date)

export const getBrazilianISOTime = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  }).formatToParts(new Date())
  const { year, month, day, hour, minute, second, fractionalSecond } = parts.reduce((acc, p) => {
    acc[p.type] = p.value
    return acc
  }, {})
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${fractionalSecond}`
}

const toNumber = (value) => (typeof value === 'string' ? parseFloat(value) : value)

export const safeToFixed = (value, decimals = 2) => {
  const number = value == null ? NaN : toNumber(value)
  return (isNaN(number) ? 0 : number).toFixed(decimals)
}

export const safeCurrencyFormat = (value) => {
  const number = value == null ? NaN : toNumber(value)
  if (isNaN(number)) return 'R$ 0,00'
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const sortArray = (adminArray) =>
  [...adminArray].sort((a, b) => {
    const nameA = a.adminName.toUpperCase()
    const nameB = b.adminName.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })

export const alerta = (text) => {
  toast.info(text, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}
