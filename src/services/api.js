import axios from 'axios'
import Cookies from 'js-cookie'

let globalAbortController = new AbortController()

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

const api = axios.create({
    baseURL: 'https://app.salvalucro.com.br/api/v1'
})

api.interceptors.request.use(
    (config) => { const updatedAccessToken = localStorage.getItem('token')
      config.headers['Authorization'] = `Bearer ${updatedAccessToken}`
      config.signal = globalAbortController.signal
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

const AUTH_ENDPOINTS = ['token', 'token/refresh/']
let sessionExpiredHandler = null

export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || '').replace(/^\//, '')
    const isAuthRequest = AUTH_ENDPOINTS.includes(url)
    if (error.response?.status === 401 && !isAuthRequest && localStorage.getItem('isSignedIn') === 'true') {
      sessionExpiredHandler?.()
    }
    return Promise.reject(error)
  }
)

export const cancelOngoingRequests = () => {
  globalAbortController.abort();
  globalAbortController = new AbortController();
}

export function config(){
    const config = { headers:{ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }
    }
    return config
}

export default api