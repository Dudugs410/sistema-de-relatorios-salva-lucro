import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { createRoot } from 'react-dom/client' // For React 18+
import Cookies from 'js-cookie'
import PluggyWidget from '../../components/PluggyWidget'
import pluggyImg from '../../assets/ID - COLORIDA 1 HORIZ 09.23.19.png'
import './extrato.scss'

import pluggyApi from '../../services/pluggy'

const Extrato = () => {
    const location = useLocation()
    const widgetContainerRef = useRef(null) // Ref to mount the widget

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
    }, [location])

    const fetchToken = async () => {
        try {
            const response = await pluggyApi.post('connect_token')
            const pluggyAccessToken = response.data
            console.log(response.data)
            console.log(pluggyAccessToken)
            Cookies.set('accessToken', pluggyAccessToken.accessToken)
            
        } catch (error) {
            console.error(error)
        }
    }

    const handleConnectClick = async() => {
        if(!Cookies.get('accessToken')){
            fetchToken()
                .then(()=>{
                    // Clear previous widget if it exists
                    if (widgetContainerRef.current) {
                        widgetContainerRef.current.innerHTML = ''
                    }
        
                    // Create a new container for the widget
                    const container = document.createElement('div')
                    widgetContainerRef.current?.appendChild(container)
        
                    // Manually render PluggyWidget into the container
                    const root = createRoot(container)
                    root.render(<PluggyWidget />)   
                })
        }

        else{
            if (widgetContainerRef.current) {
                widgetContainerRef.current.innerHTML = ''
            }

            // Create a new container for the widget
            const container = document.createElement('div')
            widgetContainerRef.current?.appendChild(container)

            // Manually render PluggyWidget into the container
            const root = createRoot(container)
            root.render(<PluggyWidget />)
        }
    }

    return (
        <div className='appPage'>
            <div className='page-background-global'>
                <div className='page-content-global page-content-financeiro'>
                    <div className='title-container-global'>
                        <h1 className='title-global'>Extrato Bancário</h1>
                    </div>
                    <hr className='hr-global' />
                    <div className='pluggy-container'>
                        {/*<img className='pluggy-icon' src={pluggyImg} alt='logo pluggy' />*/}
                        <button 
                            className='btn btn-primary btn-global' 
                            onClick={handleConnectClick}
                        >
                            Conectar
                        </button>
                    </div>
                    {/* Container where PluggyWidget will be mounted */}
                    <div ref={widgetContainerRef}></div>
                </div>
            </div>
        </div>
    )
}

export default Extrato