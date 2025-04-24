import axios from 'axios'
import Cookies from 'js-cookie'

let globalAbortController = new AbortController() // Initialize global AbortController

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

export const cancelOngoingRequests = () => {
  globalAbortController.abort(); // Cancel ongoing requests
  globalAbortController = new AbortController(); // Reset the controller for future use
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