const CorrigirAdq = () =>{
    return(
        <div className='container-cielo' >
            <div>
                <p>Realiza a correção dos cruzamentos entre Clientes x Adquirentes cadastrados incorretamente.</p>
                <br/><br/>
            </div>
            <div className='input-suporte-correcao'>
                <div className='input-block-correcao'>
                    <h6><b>Adquirente *</b></h6>
                    <input className='input-suporte input-correcao' type='text'/>
                </div>
                <br/>
                <div className='input-block-correcao'>
                    <h6><b>Cód do Estabelecimento na Adquirente *</b></h6>
                    <input className='input-suporte input-correcao' type='text'/>
                </div>
                <br/>
                <div className='input-block-correcao'>
                    <h6><b>CNPJ Origem *</b></h6>
                    <input className='input-suporte input-correcao' type='text'/>                    
                </div>
                <br/>
                <div className='input-block-correcao'>
                    <h6><b>Razão Social Origem</b></h6>
                    <input className='input-suporte input-correcao' type='text'/>                    
                </div>
                <br/>
                <div className='input-block-correcao'>
                    <h6><b>CNPJ Destino *</b></h6>
                    <input className='input-suporte input-correcao' type='text'/>                    
                </div>
                <br/>
                <div className='input-block-correcao'>
                    <h6><b>Razão Social Destino</b></h6>
                    <input className='input-suporte input-correcao' type='text'/>                    
                </div>
                <br/>
                <hr className='hr-global'/>
                <div className='input-block-correcao'>
                    <button className='btn btn-global btn-correcao'>Aplicar Correção</button>
                </div>
                <div className='input-block-corração'>
                    <p className='p-correcao'>Campos com * são obrigatórios</p>
                </div>
            </div>
        </div>
    )
}

export default CorrigirAdq