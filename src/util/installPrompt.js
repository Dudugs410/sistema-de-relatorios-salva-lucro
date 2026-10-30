export const INSTALL_PROMPT_DISMISSED_KEY = 'installPromptDismissedAt'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000

let deferredPrompt = null
let installed = false
const listeners = new Set()

const notify = () => listeners.forEach((listener) => listener())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
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
  window.navigator.standalone === true

export const isIOSDevice = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

export const isMobileDevice = () =>
  isIOSDevice() ||
  /android|mobile|silk|kindle|opera mini|iemobile/i.test(window.navigator.userAgent) ||
  window.matchMedia?.('(pointer: coarse) and (max-width: 768px)').matches

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
