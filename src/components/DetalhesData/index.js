import './detalhesData.css'

const DetalhesData = ({vendas, close}) =>{
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
                    <div className='button-container'>
                        <button type='button' className='botao-card btn btn-primary' onClick={ close }>Valores por Administradora</button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default DetalhesData