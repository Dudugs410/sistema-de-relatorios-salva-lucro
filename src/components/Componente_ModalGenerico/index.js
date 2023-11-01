import React from 'react';
import './modal.scss'
import { FiX } from 'react-icons/fi';


const ModalGenerico = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-window-content">
        <div className="modal-content-adq">
          <button className="btn btn-danger modal-close" onClick={onClose}>
            <FiX />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ModalGenerico;