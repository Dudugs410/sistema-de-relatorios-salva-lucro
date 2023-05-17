import axios from 'axios'
import Cookies from 'js-cookie';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['authorization'] = `Bearer ${Cookies.get('token')}`

export function config(accessToken){
    const config = { headers:{ 
        Authorization:`Bearer ${accessToken}`,
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