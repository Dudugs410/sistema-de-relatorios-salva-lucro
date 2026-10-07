import { useCallback } from 'react'
import api from '../../services/api'
import { getDefaultPreferences, getUserIdentity, normalizeContext } from '../../util/contextUtils'

const today = () => new Date().toISOString().split('T')[0]

export const normalizePrefs = (raw, identity) => {
  const data = Array.isArray(raw) ? raw[0] : raw
  if (!data || typeof data !== 'object') return null
  if (data.CODIGO == null && data.ICONE == null && data.ESQUEMACORES == null) return null

  const defaults = getDefaultPreferences(identity)
  const icon = parseInt(data.ICONE, 10)
  return {
    ...data,
    TEMA: data.TEMA === true || data.TEMA === 'true',
    ICONE: Number.isNaN(icon) ? defaults.ICONE : icon,
    ESQUEMACORES: normalizeContext(data.ESQUEMACORES, defaults.ESQUEMACORES),
  }
}

export const useUserPreferences = () => {
  const fetchUserPrefs = useCallback(async (identity) => {
    const userId = localStorage.getItem('userID')
    const token = localStorage.getItem('token')
    if (!userId || !token) return { status: 'error', prefs: null }

    try {
      const response = await api.get('PreferenciasUsuario', { params: { codigo: userId } })
      const prefs = normalizePrefs(response.data, identity)
      return { status: prefs ? 'found' : 'missing', prefs }
    } catch (error) {
      if (error.response?.status === 404) return { status: 'missing', prefs: null }
      console.error('Error loading user preferences:', error)
      return { status: 'error', prefs: null }
    }
  }, [])

  const loadUserPrefs = useCallback(async () => {
    const { prefs } = await fetchUserPrefs(getUserIdentity())
    return prefs
  }, [fetchUserPrefs])

  const createDefaultPreferences = useCallback(async (userId, userData = null) => {
    let userInfo = userData
    if (!userInfo) {
      try {
        const userResponse = await api.get('usuario', { params: { codigo: userId } })
        userInfo = userResponse.data
      } catch (error) {
        console.error('Error getting user data for default preferences:', error)
      }
    }

    const identity = getUserIdentity(userInfo)
    const now = today()
    const payload = {
      USUCODIGO: parseInt(userId, 10),
      ...getDefaultPreferences(identity),
      USUARIOMODIFICACAO: parseInt(userId, 10),
      DATAMODIFICACAO: now,
      USUARIOINSERCAO: parseInt(userId, 10),
      DATAINSERCAO: now,
      ATIVO: true,
    }

    try {
      const response = await api.post('PreferenciasUsuario', payload)
      return normalizePrefs(response.data, identity) || payload
    } catch (error) {
      console.error('Error creating default preferences:', error)
      return null
    }
  }, [])

  const getOrCreatePreferences = useCallback(async (userId, userData = null) => {
    const { status, prefs } = await fetchUserPrefs(getUserIdentity(userData || undefined))
    if (status === 'found') return prefs
    if (status === 'missing') return createDefaultPreferences(userId, userData)
    return null
  }, [fetchUserPrefs, createDefaultPreferences])

  const saveUserPrefs = useCallback(async (body) => {
    try {
      if (body.CODIGO) {
        await api.put('PreferenciasUsuario', body)
      } else {
        await api.post('PreferenciasUsuario', body)
      }
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
