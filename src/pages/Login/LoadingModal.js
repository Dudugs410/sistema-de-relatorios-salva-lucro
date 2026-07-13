import React from 'react';
import './loadingModal.css';

const LoadingModal = ({ message = 'Carregando...' }) => {
    return (
        <div className="loading-modal">
            <div className="loading-content">
                <div className="loading-spinner"></div>
                <p className="loading-text">{message}</p>
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;