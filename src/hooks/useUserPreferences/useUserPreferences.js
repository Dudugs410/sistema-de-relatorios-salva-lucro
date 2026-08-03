import { useCallback } from 'react'
import api from '../../services/api'
import { getIconPathByCode, DEFAULT_ICON_CODE, VISUAL_IDENTITY_ICONS } from '../../util/iconRegistry'

export const useUserPreferences = () => {
  // GET user preferences from API
  const loadUserPrefs = useCallback(async () => {
    const userId = localStorage.getItem('userID')
    const token = localStorage.getItem('token')
    
    if (!userId || !token) {
      return null
    }

    try {
      const response = await api.get('PreferenciasUsuario', {
        params: { codigo: userId }
      })
      
      // Validate response data
      if (!response.data || response.data === null) {
        return null
      }
      
      // Ensure the response has the expected structure
      if (typeof response.data !== 'object') {
        return null
      }
      
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      console.error('Error loading user preferences:', error)
      return null
    }
  }, [])

  // Create default preferences for a user with safe fallbacks
  const createDefaultPreferences = useCallback(async (userId, userData = null) => {
    const getCurrentDate = () => new Date().toISOString().split('T')[0]
    const now = getCurrentDate()
    
    // SAFE: Get user data with fallbacks
    let identidadeVisual = 'salvalucro' // Default fallback
    let defaultIconCode = DEFAULT_ICON_CODE
    let defaultColorScheme = 'salvalucro'
    
    try {
      // Use provided userData or fetch it
      let userInfo = userData
      if (!userInfo) {
        const userResponse = await api.get('usuario', {
          params: { codigo: userId }
        })
        userInfo = userResponse.data
      }
      
      // SAFE: Navigate through nested objects with optional chaining
      identidadeVisual = userInfo?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro'
      
      
      // Set default icon based on identity visual (with fallback)
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
      // Keep fallback values
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
      return response.data
    } catch (error) {
      console.error('❌ Error creating default preferences:', error)
      return null
    }
  }, [])

  // Get or create preferences
  const getOrCreatePreferences = useCallback(async (userId, userData = null) => {
    try {
      let prefs = await loadUserPrefs()
      
      if (!prefs) {
        prefs = await createDefaultPreferences(userId, userData)
      }
      
      return prefs
    } catch (error) {
      console.error('Error in getOrCreatePreferences:', error)
      return null
    }
  }, [loadUserPrefs, createDefaultPreferences])

  // SAVE user preferences to API
  const saveUserPrefs = useCallback(async (body) => {
    try { 
      const response = await api.post('PreferenciasUsuario', body)
      return true
    } catch (error) {
      console.error('Error saving preferences:', error)
      return false
    }
  }, [])

  return {
    loadUserPrefs,
    saveUserPrefs,
    getOrCreatePreferences,
    createDefaultPreferences,
  }
}