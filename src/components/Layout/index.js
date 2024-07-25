import Header from "../Header"
import Footer from "../Footer"
import SeletorCliente from "../SeletorCliente"
import { FiMail, FiPlusCircle, FiX } from "react-icons/fi"
import { useEffect, useState } from "react"
import '../../styles/global.scss'
import './layout.scss'
import '../../pages/CadastroDeBancos/cadastroDeBancos.scss'
import ImageUpload from "../Componente_ImageUpload"

function Layout({ children }){

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [uploadedImages, setUploadedImages] = useState([])
        
    const openModal = () => {
        setIsModalOpen(true)
    }
    
    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleClick = () => {
        openModal()
    }

    const handleUpload = (images) => {
      setUploadedImages(images)
    }


    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        mensagem: ''
      })

      let nomeTemp
      let emailTemp
      let mensagemTemp
    
      const handleChangeNome = (e) => {
        nomeTemp = e.target.value
      }

      const handleChangeEmail = (e) => {
        emailTemp = e.target.value
      }

      const handleChangeMensagem = (e) => {
        mensagemTemp = e.target.value
      }

      const [enviar, setEnviar] = useState(false)
    
      const handleSubmit = (e) => {
        let objTemp = {nome: nomeTemp, email: emailTemp, mensagem: mensagemTemp}
        setFormData(objTemp)
        setEnviar(true)
        //
      }

      useEffect(()=>{
        if(enviar && formData){
            window.location.href = `mailto:eduardo@salvalucro.com.br?subject=${formData.nome}&body=${formData.mensagem}`
            setEnviar(false)
            setFormData({
                nome: '',
                email: '',
                mensagem: ''
              })
        }
      },[enviar])

      const FormContato = () => {
        return (
          <div style={{ display: 'contents', position: 'relative', overflow: 'hidden' }}>
              <div className='header-sticky'>
                <div className='header-container-taxa'>
                  <div className='title-container-global title-container-banco title-container-contato' style={{ marginTop: '5%' }}>
                    <h3 className='title-global' style={{ margin: '0' }}>Contato</h3>
                    <button className='btn btn-danger close-modal-banco close-modal-contato' onClick={closeModal}><FiX size={13} /></button>
                  </div>
                </div>
                <hr className='hr-global'/>
              </div>
              <form className='form-contato-container' onSubmit={handleSubmit}>
                <div className='form-content-container'>
                <div className='input-container input-container-contato'>
                  <h6 className='form-input-title' htmlFor="nome"><b className='form-input-b'>Nome:</b> *</h6>
                  <input
                    type="text"
                    value={nomeTemp}
                    onChange={handleChangeNome}
                    placeholder='Nome...'
                    required
                  />
                </div>
                <div className='input-container input-container-contato'>
                  <h6 className='form-input-title' htmlFor="email"><b className='form-input-b'>E-mail:</b> *</h6>
                  <input
                    type="email"
                    value={emailTemp}
                    onChange={handleChangeEmail}
                    placeholder='Exemplo@email.com.br'
                    required
                  />
                </div>
                <div className='input-container input-container-contato'>
                  <h6 className='form-input-title' htmlFor="mensagem"><b className='form-input-b'>Mensagem:</b> *</h6>
                  <textarea
                    value={mensagemTemp}
                    onChange={handleChangeMensagem}
                    placeholder='Mensagem...'
                    required
                  />
                </div>
                <ImageUpload onUpload={handleUpload} />
                <hr className='hr-global' />
                <button className='btn btn-global' type='submit' >Enviar</button>
                </div>
              </form>
            </div>
          )
    }

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null
        
        return (
            <div className="modal-layout" onClick={onClose}>
                <div className='modal-layout-content modal-layout-contato-content' onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        )
    }
          
    const Contato = () => { 
        return (
            <div>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className='modal-layout-body'>
                        <FormContato />
                    </div>
                </Modal>
            </div>
        )
    }

    return(
      <div className='layout'>
          <div className='appPage'>
              <Header />
              <SeletorCliente/>
              { children }
              <div className='btn-contato-container'>
                  <button className='btn-global btn-contato' onClick={handleClick}>
                      <span><FiMail size={30}/></span>
                  </button>
              </div>
              <span className='span-plus' ><FiPlusCircle size={20}/></span>
              {isModalOpen && (
                  <Contato />
                  )}
              <Footer />
          </div>
      </div>
    )
}

export default Layout