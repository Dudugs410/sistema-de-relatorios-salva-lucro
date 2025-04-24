import { FiLock, FiSearch, FiUpload } from "react-icons/fi"

const AutC6 = ({PlaceHolder}) =>{
    return(
        <div className='container-cielo' >
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
                        <button className='btn btn-global'><FiUpload />&nbsp;Atualizar Status</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AutC6