
import { useContext } from 'react'
import './totalModalidade.scss'
import { AuthContext } from '../../contexts/auth'

const TotalModalidadesComp = () =>{
const { totaisGlobal } = useContext(AuthContext)    
    return(
        <>
            <div className='content-container-modalidade'>
                <div className='total-container-modalidade'>
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>Débito</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade'>{totaisGlobal.debito.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container-modalidade'>
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>Crédito</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade'>{totaisGlobal.credito.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container-modalidade'> 
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>Voucher</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade span-modalidade'>{totaisGlobal.voucher.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container-modalidade'> 
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>Total Líquido</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='green-modalidade'>{totaisGlobal.liquido.toFixed(2)}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TotalModalidadesComp
    