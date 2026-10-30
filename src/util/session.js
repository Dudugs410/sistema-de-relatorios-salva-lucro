import jwtDecode from 'jwt-decode'

export const SESSION_EXPIRED_MESSAGE = 'Sessão expirada, favor fazer login novamente.'

const decode = (token) => {
  try {
    return token ? jwtDecode(token) : null
  } catch {
    return null
  }
}

export const getStoredToken = () => localStorage.getItem('token')

export const getTokenExpiry = (token = getStoredToken()) => {
  const exp = decode(token)?.exp
  return exp ? exp * 1000 : null
}

export const isTokenUsable = (token = getStoredToken()) => {
  const decoded = decode(token)
  if (!decoded?.sub || !decoded?.id || !decoded?.login) return false
  return !decoded.exp || decoded.exp * 1000 > Date.now()
}

export const isSignedInStored = () => localStorage.getItem('isSignedIn') === 'true'
