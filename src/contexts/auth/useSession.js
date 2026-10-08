import { useState, useCallback } from 'react'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'
import { toast } from 'react-toastify'
import { cancelOngoingRequests } from '../../services/api'
import {
  requestToken,
  refreshTokens,
  fetchUser,
  putUser,
  logAccess,
  authenticatePluggy,
  fetchMenuOptions,
} from '../../services/authService'
import { getDefaultPreferences, getUserIdentity } from '../../util/contextUtils'
import { isUnauthorized } from './isUnauthorized'
import {
  getApiErrorMessage,
  USER_LOOKUP_ERROR_MESSAGE,
  NO_MENU_PERMISSIONS_MESSAGE,
} from '../../services/apiErrors'

const PERSISTENT_STORAGE_KEYS = ['app_version']

const SESSION_COOKIES = ['apiKey', 'accessToken', 'id', 'accounts', 'itemID']

const PLUGGY_COOKIE_OPTIONS = {
  expires: 1,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
}

const clearLocalStorageKeepingPersistent = () => {
  const persisted = PERSISTENT_STORAGE_KEYS.map((key) => [key, localStorage.getItem(key)])
  localStorage.clear()
  persisted.forEach(([key, value]) => value !== null && localStorage.setItem(key, value))
}

const clearSessionTokens = () => {
  ;['token', 'refreshToken', 'userID'].forEach((key) => localStorage.removeItem(key))
  Cookies.remove('userID')
}

const isAccountBlocked = (user) =>
  user?.CONTABLOQUEADA === true || String(user?.CONTABLOQUEADA).toLowerCase() === 'true'

const isLoginSuccessful = (responseData) => {
  try {
    return responseData?.sucess != null && JSON.parse(responseData.sucess)
  } catch {
    return false
  }
}

const storePluggyCredentials = async (userId) => {
  try {
    const data = await authenticatePluggy(userId)
    Cookies.set('pluggy_api_key', data.apiKey, PLUGGY_COOKIE_OPTIONS)
    Cookies.set('pluggy_client_id', userId, PLUGGY_COOKIE_OPTIONS)
  } catch (error) {
    console.error('Pluggy auth failed:', error)
    Cookies.remove('pluggy_api_key')
    Cookies.remove('pluggy_client_id')
  }
}

