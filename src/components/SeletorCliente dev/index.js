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

		apiCNPJ, setApiCNPJ,
		apiGroupCode, setApiGroupCode,
		groupsList, clientsList,

		// // // // // // // // // // // // // // // // // //

	} = useContext(AuthContext)


	// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

	const [groupsSelect, setGroupsSelect] = useState([])
	const [clientsSelect, setClientsSelect] = useState([])

	const [selectedGroup, setSelectedGroup] = useState({value: null, label: ''})
	const [selectedClient, setSelectedClient] = useState({value: null, label: ''})
	
	// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

	/// React Select

	// grupos

	const iniGroupsList = async () => {
		console.log('groupsList -> ', groupsList)
		if (groupsList && groupsList.length > 0) {
			const sortedOptions = groupsList
				.map((GRU) => ({
					value: GRU.CODIGOGRUPO,
					label: GRU.NOMEGRUPO,
				}))
				.sort((a, b) => a.label.localeCompare(b.label)) // Sort options alphabetically by label
			setGroupsSelect(sortedOptions)
		} else {
			setGroupsSelect([])
		}
	}

	useEffect(()=>{
		// setar valor com a primeira opcao do vetor de grupos filtrado (gruposFiltrado)
		if(groupsSelect.length > 0){
			setSelectedGroup(groupsSelect[0])
		}
	},[groupsSelect])

	const iniClientsList = async () => {
		console.log('clientsList -> ', clientsList)
		if (clientsList && clientsList.length > 0) {
			const sortedOptions = clientsList
				.map((CLI) => ({
					value: CLI.CNPJ,
					label: CLI.NOMECLIENTE,
				}))
				.sort((a, b) => a.label.localeCompare(b.label)) // Sort options alphabetically by label
			let todos = {value: 'todos', label: 'TODOS'}
			sortedOptions.unshift(todos)
			setClientsSelect(sortedOptions)
		} else {
			setClientsSelect([])
		}
	}

	useEffect(()=>{
		// setar valor com a primeira opcao do vetor de grupos filtrado (gruposFiltrado)
		if(groupsSelect.length > 0){
			setSelectedClient(clientsSelect[0])
		}
	},[clientsSelect])


	useEffect(() => {
		async function initialize(){
			await iniGroupsList()
			await iniClientsList()
		}
		initialize()
	}, [])

	const handleGroupChange = (selected) => {
		setSelectedGroup(selected)
		setSelectedClient(clientsSelect[0])
		setApiGroupCode(selected.value)
		setApiCNPJ('todos')
		iniClientsList()
	}

	const handleClientChange = (selected) => {
		setSelectedClient(selected)
		setApiCNPJ(selected.value)
	}

	useEffect(()=>{
		console.log('apiCNPJ ---> ', apiCNPJ)
	},[apiCNPJ])

	useEffect(()=>{
		console.log('apiGroupCode ---> ', apiGroupCode)
	},[apiGroupCode])

	return(
		<>
			{ groupsList === null ? <></> : 
				<>
					<div className='search-bar-seletor'>
						<form className={`date-container-seletor p-4 ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<div className='cli-container'>
								<div className='date-column-seletor'>
									<div className='select-card-seletor'>
										<span>Grupo</span>
										<Select
											className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
											options={groupsSelect}
											onChange={handleGroupChange}
											value={selectedGroup}
										/>
									</div>
								</div>
                            
								<div className='date-column-seletor '>
									<div className='select-card-seletor'>
										<span>Cliente</span>
										{clientsSelect.length > 0 ? (
											<Select
												className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
												options={clientsSelect}
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
							<div className="select-btn-seletor">

							</div>
						</form>
					</div>
				</>
			}
		</>
	)
}

export default SeletorClienteDev