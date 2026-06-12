import { useCallback } from 'react'
import api from '../../services/api'
import { getIconPathByCode, DEFAULT_ICON_CODE } from '../../util/iconRegistry'

export const useUserPreferences = () => {
  // GET user preferences from API - ALWAYS FRESH
  const loadUserPrefs = useCallback(async () => {
    const userId = localStorage.getItem('userID')
    
    if (!userId) {
      console.log('No user ID found')
      return null
    }

    try {
      const response = await api.get('PreferenciasUsuario', {
        params: { codigo: userId }
      })
      
      console.log('📡 Loaded user preferences from API:', response.data)
      
      // If no preferences exist (null response), create default preferences
      if (!response.data || response.data === null) {
        console.log('📝 No preferences found, creating default preferences...')
        const defaultPrefs = await createDefaultPreferences(userId)
        return defaultPrefs
      }
      
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('📝 No preferences found (404), creating default preferences...')
        const defaultPrefs = await createDefaultPreferences(userId)
        return defaultPrefs
      }
      console.error('Error loading user preferences:', error)
      return null
    }
  }, [])

  // Create default preferences for a user
  const createDefaultPreferences = useCallback(async (userId) => {
    const getCurrentDate = () => new Date().toISOString().split('T')[0]
    const now = getCurrentDate()
    
    // Get user data to determine default icon based on identity visual
    let defaultIconCode = DEFAULT_ICON_CODE // Default blue icon
    let defaultColorScheme = 'salvalucro'
    
    try {
      const userResponse = await api.get('usuario', {
        params: { codigo: userId }
      })
      
      const userData = userResponse.data
      const identidadeVisual = userData?.GRUPO?.IDENTIDADEVISUAL || ''
      
      // Set default icon based on identity visual
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
      console.log('✅ Default preferences created for user:', userId, response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error creating default preferences:', error)
      return null
    }
  }, [])

  // SAVE user preferences to API (POST - will auto-convert to PUT if exists)
  const saveUserPrefs = useCallback(async (body) => {
    try { 
      const response = await api.post('PreferenciasUsuario', body)
      console.log('✅ Preferences saved to API:', response.data)
      return true
    } catch (error) {
      console.error('Error saving preferences:', error)
      return false
    }
  }, [])

  return {
    loadUserPrefs,
    saveUserPrefs,
  }
}