export const useSession = ({ preferences, resetAppValues, loadGroupsList, navigate }) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [accessToken, setAccessToken] = useState(undefined)
  const [clientUserId, setClientUserId] = useState()

  const { loadUserPreferences, resetPreferences } = preferences

  const logout = useCallback(() => {
    SESSION_COOKIES.forEach((name) => Cookies.remove(name))
    clearLocalStorageKeepingPersistent()
    cancelOngoingRequests()
    resetAppValues()
    sessionStorage.removeItem('currentPath')
    localStorage.setItem('isSignedIn', false)
    resetPreferences()
    setIsSignedIn(false)
    navigate('/')
  }, [navigate, resetAppValues, resetPreferences])

  const loadUser = fetchUser

  const updateUser = useCallback(async (userObj) => {
    try {
      const response = await putUser(userObj)
      if (response.status === 401) {
        logout()
        return null
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const responseData = await response.json()
      if (!responseData?.CODIGO) return null

      const current = JSON.parse(localStorage.getItem('user') || '{}')
      const merged = {
        ...current,
        ...responseData,
        PREFERENCIAS: responseData.PREFERENCIAS ?? current.PREFERENCIAS ?? null,
      }
      localStorage.setItem('user', JSON.stringify(merged))
      return merged
    } catch (error) {
      toast.dismiss()
      toast.error('Erro ao atualizar usuário!')
      return null
    }
  }, [logout])

  const loadOptions = async () => {
    try {
      return await fetchMenuOptions(localStorage.getItem('userID'))
    } catch (error) {
      console.error(error)
      if (isUnauthorized(error)) logout()
      return null
    }
  }

  const storeDefaultPreferencesOnUser = async (user) => {
    try {
      const updatedUser = await updateUser({
        ...user,
        PREFERENCIAS: getDefaultPreferences(getUserIdentity(user)),
      })
      if (!updatedUser) return user
      const merged = {
        ...user,
        ...updatedUser,
        PREFERENCIAS: updatedUser.PREFERENCIAS ?? user.PREFERENCIAS ?? null,
      }
      localStorage.setItem('user', JSON.stringify(merged))
      return merged
    } catch (error) {
      console.log(error)
      return user
    }
  }

  const loginApp = async (login, password) => {
    resetAppValues()
    try {
      const responseData = await requestToken(login, password)

      if (!isLoginSuccessful(responseData)) {
        toast.error(responseData?.message || 'Erro ao fazer login')
        return
      }
      if (!responseData.acess_token) {
        toast.error('Token de acesso não recebido')
        return
      }

      localStorage.setItem('token', responseData.acess_token)
      localStorage.setItem('refreshToken', responseData.refresh_token)

      const userId = jwtDecode(responseData.acess_token).id
      localStorage.setItem('userID', userId)
      Cookies.set('userID', userId)
      localStorage.setItem('currentPath', '/dashboard')
      setClientUserId(userId)

      let user = null
      let userLookupMessage = USER_LOOKUP_ERROR_MESSAGE
      try {
        user = await fetchUser(userId)
      } catch (error) {
        console.error('Error loading user:', error)
        userLookupMessage = getApiErrorMessage(error, USER_LOOKUP_ERROR_MESSAGE)
      }
      if (!user?.CODIGO) {
        clearSessionTokens()
        localStorage.removeItem('currentPath')
        setClientUserId(undefined)
        toast.error(userLookupMessage)
        return
      }
      if (isAccountBlocked(user)) {
        clearSessionTokens()
        localStorage.removeItem('currentPath')
        setClientUserId(undefined)
        return { status: 'blocked' }
      }
      localStorage.setItem('user', JSON.stringify(user))

      const userPreferences = await loadUserPreferences(userId, user)
      if (userPreferences == null && user.PREFERENCIAS == null) {
        user = await storeDefaultPreferencesOnUser(user)
      }

      localStorage.setItem('GRUCODIGO', user.GRUCODIGO)
      localStorage.setItem('isSignedIn', true)
      localStorage.setItem('userData', JSON.stringify({ NOME: user.NOME, EMAIL: user.EMAIL }))

      try {
        await logAccess(userId, login)
      } catch (error) {
        console.log(error)
      }

      await storePluggyCredentials(userId)

      const menuOptions = await loadOptions()
      localStorage.setItem('options', JSON.stringify(menuOptions))
      const menuList = Array.isArray(menuOptions) ? menuOptions : menuOptions?.data
      if (Array.isArray(menuList) && menuList.length === 0) {
        toast.warning(NO_MENU_PERMISSIONS_MESSAGE, { autoClose: 10000 })
      }

      const groups = (await loadGroupsList()) || []
      localStorage.setItem('groupsStorage', JSON.stringify(groups))
      if (groups.length > 0) localStorage.setItem('groupCode', groups[0].CODIGOGRUPO)
      localStorage.setItem('cnpj', 'todos')

      setIsSignedIn(true)
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Erro ao fazer login')
    }
  }

  const refreshSession = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        console.log('No refresh token available')
        return
      }
      const data = await refreshTokens(refreshToken)
      localStorage.setItem('token', data.acess_token)
      localStorage.setItem('refreshToken', data.refresh_token)
    } catch (error) {
      console.error('Error refreshing session:', error)
      if (isUnauthorized(error)) logout()
    }
  }

  return {
    isSignedIn,
    setIsSignedIn,
    accessToken,
    setAccessToken,
    clientUserId,
    loginApp,
    logout,
    loadUser,
    updateUser,
    refreshSession,
  }
}
