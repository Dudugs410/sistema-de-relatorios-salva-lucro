/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'

import { AuthContext } from '../../contexts/auth'
import { ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'

import 'react-toastify/dist/ReactToastify.css'
import './Seletor.scss'

const SeletorClienteDev = () => {
	const { 
		gruSelecionado, 
		setGruSelecionado,
		listaClientes,
		setListaClientes,
		setGrupos,
		resetaSomatorios,
		alerta,
		isDarkTheme,
		grupos,
		cnpj,
		setCnpj,
		setInicializouAux,
		resetaDashboard,
		buscou,
		setBuscou,
		setGrupoSelecionado,
		setClienteSelecionado,
		trocarHeader,
		setTrocarHeader,
		textoExport,
		setTextoExport,
		setDetalhes,
	} = useContext(AuthContext)

	const [grupoTeste, setGrupoTeste] = useState({ value: 'selecione', label: 'Selecione' })
	const [clienteTeste, setClienteTeste] = useState({ value: 'selecione', label: 'Selecione' })

	const [cliSelecionado, setCliSelecionado] = useState('')
	const [selectedCliLabel, setSelectedCliLabel] = useState('Selecione')
	const [codigoGrupo, setCodigoGrupo] = useState('')
	const [podeBuscar, setPodeBuscar] = useState(true)

	useEffect(()=>{
		setCnpj(sessionStorage.getItem('cnpj'))
		setGrupos(JSON.parse(sessionStorage.getItem('grupos')))
		setPodeBuscar(Cookies.get('podeBuscar'))
		console.log(Cookies.get('textoExport'))
		setTextoExport(Cookies.get('textoExport'))
	},[])

	useEffect(()=>{
		console.log('cnpj: ', cnpj)
		if((cnpj !== '') || (cnpj === 'nenhum')){
			Cookies.set('cnpj', cnpj)
		}
	},[cnpj])

	useEffect(() => {
		if(Cookies.get('grupoTeste')){
			const savedGrupo = JSON.parse(Cookies.get('grupoTeste'));
			if (savedGrupo) {
				setGrupoTeste({ value: savedGrupo.value, label: savedGrupo.label });
			  }
		}
		
		if(Cookies.get('clienteTeste')){
			const savedCliente = JSON.parse(Cookies.get('clienteTeste'));
			if (savedCliente) {
			  setClienteTeste({ value: savedCliente.value, label: savedCliente.label });
			}
		}
	}, []);

	useEffect(()=>{
		const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(grupoTeste.value))
		let cli = grupoObj ? grupoObj.CLIENTES : []
		setListaClientes(cli)
		setListaCli([])
		console.log(grupoTeste.label, decodeURIComponent(Cookies.get('ultimoGrupoSelecionado')))
		if(grupoTeste.label !== decodeURIComponent(Cookies.get('ultimoGrupoSelecionado'))){
			setClienteTeste({ value: 'selecione', label: 'Selecione' })
		} else {
			const savedCliente = JSON.parse(Cookies.get('clienteTeste'))
			setClienteTeste({ value: savedCliente.value, label: savedCliente.label })
		}
		setSelectedCliLabel('Selecione')
		setCnpj('nenhum')
		setDetalhes(false)
	},[grupoTeste])

	function handleCnpj(e){
		e.preventDefault()
		if((cliSelecionado === '') || (cliSelecionado ==='selecione') || (cliSelecionado.value === '')){
			alerta('Selecione um cliente válido')
			return
		}
		resetaDashboard()
		//console.log(cliSelecionado.value)
		if(podeBuscar){
			resetaSomatorios()
			setCnpj(cliSelecionado.value)
			setInicializouAux(false)
			sessionStorage.setItem('inicializou', false)
			sessionStorage.setItem('codigoGrupo', gruSelecionado)
			Cookies.set('cnpj', cliSelecionado.value)
			setCodigoGrupo(gruSelecionado.value)
			setBuscou(true)
			setTrocarHeader(!trocarHeader)
		}   
	}

	useEffect(()=>{
		if(podeBuscar){
			Cookies.set('buscou', false)
		} else {
			Cookies.set('buscou', true)
		}
	},[buscou])

	/// React Select

	// grupos

	const listaGrupos = grupos.map((GRU) => ({
		value: GRU.CODIGOGRUPO,
		label: GRU.NOMEGRUPO,
	}))

	const [gruposFiltrado, setGruposFiltrado] = useState([])

	useEffect(() => {
		if (grupos && grupos.length > 0) {
			const sortedOptions = grupos
				.map((GRU) => ({
					value: GRU.CODIGOGRUPO,
					label: GRU.NOMEGRUPO,
				}))
				.sort((a, b) => a.label.localeCompare(b.label)) // Sort options alphabetically by label
			setGruposFiltrado(sortedOptions)
		} else {
			setGruposFiltrado([])
		}
	}, [grupos])
    
	const handleSelectChangeGrupo = (selected) => {

		// Set value in sessionStorage
		sessionStorage.setItem('codigoGrupo', selected.value)
    
		// Set value in Cookies
		Cookies.set('codigoGrupo', selected.value)
    
		// Update state with selected value
		setGruSelecionado(selected)
		//Cookies.set('gruSelecionado', JSON.stringify(gruSelecionado))
        
		// Additional code if needed
		setCliSelecionado('')
	}

	const handleSelectChangeCLI = (selected) => {
		setCliSelecionado(selected) // Set cliSelecionado to selected value (CNPJ)
	}

	// clientes

	const [listaCli, setListaCli] = useState([])

	useEffect(() => {
		if (listaClientes && listaClientes.length > 0) {
			const sortedOptions = listaClientes
				.map((CLI) => ({
					value: CLI.CNPJ,
					label: CLI.NOMECLIENTE,
				}))
				.sort((a, b) => a.label.localeCompare(b.label)) // Sort options alphabetically by label
			let todos = {value: 'todos', label: 'TODOS'}
			sortedOptions.unshift(todos)
			setListaCli(sortedOptions)
		} else {
			setListaCli([])
		}
	}, [listaClientes])

	useEffect(()=>{
		if((cliSelecionado.value === cnpj) && (gruSelecionado.value === codigoGrupo)){
			setPodeBuscar(false)
			setBuscou(true)
		} else {
			setPodeBuscar(true)
			setBuscou(false)
		}
		setGrupoSelecionado(gruSelecionado)
		setClienteSelecionado(cliSelecionado)
	},[cliSelecionado, cnpj, codigoGrupo, gruSelecionado])

	useEffect(()=>{
		Cookies.set('podeBuscar', podeBuscar)
	},[podeBuscar])

	useEffect(()=>{
		console.log('grupo selecionado: ', grupoTeste)
		setGrupoSelecionado(grupoTeste.value)
		sessionStorage.setItem('codigoGrupo', grupoTeste.value)
		Cookies.set('codigoGrupo', grupoTeste.value)
		Cookies.set('nomeHeader', grupoTeste.label)
	},[grupoTeste])

	useEffect(()=>{
		console.log('cliente selecionado: ', clienteTeste)
		setClienteSelecionado(clienteTeste.value)
		Cookies.set('filialHeader', clienteTeste.label)
	},[clienteTeste])

	const handleGrupoChange = selectedOption => {
		setGrupoTeste(selectedOption);
		// Save to cookies
		Cookies.set('grupoTeste', JSON.stringify(selectedOption));
		setClienteSelecionado('nenhum')
		setCnpj('nenhum')
	  };
	
	const handleClienteChange = selectedOption => {
		console.log(podeBuscar)
		setClienteTeste(selectedOption)
		Cookies.set('ultimoGrupoSelecionado', grupoTeste.label)
		// Save to cookies
		Cookies.set('clienteTeste', JSON.stringify(selectedOption))
		resetaDashboard()
		if(podeBuscar){
			resetaSomatorios()
			console.log('prestes a setar o cnpj...')
			setCnpj(selectedOption.value)
			setInicializouAux(false)
			sessionStorage.setItem('inicializou', false)
			sessionStorage.setItem('codigoGrupo', grupoTeste.value)
			Cookies.set('cnpj', selectedOption.value)
			setCodigoGrupo(grupoTeste.value)
			setBuscou(true)
			setTrocarHeader(!trocarHeader)
		}

		if(selectedOption.label === 'TODOS'){
			setTextoExport(grupoTeste.label + ' - todas filiais')
		} else {
			setTextoExport(selectedOption.label)

		}
	}

	useEffect(()=>{
		setTextoExport(Cookies.get('textoExport'))
	},[])

	useEffect(()=>{
		if(textoExport !== undefined){
			Cookies.set('textoExport', textoExport)
		}
	},[textoExport])
	
	return(
		<>
			{ grupos === null ? <></> : 
				<>
					<ToastContainer
						position="top-center"
						autoClose={5000}
						hideProgressBar
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="light"
					/>
					<div className='search-bar-seletor'>
						<form className={`date-container-seletor p-4 ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<div className='cli-container'>
								<div className='date-column-seletor'>
									<div className='select-card-seletor'>
										<span>Grupo</span>
										<Select
											className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
											options={gruposFiltrado}
											onChange={handleGrupoChange}
											value={grupoTeste}
										/>
									</div>
								</div>
                            
								<div className='date-column-seletor '>
									<div className='select-card-seletor'>
										<span>Cliente</span>
										{listaClientes.length > 0 ? (
											<Select
												className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
												options={listaCli}
												onChange={handleClienteChange}
												value={clienteTeste}
											/>
										) : (
											<Select
												className={`${isDarkTheme === true ? 'dark-theme-disabled' : 'light-theme-disabled'} select-disabled`}
												options={[]}
												isDisabled
												placeholder="Selecione o Cliente / Filial"
												key={gruSelecionado ? gruSelecionado.value : 'default'}
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