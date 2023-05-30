import React from "react"
import './loadingModal.css'

const LoadingModal = () => {
    return(
        <div className="modal" id="loadingModal">
            <div class="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <h4>Loading...</h4>
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingModal