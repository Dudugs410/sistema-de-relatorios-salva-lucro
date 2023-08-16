
import './totalModalidade.css'

const TotalModalidadesComp = ({texto1, valor1, texto2, valor2, texto3, valor3, texto4, valor4}) =>{
    
    return(
        <>
            <div className='content-container'>
                <div className='total-container'>
                    <div className='text-container'>
                        <div className='card-title'>
                            <h1 className='title'>{texto1}</h1>
                        </div>
                        <p className='text'>TOTAL: R$ <span className='green'>{valor1.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container'>
                    <div className='text-container'>
                        <h1 className='title'>{texto2}</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{valor2.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container'> 
                    <div className='text-container'>
                        <h1 className='title'>{texto3}</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{valor3.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container'> 
                    <div className='text-container'>
                        <h1 className='title'>{texto4}</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{valor4.toFixed(2)}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TotalModalidadesComp
    