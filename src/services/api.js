import axios from 'axios'
import Cookies from 'js-cookie';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`
//axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTYWx2YWx1Y3JvU2VydmljZUFjZXNzVG9rZW4iLCJqdGkiOiI1MDdiOGU4MS1lZmM4LTRiZGMtYTgwYS03NTExNWNlNmQ4MjYiLCJpYXQiOiIyMS8wOS8yMDIzIDEyOjUyOjA5IiwiaWQiOiIxNjc1NjEiLCJsb2dpbiI6IkVEVUFSRE8iLCJleHAiOjE2OTUzMDc5MjksImlzcyI6IlNhbHZhbHVyb0F1dGhlbnRpY2F0aW9uU2VydmVyIiwiYXVkIjoiU2FsdmFsdWNyb1NlcnZpY2VDbGllbnQifQ.D8VOjtTx2nOl__wwl3ad7kIZZJNfCJO679IrEDnpAuY`

const api = axios.create({
    baseURL: 'https://app.salvalucro.com.br/api/v1'
})

api.interceptors.request.use(
    (config) => { const updatedAccessToken = Cookies.get('token')
  
      // Update the Authorization header with the new access token
      config.headers['Authorization'] = `Bearer ${updatedAccessToken}`
  
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

export function config(token){
    const config = { headers:{ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }
    }
    return config
}

export default api