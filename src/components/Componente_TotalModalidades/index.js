
import './totalModalidade.scss'

const TotalModalidadesComp = ({texto1, valor1, texto2, valor2, texto3, valor3, texto4, valor4}) =>{
    
    return(
        <>
            <div className='content-container-modalidade'>
                <div className='total-container-modalidade'>
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>{texto1}</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='valor-total'>{valor1.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container-modalidade'>
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>{texto2}</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='valor-total'>{valor2.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container-modalidade'> 
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>{texto3}</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='valor-total span-modalidade'>{valor3.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container-modalidade'> 
                    <div className='text-container-modalidade'>
                        <h1 className='title-modalidade'>{texto4}</h1>
                        <p className='text-modalidade'>TOTAL: R$ <span className='valor-total'>{valor4.toFixed(2)}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TotalModalidadesComp
    