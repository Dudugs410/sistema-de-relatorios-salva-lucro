import { useState } from 'react'

import { FiSearch } from 'react-icons/fi'
import RadioSelect from '../../components/Componente_RadioSelect'

const GestaoAdq = ({PlaceHolder2}) =>{

    const radioOptions = [{value: 0, label: 'Identificados'},{value: 1, label: 'Pendentes'}]
    const [radioOption, setRadioOption] = useState(null)

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
                        <h6><b>Código do Cliente</b></h6>
                        <input className='input-suporte' type='text'/>                    
                    </div>
                    <div className='input-block'>
                        <div className='radio-suporte'><RadioSelect options={radioOptions} onSelect={(e) => {setRadioOption(e)}}/></div>
                    </div>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                    </div>
                </div>
                <hr className='hr-global'/>
                <PlaceHolder2 />
            </div>
        </div>
    )
}

export default GestaoAdq