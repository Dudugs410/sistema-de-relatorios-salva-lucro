import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FiClock } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import { getTokenExpiry, isSignedInStored, isTokenUsable } from '../../util/session'
import './sessionManager.scss'

const CHECK_INTERVAL_MS = 15 * 1000
const IDLE_TIMEOUT_MS = 10 * 60 * 1000
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'wheel']

const formatRemaining = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

const SessionManager = () => {
  const { refreshSession, expireSession, logout } = useContext(AuthContext)
  const [showPrompt, setShowPrompt] = useState(false)
  const [renewing, setRenewing] = useState(false)
  const [now, setNow] = useState(Date.now())
  const lastActivityRef = useRef(Date.now())
  const showPromptRef = useRef(false)
  const refreshingRef = useRef(false)

  const openPrompt = useCallback((open) => {
    showPromptRef.current = open
    setShowPrompt(open)
  }, [])

  const renew = useCallback(async () => {
    if (refreshingRef.current) return true
    refreshingRef.current = true
    try {
      const renewed = await refreshSession()
      if (!renewed) expireSession()
      return renewed
    } finally {
      refreshingRef.current = false
    }
  }, [refreshSession, expireSession])

  const checkSession = useCallback(() => {
    if (!isSignedInStored()) {
      if (showPromptRef.current) openPrompt(false)
      return
    }
    if (!isTokenUsable()) {
      openPrompt(false)
      expireSession()
      return
    }
    if (showPromptRef.current) return

    const current = Date.now()
    if (current - lastActivityRef.current >= IDLE_TIMEOUT_MS) {
      openPrompt(true)
      return
    }

    const expiry = getTokenExpiry()
    if (expiry && expiry - current <= REFRESH_BEFORE_EXPIRY_MS) renew()
  }, [expireSession, openPrompt, renew])

  useEffect(() => {
    const markActivity = () => {
      lastActivityRef.current = Date.now()
    }
    const handleVisibility = () => {
      if (!document.hidden) checkSession()
    }
    const handleStorage = (event) => {
      if ((event.key === null || event.key === 'isSignedIn') && !isSignedInStored()) {
        openPrompt(false)
        logout()
      }
    }

    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, markActivity, { passive: true }))
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(checkSession, CHECK_INTERVAL_MS)

    return () => {
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, markActivity))
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [checkSession, logout, openPrompt])

  useEffect(() => {
    if (!showPrompt) return undefined
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [showPrompt])

  if (!showPrompt) return null

  const handleStay = async () => {
    setRenewing(true)
    const renewed = await renew()
    setRenewing(false)
    if (renewed) {
      lastActivityRef.current = Date.now()
      openPrompt(false)
    }
  }

  const handleLeave = () => {
    openPrompt(false)
    logout()
  }

  const expiry = getTokenExpiry()
  const remaining = expiry ? expiry - now : null

  return (
    <div className='session-prompt-overlay'>
      <div
        className='session-prompt'
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='session-prompt-title'
        aria-describedby='session-prompt-text'
      >
        <div className='session-prompt__icon' aria-hidden='true'>
          <FiClock />
        </div>
        <h2 id='session-prompt-title' className='session-prompt__title'>Manter-se conectado?</h2>
        <p id='session-prompt-text' className='session-prompt__text'>
          Sua sessão está inativa há algum tempo.
          {remaining != null && (
            <>
              {' '}Ela será encerrada em <strong>{formatRemaining(remaining)}</strong>.
            </>
          )}
        </p>
        <div className='session-prompt__actions'>
          <button type='button' className='session-prompt__btn session-prompt__btn--secondary' onClick={handleLeave} disabled={renewing}>
            Sair
          </button>
          <button type='button' className='session-prompt__btn session-prompt__btn--primary' onClick={handleStay} disabled={renewing} autoFocus>
            {renewing ? 'Renovando...' : 'Continuar conectado'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionManager
