import { useContext, useRef } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiFilePlus } from 'react-icons/fi'
import '../Financeiro/financeiro.scss'
import '../../styles/global.scss'
import './conciliacao.scss'

const ConciliacaoBancaria = () => {

    const { isDarkTheme } = useContext(AuthContext)

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };

    return(
        <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                <div className={`page-content-global page-content-financeiro ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <h1 className={`title-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Conciliação Bancária</h1>          
                    </div>
                    <hr className="hr-recebimentos"/>
                    <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                        <div className=''>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>{'Carregar Extrato (Cnab240)'}</h6>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                // Handle file selection if needed
                                console.log(e.target.files[0]);
                                }}
                            />
                            {/* Visible button to trigger file input */}
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleButtonClick}><FiFilePlus /> &nbsp; Arquivo</button>
                        </div>
                        <hr className='hr-global'/>
                        <div className={`container-conciliacao ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        </div>
                    </div>
                </div>
            </div>   
        </div>
    )
}

export default ConciliacaoBancaria