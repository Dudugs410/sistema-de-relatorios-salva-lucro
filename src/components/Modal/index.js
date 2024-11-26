import React, { useContext, useEffect } from 'react'
import './modal.scss'
import { FiX } from 'react-icons/fi'

const Modal = ({ onClose, children }) => {

  useEffect(()=>{
    localStorage.setItem('showModalDash', false)
  },[onClose])

  return (
    <div className="modal-overlay">
      <div className='modal-window-content'>
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

export default Modal