import { useState, useEffect, useContext, useRef } from 'react'
import Select from 'react-select'
import Cookies from 'js-cookie'
import axios from 'axios'
import { cancelOngoingRequests } from '../../services/api'

import { AuthContext } from '../../contexts/auth'

import 'react-toastify/dist/ReactToastify.css'
import './Seletor.scss'

const SeletorCliente = ({onClose}) => {
  const {
    changedOption, setChangedOption,
    setIsLoadedSalesDashboard,
    setIsLoadedCreditsDashboard,
    setIsLoadedServicesDashboard,
    setExportName,
    setSalesPageArray,
    setCreditsPageArray,
    setServicesPageArray,
    fetchingData,
  } = useContext(AuthContext)

  const [selectorGroupList, setSelectorGroupList] = useState(
    JSON.parse(localStorage.getItem('groupsStorage'))
  )

  const [groupOptions, setGroupOptions] = useState([])
  const [clientOptions, setClientOptions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)

  const handleLoad = (e) => {
    e.preventDefault()
    setIsLoadedSalesDashboard(false)
    setIsLoadedCreditsDashboard(false)
    setIsLoadedServicesDashboard(false)
    setChangedOption(!changedOption)
    onClose()
  }

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
      //setChangedOption(!changedOption)
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
    //setChangedOption(!changedOption)
  }, [selectedClient, selectedGroup])

  const handleGroupChange = (selected) => {
    //setIsLoadedSalesDashboard(false)
    //setIsLoadedCreditsDashboard(false)
    //setIsLoadedServicesDashboard(false)
    setSelectedGroup(selected)

    // Reset selected client to the first option
    const options = getClientOptions(selected)
    setClientOptions(options)
    setSelectedClient(options[0])

    // Update cookies
    localStorage.setItem('selectedGroup', JSON.stringify(selected))
    localStorage.setItem('groupCode', selected.value)
    localStorage.setItem('clientOptions', JSON.stringify(options))
    localStorage.setItem('selectedClient', JSON.stringify(options[0]))
  }

  const handleClientChange = (selected) => {
    cancelOngoingRequests()
    //setIsLoadedSalesDashboard(false)
    //setIsLoadedCreditsDashboard(false)
    //setIsLoadedServicesDashboard(false)
    setSelectedClient(selected)
    localStorage.setItem('selectedClient', JSON.stringify(selected))
  }

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

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Set your desired z-index value here
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // If you're using the menuPortal
  }

  return (
    <div className="search-bar-seletor">
      <form className="date-container-seletor p-4">
        <div className="cli-container">
          <div className="date-column-seletor">
            <div className="select-card-seletor">
              <span>Grupo</span>
              <Select
                styles={customStyles}
                options={groupOptions}
                onChange={handleGroupChange}
                value={selectedGroup}
                isDisabled={fetchingData}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="date-column-seletor">
            <div className="select-card-seletor" >
              <span>Cliente</span>
              <Select
                styles={customStyles}
                options={clientOptions}
                placeholder="Selecione o Cliente / Filial"
                onChange={handleClientChange}
                value={selectedClient}
                isDisabled={(!selectedGroup || fetchingData)}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className='date-column-seletor'>
            <button className='btn btn-global btn-seletor' onClick={handleLoad}>Selecionar</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SeletorCliente
