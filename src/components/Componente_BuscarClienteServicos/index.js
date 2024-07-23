/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useRef } from 'react'

import './buscarServicos.scss'
import { AuthContext } from '../../contexts/auth'

import '../../styles/global.scss'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './reactdatepicker.css'
import Cookies from 'js-cookie'

const BuscarClienteServicos = () => {
	const [buscou, setBuscou] = useState(false)
	const [clicouPesquisar, setClicouPesquisar] = useState(false)

	const {  
		setLoading,
		loadAjustes,
		setTotaisGlobal,
		setAjustes,
		ajustes,
		setDetalhes,
		alerta,
		dataBuscaServicos, 
		cnpjBuscaServicos,
	} = useContext(AuthContext)
    
	async function handleBusca(e){
		toast.dismiss()
		toast.promise(buscar, {
			pending: 'Carregando...',
			error: 'Ocorreu um Erro',
		})
		e.preventDefault()
		setClicouPesquisar(true)
		setDetalhes(true)
	}
	
	async function buscar() {
		await loadAjustes(cnpjBuscaServicos, dataBuscaServicos[0], dataBuscaServicos[1])
		.then(() => {
			if (dataBuscaServicos === '' || cnpjBuscaServicos === '') {
				return 0
			} else {
				//adiciono .toLocaleDateString('pt-BR') às datas para que possamos comparar apenas o dia, mes e ano, sem levar em consideração a hora, minuto e segundos
				if(buscou !== true){
					toast.dismiss()
					toast.success(dataBuscaServicos[0].toLocaleDateString('pt-BR') === dataBuscaServicos[1].toLocaleDateString('pt-BR') ? `executou a busca do dia ${dataBuscaServicos[0].toLocaleDateString('pt-BR')}` : `executou a busca do dia ${dataBuscaServicos[0].toLocaleDateString('pt-BR')} ao dia ${dataBuscaServicos[1].toLocaleDateString('pt-BR')}`)
					setBuscou(true)
				}

				if (ajustes.length === 0) {
					setDetalhes(false)
					setClicouPesquisar(false)
				}
			}
		})
	setLoading(false)
	}

	useEffect(()=>{
		if(((cnpjBuscaServicos === '' || cnpjBuscaServicos === 'Selecione' || cnpjBuscaServicos === undefined) && (Cookies.get('cnpj') !== '')) && (clicouPesquisar)){
			alerta('selecione um cliente válido')
			return
		}
		if(buscou === true){
			if((ajustes === null) || (ajustes.length === 0)){
				toast.dismiss()
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
				<form className='date-container-vendas'>       
					<div className='submit-container select-align select-align-filtro voltar-align'>
						{ ajustes.length > 0 ? <button className='btn btn-secondary btn-global btn-pesquisar' onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className='btn btn-primary btn-global btn-pesquisar' onClick={(e) => handleBusca(e)}>Pesquisar</button>}
					</div>      
				</form>
			</div>
		</>
	)
}

export default BuscarClienteServicos