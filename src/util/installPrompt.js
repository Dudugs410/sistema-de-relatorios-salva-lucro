export const INSTALL_PROMPT_DISMISSED_KEY = 'installPromptDismissedAt'
export const MANUAL_INSTALL_KEY = 'pwaManualInstalls'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000

let deferredPrompt = null
let installed = false
const listeners = new Set()

const notify = () => listeners.forEach((listener) => listener())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    installed = false
    notify()
  })

  window.addEventListener('appinstalled', () => {
    installed = true
    deferredPrompt = null
    notify()
  })
}

export const subscribeInstallPrompt = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const canPromptInstall = () => Boolean(deferredPrompt)

export const promptInstall = async () => {
  if (!deferredPrompt) return 'unavailable'
  const promptEvent = deferredPrompt
  deferredPrompt = null
  notify()
  promptEvent.prompt()
  const { outcome } = await promptEvent.userChoice
  if (outcome === 'accepted') {
    installed = true
    notify()
  }
  return outcome
}

export const isRunningInstalled = () =>
  installed ||
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.matchMedia?.('(display-mode: fullscreen)').matches ||
  window.matchMedia?.('(display-mode: minimal-ui)').matches ||
  window.navigator.standalone === true

export const isIOSDevice = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

// Safari no macOS (17+) instala via "Arquivo > Adicionar ao Dock" e não dispara beforeinstallprompt.
export const isMacSafari = () => {
  const ua = window.navigator.userAgent
  return !isIOSDevice() && /macintosh/i.test(ua) && /safari/i.test(ua) && !/chrome|chromium|crios|edg|fxios|opr|firefox/i.test(ua)
}

// Navegadores que só permitem instalação manual (sem evento) e onde não há como detectar a instalação.
export const needsManualInstall = () => isIOSDevice() || isMacSafari()

export const isMobileDevice = () =>
  isIOSDevice() ||
  /android|mobile|silk|kindle|opera mini|iemobile/i.test(window.navigator.userAgent) ||
  window.matchMedia?.('(pointer: coarse) and (max-width: 768px)').matches

const readManualInstalls = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(MANUAL_INSTALL_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const isManuallyInstalled = (tenantPath) => readManualInstalls().includes(tenantPath)

export const markManuallyInstalled = (tenantPath) => {
  try {
    const current = readManualInstalls()
    if (!current.includes(tenantPath)) {
      localStorage.setItem(MANUAL_INSTALL_KEY, JSON.stringify([...current, tenantPath]))
    }
  } catch {
    return
  }
  notify()
}

export const isInstallPromptSnoozed = () => {
  try {
    const dismissedAt = Number(localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY))
    return Boolean(dismissedAt) && Date.now() - dismissedAt < DISMISS_DURATION_MS
  } catch {
    return false
  }
}

export const snoozeInstallPrompt = () => {
  try {
    localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, String(Date.now()))
  } catch {
    return
  }
}
