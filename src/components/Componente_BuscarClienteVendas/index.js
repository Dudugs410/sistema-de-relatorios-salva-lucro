/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useRef } from 'react'

import './buscarVendas.scss'
import { AuthContext } from '../../contexts/auth'
import { VendasContext } from '../../pages/Vendas'

import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'

import '../../styles/global.scss'
import 'react-toastify/dist/ReactToastify.css'
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
		gerarDados,
		detalhes,
		setDetalhes,
		setTotaisGlobalVendas,
		alerta,
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
	} = useContext(VendasContext)
    
	useEffect(()=>{
		setCnpj(Cookies.get('cnpj'))
		setCnpjBusca(Cookies.get('cnpj'))
	},[])

	async function handleBusca(e){
		e.preventDefault()

		setClicouPesquisar(true)
		await buscar()
		await gerarDados(vendas)

		setDetalhes(true)
	}

	useEffect(()=>{
		if(vendas.length === 0){
			setDetalhes(false)
		}
	},[detalhes])

	async function buscar() {
		if(cnpjBusca === '' || cnpjBusca === 'Selecione' || cnpjBusca === undefined){
			return
		}
		await loadVendas(dataBusca[0].toLocaleDateString('pt-BR'), dataBusca[1].toLocaleDateString('pt-BR'), cnpjBusca)
			.then(() =>{
				if(dataBusca === '' || cnpjBusca === ''){
					return 0
				} else {
					//adiciono .toLocaleDateString('pt-BR') às datas para que possamos comparar apenas o dia, mes e ano, sem levar em consideração a hora, minuto e segundos
					if(dataBusca[0].toLocaleDateString('pt-BR') === dataBusca[1].toLocaleDateString('pt-BR')){
						console.log('mostrou alerta vendas')
						alerta(`executou a busca do dia ${dataBusca[0].toLocaleDateString('pt-BR')}`);
						setBuscou(true)
					} else if (dataBusca[0].toLocaleDateString('pt-BR') !== dataBusca[1].toLocaleDateString('pt-BR')){
						console.log('mostrou alerta vendas')
						alerta(`executou a busca do dia ${dataBusca[0].toLocaleDateString('pt-BR')} ao dia ${dataBusca[1].toLocaleDateString('pt-BR')}`);
						setBuscou(true)
					}

					if(vendas.length === 0){
						setDetalhes(false)
					}
				}    
			})
		setLoading(false)
	}

	useEffect(()=>{
		if(((cnpjBusca === '' || cnpjBusca === 'Selecione' || cnpjBusca === undefined) && (Cookies.get('cnpj') !== '')) && (clicouPesquisar)){
			alerta('selecione um cliente válido')
			return
		}
		if(buscou === true){
			if((vendas === null) || (vendas.length === 0)){
				alerta('não existem vendas para a data selecionada')
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
		setTotalLiquido(0.00)
		setTotalCredito(0.00)
		setTotalDebito(0.00)
		setTotalVoucher(0.00)
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalVendas({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
		setArrayAdm()
		setClicouPesquisar(false)
	}

	return(
		<>
			<div className='search-bar'>
				<form className={`date-container-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>       
					<div className='submit-container select-align'>
						{ (detalhes) && (vendas.length > 0) ? <button className={`btn btn-secondary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleBusca}>Pesquisar</button>}
					</div>
				</form>
			</div>
		</>
	)
}

export default BuscarClienteVendas