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
	const [arrayDados, setArrayDados] = useState([])
	const [clicouPesquisar, setClicouPesquisar] = useState(false)

	const {
		setCnpj,  
		setLoading,
		loadCreditos, 
		setCreditos,
		setTotaisGlobal,
		isDarkTheme,
		creditos,
		gerarDados,
		detalhes,
		setDetalhes,
		setTotaisGlobalCreditos,
		alerta,
		converteData,
	} = useContext(AuthContext)

	const {
		dataBusca,
		cnpjBusca,
		setCnpjBusca,
		setTotalDebito,
		setTotalCredito,
		setTotalVoucher,
		setTotalLiquido,
		setArrayAdm,
	} = useContext(CreditosContext)
    
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
		await gerarDados(creditos)
		setDetalhes(true)
	}

	async function buscar() {
		setLoading(true);
		await loadCreditos(cnpjBusca, converteData(dataBusca[0]), converteData(dataBusca[1]))
			.then(() => {
				if (dataBusca === '' || cnpjBusca === '') {
					return 0;
				} else {
					//adiciono .toLocaleDateString('pt-BR') às datas para que possamos comparar apenas o dia, mes e ano, sem levar em consideração a hora, minuto e segundos
					if(buscou !== true){
						if ((dataBusca[0].toLocaleDateString('pt-BR') === dataBusca[1].toLocaleDateString('pt-BR'))) {
							console.log('mostrou alerta créditos');
							alerta(`executou a busca do dia ${dataBusca[0].toLocaleDateString('pt-BR')}`);
							setBuscou(true);
						} else if (dataBusca[0].toLocaleDateString('pt-BR') !== dataBusca[1].toLocaleDateString('pt-BR')) {
							console.log('mostrou alerta créditos');
							alerta(`executou a busca do dia ${dataBusca[0].toLocaleDateString('pt-BR')} ao dia ${dataBusca[1].toLocaleDateString('pt-BR')}`);
							setBuscou(true);
						}
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
		if(((cnpjBusca === '' || cnpjBusca === 'Selecione' || cnpjBusca === undefined) && (Cookies.get('cnpj') !== '')) && (clicouPesquisar)){
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
		setTotalLiquido(0.00)
		setTotalCredito(0.00)
		setTotalDebito(0.00)
		setTotalVoucher(0.00)
		setArrayAdm()
		setClicouPesquisar(false)
		setTotaisGlobal({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
		setTotaisGlobalCreditos({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
	}

	return(
		<>
			<div className='search-bar'>
				<form className={`date-container-creditos ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>       
					<div className='submit-container select-align'>
						{ (detalhes) && (creditos.length > 0) ? <button className={`btn btn-secondary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={(e) => handleBusca(e)}>Pesquisar</button>}
					</div>      
				</form>
			</div>
		</>
	)
}

export default BuscarClienteCreditos