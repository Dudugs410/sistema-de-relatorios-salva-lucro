import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useUserPreferences } from '../../hooks/useUserPreferences/useUserPreferences'
import {
  applyContext as applyContextToDOM,
  applyTheme as applyThemeToDOM,
  getStoredContext,
  getStoredUser,
  getUserIdentity,
  getDefaultPreferences,
} from '../../util/contextUtils'
import { getIconPathByCode, getDefaultIconByVisualIdentity } from '../../util/iconRegistry'
import { getLogoByContext, getTenantFromURL } from '../../util/tenant'
import salvalucroLogo from '../../assets/LogoTopo.png'

const resolveLogo = (identity) => getTenantFromURL()?.logo || getLogoByContext(identity) || salvalucroLogo

const getLoggedOutContext = () => getTenantFromURL()?.contextKey || getStoredContext()

const isLoggedIn = () => Boolean(localStorage.getItem('userID') && localStorage.getItem('token'))

const today = () => new Date().toISOString().split('T')[0]

export const usePreferences = () => {
  const [theme, setTheme] = useState(false)
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)
  const [userPreferences, setUserPreferences] = useState(null)
  const [userImg, setUserImg] = useState('')
  const [currentLogo, setCurrentLogo] = useState(() => resolveLogo(getUserIdentity()))
  const [currentContext, setCurrentContext] = useState(getStoredContext())

  const { saveUserPrefs, getOrCreatePreferences } = useUserPreferences()

  const applyTheme = useCallback((themeValue) => {
    const isDark = themeValue === true || themeValue === 'true'
    applyThemeToDOM(isDark)
    setTheme(isDark)
    return isDark
  }, [])

  const applyContext = useCallback((scheme, fallbackIdentity = null) => {
    const resolved = applyContextToDOM(scheme, fallbackIdentity)
    setCurrentContext(resolved)
    return resolved
  }, [])

  const applyPreferences = useCallback((prefs, identity = getUserIdentity()) => {
    const effective = { ...getDefaultPreferences(identity), ...(prefs || {}) }
    applyTheme(effective.TEMA)
    applyContext(effective.ESQUEMACORES, identity)
    setUserImg(getIconPathByCode(effective.ICONE, getDefaultIconByVisualIdentity(identity).path))
    localStorage.setItem('userIconCode', effective.ICONE)
    setCurrentLogo(resolveLogo(identity))
  }, [applyTheme, applyContext])

  const loadUserPreferences = useCallback(async (userId, userData = null) => {
    if (!userId) return null
    const user = userData || getStoredUser()
    const identity = getUserIdentity(user)
    const prefs = await getOrCreatePreferences(userId, user)
    if (prefs) setUserPreferences(prefs)
    applyPreferences(prefs, identity)
    return prefs
  }, [getOrCreatePreferences, applyPreferences])

  const savePreferences = useCallback(async (changes) => {
    if (!isLoggedIn()) return false
    const userId = parseInt(localStorage.getItem('userID'), 10)
    const user = getStoredUser()
    const identity = getUserIdentity(user)
    const current = userPreferences || await getOrCreatePreferences(userId, user)
    const merged = { ...getDefaultPreferences(identity), ...(current || {}), ...changes }
    const now = today()

    const payload = {
      ...(current?.CODIGO ? { CODIGO: current.CODIGO } : {}),
      USUCODIGO: userId,
      TEMA: merged.TEMA === true || merged.TEMA === 'true',
      ICONE: merged.ICONE,
      ESQUEMACORES: merged.ESQUEMACORES,
      USUARIOMODIFICACAO: userId,
      DATAMODIFICACAO: now,
      USUARIOINSERCAO: current?.USUARIOINSERCAO ?? userId,
      DATAINSERCAO: current?.DATAINSERCAO ?? now,
      ATIVO: true,
    }

    const success = await saveUserPrefs(payload)
    if (success) {
      setUserPreferences(payload)
      applyPreferences(payload, identity)
    }
    return success
  }, [userPreferences, getOrCreatePreferences, saveUserPrefs, applyPreferences])

  const toggleTheme = useCallback(async () => {
    const newTheme = !theme
    applyTheme(newTheme)
    if (!isLoggedIn()) return

    const success = await savePreferences({ TEMA: newTheme })
    if (!success) {
      toast.error('Erro ao salvar preferência de tema')
      applyTheme(theme)
    }
  }, [theme, applyTheme, savePreferences])

  const applyLoggedOutAppearance = useCallback(() => {
    applyTheme(false)
    applyContext(getLoggedOutContext())
    setCurrentLogo(resolveLogo(getUserIdentity()))
  }, [applyTheme, applyContext])

  const resetPreferences = useCallback(() => {
    setUserPreferences(null)
    setUserImg('')
    applyLoggedOutAppearance()
  }, [applyLoggedOutAppearance])

  useEffect(() => {
    const initialize = async () => {
      if (isLoggedIn()) {
        await loadUserPreferences(localStorage.getItem('userID'))
      } else {
        applyLoggedOutAppearance()
      }
      setIsThemeLoaded(true)
    }
    initialize()
  }, [])

  useEffect(() => {
    const handleUrlChange = () => setCurrentLogo(resolveLogo(getUserIdentity()))
    window.addEventListener('popstate', handleUrlChange)
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [])

  return {
    theme,
    isThemeLoaded,
    userPreferences,
    userImg,
    setUserImg,
    currentLogo,
    currentContext,
    applyContext,
    toggleTheme,
    loadUserPreferences,
    savePreferences,
    resetPreferences,
  }
}
