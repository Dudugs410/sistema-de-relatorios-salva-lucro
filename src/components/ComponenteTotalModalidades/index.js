
import './totais.css'

import { useEffect } from 'react'

const ComponenteTotalModalidades = ({ array }) =>{

    async function loadTotalAdquirentes(array){
        console.log(array)
        
    }

    useEffect(()=>{
        loadTotalAdquirentes(array)
    },[])
    
    return(
        <>
            <div className='content-container'>
                <div className='total-container'>
                    <div className='text-container'>
                        <div className='card-title'>
                            <h1 className='title'>Débito</h1>
                        </div>
                        <p className='text'>TOTAL: R$ <span className='green'>{}</span></p>
                    </div>
                </div>
                <div className='total-container'>
                    <div className='text-container'>
                        <h1 className='title'>Crédito</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{}</span></p>
                    </div>
                </div>
                <div className='total-container'> 
                    <div className='text-container'>
                        <h1 className='title'>Voucher</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{}</span></p>
                    </div>
                </div>
                <div className='total-container'> 
                    <div className='text-container'>
                        <h1 className='title'>Total Líquido</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ComponenteTotalModalidades
    