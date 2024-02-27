import './creditos.scss'
import { useContext, useEffect, useState } from 'react'
import TabelaVendasCreditos from '../../components/Componente_TabelaVendasCreditos'
import { AuthContext } from '../../contexts/auth'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import GerarRelatorio from '../../components/Componente_GerarRelatorio'
import Cookies from 'js-cookie'
import { createContext } from 'react'
import { useLocation } from 'react-router-dom'
import BuscarClienteCreditos from '../../components/Componente_BuscarClienteCreditos'
import MyCalendar from '../../components/Componente_Calendario'

export const CreditosContext = createContext({})

const Creditos = () =>{
	const location = useLocation()

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname)
	}, [location])

	const {
		cnpj,
		bandeiras, 
		loadBandeiras,
		grupos,
		setGrupos,
		adquirentes,
		loadAdquirentes,
		creditos,
		setCreditos,
		loadCreditos,
		gerarDados,
		tableData,
		isDarkTheme,
		setIsDarkTheme,
		setTotaisGlobal,setTotaisGlobalCreditos,
		detalhes,
	} = useContext(AuthContext)

	useEffect(()=>{
		setCreditos([])
	},[])

	const [tipo, setTipo] = useState('creditos')

	useEffect(()=>{
	  setTipo('creditos')
	  Cookies.set('tipo', 'creditos')
	},[])

	const [totalCredito, setTotalCredito] = useState(0.00)
	const [totalDebito, setTotalDebito] = useState(0.00)
	const [totalVoucher, setTotalVoucher] = useState(0.00)
	const [totalLiquido, setTotalLiquido] = useState(0.00)

	const [arrayAdm, setArrayAdm] = useState([])
	const [arrayRelatorio, setArrayRelatorio] = useState([])
	const [dataBusca, setDataBusca] = useState([new Date(), new Date])

	const [cnpjBusca, setCnpjBusca] = useState('')
	const [vendasTotais, setVendasTotais] = useState([])

	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
	},[])

	useEffect(()=>{
		async function inicializar(){
			if(bandeiras.length === 0){
				await loadBandeiras()
			}
      
			if(grupos.length === 0){
				setGrupos(JSON.parse(sessionStorage.getItem('grupos')))     
			}
      
			if(adquirentes.length === 0){
				await loadAdquirentes()
			}
		}
		inicializar()
	},[])

	useEffect(()=>{
		creditos.length = 0
		setTotalCredito(0.00)
		setTotalDebito(0.00)
		setTotalVoucher(0.00)
		setTotalLiquido(0.00)
		setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
		setTotaisGlobalCreditos({debito: 0, credito: 0, voucher: 0, liquido: 0})
	},[])
	
	useEffect(()=>{
		try {
			if(creditos.length === 0){
				setTotalCredito(0.00)
				setTotalDebito(0.00)
				setTotalVoucher(0.00)
				setTotalLiquido(0.00)
			}
			else if(creditos.length > 0){
				setArrayRelatorio(gerarDados(creditos))
				setArrayAdm(separaAdm(creditos))
			}
		} catch (error) {
			console.log(error)
		}
	},[creditos])

	useEffect(()=>{
		setCnpjBusca(cnpj)
	},[cnpj])

	const [vendasTemp, setVendasTemp] = useState([])

	const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
	const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

	useEffect(()=>{
		if(detalhes && (cnpjBusca !== '')){
			setVendasTemp(loadCreditos(cnpjBusca, dataBusca[0], dataBusca[1]))
		}

	},[cnpjBusca])

	function handleDateChange(date){
		setDataBusca(date)
	  }
	
	  const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
	  const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
	
	  useEffect(()=>{
		if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
		  setDataBuscaInicial(dataBusca[0])
		  setDataBuscaInicial(dataBusca[1])
		  setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
		  setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
		}
	  },[dataBusca])

	  function separaAdm(array) {
		let sums = {
			debito: 0,
			credito: 0,
			voucher: 0,
			total: 0
		};
	
		let separatedByAdquirente = [];
	
		array.forEach((item) => {
			// Calculate individual sums
			switch (item.produto.descricaoProduto) {
				case 'Débito':
					sums.debito += item.valorLiquido;
					break;
				case 'Crédito':
					sums.credito += item.valorLiquido;
					break;
				case 'Voucher':
					sums.voucher += item.valorLiquido;
					break;
			}
			sums.total += item.valorLiquido;
	
			// Find or create entry in separatedByAdquirente
			let entry = separatedByAdquirente.find(adquirente => adquirente.nomeAdquirente === item.adquirente.nomeAdquirente);
			if (!entry) {
				entry = {
					id: separatedByAdquirente.length,
					nomeAdquirente: item.adquirente.nomeAdquirente,
					total: 0
				};
				separatedByAdquirente.push(entry);
			}
	
			// Update total for this adquirente
			entry.total += item.valorLiquido;
		});

		let totalTemp = { debito: sums.debito, credito: sums.credito, voucher: sums.voucher, liquido: sums.total };
	
		setTotaisGlobalCreditos(totalTemp);
		console.log(totalTemp);
		console.log('Sums:', sums);
		console.log('Separated by Adquirente:', separatedByAdquirente);
		return separatedByAdquirente;
	}

	return(
		<CreditosContext.Provider 
			value={{
				dataBusca, 
				setDataBusca, 
				totalDebito,
				setTotalDebito,
				totalCredito,
				setTotalCredito,
				totalVoucher,
				setTotalVoucher,
				totalLiquido,
				setTotalLiquido,
				cnpjBusca,
				setCnpjBusca,
				setArrayAdm,
			}}>

			<div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				<div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
					<div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						<div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Calendário de Créditos</h1>
						</div>
						<TotalModalidadesComp tipo = 'creditos'/>
						{ (detalhes) && (creditos.length > 0) ? <GerarRelatorio className='export' tableData={tableData} detalhes={detalhes} tipo='creditos'/> : <></> }
						<div className='component-container-vendas'>
							{ (detalhes) && (creditos.length > 0) ?  <TabelaVendasCreditos array={creditos} tipo = 'creditos'/> : <MyCalendar dataInicialExibicao={dataInicialExibicao} dataFinalExibicao={dataFinalExibicao} dataBusca={dataBusca} handleDateChange={handleDateChange} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> }
							{ (detalhes) && (creditos.length > 0) ? <TabelaGenericaAdm Array={arrayAdm}/> : <></> }
							{ (detalhes) && (creditos.length > 0) ? <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> : <></> }
						</div>
						<BuscarClienteCreditos />
					</div>
				</div>
			</div>
		</CreditosContext.Provider>
	)
}

export default Creditos