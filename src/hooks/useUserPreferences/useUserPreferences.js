import { useCallback } from 'react'
import api from '../../services/api'
import { getIconPathByCode, DEFAULT_ICON_CODE } from '../../util/iconRegistry'

export const useUserPreferences = () => {
  const CACHE_KEY = 'userPreferencesCache'
  const CACHE_TIMESTAMP_KEY = 'userPreferencesTimestamp'
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const getCachedPreferences = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
      
      if (!cached || !timestamp) return null
      
      const age = Date.now() - parseInt(timestamp)
      if (age > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(CACHE_TIMESTAMP_KEY)
        return null
      }
      
      return JSON.parse(cached)
    } catch {
      return null
    }
  }, [])

  const setCachedPreferences = useCallback((prefs) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(prefs))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()))
    } catch (error) {
      console.error('Error caching preferences:', error)
    }
  }, [])

  const loadUserPrefs = useCallback(async (forceRefresh = false) => {
    const userId = localStorage.getItem('userID')
    const token = localStorage.getItem('token')
    
    if (!userId || !token) {
      return null
    }

    if (!forceRefresh) {
      const cached = getCachedPreferences()
      if (cached) {
        return cached
      }
    }

    try {
      const response = await api.get('PreferenciasUsuario', {
        params: { codigo: userId }
      })
      
      if (!response.data) return null
      
      setCachedPreferences(response.data)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) return null
      console.error('Error loading user preferences:', error)
      return null
    }
  }, [getCachedPreferences, setCachedPreferences])

  const createDefaultPreferences = useCallback(async (userId, userData = null) => {
    const getCurrentDate = () => new Date().toISOString().split('T')[0]
    const now = getCurrentDate()
    
    let identidadeVisual = 'salvalucro'
    let defaultIconCode = DEFAULT_ICON_CODE
    let defaultColorScheme = 'salvalucro'
    
    try {
      let userInfo = userData
      if (!userInfo) {
        const userResponse = await api.get('usuario', {
          params: { codigo: userId }
        })
        userInfo = userResponse.data
      }
      
      identidadeVisual = userInfo?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro'
      
      switch (identidadeVisual) {
        case 'sifra':
          defaultIconCode = 7
          defaultColorScheme = 'sifra'
          break
        case 'mg':
          defaultIconCode = 6
          defaultColorScheme = 'mg'
          break
        case 'superjur':
          defaultIconCode = 8
          defaultColorScheme = 'superjur'
          break
        case 'carddigital':
          defaultIconCode = 9
          defaultColorScheme = 'carddigital'
          break
        default:
          defaultIconCode = DEFAULT_ICON_CODE
          defaultColorScheme = 'salvalucro'
          break
      }
    } catch (error) {
      console.error('Error getting user data for default preferences:', error)
    }
    
    const payload = {
      USUCODIGO: parseInt(userId),
      TEMA: false,
      ICONE: defaultIconCode,
      ESQUEMACORES: defaultColorScheme,
      USUARIOMODIFICACAO: parseInt(userId),
      DATAMODIFICACAO: now,
      USUARIOINSERCAO: parseInt(userId),
      DATAINSERCAO: now,
      ATIVO: true
    }
    
    try {
      const response = await api.post('PreferenciasUsuario', payload)
      setCachedPreferences(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating default preferences:', error)
      return null
    }
  }, [setCachedPreferences])

  const saveUserPrefs = useCallback(async (body) => {
    try {
      let response
      if (body.CODIGO) {
        response = await api.put('PreferenciasUsuario', body)
      } else {
        response = await api.post('PreferenciasUsuario', body)
      }
      
      if (response.data) {
        setCachedPreferences(response.data)
      }
      
      return response.data || true
    } catch (error) {
      console.error('Error saving preferences:', error)
      return false
    }
  }, [setCachedPreferences])

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TIMESTAMP_KEY)
  }, [])

  const forceRefreshPreferences = useCallback(async () => {
    return await loadUserPrefs(true)
  }, [loadUserPrefs])

  return {
    loadUserPrefs,
    saveUserPrefs,
    createDefaultPreferences,
    forceRefreshPreferences,
    getCachedPreferences,
    setCachedPreferences,
    clearCache,
  }
}