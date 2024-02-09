/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useRef } from 'react'

import './buscarServicos.scss'
import { AuthContext } from '../../contexts/auth'
import { ServicosContext } from '../../pages/Servicos'

import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'

import '../../styles/global.scss'
import 'react-toastify/dist/ReactToastify.css'
import './reactdatepicker.css'
import Cookies from 'js-cookie'
import { useCallback } from 'react'

const BuscarClienteServicos = () => {
	const [buscou, setBuscou] = useState(false)
	const [arrayDados, setArrayDados] = useState([])

	const { 
		setCnpj,  
		setLoading,
		loadAjustes,
		setTotaisGlobal,
		isDarkTheme,
		setAjustes,
		ajustes,
		gerarDados,
	} = useContext(AuthContext)

	const {
		detalhes, 
		setDetalhes,
		dataBusca,		
		setDataBusca, 
		cnpjBusca,
		setCnpjBusca,
	} = useContext(ServicosContext)
    
	// useEffect(()=>{
	// 	console.log('Detalhes: ',detalhes)
	// },[detalhes])
    
	useEffect(()=>{
		setCnpj(Cookies.get('cnpj'))
		setCnpjBusca(Cookies.get('cnpj'))
	},[])

	const alerta = useCallback((text) => {
		toast.info(text, {
			position: 'top-center',
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'light',
		})
	}, [])

	async function handleBusca(e){
		e.preventDefault()
		if(cnpjBusca === '' || cnpjBusca === 'Selecione' || cnpjBusca === undefined){
			alerta('selecione um cliente válido')
			return
		}
		await buscar()
		// await gerarDados(ajustes)
	}
	
	async function buscar() {
		// console.log('cnpj', cnpjBusca)
		await loadAjustes(cnpjBusca, dataBusca[0], dataBusca[1])
		.then(() =>{
				// console.log('ajustes buscar',ajustes)
				if(!(dataBusca) || cnpjBusca === ''){
					return 0
				}
				else{
					alerta(`executou a busca dos dias ${(dataBusca[0].toLocaleDateString('pt-BR'))} até ${(dataBusca[1]).toLocaleDateString('pt-BR')}`)
					setBuscou(true)
					if(ajustes.length === 0){
						setDetalhes(false)
					}
				}    
			})
		setLoading(false)
	}

	useEffect(()=>{
		// console.log('buscou: ', buscou)
		if(buscou === true){
			if((ajustes === null) || (ajustes.length === 0)){
				alerta('não existem vendas para a data selecionada')
				setBuscou(false)
				setDetalhes(false)
			}
			else{
				setDetalhes(true)
				setBuscou(false)
			}
		}
	},[buscou])

	const alertaRef = useRef()
	const setDetalhesRef = useRef()
	const arrayDadosRef = useRef()

	useEffect(()=>{
		alertaRef.current = alerta
		setDetalhesRef.current = setDetalhes
		arrayDadosRef.current = arrayDados                   
	},[alerta, setDetalhes, arrayDados])

	useEffect(()=>{
		// console.log('buscou: ', buscou)
		if(buscou === true){
			if((arrayDadosRef === null) || (arrayDadosRef.length === 0)){
				alertaRef.current('não existem vendas para a data selecionada')
				setBuscou(false)
			}
			else{
				setDetalhesRef.current(true)
				setBuscou(false)
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
	}

	return(
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
			<div className='search-bar'>
				<form className={`date-container-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>       
					<div className='submit-container select-align'>
						{ (detalhes) && (ajustes > 0) ? <button className={`btn btn-secondary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleBusca}>Pesquisar</button>}
					</div>      
				</form>
			</div>
		</>
	)
}

export default BuscarClienteServicos