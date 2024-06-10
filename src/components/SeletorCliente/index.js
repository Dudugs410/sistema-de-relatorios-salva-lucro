/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
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

  const [groupOptions, setGroupOptions] = useState(() => {
    const storedGroupOptions = Cookies.get('groupOptions');
    return storedGroupOptions ? JSON.parse(storedGroupOptions) : [];
  });

  const [clientOptions, setClientOptions] = useState(() => {
    const storedClientOptions = Cookies.get('clientOptions');
    return storedClientOptions ? JSON.parse(storedClientOptions) : [{ label: 'TODOS', value: 'todos' }];
  });

  const [selectedGroup, setSelectedGroup] = useState(() => {
    const selected = Cookies.get('selectedGroup');
    if (selected) {
      try {
        const parsedSelected = JSON.parse(selected);
        Cookies.set('groupCode', parsedSelected.value);
        return parsedSelected;
      } catch (error) {
        console.error('Error parsing selectedGroup from cookies:', error);
        return null;
      }
    }
    return null;
  });

  const [selectedClient, setSelectedClient] = useState(() => {
    const cnpj = Cookies.get('cnpj');
    const clientName = Cookies.get('clientName');
    return cnpj && clientName ? { value: cnpj, label: clientName } : { value: 'todos', label: 'TODOS' };
  });

  useEffect(() => {
    const iniGroupsList = () => {
      if (selectorGroupList && selectorGroupList.length > 0) {
        const sortedOptions = selectorGroupList
          .map((GRU) => ({
            value: GRU.CODIGOGRUPO,
            label: GRU.NOMEGRUPO,
            clients: GRU.CLIENTES,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setGroupOptions(sortedOptions);
        Cookies.set('groupOptions', JSON.stringify(sortedOptions));
        sessionStorage.setItem('isSelected', 'true');
      } else {
        const storedGroupOptions = Cookies.get('groupOptions');
        if (storedGroupOptions) {
          setGroupOptions(JSON.parse(storedGroupOptions));
        }
      }
    };

    iniGroupsList();
  }, [selectorGroupList]);

  useEffect(() => {
    if (selectedGroup && groupOptions.length > 0) {
      const options = getClientOptions(selectedGroup);
      setClientOptions(options);
      Cookies.set('clientOptions', JSON.stringify(options));
      Cookies.set('groupName', selectedGroup.label);
      Cookies.set('groupClients', JSON.stringify(selectedGroup.clients));
      Cookies.set('selectedGroup', JSON.stringify(selectedGroup));
      setChangedOption(true);
    }
  }, [selectedGroup, groupOptions]);

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
    setChangedOption(true);
    setSelectedGroup(selected);
    Cookies.set('groupCode', selected.value);
    Cookies.set('selectedGroup', JSON.stringify(selected));
    const options = getClientOptions(selected);
    setClientOptions(options);
    setSelectedClient({ value: 'todos', label: 'TODOS' });
    Cookies.set('clientOptions', JSON.stringify(options));
  };

  const handleClientChange = (selected) => {
    setIsLoadedSalesDashboard(false);
    setIsLoadedCreditsDashboard(false);
    setIsLoadedServicesDashboard(false);
    setChangedOption(true);
    setSelectedClient(selected);
    Cookies.set('cnpj', selected.value);
    Cookies.set('clientCode', selected.cod);
    Cookies.set('clientName', selected.label);
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
