import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`

const api = axios.create({
    baseURL: 'https://app.salvalucro.com.br/api/v1'
})

api.interceptors.request.use(
    (config) => { const updatedAccessToken = Cookies.get('token')
      config.headers['Authorization'] = `Bearer ${updatedAccessToken}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

export function config(){
    const config = { headers:{ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }
    }
    return config
}

export default api