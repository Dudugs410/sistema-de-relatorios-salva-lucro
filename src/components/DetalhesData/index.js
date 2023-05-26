import './detalhesData.css'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'

const DetalhesData = ({ close }) =>{

const { totalLiquido, totalDebito, totalCredito, totalVoucher } = useContext(AuthContext)
const [ total ] = useState(0)

    return(
        <>
            <div className='card-vendas'>
                <span>Vendas no total</span>
                <hr/>
                <span>Formas de pagamento: </span>
                <br/><br/><br/>
                <div className='btn-div'>
                    <div className='valores-div'>
                        <span>Débito à vista: </span> <span>R$ {`${totalDebito.toFixed(2)}`}</span>
                    </div>
                    <div className='valores-div'>
                        <span>Crédito à vista: </span> <span>R$ {`${totalCredito.toFixed(2)}`}</span>
                    </div>
                    <div className='valores-div'>
                        <span>Voucher: </span> <span>R$ {`${totalVoucher.toFixed(2)}`}</span>
                    </div>
                    <hr/>
                    <div className='valores-div'>
                        <span>Total Líquido: </span> <span>R$ {`${totalLiquido.toFixed(2)}`}</span>
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