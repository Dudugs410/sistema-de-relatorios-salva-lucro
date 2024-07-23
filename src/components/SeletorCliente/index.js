import { useState, useEffect, useContext, useRef } from 'react'
import Select from 'react-select'
import Cookies from 'js-cookie'
import axios from 'axios'

import { AuthContext } from '../../contexts/auth'

import 'react-toastify/dist/ReactToastify.css'
import './Seletor.scss'

const SeletorCliente = () => {
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
    JSON.parse(sessionStorage.getItem('groupsStorage'))
  )

  const [groupOptions, setGroupOptions] = useState([])
  const [clientOptions, setClientOptions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)

  const cancelSourceRef = useRef(axios.CancelToken.source())

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

      const isFirstLoad = sessionStorage.getItem('isSelected') !== 'true'
      if (isFirstLoad) {
        if (sortedOptions.length > 0) {
          const initialGroup = sortedOptions[0]
          const initialClientOptions = getClientOptions(initialGroup)

          setSelectedGroup(initialGroup)
          setClientOptions(initialClientOptions)
          setSelectedClient(initialClientOptions[0])

          Cookies.set('selectedGroup', JSON.stringify(initialGroup))
          Cookies.set('clientOptions', JSON.stringify(initialClientOptions))
          Cookies.set('selectedClient', JSON.stringify(initialClientOptions[0]))
          Cookies.set('groupCode', initialGroup.value)
          sessionStorage.setItem('isSelected', 'true')
        }
      } else {
        const savedGroup = Cookies.get('selectedGroup')
        const savedClientOptions = Cookies.get('clientOptions')
        const savedClient = Cookies.get('selectedClient')

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

      if (!Cookies.get('selectedClient')) {
        setSelectedClient(options[0])
        Cookies.set('selectedClient', JSON.stringify(options[0]))
      }

      Cookies.set('clientOptions', JSON.stringify(options))
      Cookies.set('groupName', selectedGroup.label)
      Cookies.set('groupClients', JSON.stringify(selectedGroup.clients))
      Cookies.set('selectedGroup', JSON.stringify(selectedGroup))
      Cookies.set('groupCode', selectedGroup.value)
      setChangedOption(!changedOption)
    }
  }, [selectedGroup])

  useEffect(() => {
    setSalesPageArray([])
    setCreditsPageArray([])
    setServicesPageArray([])
    if (selectedClient && selectedClient.label !== 'TODOS') {
      Cookies.set('cnpj', selectedClient.value)
      Cookies.set('clientCode', selectedClient.cod)
      setExportName(selectedClient.label)
    } else if (selectedClient) {
      Cookies.set('cnpj', selectedClient.value)
      Cookies.set('clientCode', 'todos')
      setExportName(selectedGroup ? `${selectedGroup.label} - Todas Filiais` : '')
    }
    setChangedOption(!changedOption)
  }, [selectedClient, selectedGroup])

  const handleGroupChange = (selected) => {
    setIsLoadedSalesDashboard(false)
    setIsLoadedCreditsDashboard(false)
    setIsLoadedServicesDashboard(false)
    setSelectedGroup(selected)

    // Cancel ongoing Axios requests
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel('Operation canceled due to new selection.')
    }
    cancelSourceRef.current = axios.CancelToken.source()

    // Reset selected client to the first option
    const options = getClientOptions(selected)
    setClientOptions(options)
    setSelectedClient(options[0])

    // Update cookies
    Cookies.set('selectedGroup', JSON.stringify(selected))
    Cookies.set('groupCode', selected.value)
    Cookies.set('clientOptions', JSON.stringify(options))
    Cookies.set('selectedClient', JSON.stringify(options[0]))
  }

  const handleClientChange = (selected) => {
    setIsLoadedSalesDashboard(false)
    setIsLoadedCreditsDashboard(false)
    setIsLoadedServicesDashboard(false)
    setSelectedClient(selected)
    Cookies.set('selectedClient', JSON.stringify(selected))

    // Cancel ongoing Axios requests
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel('Operation canceled due to new selection.')
    }
    cancelSourceRef.current = axios.CancelToken.source()
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
                //isDisabled={fetchingData}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="date-column-seletor">
            <div className="select-card-seletor">
              <span>Cliente</span>
              <Select
                styles={customStyles}
                options={clientOptions}
                placeholder="Selecione o Cliente / Filial"
                onChange={handleClientChange}
                value={selectedClient}
                //isDisabled={(!selectedGroup || fetchingData)}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SeletorCliente
