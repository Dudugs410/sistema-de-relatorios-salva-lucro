/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'
import '../Componente_TabelaVendasCreditos/detalhesCredito.scss'
import '../../styles/global.scss'

const TabelaServicos = ({ array, tipo }) => {  
	const { dateConvert, isDarkTheme, setDetalhes } = useContext(AuthContext)

	const [vendasArray, setVendasArray] = useState([])

	const [vendasTeste, setVendasTeste] = useState([])
	const [vendasExibicao, setVendasExibicao] = useState([])

	const [bandeirasExistentes, setBandeirasExistentes] = useState([])
	const [adquirentesExistentes, setAdquirentesExistentes] = useState([])
	
	const [todasBandeiras, setTodasBandeiras] = useState('')
	const [todasAdquirentes, setTodasAdquirentes] = useState('')
	
	const [banSelecionada, setBanSelecionada] = useState('')
	const [adqSelecionada, setAdqSelecionada] = useState('')

	const [style, setStyle] = useState({})

	//adicionando páginas à tabela:
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(15) // Number of items per page

	useEffect(() => {
		setCurrentPage(1) // Reset page to 1 when data changes
	}, [array])

	// Change page functions
	const goToPrevPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)) // Decrease page by 1, minimum page is 1
	}

	const goToNextPage = () => {
		setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(vendasExibicao.length / itemsPerPage))) // Increase page by 1, maximum page is calculated based on array length
	}

	const goToFirstPage = () => {
		setCurrentPage(1) // Go to the first page
	}
    
	const goToLastPage = () => {
		setCurrentPage(Math.ceil(vendasExibicao.length / itemsPerPage)) // Go to the last page
	}
  
	// Calculate indexes for pagination
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = vendasExibicao.slice(indexOfFirstItem, indexOfLastItem)
  
	// Change page
	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	////////////////////////////////////////////////////
	
	useEffect(()=>{
		if(array.length > 0){
			setVendasArray(array)
		}
	},[])

	useEffect(()=>{
		async function init(){
			setVendasTeste(vendasArray)
		}
		init()
	},[vendasArray])

	useEffect(()=>{
		setVendasArray(array)

	},[array])
	useEffect(()=>{
		if(vendasExibicao.length > 0){
			// gerarDados(vendasExibicao)
			// carregaTotais(vendasExibicao)
			setCurrentPage(1)
            
		}
	},[vendasExibicao])

	useEffect(()=>{

		setVendasExibicao(vendasTeste)

		const bandeirasTemp = []
		const uniqueStringsSet = new Set()
        
		vendasTeste.forEach(item => {
			if (!uniqueStringsSet.has(item.descricao)) {
				uniqueStringsSet.add(item.descricao)
				bandeirasTemp.push(item.descricao)
			}
		})

		const adquirentesTemp = []
		const otherUniqueStringsSet = new Set()
        
		vendasTeste.forEach(item => {
			if (!otherUniqueStringsSet.has(item.nome_adquirente)) {
				otherUniqueStringsSet.add(item.nome_adquirente)
				adquirentesTemp.push(item.nome_adquirente)
			}
		})

		setBandeirasExistentes(bandeirasTemp)
		setTodasBandeiras(bandeirasTemp)

		setAdquirentesExistentes(adquirentesTemp)
		setTodasAdquirentes(adquirentesTemp)

	},[vendasTeste])

	// função que altera lista de adquirentes de acordo com a bandeira/adq selecionada, para que o usuário só tenha opções existentes
	function atualizaADQ(){
		const adquirentesTemp = []
		const otherUniqueStringsSet = new Set()

		if(banSelecionada !== ''){
			vendasTeste.forEach(item => {
				if ((!otherUniqueStringsSet.has(item.nome_adquirente)) && (item.descricao === banSelecionada)) {
					otherUniqueStringsSet.add(item.nome_adquirente)
					adquirentesTemp.push(item.nome_adquirente)
				}
			})
			setAdquirentesExistentes(adquirentesTemp)
		} else {
			setAdquirentesExistentes(todasAdquirentes)
		}
	}

	function atualizaBAN(){
		const bandeirasTemp = []
		const otherUniqueStringsSet = new Set()

		if(adqSelecionada !== ''){
			vendasTeste.forEach(item => {
				if ((!otherUniqueStringsSet.has(item.descricao)) && (item.nome_adquirente === adqSelecionada)) {
					otherUniqueStringsSet.add(item.descricao)
					bandeirasTemp.push(item.descricao)
				}
			})
			setBandeirasExistentes(bandeirasTemp)
		} else {
			setBandeirasExistentes(todasBandeiras)
		}
	}

	useEffect(()=>{
		if(adquirentesExistentes.length > 0 && bandeirasExistentes.length > 0){
			atualizaADQ()
		}
		if(banSelecionada === '' && adqSelecionada === ''){
			setVendasExibicao(vendasTeste)
		} 
		else if(banSelecionada !== '' && adqSelecionada === ''){
			let arrayFiltrado = vendasTeste.filter(venda => venda.descricao === banSelecionada)
			setVendasExibicao(arrayFiltrado)
		} 
		else if(banSelecionada !== '' && adqSelecionada !== ''){   
			let arrayFiltrado = vendasTeste.filter(venda => (venda.descricao === banSelecionada) && (venda.nome_adquirente === adqSelecionada))
			if(arrayFiltrado.length > 0){
				setVendasExibicao(arrayFiltrado)
			} else if(arrayFiltrado.length === 0){
				setVendasExibicao(vendasTeste)
			}
		} else {
			let arrayFiltrado = vendasTeste.filter(venda => venda.nome_adquirente === adqSelecionada)
			setVendasExibicao(arrayFiltrado)
		}
	},[banSelecionada])

	useEffect(()=>{
		if(adquirentesExistentes.length > 0 && bandeirasExistentes.length > 0){
			atualizaBAN()
		}
		if(adqSelecionada === '' && banSelecionada === ''){
			setVendasExibicao(vendasTeste)
		}
		else if(adqSelecionada !== '' && banSelecionada === ''){
			let arrayFiltrado = vendasTeste.filter(venda => venda.nome_adquirente === adqSelecionada)
			setVendasExibicao(arrayFiltrado)
		} else if (adqSelecionada !== '' && banSelecionada !== '') {
			let arrayFiltrado = vendasTeste.filter(venda => (venda.descricao === banSelecionada) && (venda.nome_adquirente === adqSelecionada))
			if(arrayFiltrado.length > 0){
				setVendasExibicao(arrayFiltrado)
			} else if(arrayFiltrado.length === 0) {
				setVendasExibicao(vendasTeste)
			}
		} else {
			let arrayFiltrado = vendasTeste.filter(venda => venda.descricao === banSelecionada)
			setVendasExibicao(arrayFiltrado)
		}

	},[adqSelecionada])


	return(
		<>
		<div className='date-container'>
		<div className='date-column'>
			<div className='select-card select-align'>
				<span className={`span-str ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} style={style}>Adquirente</span>
				<select className={`${isDarkTheme ? 'dark-theme' : 'light-theme'}`} id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}} style={style}>
					<option value='' selected>Todas</option>
					{adquirentesExistentes.map((ADQ)=>(
						<option key={ADQ} value={ADQ}>{ADQ}</option>
					))}
				</select>
			</div>
		</div>
		<div className='date-column'>
			<div className='select-card select-align'>
				<span className={`span-str ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} style={style}>Serviço</span>
				<select className={`${isDarkTheme ? 'dark-theme' : 'light-theme'}`} id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}} style={style}>
					<option value='' selected>Todas</option>
					{bandeirasExistentes.map((BAN)=>(
						<option key={BAN} value={BAN}>{BAN}</option>
					))}
				</select>
			</div>
		</div>
	</div>
		<div className='dropShadow vendas-view'>
			<div className={`table-wrapper ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
				<table className={`table table-striped det-table-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
					<thead>
						<tr className={`det-tr-top-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<th className='det-th-global'scope="col">cnpj</th>
							<th className='det-th-global'scope="col">Razão Social</th>
							<th className='det-th-global'scope="col">Codigo do Estabelecimento</th>
							<th className='det-th-global'scope="col">Data</th>
							<th className='det-th-global'scope="col">Adquirente</th>
							<th className='det-th-global'scope="col">Serviço</th>
							<th className='det-th-global'scope="col">Valor</th>
						</tr>
					</thead>
					<tbody>
						{
						vendasExibicao.length > 0 && currentItems.map((venda, index)=>{
								return(
									<tr key={index} className={`det-tr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}  >
										<td className='det-td-vendas-global'data-label="cnpj">{venda.cnpj}</td>
										<td className='det-td-vendas-global'data-label="Razão Social">{venda.razao_social}</td>
										<td className='det-td-vendas-global'data-label="Código do Estabelecimento">{venda.codigo_estabelecimento}</td>
										<td className='det-td-vendas-global'data-label="Data">{dateConvert(venda.data)}</td>
										<td className='det-td-vendas-global'data-label="Adquirente">{venda.nome_adquirente}</td>
										<td className='det-td-vendas-global'data-label="Serviço">{venda.descricao}</td>
										<td className='det-td-vendas-global'data-label="Valor"><span className='red-global'>{Number(venda.valor.toFixed(2)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
									</tr>
								)
							}
						)}
					</tbody>
				</table>
			</div>
		</div>
		<hr className="hr-recebimentos"/>
			{vendasExibicao.length > itemsPerPage && (
				<div className="container-btn-pagina">
					<button
						className={`btn btn-primary btn-global btn-skip ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
						onClick={goToFirstPage}
						disabled={currentPage === 1} // Disable if already on the first page
					>
						<FiSkipBack />
					</button>
					<button
						className={`btn btn-primary btn-global btn-navigate ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
						onClick={goToPrevPage}
						disabled={currentPage === 1} // Disable if it's the first page
					>
						<FiChevronLeft/> {/* Left arrow */}
					</button>
					<div className={`pagina-atual ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
						<span className={`texto-paginacao ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>Página </span>
						<span className={`texto-paginacao ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>{currentPage}</span>
					</div>
					<button
						className={`btn btn-primary btn-global btn-navigate ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
						onClick={goToNextPage}
						disabled={currentPage === Math.ceil(vendasExibicao.length / itemsPerPage)} // Disable if it's the last page
					>
						<FiChevronRight/> {/* Right arrow */}
					</button>
					<button
						className={`btn btn-primary btn-global btn-skip ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
						onClick={goToLastPage}
						disabled={currentPage === Math.ceil(vendasExibicao.length / itemsPerPage)} // Disable if already on the last page
					>
						<FiSkipForward />
					</button>
				</div>
				
			)}
			{ sessionStorage.getItem('currentPath') !== '/dashboard' ? 
			<div className='voltar-container'>
				<button className={`btn btn-secondary btn-global btn-voltar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={() => { setDetalhes(false)} }>Voltar</button>
			</div> : <></>}
	</>
	)
}

export default TabelaServicos