import { useState, useEffect, useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import '../SeletorCliente'
import { AuthContext } from '../../contexts/auth'
import { FiRefreshCw } from 'react-icons/fi'
import Modal from "../Modal"
import SeletorCliente from '../SeletorCliente'
import './dadosDisplay.scss'
import { cancelOngoingRequests } from '../../services/api'

const DadosGrupoCliente = () => {

    const {
        setExportName,
        setSalesPageArray,
        setCreditsPageArray,
        setServicesPageArray,
        displayGroup,
        displayClient,
        setDisplayGroup,
        setDisplayClient,
        fetchingData,
        setCanceled,
      } = useContext(AuthContext)

      const [modalOpen, setModalOpen] = useState(false)
    
      const [selectorGroupList, setSelectorGroupList] = useState(
        JSON.parse(localStorage.getItem('groupsStorage'))
      )
    
      const [groupOptions, setGroupOptions] = useState([])
      const [clientOptions, setClientOptions] = useState([])
      const [selectedGroup, setSelectedGroup] = useState(null)
      const [selectedClient, setSelectedClient] = useState(null)
    
      useEffect(()=>{
        console.log(selectedGroup, selectedClient)
    
        if(selectedGroup && selectedClient){
          setDisplayGroup(selectedGroup.label)
          setDisplayClient(selectedClient.label)
        }
      },[selectedGroup, selectedClient])
    
      useEffect(() => {
        if (selectorGroupList) {
          const sortedOptions = selectorGroupList
            .map((GRU) => ({
              value: GRU.CODIGOGRUPO,
              label: GRU.NOMEGRUPO,
              clients: GRU.CLIENTES,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
          setGroupOptions(sortedOptions)
    
          const isFirstLoad = localStorage.getItem('isSelected') !== 'true'
          if (isFirstLoad) {
            if (sortedOptions.length > 0) {
              const initialGroup = sortedOptions[0]
              const initialClientOptions = getClientOptions(initialGroup)
    
              setSelectedGroup(initialGroup)
              setClientOptions(initialClientOptions)
              setSelectedClient(initialClientOptions[0])
    
              localStorage.setItem('selectedGroup', JSON.stringify(initialGroup))
              localStorage.setItem('clientOptions', JSON.stringify(initialClientOptions))
              localStorage.setItem('selectedClient', JSON.stringify(initialClientOptions[0]))
              localStorage.setItem('groupCode', initialGroup.value)
              localStorage.setItem('isSelected', 'true')
            }
          } else {
            const savedGroup = localStorage.getItem('selectedGroup')
            const savedClientOptions = localStorage.getItem('clientOptions')
            const savedClient = localStorage.getItem('selectedClient')
    
            if (savedGroup) setSelectedGroup(JSON.parse(savedGroup))
            if (savedClientOptions) setClientOptions(JSON.parse(savedClientOptions))
            if (savedClient) setSelectedClient(JSON.parse(savedClient))
          }
        }
      }, [selectorGroupList])
    
      useEffect(() => {
        if (selectedGroup) {
          const options = getClientOptions(selectedGroup)
          setClientOptions(options)
    
          if (!localStorage.getItem('selectedClient')) {
            setSelectedClient(options[0])
            localStorage.setItem('selectedClient', JSON.stringify(options[0]))
          }
    
          localStorage.setItem('clientOptions', JSON.stringify(options))
          localStorage.setItem('groupName', selectedGroup.label)
          localStorage.setItem('groupClients', JSON.stringify(selectedGroup.clients))
          localStorage.setItem('selectedGroup', JSON.stringify(selectedGroup))
          localStorage.setItem('groupCode', selectedGroup.value)
        }
      }, [selectedGroup])
    
      useEffect(() => {
        setSalesPageArray([])
        setCreditsPageArray([])
        setServicesPageArray([])
        if (selectedClient && selectedClient.label !== 'TODOS') {
          localStorage.setItem('cnpj', selectedClient.value)
          localStorage.setItem('clientCode', selectedClient.cod)
          setExportName(selectedClient.label)
        } else if (selectedClient) {
          localStorage.setItem('cnpj', selectedClient.value)
          localStorage.setItem('clientCode', 'todos')
          setExportName(selectedGroup ? `${selectedGroup.label} - Todas Filiais` : '')
        }
      }, [selectedClient, selectedGroup])
    
      const getClientOptions = (group) => {
        const todosOption = { label: 'TODOS', value: 'todos' }
        const foundGroup = groupOptions.find((option) => option.value === group.value)
        if (foundGroup) {
          const sortedClientOptions = foundGroup.clients
            .map((CLI) => ({
              value: CLI.CNPJ,
              label: CLI.NOMECLIENTE,
              cod: CLI.CODIGOCLIENTE,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
          return [todosOption, ...sortedClientOptions]
        }
        return [todosOption]
      }

      const handleCancel = () => {
        setCanceled(true)
        cancelOngoingRequests()
      } 

    return (
        <div className="display-seletor">
            { modalOpen && <Modal children={<SeletorCliente onClose={()=>{setModalOpen(false)}}/>} onClose={()=>{setModalOpen(false)}}/> }
            <div className="dados-display-container">
                <div className="grupo-cli-container">
                  <div className='gru-cli-inner-container'>
                    <div className="grupo-cli-content">
                        <div className="select-card-seletor-display">
                            <span style={{color: 'white'}}>Grupo: </span>
                            <span className='span-display'>{displayGroup}</span>
                        </div>
                    </div>
                    <div className="grupo-cli-content">
                        <div className="select-card-seletor-display" >
                            <span style={{color: 'white'}}>Cliente: </span>
                            <span className='span-display'>{displayClient}</span>
                        </div>
                    </div>
                  </div>
                    <div className="grupo-cli-content">
                        <div className="select-card-seletor-display">
                          <div className='select-card-seletor-btn-container'>
                            <button type='button' className='btn btn-success-dados px-2 py-1' onClick={() => {setModalOpen(true)}} disabled={fetchingData}><FiRefreshCw/> {fetchingData ? 'Carregando dados. Aguarde' : 'Trocar'}</button>
                              {fetchingData &&
                                <button type='button' className='btn btn-outline-danger px-2 py-1' onClick={handleCancel}>cancelar</button>}
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DadosGrupoCliente
