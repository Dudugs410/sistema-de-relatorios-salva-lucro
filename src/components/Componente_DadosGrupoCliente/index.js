import { useState, useEffect, useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import '../SeletorCliente'
import { AuthContext } from '../../contexts/auth'
import { FiRefreshCw } from 'react-icons/fi'
import Modal from "../Modal"
import SeletorCliente from '../SeletorCliente'

const DadosGrupoCliente = () => {

    const { changedOption } = useContext(AuthContext)

    const [group, setGroup] = useState(JSON.parse(localStorage.getItem('selectedGroup')))
    const [client, setClient] = useState(JSON.parse(localStorage.getItem('selectedGroup')))

    const [displayGroup, setDisplayGroup] = useState('')
    const [displayClient, setDisplayClient] = useState('')

    useEffect(()=>{
        setGroup(JSON.parse(localStorage.getItem('selectedGroup')))
        setClient(JSON.parse(localStorage.getItem('selectedClient')))
    },[changedOption])

    useEffect(()=>{
        setDisplayGroup(group.label)
    },[group])

    useEffect(()=>{
        setDisplayClient(client.label)
    },[client])
    
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className="search-bar-seletor">
            { modalOpen && <Modal children={<SeletorCliente onClose={()=>{setModalOpen(false)}}/>} onClose={()=>{setModalOpen(false)}}/> }
            <form className="date-container-seletor p-4">
                <div className="cli-container">
                    <div className="date-column-seletor">
                        <div className="select-card-seletor">
                            <span>Grupo: </span>
                            <span>{displayGroup}</span>
                        </div>
                    </div>
                    <div className="date-column-seletor">
                        <div className="select-card-seletor" >
                            <span>Cliente: </span>
                            <span>{displayClient}</span>
                        </div>
                    </div>
                    <div className="date-column-seletor">
                        <div className="select-card-seletor">
                            <button type='button' className='btn btn-outline-success px-2 py-1' onClick={() => {setModalOpen(true)}}><FiRefreshCw/> Trocar Grupo/Cliente</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default DadosGrupoCliente
