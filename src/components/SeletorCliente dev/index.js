/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'

import { AuthContext } from '../../contexts/auth'
import { ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'

import 'react-toastify/dist/ReactToastify.css'
import './Seletor.scss'
import { FiCalendar } from 'react-icons/fi'

const SeletorClienteDev = () => {
	const { 
		gruSelecionado,	setGruSelecionado,
		listaClientes, setListaClientes,
		grupos, setGrupos, loadGrupos,
		resetaSomatorios,
		alerta,
		isDarkTheme,
		cnpj, setCnpj,
		setInicializouAux,
		resetaDashboard,
		buscou, setBuscou,
		setGrupoSelecionado,
		setClienteSelecionado,
		trocarHeader, setTrocarHeader,
		textoExport, setTextoExport,
		
	} = useContext(AuthContext)

	const [grupoTeste, setGrupoTeste] = useState({ value: 'selecione', label: 'Selecione' })
	const [clienteTeste, setClienteTeste] = useState({ value: 'todos', label: 'TODOS' })

	const [cliSelecionado, setCliSelecionado] = useState('')
	const [codigoGrupo, setCodigoGrupo] = useState('')
	const [podeBuscar, setPodeBuscar] = useState(true)

	useEffect(()=>{
		setCnpj(sessionStorage.getItem('cnpj'))
		if(sessionStorage.getItem('grupos')){
			setGrupos(JSON.parse(sessionStorage.getItem('grupos')))
		} else {
			loadGrupos()
		}
		setPodeBuscar(Cookies.get('podeBuscar'))
		setTextoExport(Cookies.get('textoExport'))
	},[])

	useEffect(()=>{
		const grupoObj = grupos.find(item => item.CODIGOGRUPO === Number(grupoTeste.value))
		let cli = grupoObj ? grupoObj.CLIENTES : []
		setListaClientes(cli)
		setClientesFiltrados([])
		if(grupoTeste.label !== decodeURIComponent(Cookies.get('ultimoGrupoSelecionado'))){
			setClienteTeste({ value: 'todos', label: 'TODOS' })
		}
		setGruSelecionado(grupoTeste)
	},[grupoTeste])

	function handleCnpj(){
		if((cliSelecionado === '') || (cliSelecionado ==='selecione') || (cliSelecionado.value === '')){
			return
		}
		resetaDashboard()
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

	useEffect(()=>{
		handleCnpj()
	},[])

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

	const [podeSetarCliente, setPodeSetarCliente] = useState(false)
	const [grupoInicial, setGrupoInicial] = useState({})

	useEffect(()=>{
		// setar valor com a primeira opcao do vetor de grupos filtrado (gruposFiltrado)
		if(gruposFiltrado.length > 0){
			setGrupoTeste({value: gruposFiltrado[0].value, label: gruposFiltrado[0].label})
			setPodeSetarCliente(true)
		}
	},[gruposFiltrado])

	useEffect(()=>{
		if(grupoTeste){
			Cookies.set('codigoGrupo', grupoTeste.value)
			setGrupoInicial(grupoTeste)
		}
	},[grupoTeste])

	// clientes

	const [clientesFiltrados, setClientesFiltrados] = useState([])

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
			setClientesFiltrados(sortedOptions)
		} else {
			setClientesFiltrados([])
		}
	}, [listaClientes])

	useEffect(()=>{
		// setar valor com a primeira opcao do vetor de clientes filtrado (listaClientes)
		if((podeSetarCliente) && (gruposFiltrado.length > 0) && (clientesFiltrados.length > 0)){
			setClienteTeste({value: clientesFiltrados[0].value, label: clientesFiltrados[0].label})
		}
	},[podeSetarCliente])

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

		if(cliSelecionado.label !== 'TODOS'){
			setTextoExport(cliSelecionado.label)
		} else {
			setTextoExport(gruSelecionado.label + ' - todas filiais')
		}

	},[cliSelecionado, cnpj, codigoGrupo, gruSelecionado])

	useEffect(()=>{
		Cookies.set('podeBuscar', podeBuscar)
	},[podeBuscar])

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
		setGrupoSelecionado(grupoTeste.value)
		sessionStorage.setItem('codigoGrupo', grupoTeste.value)
		Cookies.set('codigoGrupo', grupoTeste.value)
		Cookies.set('nomeHeader', grupoTeste.label)
	},[grupoTeste])

	useEffect(()=>{
		setClienteSelecionado(clienteTeste.value)
		Cookies.set('filialHeader', clienteTeste.label)
		setCliSelecionado(clienteTeste)
	},[clienteTeste])

	const handleGrupoChange = selectedOption => {
		setGrupoTeste(selectedOption);
		// Save to cookies
		Cookies.set('grupoTeste', JSON.stringify(selectedOption));
	  };
	
	const handleClienteChange = selectedOption => {
		setClienteTeste(selectedOption)
		Cookies.set('clienteTeste', JSON.stringify(selectedOption))
		resetaDashboard()
		if(podeBuscar){
			resetaSomatorios()
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



	useEffect(()=>{
		setCnpj(clienteTeste.value)
		Cookies.set('cnpj', clienteTeste.value)
	},[clienteTeste])

	useEffect(()=>{
		setGrupoSelecionado(grupoTeste.value)
		
	},[grupoTeste])
	
	useEffect(()=>{
		if(Cookies.get('isCliente') === true){
			setGrupoTeste({})
			setClienteTeste({value: 'todos', label:'Total'})
		}
	},[])

	useEffect(()=>{
		if((!isNaN(grupoInicial.value)) && (grupoInicial.value !== 'selecione')){
			Cookies.set('grupo', grupoInicial.value)
			setBuscou(!buscou)
		}
	},[grupoInicial])

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
												options={clientesFiltrados}
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