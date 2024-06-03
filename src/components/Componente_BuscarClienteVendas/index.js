/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useRef } from 'react'

import './buscarVendas.scss'
import { AuthContext } from '../../contexts/auth'
import { VendasContext } from '../../pages/Vendas'

import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../styles/global.scss'
import './reactdatepicker.css'
import Cookies from 'js-cookie'
import { useCallback } from 'react'
                                                                                                                                       
const BuscarClienteVendas = () => {
	const [buscou, setBuscou] = useState(false)
	const [arrayDados, setArrayDados] = useState([])
	const [clicouPesquisar, setClicouPesquisar] = useState(false)

	const {
		setCnpj,
		setLoading,
		loadVendas,
		setTotaisGlobal,
		isDarkTheme,
		vendas,
		detalhes,
		setDetalhes,
		setTotaisGlobalVendas,
		alerta,
		setVendas,
		dataBuscaVendas,
		cnpjBuscaVendas,
		setCnpjBuscaVendas,
		setTotalDebitoVendas,
		setTotalCreditoVendas,
		setTotalVoucherVendas,
		setTotalLiquidoVendas,
		setArrayAdmVendas,

	} = useContext(AuthContext)
    
	/*useEffect(()=>{
		setCnpj(Cookies.get('cnpj'))
		setCnpjBusca(Cookies.get('cnpj'))
	},[])*/

	async function handleBusca(e) {

		e.preventDefault()
		toast.promise(buscar, {
			pending: 'Carregando...',
			success: 'Carregado com Sucesso',
			error: 'Ocorreu um Erro',
		})
		setClicouPesquisar(true)
		setDetalhes(true)
	}

	useEffect(()=>{
		if(vendas.length === 0){
			setDetalhes(false)
		}
	},[detalhes])

	async function buscar() {
		console.log('função buscar')
		if(cnpjBuscaVendas === '' || cnpjBuscaVendas === 'Selecione' || cnpjBuscaVendas === undefined){
			return
		}
		await loadVendas(dataBuscaVendas[0].toLocaleDateString('pt-BR'), dataBuscaVendas[1].toLocaleDateString('pt-BR'), cnpjBuscaVendas)
			.then(() =>{
				
				//adiciono .toLocaleDateString('pt-BR') às datas para que possamos comparar apenas o dia, mes e ano, sem levar em consideração a hora, minuto e segundos
				if(buscou !== true){
					if(dataBuscaVendas[0].toLocaleDateString('pt-BR') === dataBuscaVendas[1].toLocaleDateString('pt-BR')){
						console.log('mostrou alerta vendas')
						alerta(`executou a busca do dia ${dataBuscaVendas[0].toLocaleDateString('pt-BR')}`);
						setBuscou(true)
					} else if (dataBuscaVendas[0].toLocaleDateString('pt-BR') !== dataBuscaVendas[1].toLocaleDateString('pt-BR')){
						console.log('mostrou alerta vendas')
						alerta(`executou a busca do dia ${dataBuscaVendas[0].toLocaleDateString('pt-BR')} ao dia ${dataBuscaVendas[1].toLocaleDateString('pt-BR')}`);
						setBuscou(true)
					}
				}   
			})
			
		setLoading(false)
	}

	useEffect(()=>{
		if(((cnpjBuscaVendas === '' || cnpjBuscaVendas === 'Selecione' || cnpjBuscaVendas === undefined) && (Cookies.get('cnpj') !== '')) && (clicouPesquisar)){
			alerta('selecione um cliente válido')
			return
		}
		if(buscou === true){
			if((vendas === null) || (vendas.length === 0)){
				toast.error('não existem vendas para a data selecionada')
				setBuscou(false)
				setDetalhes(false)
				setClicouPesquisar(false)
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
		setDetalhes(false)
		setBuscou(false)
		setTotalLiquidoVendas(0.00)
		setTotalCreditoVendas(0.00)
		setTotalDebitoVendas(0.00)
		setTotalVoucherVendas(0.00)
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalVendas({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
		setArrayAdmVendas()
		setClicouPesquisar(false)
		setVendas([])
	}

	return(
		<>
			<div className='search-bar'>
				<form className='date-container-vendas'>       
					<div className='submit-container select-align'>
						{ vendas.length > 0 ? <button className='btn btn-secondary btn-global btn-pesquisar' onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className='btn btn-primary btn-global btn-pesquisar' onClick={handleBusca}>Pesquisar</button>}
					</div>
				</form>
			</div>
		</>
	)
}

export default BuscarClienteVendas