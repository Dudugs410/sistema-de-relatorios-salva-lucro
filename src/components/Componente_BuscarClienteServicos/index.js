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
		dataBuscaServicos, setDataBuscaServicos, 
		cnpjBuscaServicos, setCnpjBuscaServicos,
		dataInicialExibicaoServicos, setDataInicialExibicaoServicos,
		dataFinalExibicaoServicos, setDataFinalExibicaoServicos,
		arrayRelatorioServicos, setArrayRelatorioServicos,
		arrayAdmServicos, setArrayAdmServicos,
		ajustesTempServicos, setAjustesTempServicos,
		dataInicialServicos, setDataInicialServicos,
		dataFinalServicos,  setDataFinalServicos,
		loadServicosPage, handleDateChangeServicos,
	} = useContext(AuthContext)
    
	/*useEffect(()=>{
		setCnpj(Cookies.get('cnpj'))
		setCnpjBusca(Cookies.get('cnpj'))
	},[])*/
    
	async function handleBusca(e){
		toast.promise(buscar, {
			pending: 'Carregando...',
			error: 'Ocorreu um Erro',
		})
		e.preventDefault()
		setClicouPesquisar(true)
		await gerarDados(ajustes)
		setDetalhes(true)
	}
	
	async function buscar() {
		await loadAjustes(cnpjBuscaServicos, dataBuscaServicos[0], dataBuscaServicos[1])
		.then(() => {
			if (dataBuscaServicos === '' || cnpjBuscaServicos === '') {
				return 0;
			} else {
				//adiciono .toLocaleDateString('pt-BR') às datas para que possamos comparar apenas o dia, mes e ano, sem levar em consideração a hora, minuto e segundos
				if(buscou !== true){
					toast.success(dataBuscaServicos[0].toLocaleDateString('pt-BR') === dataBuscaServicos[1].toLocaleDateString('pt-BR') ? `executou a busca do dia ${dataBuscaServicos[0].toLocaleDateString('pt-BR')}` : `executou a busca do dia ${dataBuscaServicos[0].toLocaleDateString('pt-BR')} ao dia ${dataBuscaServicos[1].toLocaleDateString('pt-BR')}`)
					setBuscou(true);	
				}

				if (ajustes.length === 0) {
					setDetalhes(false);
					setClicouPesquisar(false);
				}
			}
		});
	setLoading(false);
	}

	useEffect(()=>{
		if(((cnpjBuscaServicos === '' || cnpjBuscaServicos === 'Selecione' || cnpjBuscaServicos === undefined) && (Cookies.get('cnpj') !== '')) && (clicouPesquisar)){
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
						{ ajustes.length > 0 ? <button className={`btn btn-secondary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={(e) => handleBusca(e)}>Pesquisar</button>}
					</div>      
				</form>
			</div>
		</>
	)
}

export default BuscarClienteServicos