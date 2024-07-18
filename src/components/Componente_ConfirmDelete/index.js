import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './confirmDelete.scss'

const ConfirmDelete = ({ onConfirm, onCancel }) => (
    <div className='confirm-background'>
        <p>Tem certeza que deseja deletar este item?</p>
        <div className='confirm-delete'>
            <button onClick={onConfirm} className="btn btn-danger">Sim</button>
            <button onClick={onCancel} className="btn btn-secondary">Não</button>
        </div>
    </div>
);

export default ConfirmDelete