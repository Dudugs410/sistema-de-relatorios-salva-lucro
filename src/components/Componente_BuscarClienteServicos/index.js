/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useRef } from 'react'

import './buscarServicos.scss'
import { AuthContext } from '../../contexts/auth'
import { ServicosContext } from '../../pages/Servicos'

import '../../styles/global.scss'

import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './reactdatepicker.css'
import Cookies from 'js-cookie'

const BuscarClienteServicos = () => {
	const [buscou, setBuscou] = useState(false)
	const [arrayDados, setArrayDados] = useState([])
	const [clicouPesquisar, setClicouPesquisar] = useState(false)

	const { 
		setCnpj,  
		setLoading,
		loadAjustes,
		setTotaisGlobal,
		isDarkTheme,
		setAjustes,
		ajustes,
		detalhes,
		setDetalhes,
		gerarDados,
		alerta,
	} = useContext(AuthContext)

	const {
		dataBusca,		 
		cnpjBusca,
		setCnpjBusca,
	} = useContext(ServicosContext)
    
	useEffect(()=>{
		setCnpj(Cookies.get('cnpj'))
		setCnpjBusca(Cookies.get('cnpj'))
	},[])
    
	async function handleBusca(e){
		toast.promise(buscar, {
			pending: 'Carregando...',
			success: 'Carregado com Sucesso',
			error: 'Ocorreu um Erro',
		})
		e.preventDefault()
		setClicouPesquisar(true)
		await gerarDados(ajustes)
		setDetalhes(true)
	}
	
	async function buscar() {
		console.log('Parametros da busca: ', cnpjBusca, dataBusca[0], dataBusca[1])
		await loadAjustes(cnpjBusca, dataBusca[0], dataBusca[1])
			.then(() =>{
				if(dataBusca === '' || cnpjBusca === ''){
					return 0
				} else {
					//adiciono .toLocaleDateString('pt-BR') às datas para que possamos comparar apenas o dia, mes e ano, sem levar em consideração a hora, minuto e segundos
					if(buscou !== true){
						if((dataBusca[0].toLocaleDateString('pt-BR') === dataBusca[1].toLocaleDateString('pt-BR'))){
							console.log('mostrou alerta servicos')
							alerta(`executou a busca do dia ${dataBusca[0].toLocaleDateString('pt-BR')}`)
							setBuscou(true)
							
						} else if (dataBusca[0].toLocaleDateString('pt-BR') !== dataBusca[1].toLocaleDateString('pt-BR')){
							console.log('mostrou alerta servicos')
							alerta(`executou a busca do dia ${dataBusca[0].toLocaleDateString('pt-BR')} ao dia ${dataBusca[1].toLocaleDateString('pt-BR')}`)
							setBuscou(true)
						}
					}

					if(ajustes.length === 0){
						setDetalhes(false)
						setClicouPesquisar(false)
						
					}
				}    
			})
	}

	useEffect(()=>{
		if(((cnpjBusca === '' || cnpjBusca === 'Selecione' || cnpjBusca === undefined) && (Cookies.get('cnpj') !== '')) && (clicouPesquisar)){
			alerta('selecione um cliente válido')
			return
		}
		if(buscou === true){
			if((ajustes === null) || (ajustes.length === 0)){
				toast.error('não existem ajustes para a data selecionada')
				setBuscou(false)
				setDetalhes(false)
			}
			else{
				setDetalhes(true)
				setBuscou(false)
				setClicouPesquisar(false)
			}
		}
	},[buscou])

	function handleVoltar(e){
		e.preventDefault()
		setAjustes([])
		setDetalhes(false)
		setBuscou(false)
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		// setArrayAdm()
		setClicouPesquisar(false)
	}

	return(
		<>
			<div className='search-bar'>
				<form className={`date-container-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>       
					<div className='submit-container select-align select-align-filtro'>
						{ (detalhes) && (ajustes.length > 0) ? <button className={`btn btn-secondary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={(e) => handleBusca(e)}>Pesquisar</button>}
					</div>      
				</form>
			</div>
		</>
	)
}

export default BuscarClienteServicos