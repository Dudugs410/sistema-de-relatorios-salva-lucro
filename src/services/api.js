import axios from 'axios'
import Cookies from 'js-cookie';

axios.defaults.headers.common['Content-Type'] = 'application/json';

export function config(token){
    const config = { headers:{ 
        Authorization:`Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        } 
    }
    return config

}

const api = axios.create({
    baseURL: 'https://app.salvalucro.com.br/api/v1'
})

export default api