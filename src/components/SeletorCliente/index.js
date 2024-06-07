/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext } from 'react';
import Select from 'react-select';

import { AuthContext } from '../../contexts/auth';
import Cookies from 'js-cookie';

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
  const [clientOptions, setClientOptions] = useState(() => {
    const storedClientOptions = Cookies.get('clientOptions');
    return storedClientOptions ? JSON.parse(storedClientOptions) : [];
  });

  const [selectedGroup, setSelectedGroup] = useState(() => {
    const groupCode = Cookies.get('groupCode');
    const groupName = Cookies.get('groupName');
	const groupClients = Cookies.get('groupClients')
    return groupCode && groupName ? { value: groupCode, label: groupName, clients: groupClients } : null;
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
          .sort((a, b) => a.label.localeCompare(b.label)); // Sort options alphabetically by label
        setGroupOptions(sortedOptions);

        if (!selectedGroup) {
          const firstGroup = sortedOptions[0];
          setSelectedGroup(firstGroup);
          const clientOpts = getClientOptions(firstGroup);
          setClientOptions(clientOpts);
          setSelectedClient({ value: 'todos', label: 'TODOS' });
          Cookies.set('groupCode', firstGroup.value);
          Cookies.set('groupName', firstGroup.label);
		  Cookies.set('groupClients', firstGroup.clients)
          Cookies.set('cnpj', 'todos');
          Cookies.set('clientCode', '-');
          Cookies.set('clientOptions', JSON.stringify(clientOpts));
        } else {
          const savedGroup = sortedOptions.find((group) => group.value === selectedGroup.value);
          if (savedGroup) {
            const options = getClientOptions(savedGroup);
            setClientOptions(options);
            Cookies.set('clientOptions', JSON.stringify(options));
          }
        }
      } else {
        setGroupOptions([]);
      }
    };

    iniGroupsList();
  }, [selectorGroupList]);

  useEffect(() => {
    if (selectedGroup) {
      const options = getClientOptions(selectedGroup);
      setClientOptions(options);
      Cookies.set('clientOptions', JSON.stringify(options));
      setSelectedClient({ value: 'todos', label: 'TODOS' });
      Cookies.set('groupName', selectedGroup.label);
	  Cookies.set('groupClients', selectedGroup.clients);
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
      setExportName(selectedGroup ? selectedGroup.label + ' - Todas Filiais' : '');
    }
  }, [selectedClient]);

  const handleGroupChange = (selected) => {
    setIsLoadedSalesDashboard(false);
    setIsLoadedCreditsDashboard(false);
    setIsLoadedServicesDashboard(false);
    setChangedOption(true);
    setSelectedGroup(selected);
    Cookies.set('groupCode', selected.value);
    Cookies.set('groupName', selected.label);
	Cookies.set('groupClients', selected.clients);
    const options = getClientOptions(selected);
    setClientOptions(options);
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
        .sort((a, b) => a.label.localeCompare(b.label)); // Sort options alphabetically by label
      return [todosOption, ...sortedClientOptions];
    }
    return [todosOption];
  };

  return (
    <>
      {selectorGroupList === null ? (
        <></>
      ) : (
        <>
          <div className='search-bar-seletor'>
            <form className='date-container-seletor p-4'>
              <div className='cli-container'>
                <div className='date-column-seletor'>
                  <div className='select-card-seletor'>
                    <span>Grupo</span>
                    <Select
                      options={groupOptions}
                      onChange={handleGroupChange}
                      value={selectedGroup}
                    />
                  </div>
                </div>

                <div className='date-column-seletor '>
                  <div className='select-card-seletor'>
                    <span>Cliente</span>
                    <Select
                      options={clientOptions}
                      placeholder='Selecione o Cliente / Filial'
                      onChange={handleClientChange}
                      value={selectedClient}
                      isDisabled={!selectedGroup}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default SeletorCliente;
