import Calendar from 'react-calendar'
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

export const CreditosContext = createContext({})

const Creditos = () =>{
	const location = useLocation()

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname)
	}, [location])

	const {
		cnpj,
		setCnpj,
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
		setCnpj(Cookies.get('cnpj'))
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

	/*
	useEffect(()=>{
		setCnpj(Cookies.get('cnpj'))
	},[])
*/
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
		if(detalhes){
			setVendasTemp(loadCreditos(cnpjBusca, dataBusca, dataBusca))
		}

	},[cnpjBusca])

	function handleDateChange(date){
		setDataBusca(date)
	  }
	
	  const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
	  const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
	
	  useEffect(()=>{
		console.log(dataBusca)
		if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
		  setDataBuscaInicial(dataBusca[0])
		  setDataBuscaInicial(dataBusca[1])
		  setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
		  setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
		}
	  },[dataBusca])

	function separaAdm(array){
		if(array.length > 0){
			let temp = []
			let totalCreditoTemp = 0
			let totalDebitoTemp = 0
			let totalVoucherTemp = 0
			let totalLiquidoTemp = 0

			array.forEach((venda)=>{
				if(temp.length === 0){
					let novoObj = {
						nomeAdquirente: venda.adquirente.nomeAdquirente,
						total: venda.valorLiquido,
						id: 0,
						vendas: []
					}
					temp.push(novoObj)
				}else{
					let novoObj = {
						nomeAdquirente: venda.adquirente.nomeAdquirente,
						total: venda.valorLiquido,
						id: 0,
						vendas: []
					}

					if(!(temp.find((objeto) => objeto.nomeAdquirente === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
						novoObj.id = (temp.length)
						temp.push(novoObj)
					}

					else{
						for(let i = 0; i < temp.length; i++){
							if(temp[i].nomeAdquirente === venda.adquirente.nomeAdquirente){
								temp[i].total += venda.valorLiquido
							}
						}
					}
				}
				// eslint-disable-next-line default-case
				switch(venda.produto.descricaoProduto){
				case 'Crédito':
					totalCreditoTemp += venda.valorLiquido
					break

				case 'Débito':
					totalDebitoTemp += venda.valorLiquido
					break

				case 'Voucher':
					totalVoucherTemp += venda.valorLiquido
					break
				}
				totalLiquidoTemp += venda.valorLiquido
			})
			temp.forEach((adq) => {
				let vendasTemp = []
				vendasTemp.length = 0
				array.forEach((vendasDia) => {
					if(vendasDia.length > 0){
						vendasDia.forEach((venda) => {
							if(venda.adquirente.nomeAdquirente === adq.nomeAdquirente){
								vendasTemp.push(venda)
							}
							adq.vendas = vendasTemp
						})
					}
				})
			})
			let totalTemp = {debito: totalDebitoTemp, credito: totalCreditoTemp, voucher: totalVoucherTemp, liquido: totalLiquidoTemp}
			setTotaisGlobalCreditos(totalTemp)

			return temp
		}
	}

	function MyCalendar() {
		return (
		  <div>
			<Calendar
			  style={{ color:'white' }}
			  className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
			  onChange={ handleDateChange }
			  selectRange={true}
			  value={ dataBusca }
			  tileClassName={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
			/>
			<hr/>
			<div className='container-busca'>
			  <span className={`span-busca ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				{dataInicialExibicao !== dataFinalExibicao ? 
				  <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong> ao dia <strong>${dataFinalExibicao}</strong>`}} /> : 
				  <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong>`}} />
				}
			  </span>
			  <BuscarClienteCreditos />
			</div>
		  </div>
		)
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
						<hr className="hr-recebimentos"/>
						<TotalModalidadesComp tipo = 'creditos'/>
						<hr className="hr-recebimentos"/>
						{ (detalhes) && (creditos.length > 0) ? <GerarRelatorio className='export' tableData={tableData} detalhes={detalhes} tipo='creditos'/> : <></> }
						<div className='component-container-vendas'>
							{ (detalhes) && (creditos.length > 0) ?  <TabelaVendasCreditos array={creditos} tipo = 'creditos'/> : <MyCalendar className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> }
							<hr className="hr-recebimentos"/>
							{ (detalhes) && (creditos.length > 0) ? <TabelaGenericaAdm Array={arrayAdm}/> : <></> }
							{ (detalhes) && (creditos.length > 0) ? <hr className='hr-recebimentos'/> : <></> }
						</div>
					</div>
				</div>
			</div>
		</CreditosContext.Provider>
	)
}

export default Creditos