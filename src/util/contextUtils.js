import { VISUAL_IDENTITY_ICONS } from './iconRegistry'

export const ALL_CONTEXTS = [
  'salvalucro',
  'sifra',
  'mg',
  'superjur',
  'carddigital',
  'SPECIAL',
  'ALT-1',
  'ALT-2',
  'ALT-3',
  'ALT-4',
  'ALT-5',
  'ALT-6',
  'ALT-7',
  'ALT-8',
  'ALT-9',
  'ALT-10',
  'ALT-11',
  'ALT-12',
  'ALT-13',
  'ALT-14',
  'CB-PROTANOPIA',
  'CB-DEUTERANOPIA',
  'CB-TRITANOPIA',
  'CB-MONOCHROMACY',
  'CB-HIGH-CONTRAST',
]

export const DEFAULT_CONTEXT = 'salvalucro'
export const DEFAULT_THEME = 'light'

export const IDENTITIES = ['salvalucro', 'sifra', 'mg', 'superjur', 'carddigital']

export const isValidContext = (scheme) => {
  return typeof scheme === 'string' && ALL_CONTEXTS.includes(scheme)
}

const matchIdentity = (identity) => {
  if (typeof identity !== 'string') return null
  const key = identity
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')

  if (key === 'sl' || key === 'cores' || key.startsWith('salvalucro')) return 'salvalucro'
  if (key.startsWith('sifra')) return 'sifra'
  if (key === 'mg' || key.startsWith('mgsolucoes')) return 'mg'
  if (key.startsWith('superjur')) return 'superjur'
  if (key.startsWith('carddigital') || key.startsWith('digitalcard')) return 'carddigital'
  return null
}

export const normalizeIdentity = (identity) => matchIdentity(identity) || DEFAULT_CONTEXT

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}') || {}
  } catch {
    return {}
  }
}

export const getUserIdentity = (user = getStoredUser()) => {
  return normalizeIdentity(user?.GRUPO?.IDENTIDADEVISUAL)
}

export const getDefaultPreferences = (identity) => {
  const resolved = normalizeIdentity(identity)
  return {
    TEMA: false,
    ICONE: VISUAL_IDENTITY_ICONS[resolved].code,
    ESQUEMACORES: resolved,
  }
}

export const normalizeContext = (scheme, fallbackIdentity = null) => {
  if (isValidContext(scheme)) return scheme

  if (typeof scheme === 'string') {
    const trimmed = scheme.trim()
    if (isValidContext(trimmed.toUpperCase())) return trimmed.toUpperCase()
    if (isValidContext(trimmed.toLowerCase())) return trimmed.toLowerCase()
    const identity = matchIdentity(trimmed)
    if (identity) return identity
  }

  if (fallbackIdentity) return normalizeIdentity(fallbackIdentity)

  return DEFAULT_CONTEXT
}

const parseColor = (value) => {
  const color = (value || '').trim()
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const digits = hex[1].length === 3 ? hex[1].split('').map((d) => d + d).join('') : hex[1]
    return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16))
  }
  const rgb = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  return rgb ? rgb.slice(1, 4).map(Number) : null
}

const luminance = ([r, g, b]) => {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

const contrastRatio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const MIN_TEXT_CONTRAST = 4.5
const MIN_UI_CONTRAST = 3
const DARK_TEXT = '#141414'
const LIGHT_TEXT = '#ffffff'

const BLACK = [0, 0, 0]
const WHITE = [255, 255, 255]

const toRgbString = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`

const mix = (color, target, amount) => color.map((c, i) => Math.round(c + (target[i] - c) * amount))

const readableTextOn = (background) => {
  const dark = parseColor(DARK_TEXT)
  return contrastRatio(dark, background) >= contrastRatio(WHITE, background) ? DARK_TEXT : LIGHT_TEXT
}

const ensureVisibleOn = (accent, background) => {
  const target = luminance(background) > 0.5 ? BLACK : WHITE
  for (let amount = 0; amount <= 1; amount += 0.05) {
    const candidate = mix(accent, target, amount)
    if (contrastRatio(candidate, background) >= MIN_UI_CONTRAST) return candidate
  }
  return target
}

export const updateContrastColors = () => {
  const root = document.documentElement
  const vars = ['--on-secondary-color', '--highlight-color', '--highlight-color-rgb', '--on-highlight-color']
  vars.forEach((v) => root.style.removeProperty(v))

  const styles = getComputedStyle(root)
  const secondary = parseColor(styles.getPropertyValue('--secondary-color'))
  const primary = parseColor(styles.getPropertyValue('--primary-color'))
  const background = parseColor(styles.getPropertyValue('--background-color')) || WHITE
  if (!secondary) return

  const onSecondary = primary && contrastRatio(primary, secondary) >= MIN_TEXT_CONTRAST
    ? styles.getPropertyValue('--primary-color').trim()
    : readableTextOn(secondary)
  root.style.setProperty('--on-secondary-color', onSecondary)

  const highlight = ensureVisibleOn(secondary, background)
  root.style.setProperty('--highlight-color', toRgbString(highlight))
  root.style.setProperty('--highlight-color-rgb', highlight.join(', '))
  root.style.setProperty('--on-highlight-color', readableTextOn(highlight))
}

export const getThemeColor = (name, fallback = '') => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export const applyContext = (scheme, fallbackIdentity = null) => {
  const resolved = normalizeContext(scheme, fallbackIdentity)
  const root = document.documentElement

  ALL_CONTEXTS.forEach((c) => root.classList.remove(`context-${c}`))
  root.setAttribute('data-context', resolved)
  root.classList.add(`context-${resolved}`)

  localStorage.setItem('appContext', resolved)
  updateContrastColors()
  return resolved
}

export const applyTheme = (isDark) => {
  const value = isDark ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', value)
  localStorage.setItem('appTheme', value)
  updateContrastColors()
  return value
}

export const getStoredContext = () => {
  return localStorage.getItem('appContext') || DEFAULT_CONTEXT
}

export const getStoredTheme = () => {
  return localStorage.getItem('appTheme') || DEFAULT_THEME
}
