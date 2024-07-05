import { useContext, useRef } from 'react'
import { FiFilePlus } from 'react-icons/fi'
import '../Financeiro/financeiro.scss'
import '../../styles/global.scss'
import './conciliacao.scss'

const ConciliacaoBancaria = () => {
    const fileInputRef = useRef(null)

    const handleButtonClick = () => {
      fileInputRef.current.click()
    }

    return(
        <div className='appPage'>
            <div className='page-background-global'>
                <div className='page-content-global page-content-financeiro'>
                    <div className='title-container-global'>
                        <h1 className='title-global'>Conciliação Bancária</h1>          
                    </div>
                    <hr className="hr-global"/>
                    <div className='container-cielo'>
                        <div className='container-extrato-cnab'>
                            <h6>{'Carregar Extrato (Cnab240)'}</h6>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                // Handle file selection if needed
                                console.log(e.target.files[0])
                                }}
                            />
                            {/* Visible button to trigger file input */}
                            <button className='btn btn-global' onClick={handleButtonClick}><FiFilePlus /> &nbsp; Arquivo</button>
                        </div>
                        <hr className='hr-global'/>
                        <div className='container-conciliacao'>
                        </div>
                    </div>
                </div>
            </div>   
        </div>
    )
}

export default ConciliacaoBancaria