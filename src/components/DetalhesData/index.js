import './detalhesData.css'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'

const DetalhesData = ({ close }) =>{

const { totalLiquido } = useContext(AuthContext)
const [ total, setTotal] = useState(0)

useEffect(()=>{
    setTotal(totalLiquido)
},[totalLiquido])

    return(
        <>
            <div className='card-vendas'>
                <span>Vendas no total</span>
                <hr/>
                <span>Formas de pagamento: </span>
                <br/><br/><br/>
                <div className='btn-div'>
                    <div className='valores-div'>
                        <span>Débito à vista: </span> <span>valor</span>
                    </div>
                    <div className='valores-div'>
                        <span>Crédito à vista: </span> <span>valor</span>
                    </div>
                    <div className='valores-div'>
                        <span>Voucher: </span> <span>valor</span>
                    </div>
                    <hr/>
                    <div className='valores-div'>
                        <span>Total Líquido: </span> <span>{`${total}`}</span>
                    </div>
                    <div className='button-container'>
                        <button type='button' className='botao-card btn btn-primary' onClick={ close }>Valores por Administradora</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetalhesData