/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'

import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'

import 'react-toastify/dist/ReactToastify.css'
import './Seletor.scss'

const SeletorClienteDev = () => {
	const { 
		isDarkTheme,

		// // // // // // // // // // // // // // // // // //

		changedOption, setChangedOption,

		setIsLoadedSalesDashboard, setIsLoadedCreditsDashboard, setIsLoadedServicesDashboard

		// // // // // // // // // // // // // // // // // //

	} = useContext(AuthContext)


	// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

	const [selectorGroupList, setSelectorGroupList] = useState(JSON.parse(sessionStorage.getItem('groupsStorage')))

	//array com as opções disponíveis
	const [groupOptions, setGroupOptions] = useState([])
	const [clientOptions, setClientOptions] = useState([])

	//objeto da Opção Selecionada:
	const [selectedGroup, setSelectedGroup] = useState({value: null, label: ''})
	const [selectedClient, setSelectedClient] = useState({value: 'todos', label: 'TODOS'})
	
	// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

	/// React Select

	// grupos

	// Inicializa a Lista de grupos dentro do componente ReactSelect,
	// Estruturado da forma correta, com o valor(código do grupo), 
	// label(nome do grupo) e clients(array com os clientes pertencentes
	// àquele grupo)

	const iniGroupsList = async () => {
		if (selectorGroupList && selectorGroupList.length > 0) {
			const sortedOptions = selectorGroupList
				.map((GRU) => ({
					value: GRU.CODIGOGRUPO,
					label: GRU.NOMEGRUPO,
					clients: GRU.CLIENTES
				}))
				.sort((a, b) => a.label.localeCompare(b.label)) // Sort options alphabetically by label
			setGroupOptions(sortedOptions)
			setSelectedGroup(sortedOptions[0])
			setSelectedClient({label: 'TODOS', value: 'todos'})
			Cookies.set('groupCode', sortedOptions[0].value)
			Cookies.set('cnpj', 'todos')
			
		} else {
			setGroupOptions([])
		}
	}

	useEffect(()=>{
		iniGroupsList()
	},[])

	useEffect(()=>{
		if(selectedGroup){
			const todosOption = { label: 'TODOS', value: 'todos' };
			const clients = selectedGroup.clients
			if (clients && clients.length > 0) {
				const sortedOptions = clients
					.map((CLI) => ({
						value: CLI.CNPJ,
						label: CLI.NOMECLIENTE,
					}))
					.sort((a, b) => a.label.localeCompare(b.label)); // Sort options alphabetically by label
				setClientOptions([todosOption, ...sortedOptions]);
				setSelectedClient(clientOptions[0]); // Update selected client
				Cookies.set('cnpj', sortedOptions[0].value);
				setChangedOption(!changedOption)
			} else {
				setClientOptions([]);
			}
		}
	}, [selectedGroup]);

	////////////////////////////////////////////////////
	//Funções dos Select:

	//Ao Selecionar Grupo:
	const handleGroupChange = (selected) => {
		setIsLoadedSalesDashboard(false)
		setIsLoadedCreditsDashboard(false)
		setIsLoadedServicesDashboard(false)
		setChangedOption(!changedOption)
		setSelectedGroup(selected)
	}

	//Ao Selecionar Cliente:
	const handleClientChange = (selected) => {
		setIsLoadedSalesDashboard(false)
		setIsLoadedCreditsDashboard(false)
		setIsLoadedServicesDashboard(false)
		setChangedOption(!changedOption)
		setSelectedClient(selected)
	}

	return(
		<>
			{ selectorGroupList === null ? <></> : 
				<>
					<div className='search-bar-seletor'>
						<form className={`date-container-seletor p-4 ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<div className='cli-container'>
								<div className='date-column-seletor'>
									<div className='select-card-seletor'>
										<span>Grupo</span>
										<Select
											className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
											options={groupOptions}
											onChange={handleGroupChange}
											value={selectedGroup}
										/>
									</div>
								</div>
                            
								<div className='date-column-seletor '>
									<div className='select-card-seletor'>
										<span>Cliente</span>
										{clientOptions && clientOptions.length > 0 ? (
											<Select
												className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
												options={clientOptions}
												placeholder="Selecione o Cliente / Filial"
												onChange={handleClientChange}
												value={selectedClient}
											/>
										) : (
											<Select
												className={`${isDarkTheme === true ? 'dark-theme-disabled' : 'light-theme-disabled'} select-disabled`}
												options={[]}
												isDisabled
												placeholder="Selecione o Cliente / Filial"
												value={selectedClient}
											/>
										)}
									</div>
								</div>
							</div>
						</form>
					</div>
				</>
			}
		</>
	)
}

export default SeletorClienteDev