import { useEffect, useState } from 'react'
import { PluggyConnect } from 'react-pluggy-connect'
import { useLocation } from 'react-router-dom'
import PluggyWidget from '../../components/PluggyWidget'
import pluggyImg from '../../assets/logoPluggy.webp'

import './extrato.scss'

const Extrato = () =>{
    const location = useLocation()

    const [pluggy, setPluggy] = useState(false)
    const onSuccess = (itemData) => {
        // do something with the financial data
      };
    
      const onError = (error) => {
        // handle the error
      };

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
    }, [location])

    return(
      <div className='appPage'>
        <div className='page-background-global'>
          <div className='page-content-global page-content-financeiro'>
            {pluggy && 
                <PluggyWidget/>
            }
            <div className='title-container-global'>
              <h1 className='title-global'>Extrato Bancário</h1>
            </div>
            <hr className='hr-global'/>
            <div className='pluggy-container'>
                <img className='pluggy-icon' src={pluggyImg} alt='logo pluggy' />
                <button className='btn btn-primary btn-global' onClick={()=>{setPluggy(true)}}>Conectar</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Extrato