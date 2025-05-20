/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'

const TabelaServicos = ({ array }) => {  
	const { dateConvert,  servicesDateRange, exportServices } = useContext(AuthContext)

	const [vendasArray, setVendasArray] = useState([])
	const [vendasTeste, setVendasTeste] = useState([])
	const [vendasExibicao, setVendasExibicao] = useState([])

	const [bandeirasExistentes, setBandeirasExistentes] = useState([])
	const [adquirentesExistentes, setAdquirentesExistentes] = useState([])
	
	const [todasBandeiras, setTodasBandeiras] = useState('')
	const [todasAdquirentes, setTodasAdquirentes] = useState('')
	
	const [banSelecionada, setBanSelecionada] = useState('')
	const [adqSelecionada, setAdqSelecionada] = useState('')

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
		if(vendasExibicao.length > 0){
			setCurrentPage(1)   
		}
	},[vendasExibicao])

	useEffect(()=>{
		if(localStorage.getItem('currentPath') === '/servicos'){
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
	
		}
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

	useEffect(() => {
		if (adquirentesExistentes && adquirentesExistentes.length > 0) {
			const sortedOptions = adquirentesExistentes.sort((a, b) => a.localeCompare(b)) // Sort options alphabetically by label
			setAdquirentesExistentes(sortedOptions)
		}
	}, [adquirentesExistentes])

	useEffect(() => {
		if (bandeirasExistentes && bandeirasExistentes.length > 0) {
			const sortedOptions = bandeirasExistentes.sort((a, b) => a.localeCompare(b)) // Sort options alphabetically by label
			setBandeirasExistentes(sortedOptions)
		}
	}, [bandeirasExistentes])

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

	useEffect(()=>{
		if(vendasExibicao.length > 0){
			exportServices(vendasExibicao)
		}
	},[vendasExibicao])

	return(
		<>
		<div className='date-container'>
		<div className='container'>
						<div className='export-column'>
							<div className='select-card select-align select-align-filtro'>
								<span className='span-str'>Adquirente</span>
								<select className='select-filtro' id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
									<option value=''>Todas</option>
									{adquirentesExistentes.map((ADQ)=>(
										<option className='select-filtro' key={ADQ} value={ADQ}>{ADQ}</option>
									))}
								</select>
							</div>
						</div>
						<div className='export-column'>
							<div className='select-card select-align select-align-filtro'>
								<span className='span-str'>Bandeira</span>
								<select className='select-filtro' id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
									<option value='' defaultValue={'Todas'}>Todas</option>
									{bandeirasExistentes.map((BAN)=>(
										<option key={BAN} value={BAN}>{BAN}</option>
									))}
								</select>
							</div>
						</div>
					</div>
			<hr className='hr-global'/>
			<div className='container-busca'>
				<span className='span-busca'>
					{servicesDateRange[0].toLocaleDateString('pt-BR') !== servicesDateRange[1].toLocaleDateString('pt-BR') ? 
						<span dangerouslySetInnerHTML={{__html: `Exibindo Ajustes/Serviços do dia <strong>${servicesDateRange[0].toLocaleDateString('pt-BR')}</strong> ao dia <strong>${servicesDateRange[1].toLocaleDateString('pt-BR')}</strong>`}} /> : 
						<span dangerouslySetInnerHTML={{__html: `Exibindo Ajustes/Serviços do dia <strong>${servicesDateRange[0].toLocaleDateString('pt-BR')}</strong>`}} />
					}
				</span>
			</div>
		</div>
		<hr className='hr-global'/>
		<div className='dropShadow vendas-view'>
			<div className='table-wrapper'
			>
				<table className='table table-striped table-hover det-table-global'>
					<thead>
						<tr className='det-tr-top-global'>
							<th className='det-th-global'scope="col">cnpj</th>
							<th className='det-th-global'scope="col">Data</th>
							<th className='det-th-global'scope="col">Adquirente</th>
							<th className='det-th-global'scope="col">Serviço</th>
							<th className='det-th-global'scope="col">Valor</th>
							{/* <th className='det-th-global'scope="col">Codigo do Estabelecimento</th> */}
							<th className='det-th-global'scope="col">Razão Social</th>
						</tr>
					</thead>
					<tbody>
						{
						vendasExibicao.length > 0 && currentItems.map((venda, index)=>{
								return(
									<tr key={index} className='det-tr-global'>
										<td className='det-td-vendas-global'data-label="cnpj">{venda.cnpj}</td>
										<td className='det-td-vendas-global'data-label="Data">{dateConvert(venda.data)}</td>
										<td className='det-td-vendas-global'data-label="Adquirente">{venda.nome_adquirente}</td>
										<td className='det-td-vendas-global'data-label="Serviço">{venda.descricao}</td>
										<td className='det-td-vendas-global'data-label="Valor"><span className='red-global'>{Number(venda.valor.toFixed(2)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
										{/* <td className='det-td-vendas-global'data-label="Código do Estabelecimento">{venda.codigo_estabelecimento}</td> */}
										<td className='det-td-vendas-global'data-label="Razão Social">{venda.razao_social}</td>
									</tr>
								)
							}
						)}
					</tbody>
				</table>
			</div>
		</div>
		<hr className='hr-global'/>
			{vendasExibicao.length > itemsPerPage && (
				<>
					<div className="container-btn-pagina">
						<button
							className='btn btn-primary btn-global btn-skip'
							onClick={goToFirstPage}
							disabled={currentPage === 1} // Disable if already on the first page
						>
							<FiSkipBack />
						</button>
						<button
							className='btn btn-primary btn-global btn-navigate'
							onClick={goToPrevPage}
							disabled={currentPage === 1} // Disable if it's the first page
						>
							<FiChevronLeft/> {/* Left arrow */}
						</button>
						<div className={`pagina-atual `}>
							<span className='texto-paginacao'>Página </span>
							<span className='texto-paginacao' >{currentPage}</span>
						</div>
						<button
							className='btn btn-primary btn-global btn-navigate'
							onClick={goToNextPage}
							disabled={currentPage === Math.ceil(vendasExibicao.length / itemsPerPage)} // Disable if it's the last page
						>
							<FiChevronRight/> {/* Right arrow */}
						</button>
						<button
							className={`btn btn-primary btn-global btn-skip `}
							onClick={goToLastPage}
							disabled={currentPage === Math.ceil(vendasExibicao.length / itemsPerPage)} // Disable if already on the last page
						>
							<FiSkipForward />
						</button>
					</div>
					<hr className='hr-global'/>
				</>	
			)}
	</>
	)
}

export default TabelaServicos