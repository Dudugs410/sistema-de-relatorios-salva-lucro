import React from 'react';
import './modal.css'

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-window-content">
        <div className="modal-content">
          <button className="btn btn-danger modal-close" onClick={onClose}>
            Close
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal;