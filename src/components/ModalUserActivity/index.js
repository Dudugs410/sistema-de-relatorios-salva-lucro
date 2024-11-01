import React, { useEffect } from 'react'
import './modalActivity.scss'

const ModalUserActivity = ({ onClose, children }) => {

  useEffect(()=>{
    sessionStorage.setItem('showModalDash', false)
  },[onClose])

  return (
    <div className="modal-overlay">
      <div className='modal-useractivity-container'>
        <div className="modal-useractivity-body">
          {children}
        </div>
      </div>
      <div className="modal-useractivity-background" onClick={onClose} />
    </div>
  )
}

export default ModalUserActivity