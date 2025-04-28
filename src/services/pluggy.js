
import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.headers.common['Content-Type'] = 'application/json'

const pluggyApi = axios.create({
    baseURL: 'https://api.pluggy.ai/'
})

pluggyApi.interceptors.request.use(
    (config) => {
      const apiKey = Cookies.get('apiKey'); // Replace 'apiKey' with your storage key
      if (apiKey) {
        config.headers['X-API-Key'] = apiKey; // Use the header name your API expects
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
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

export default pluggyApi;