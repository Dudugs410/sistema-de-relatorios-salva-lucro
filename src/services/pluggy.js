
import axios from 'axios'


axios.defaults.headers.common['Content-Type'] = 'application/json'

const pluggy = axios.create({
    baseURL: 'https://api.pluggy.ai/'
})

export function config(){
    const config = { headers:{ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }
    }
    return config
}

export default pluggy;