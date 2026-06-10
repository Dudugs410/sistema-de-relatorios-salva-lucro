import { useEffect } from 'react'
import '../../../components/Modal/modal.scss'
import { FiX } from 'react-icons/fi'

const ModalAlerta = ({ onClose }) => {
    useEffect(()=>{
        console.log('modal alerta')
    },[])
  return (
    <div className="modal-overlay">
      <div className='modal-window-content'>
        <div className="modal-content-adq">
          <div className='modal-btn-container'>
            <button className="btn btn-danger modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <p style={{textAlign: 'center'}} className='text-global'>
            <b>AVISO IMPORTANTE !!!</b><hr/>
            A partir de das 18 horas de hoje (29/08/2025) até as 18 horas de domingo (31/08/2025), o sistema Salva Lucro ficará indisponível.  Isto ocorrerá devido a uma atualização dos servidores no data center que hospedamos as informações. Isto visa uma melhor performance com equipamentos mais modernos.
            Devido a esta operação, poderemos ter atrasos nas informações na segunda feira, das vendas do final de semana.  Tão logo esteja regularizado, informaremos.
          </p>
        </div>
      </div>
      <div className="modal-background" onClick={onClose} />
    </div>
  )
}

export default ModalAlerta