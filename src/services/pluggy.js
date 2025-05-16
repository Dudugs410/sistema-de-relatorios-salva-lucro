
import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.headers.common['Content-Type'] = 'application/json'

const pluggyApi = axios.create({
    baseURL: 'https://api.pluggy.ai/'
})

pluggyApi.interceptors.request.use(
    (config) => {
      const apiKey = Cookies.get('pluggy_api_key'); // Replace 'apiKey' with your storage key
      if (apiKey) {
        config.headers['X-API-KEY'] = apiKey; // Use the header name your API expects
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  )

export function config(){
    const config = { 
        headers:{ 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:{
          'clientUserId': 'teste'
        }
    }
    return config
}

export default pluggyApi;