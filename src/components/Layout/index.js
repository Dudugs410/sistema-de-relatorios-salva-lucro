import Header from "../Header"
import Footer from "../Footer"
import SeletorClienteDev from "../SeletorCliente dev"
import { FiMail, FiPlusCircle } from "react-icons/fi"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import './layout.scss'

function Layout({ children }){
    const { isDarkTheme } = useContext(AuthContext)

    const [isModalOpen, setIsModalOpen] = useState(false);
        
    const openModal = () => {
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleClick = () => {
        console.log('handleClick')
        openModal()
    }


    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        mensagem: ''
      });

      let nomeTemp
      let emailTemp
      let mensagemTemp
    
      const handleChangeNome = (e) => {
        console.log(e.target.value)
        nomeTemp = e.target.value
      };

      const handleChangeEmail = (e) => {
        console.log(e.target.value)
        emailTemp = e.target.value
      };

      const handleChangeMensagem = (e) => {
        console.log(e.target.value)
        mensagemTemp = e.target.value
      };

      const [enviar, setEnviar] = useState(false)
    
      const handleSubmit = (e) => {
        console.log(nomeTemp, emailTemp, mensagemTemp)
        let objTemp = {nome: nomeTemp, email: emailTemp, mensagem: mensagemTemp}
        setFormData(objTemp)
        setEnviar(true)
        //
      };

      useEffect(()=>{
        if(enviar && formData){
            window.location.href = `mailto:eduardo@salvalucro.com.br?subject=${formData.nome}&body=${formData.mensagem}`;
            setEnviar(false)
            setFormData({
                nome: '',
                email: '',
                menssagem: ''
              })
        }
      },[enviar])

    const FormContato = () => {
        return (
            <form className='form-contato-container' onSubmit={handleSubmit}>
            <h3><b>Contato</b></h3>
              <div className='input-container'>
                <h6 htmlFor="nome"><b>Nome:</b> *</h6>
                <input
                  type="text"
                  value={nomeTemp}
                  onChange={handleChangeNome}
                  placeholder='Nome...'
                  required
                />
              </div>
              <div className='input-container'>
                <h6 htmlFor="email"><b>E-mail:</b> *</h6>
                <input
                  type="email"
                  value={emailTemp}
                  onChange={handleChangeEmail}
                  placeholder='Exemplo@email.com.br'
                  required
                />
              </div>
              <div className='input-container'>
                <h6 htmlFor="menssagem"><b>Mensagem:</b> *</h6>
                <textarea
                  value={mensagemTemp}
                  onChange={handleChangeMensagem}
                  placeholder='Mensagem...'
                  required
                />
              </div>
              <button className={`btn btn-global ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} type='submit' >Enviar</button>
            </form>
          );
    }

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        
        return (
            <div className="modal-layout" onClick={onClose}>
                <div className={`modal-layout-content ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        );
    };
          
    const Contato = () => {
        
        return (
            <div>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className='modal-layout-body'>
                        <FormContato />
                    </div>
                </Modal>
            </div>
        );
    };

    return(
        <div className='layout'>
            <div className='appPage'>
                <Header />
                <SeletorClienteDev/>
                { children }
                <div className={`btn-contato-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <button className={`btn-global btn-contato ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} onClick={handleClick}>
                        <span><FiMail size={30}/></span>
                    </button>
                </div>
                <span className={`span-plus ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}><FiPlusCircle size={20}/></span>
                {isModalOpen && (
                    <Contato />
                    )}
                <Footer />
            </div>
        </div>

    )
}

export default Layout