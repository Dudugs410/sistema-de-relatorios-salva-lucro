import React, { useContext, useEffect } from 'react'
import './modal.scss'
import { FiX } from 'react-icons/fi'

const Modal = ({ onClose, children }) => {

  useEffect(() => {
    localStorage.setItem('showModalDash', false)
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div className="modal-overlay">
      <div className='modal-window-content'>
        <div className="modal-content-adq">
          <div className='modal-btn-container'>
            <button 
              className="btn btn-danger modal-close" 
              onClick={onClose}
              aria-label="Fechar modal"
            >
              <FiX />
            </button>
          </div>
          <div className="modal-content-body">
            {children}
          </div>
        </div>
      </div>
      <div 
        className="modal-background" 
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  )
}

export default Modal