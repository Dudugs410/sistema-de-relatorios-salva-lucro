/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useRef } from 'react'

import './buscarCreditos.scss'
import { AuthContext } from '../../contexts/auth'
import { CreditosContext } from '../../pages/Creditos'

import '../../styles/global.scss'

import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './reactdatepicker.css'
import Cookies from 'js-cookie'

const BuscarClienteCreditos = () => {
	const [buscou, setBuscou] = useState(false)
	const [clicouPesquisar, setClicouPesquisar] = useState(false)

	const {
		setLoading,
		loadCreditos, 
		setCreditos,
		setTotaisGlobal,
		isDarkTheme,
		creditos,
		gerarDados,
		setDetalhes,
		setTotaisGlobalCreditos,
		alerta,
		converteData,
		setTotalCreditoCreditos,
		setTotalDebitoCreditos,
		setTotalVoucherCreditos,
		setTotalLiquidoCreditos,
		setArrayAdmCreditos,
		dataBuscaCreditos,
		cnpjBuscaCreditos,
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
		await gerarDados(creditos)
		setDetalhes(true)
	}

	async function buscar() {
		setLoading(true);
		await loadCreditos(cnpjBuscaCreditos, converteData(dataBuscaCreditos[0]), converteData(dataBuscaCreditos[1]))
			.then(() => {
				if (dataBuscaCreditos === '' || cnpjBuscaCreditos === '') {
					return 0;
				} else {
					//adiciono .toLocaleDateString('pt-BR') às datas para que possamos comparar apenas o dia, mes e ano, sem levar em consideração a hora, minuto e segundos
					if(buscou !== true){
						toast.success(dataBuscaCreditos[0].toLocaleDateString('pt-BR') === dataBuscaCreditos[1].toLocaleDateString('pt-BR') ? `executou a busca do dia ${dataBuscaCreditos[0].toLocaleDateString('pt-BR')}` : `executou a busca do dia ${dataBuscaCreditos[0].toLocaleDateString('pt-BR')} ao dia ${dataBuscaCreditos[1].toLocaleDateString('pt-BR')}`)
						setBuscou(true);	
					}

					if (creditos.length === 0) {
						setDetalhes(false);
						setClicouPesquisar(false);
					}
				}
			});
		setLoading(false);
	}

	useEffect(()=>{
		if(((cnpjBuscaCreditos === '' || cnpjBuscaCreditos === 'Selecione' || cnpjBuscaCreditos === undefined) && (Cookies.get('cnpj') !== '')) && (clicouPesquisar)){
			console.log('alerta useEffect')
			alerta('selecione um cliente válido')
			return
		}
		if(buscou === true){
			if((creditos === null) || (creditos.length === 0)){
				console.log('alerta useEffect 2')
				toast.error('não existem creditos para a data selecionada')
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
		setCreditos([])
		setDetalhes(false)
		setBuscou(false)
		setTotalLiquidoCreditos(0.00)
		setTotalCreditoCreditos(0.00)
		setTotalDebitoCreditos(0.00)
		setTotalVoucherCreditos(0.00)
		setArrayAdmCreditos()
		setClicouPesquisar(false)
		setTotaisGlobal({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
		setTotaisGlobalCreditos({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
	}

	return(
		<>
			<div className='search-bar'>
				<form className={`date-container-creditos ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>       
					<div className='submit-container select-align'>
						{ creditos.length > 0 ? <button className={`btn btn-secondary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={(e) => handleBusca(e)}>Pesquisar</button>}
					</div>      
				</form>
			</div>
		</>
	)
}

export default BuscarClienteCreditos