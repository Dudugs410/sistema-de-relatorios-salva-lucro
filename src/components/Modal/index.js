import React, { useContext } from 'react';
import './modal.scss'
import { FiX } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';


const Modal = ({ onClose, children }) => {

  const {isDarkTheme} = useContext(AuthContext)

  return (
    <div className="modal-overlay">
      <div className={`modal-window-content ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="modal-content-adq">
          <button className="btn btn-danger modal-close" onClick={onClose}>
            <FiX />
          </button>
          {children}
        </div>
      </div>
      <div className="modal-background" onClick={onClose} />
    </div>
  )
}

export default Modal;