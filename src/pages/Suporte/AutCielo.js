import { FiActivity, FiCheckSquare, FiCopy, FiLock, FiSearch, FiUpload } from 'react-icons/fi'


const AutCielo = ({PlaceHolder}) =>{
    return(
        <div className='container-cielo'>
            <div>
                <h4>Prezado Cliente</h4>
                <p>Para que possamos ter acesso aos arquivos de extratos da Administradora Cielo, é necessária sua autorização eletrônica, para isso, nosso sistema está integrado com o portal da Cielo.
                <br/><br/>
                Selecione na lista abaixo, um código de Estabelecimento e clique no botão "Autorizar" para prosseguir.</p>
            </div>
            <div className='suporte-content'>
                <div className='input-suporte'>
                    <div className='input-block'>
                        <h6><b>Estabelecimento</b></h6>
                        <input className='input-suporte' type='text'/>
                    </div>
                    <div className='input-block'>
                        <h6><b>CNPJ</b></h6>
                        <input className='input-suporte' type='text'/>    
                    </div>
                    <div className='input-block'>
                        <h6><b>Razão Social</b></h6>
                        <input className='input-suporte' type='text'/>                    
                    </div>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                    </div>
                </div>
                <hr className='hr-global'/>
                <PlaceHolder />
                <div className='input-suporte'>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiLock />&nbsp;Autorizar</button>
                    </div>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiCheckSquare />&nbsp;Consultar Status</button>
                    </div>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiActivity />&nbsp;Credenciar</button>
                    </div>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiUpload />&nbsp;Atualizar Status</button>
                    </div>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiCopy />&nbsp;Duplicação</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AutCielo