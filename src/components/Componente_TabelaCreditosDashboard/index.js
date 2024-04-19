/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'


const TabelaCreditosDashboard = ({array}) =>{

	const { dateConvert, isDarkTheme } = useContext(AuthContext)

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

	// // // // // // // // // // // // // // // // // // // // // // // // // // //

	useEffect(()=>{
		if(array){
			if(array.sales.length > 0){
				setVendasArray(array.sales)
			}
		}
	},[array])

	useEffect(()=>{
		async function init(){
			setVendasTeste(vendasArray)
		}
		init()
	},[vendasArray])

	useEffect(()=>{
		setVendasExibicao(vendasTeste)
		const bandeirasTemp = []
		const uniqueStringsSet = new Set()
		vendasTeste.forEach(item => {
			if (!uniqueStringsSet.has(item.bandeira.descricaoBandeira)) {
				uniqueStringsSet.add(item.bandeira.descricaoBandeira)
				bandeirasTemp.push(item.bandeira.descricaoBandeira)
			}
		})

		const adquirentesTemp = []
		const otherUniqueStringsSet = new Set()
        
		vendasTeste.forEach(item => {
			if (!otherUniqueStringsSet.has(item.adquirente.nomeAdquirente)) {
				otherUniqueStringsSet.add(item.adquirente.nomeAdquirente)
				adquirentesTemp.push(item.adquirente.nomeAdquirente)
			}
		})

		setBandeirasExistentes(bandeirasTemp)
		setTodasBandeiras(bandeirasTemp)

		setAdquirentesExistentes(adquirentesTemp)
		setTodasAdquirentes(adquirentesTemp)

	},[vendasTeste])

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

	///////////////////////////////////////////////////////////////////////////////////////////////////

	// função que altera lista de adquirentes de acordo com a bandeira/adq selecionada, para que o usuário só tenha opções existentes
	function atualizaADQ(){
		const adquirentesTemp = []
		const otherUniqueStringsSet = new Set()

		if(banSelecionada !== ''){
			vendasTeste.forEach(item => {
				if ((!otherUniqueStringsSet.has(item.adquirente.nomeAdquirente)) && (item.bandeira.descricaoBandeira === banSelecionada)) {
					otherUniqueStringsSet.add(item.adquirente.nomeAdquirente)
					adquirentesTemp.push(item.adquirente.nomeAdquirente)
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
				if ((!otherUniqueStringsSet.has(item.bandeira.descricaoBandeira)) && (item.adquirente.nomeAdquirente === adqSelecionada)) {
					otherUniqueStringsSet.add(item.bandeira.descricaoBandeira)
					bandeirasTemp.push(item.bandeira.descricaoBandeira)
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
			let arrayFiltrado = vendasTeste.filter(venda => venda.bandeira.descricaoBandeira === banSelecionada)
			setVendasExibicao(arrayFiltrado)
		} 
		else if(banSelecionada !== '' && adqSelecionada !== ''){   
			let arrayFiltrado = vendasTeste.filter(venda => (venda.bandeira.descricaoBandeira === banSelecionada) && (venda.adquirente.nomeAdquirente === adqSelecionada))
			if(arrayFiltrado.length > 0){
				setVendasExibicao(arrayFiltrado)
			} else if(arrayFiltrado.length === 0){
				setVendasExibicao(vendasTeste)
			}
		} else {
			let arrayFiltrado = vendasTeste.filter(venda => venda.adquirente.nomeAdquirente === adqSelecionada)
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
			let arrayFiltrado = vendasTeste.filter(venda => venda.adquirente.nomeAdquirente === adqSelecionada)
			setVendasExibicao(arrayFiltrado)
		} else if (adqSelecionada !== '' && banSelecionada !== '') {
			let arrayFiltrado = vendasTeste.filter(venda => (venda.bandeira.descricaoBandeira === banSelecionada) && (venda.adquirente.nomeAdquirente === adqSelecionada))
			if(arrayFiltrado.length > 0){
				setVendasExibicao(arrayFiltrado)
			} else if(arrayFiltrado.length === 0) {
				setVendasExibicao(vendasTeste)
			}
		} else {
			let arrayFiltrado = vendasTeste.filter(venda => venda.bandeira.descricaoBandeira === banSelecionada)
			setVendasExibicao(arrayFiltrado)
		}
	},[adqSelecionada])

	return(
		<>
			<hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
			<div className='dropShadow vendas-view'>
				<div className={`table-wrapper ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
					<table className={`table table-striped table-hover det-table-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
						<thead>
							<tr className={`det-tr-top-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
								<th className='det-th-global'scope="col">CNPJ</th>
								<th className='det-th-global'scope="col">Adquirente</th>
								<th className='det-th-global'scope="col">Bandeira</th>
								<th className='det-th-global'scope="col">Produto</th>
								<th className='det-th-global'scope="col">Subproduto</th>
								<th className='det-th-global'scope="col">Valor Bruto</th>
								<th className='det-th-global'scope="col">Valor Líquido</th>
								<th className='det-th-global'scope="col">Taxa</th>
								<th className='det-th-global'scope="col">Valor Desconto</th>
								<th className='det-th-global'scope="col">NSU</th>
								<th className='det-th-global'scope="col">Data da Venda</th>
								<th className='det-th-global'scope="col">Hora da Venda</th>
								<th className='det-th-global'scope="col">Data do Crédito</th>
								<th className='det-th-global'scope="col">Autorização</th>
								<th className='det-th-global'scope="col">QTD Parcelas</th>
								<th className='det-th-global'scope="col">TID</th>
							</tr>
						</thead>
						<tbody>
							{vendasExibicao.length > 0 && currentItems.map((venda, index)=>{
								return(
									<tr key={index} className={`det-tr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}  >
										<td className='det-td-vendas-global'data-label="CNPJ">{venda.cnpj}</td>
										<td className='det-td-vendas-global'data-label="Adquirente">{venda.adquirente.nomeAdquirente}</td>
										<td className='det-td-vendas-global'data-label="Bandeira">{venda.bandeira.descricaoBandeira}</td>
										<td className='det-td-vendas-global'data-label="Produto">{venda.produto.descricaoProduto}</td>
										<td className='det-td-vendas-global'data-label="Subproduto">{venda.modalidade.descricaoModalidade}</td>
										<td className='det-td-vendas-global'data-label="Valor Bruto"><span className={`green-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>{Number(venda.valorBruto).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
										<td className='det-td-vendas-global'data-label="Valor Líquido"><span className={`green-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>{Number(venda.valorLiquido).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
										<td className='det-td-vendas-global'data-label="Taxa"><span className='red-global'>{Number(venda.taxa).toFixed(2)}%</span></td>
										<td className='det-td-vendas-global'data-label="Valor Desconto"><span className='red-global'>{Number(venda.valorDesconto).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
										<td className='det-td-vendas-global'data-label="NSU">{venda.nsu}</td>
										<td className='det-td-vendas-global'data-label="Data da Venda">{dateConvert(venda.dataVenda)}</td>
										<td className='det-td-vendas-global'data-label="Hora da Venda">{ venda.horaVenda?.replaceAll('-', ':')}</td>
										<td className='det-td-vendas-global'data-label="Data do Crédito">{dateConvert(venda.dataCredito)}</td>
										<td className='det-td-vendas-global'data-label="Autorização">{venda.codigoAutorizacao}</td>
										<td className='det-td-vendas-global'data-label="QTD Parcelas">{venda.quantidadeParcelas}</td>
										<td className='det-td-vendas-global'data-label="TID">{venda.tid}</td>
									</tr>
								)
							})}
						</tbody>
					</table> 
				</div>
			</div>
			<hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
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
			<hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
		</>
	)
}
export default TabelaCreditosDashboard