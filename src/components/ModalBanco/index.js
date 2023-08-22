


const ModalBanco = ({onClose, children}) => {
    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn btn-danger modal-close" onClick={onClose}>
              Close
            </button>
            {children}
          </div>
        </div>
      )
}

export default ModalBanco