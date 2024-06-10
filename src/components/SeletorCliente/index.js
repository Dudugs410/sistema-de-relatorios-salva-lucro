import { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import Cookies from 'js-cookie';

import { AuthContext } from '../../contexts/auth';

import 'react-toastify/dist/ReactToastify.css';
import './Seletor.scss';

const SeletorCliente = () => {
  const {
    setChangedOption,
    setIsLoadedSalesDashboard,
    setIsLoadedCreditsDashboard,
    setIsLoadedServicesDashboard,
    setExportName,
    setSalesPageArray,
    setCreditsPageArray,
    setServicesPageArray,
  } = useContext(AuthContext);

  const [selectorGroupList, setSelectorGroupList] = useState(
    JSON.parse(sessionStorage.getItem('groupsStorage'))
  );

  const [groupOptions, setGroupOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (selectorGroupList) {
      const sortedOptions = selectorGroupList
        .map((GRU) => ({
          value: GRU.CODIGOGRUPO,
          label: GRU.NOMEGRUPO,
          clients: GRU.CLIENTES,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setGroupOptions(sortedOptions);

      const isFirstLoad = sessionStorage.getItem('isSelected') !== 'true';
      if (isFirstLoad) {
        if (sortedOptions.length > 0) {
          const initialGroup = sortedOptions[0];
          const initialClientOptions = getClientOptions(initialGroup);
          
          setSelectedGroup(initialGroup);
          setClientOptions(initialClientOptions);
          setSelectedClient(initialClientOptions[0]);
          
          Cookies.set('selectedGroup', JSON.stringify(initialGroup));
          Cookies.set('clientOptions', JSON.stringify(initialClientOptions));
          Cookies.set('selectedClient', JSON.stringify(initialClientOptions[0]));
          sessionStorage.setItem('isSelected', 'true');
        }
      } else {
        const savedGroup = Cookies.get('selectedGroup');
        const savedClientOptions = Cookies.get('clientOptions');
        const savedClient = Cookies.get('selectedClient');
        
        if (savedGroup) setSelectedGroup(JSON.parse(savedGroup));
        if (savedClientOptions) setClientOptions(JSON.parse(savedClientOptions));
        if (savedClient) setSelectedClient(JSON.parse(savedClient));
      }
    }
  }, [selectorGroupList]);

  useEffect(() => {
    setIsLoadedCreditsDashboard(false)
    setIsLoadedSalesDashboard(false)
    setIsLoadedServicesDashboard(false)
    if (selectedGroup) {
      const options = getClientOptions(selectedGroup);
      setClientOptions(options);

      if (!Cookies.get('selectedClient')) {
        setSelectedClient(options[0]);
        Cookies.set('selectedClient', JSON.stringify(options[0]));
      }
      
      Cookies.set('clientOptions', JSON.stringify(options));
      Cookies.set('groupName', selectedGroup.label);
      Cookies.set('groupClients', JSON.stringify(selectedGroup.clients));
      Cookies.set('selectedGroup', JSON.stringify(selectedGroup));
      Cookies.set('groupCode', JSON.stringify(selectedGroup.value))
      setChangedOption(true);
    }
  }, [selectedGroup]);

  useEffect(() => {
    setSalesPageArray([]);
    setCreditsPageArray([]);
    setServicesPageArray([]);

    if (selectedClient && selectedClient.label !== 'TODOS') {
      Cookies.set('cnpj', selectedClient.value);
      Cookies.set('clientCode', selectedClient.cod);
      setExportName(selectedClient.label);
    } else if (selectedClient) {
      Cookies.set('cnpj', selectedClient.value);
      Cookies.set('clientCode', 'todos');
      setExportName(selectedGroup ? `${selectedGroup.label} - Todas Filiais` : '');
    }
  }, [selectedClient, selectedGroup]);

  const handleGroupChange = (selected) => {
    setIsLoadedSalesDashboard(false);
    setIsLoadedCreditsDashboard(false);
    setIsLoadedServicesDashboard(false);
    setSelectedGroup(selected);
  };

  const handleClientChange = (selected) => {
    setIsLoadedSalesDashboard(false);
    setIsLoadedCreditsDashboard(false);
    setIsLoadedServicesDashboard(false);
    setSelectedClient(selected);
    Cookies.set('selectedClient', JSON.stringify(selected));
  };

  const getClientOptions = (group) => {
    const todosOption = { label: 'TODOS', value: 'todos' };
    const foundGroup = groupOptions.find((option) => option.value === group.value);
    if (foundGroup) {
      const sortedClientOptions = foundGroup.clients
        .map((CLI) => ({
          value: CLI.CNPJ,
          label: CLI.NOMECLIENTE,
          cod: CLI.CODIGOCLIENTE,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      return [todosOption, ...sortedClientOptions];
    }
    return [todosOption];
  };

  return (
    <div className="search-bar-seletor">
      <form className="date-container-seletor p-4">
        <div className="cli-container">
          <div className="date-column-seletor">
            <div className="select-card-seletor">
              <span>Grupo</span>
              <Select
                options={groupOptions}
                onChange={handleGroupChange}
                value={selectedGroup}
              />
            </div>
          </div>
          <div className="date-column-seletor">
            <div className="select-card-seletor">
              <span>Cliente</span>
              <Select
                options={clientOptions}
                placeholder="Selecione o Cliente / Filial"
                onChange={handleClientChange}
                value={selectedClient}
                isDisabled={!selectedGroup}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeletorCliente;
