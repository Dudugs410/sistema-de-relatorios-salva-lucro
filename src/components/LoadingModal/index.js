import React, {useEffect, useContext} from "react"
import { AuthContext } from "../../contexts/auth"

import './loadingModal.css'



const LoadingModal = () => {

    const { loading, setLoading } = useContext(AuthContext)

    useEffect(() => {
        setLoading(sessionStorage.getItem('loading'))
    },[loading, setLoading])

    if(loading)
    {
        return(
            <div class="modal" id="loadingModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <h4>Loading...</h4>
                            <div class="spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default LoadingModal