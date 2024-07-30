import { FiSearch } from 'react-icons/fi'


const ConsultaArquivo = () =>{
    return(
        <div className='suporte-content'>
            <div className='input-suporte'>
                <div className='input-block'>
                    <h6><b>Nome do Arquivo</b></h6>
                    <input className='input-suporte' type='text'/>
                </div>
                <div className='input-block'>
                    <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                </div>
            </div>
            <div className='consulta-arquivos'>

            </div>
        </div>
    )
}

export default ConsultaArquivo