import { useEffect, useContext, useState } from 'react'
import Select from 'react-select'
import '../Vendas/vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'
import { FiHelpCircle } from 'react-icons/fi'
import api from '../../services/api'
import NewDisplayData from '../../components/Component_NewDisplayData'

const Creditos = () =>{
	const location = useLocation()
	const [downloading, setDownloading] = useState(false)

	const resetValues = () => {
		setCreditsPageArray([])
		setCreditsPageAdminArray([])
		setBtnDisabledCredits(false)
		setCreditsTotal({
			debit: 0,
			credit: 0,
			voucher: 0,
			total: 0
		})
		creditsTableData.length = 0
		// Clear select states
		setAdministradora(null)
		setBandeira(null)
		// Clear localStorage items
		localStorage.removeItem('selectedAdmCredits')
		localStorage.removeItem('selectedBanCredits')
	}

	useEffect(()=>{
		resetValues()
	},[])

	useEffect(() => {
		localStorage.setItem('currentPath', location.pathname)
	}, [location])

	const [bandeira, setBandeira] = useState(null)
	const [administradora, setAdministradora] = useState(null)
  
	const [listaBandeiras, setListaBandeiras] = useState([])
	const [listaAdministradoras, setListaAdministradoras] = useState([])
  
	useEffect(()=>{
		const inicializar = async () =>{
			setListaBandeiras(await loadBanners())
			setListaAdministradoras(await loadAdmins())
		}
		inicializar()
	},[])
  
	useEffect(()=>{
		if(listaBandeiras.length>0){
			console.log('bandeiras: ', listaBandeiras)
		}
	},[listaBandeiras])
  
	useEffect(()=>{
		if(listaAdministradoras.length>0){
			console.log('administradoras: ', listaAdministradoras)
		}
	},[listaAdministradoras])
  
	const handleAdmin = (option) => {
		console.log('executou função', option)
		setAdministradora(option?.codigoAdquirente || null)
		localStorage.setItem('selectedAdmCredits', JSON.stringify(option))
	}
  
	const handleBan = (option) => {
		console.log('executou função', option)
		setBandeira(option?.codigoBandeira || null)
		localStorage.setItem('selectedBanCredits', JSON.stringify(option))
	}
  
	const {
		creditsPageArray, setCreditsPageArray,
		creditsPageAdminArray, setCreditsPageAdminArray,
		creditsDateRange, setCreditsDateRange,
		loadCredits, loadTotalCredits, creditsTotal, setCreditsTotal, tableData,
		groupByAdmin, loadAdmins, loadBanners,
		btnDisabledCredits, setBtnDisabledCredits,
		exportCredits, creditsTableData,
    newLoadCredits,
    newGroupByAdminCredits,
    newLoadTotalCredits,
	} = useContext(AuthContext)
  

useEffect(() => {
  if (creditsPageArray.length > 0) {
    setCreditsPageAdminArray(newGroupByAdminCredits(creditsPageArray))
    newLoadTotalCredits(creditsPageArray)
  }
}, [creditsPageArray])

	async function handleLoadData(e) {
		e.preventDefault()
		try {
			setBtnDisabledCredits(true)
			toast.dismiss()
			await toast.promise(loadData(), {
				pending: 'Carregando...',
			})
			setBtnDisabledCredits(false)
		} catch (error) {
			console.error('Error handling busca:', error)
			toast.dismiss()
			toast.error('Ocorreu um Erro')
			setBtnDisabledCredits(false)
		}
	}

async function loadData() {
  try {
    const startDateFormatted = creditsDateRange[0]
    const endDateFormatted = creditsDateRange[1]
    const creditsData = await newLoadCredits(startDateFormatted, endDateFormatted)
    const groupedData = newGroupByAdminCredits(creditsData)

    setCreditsPageAdminArray(groupedData)
    newLoadTotalCredits(creditsData)
    
    return creditsData
  } catch (error) {
    console.error('Error fetching credits data:', error)
    throw error
  }
}

	useEffect(()=>{
		if(creditsPageArray.length > 0){
			exportCredits(creditsPageArray)
		}
	},[creditsPageArray, localStorage.getItem('currentPath')])

	const handleDateRangeChange = (dateRange) => {
		setCreditsDateRange(dateRange)
	}

	const handleGoBack = () => {
		resetValues()
	}

	// Helper function to format date to YYYY-MM-DD
	const formatDateToYYYYMMDD = (date) => {
		if (!date) return ''
		
		if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
			return date
		}
		
		if (date instanceof Date) {
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}-${month}-${day}`
		}
		
		if (typeof date === 'string' && date.includes('/')) {
			const [day, month, year] = date.split('/')
			return `${year}-${month}-${day}`
		}
		
		const dateObj = new Date(date)
		if (!isNaN(dateObj.getTime())) {
			const year = dateObj.getFullYear()
			const month = String(dateObj.getMonth() + 1).padStart(2, '0')
			const day = String(dateObj.getDate()).padStart(2, '0')
			return `${year}-${month}-${day}`
		}
		
		return ''
	}

	// Get the request object for API
	const getRequestObject = (format) => {
		const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
		const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
		const dataInicial = localStorage.getItem('dataInicial')
		const dataFinal = localStorage.getItem('dataFinal')
		
		// Get selected filters from localStorage (for credits)
		const bandeiraObj = JSON.parse(localStorage.getItem('selectedBanCredits')) || ''
		const adquirenteObj = JSON.parse(localStorage.getItem('selectedAdmCredits')) || ''
		
		// Get clientes string
		let clientesString
		if (cliente && cliente.label === 'TODOS') {
			const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || []
			clientesString = clientCodes.join(', ')
		} else if (cliente && cliente.cod) {
			clientesString = String(cliente.cod)
		} else {
			clientesString = ""
		}

		const nomeGrupo = grupo?.label || ""
		const ban = bandeiraObj?.codigoBandeira || ''
		const adq = adquirenteObj?.codigoAdquirente || ''

		return {
			dataInicial: formatDateToYYYYMMDD(dataInicial),
			dataFinal: formatDateToYYYYMMDD(dataFinal),
			clientes: clientesString,
			nomeGrupo: nomeGrupo,
			bandeira: ban,
			adquirente: adq,
			produto: '',
			modalidade: '',
			arquivo: format, // 'PDF' or 'XLSX'
			modelo: 'RECEBIMENTO' // Changed from 'VENDA' to 'RECEBIMENTO'
		}
	}

	// Generic download function using the API
	const downloadReport = async (format) => {
		setDownloading(true)
		
		try {
			const requestObject = getRequestObject(format)
			
			console.log(`Downloading ${format} report for Creditos with request:`, requestObject)
			
			const response = await api.post('relatorios/detalhado', requestObject)
			
			if (response.data.success === true && response.data.formato === format) {
				// Convert base64 to blob and download
				const binaryData = atob(response.data.base64)
				const arrayBuffer = new ArrayBuffer(binaryData.length)
				const uint8Array = new Uint8Array(arrayBuffer)
				for (let i = 0; i < binaryData.length; i++) {
					uint8Array[i] = binaryData.charCodeAt(i)
				}
				
				const mimeType = format === 'PDF' 
					? 'application/pdf' 
					: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				const fileExtension = format === 'PDF' ? 'pdf' : 'xlsx'
				const blob = new Blob([arrayBuffer], { type: mimeType })
				const url = URL.createObjectURL(blob)
				
				const a = document.createElement('a')
				a.href = url
				
				// Create filename with date range
				const startDate = formatDateToYYYYMMDD(creditsDateRange[0])
				const endDate = formatDateToYYYYMMDD(creditsDateRange[1])
				const dateRangeStr = startDate === endDate ? startDate : `${startDate}_a_${endDate}`
				const fileName = `Relatorio_Creditos_${dateRangeStr}.${fileExtension}`
				
				a.download = fileName
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
				
				toast.success(`${format} report downloaded successfully!`)
				console.log(`${format} report downloaded successfully`)
			} else {
				console.error('API returned unsuccessful response:', response.data)
				toast.error(response.data.mensagem || `Failed to generate ${format} report`)
			}
		} catch (err) {
			console.error(`Error downloading ${format} report:`, err)
			toast.error(err.response?.data?.mensagem || err.message || `An error occurred while generating the ${format} report`)
		} finally {
			setDownloading(false)
		}
	}

	// Excel download handler
	const handleExcelDownload = async () => {
		if (!creditsPageArray || creditsPageArray.length === 0) {
			toast.warning('No data available to export. Please load data first.')
			return
		}
		await downloadReport('XLSX')
	}

	// PDF download handler
	const handlePDFDownload = async () => {
		if (!creditsPageArray || creditsPageArray.length === 0) {
			toast.warning('No data available to export. Please load data first.')
			return
		}
		await downloadReport('PDF')
	}

	// Get the selected option object for Adquirente
	const getSelectedAdminOption = () => {
		if (!administradora || listaAdministradoras.length === 0) return null
		return listaAdministradoras.find(option => option.codigoAdquirente === administradora)
	}

	// Get the selected option object for Bandeira
	const getSelectedBanOption = () => {
		if (!bandeira || listaBandeiras.length === 0) return null
		return listaBandeiras.find(option => option.codigoBandeira === bandeira)
	}

	// Joyride state
	const [runTutorial, setRunTutorial] = useState(false)
	const [steps, setSteps] = useState([
		{
			target: '[data-tour="calendario-section"]',
			content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
			disableBeacon: true,
			placement: 'bottom'
		},
		{
			target: '[data-tour="pesquisar-section"]',
			content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
			placement: 'bottom'
		},
	])

	useEffect(()=>{
		if(creditsPageArray.length > 0){
			let stepsTemp = [
				{
					target: '[data-tour="modalidade-section"]',
					content: 'Valores totais dos créditos exibidos, por modalidade.',
					disableBeacon: true,
					placement: 'bottom'
				},
				{
					target: '[data-tour="exportacao-section"]',
					content: 'Exporta os créditos sendo exibidos para os formatos Excel ou PDF.',
					placement: 'bottom'
				},
				{
					target: '[data-tour="bandeiraadquirente-section"]',
					content: 'Filtra os créditos de acordo com a combinação de bandeira/adquirente selecionada.',
					placement: 'bottom'
				},
				{
					target: '[data-tour="tabelavendas-section"]',
					content: 'Créditos do período selecionado. Podem ser filtrados por bandeira/adquirente.',
					placement: 'bottom'
				},
				{
					target: '[data-tour="totaladq-section"]',
					content: 'Valores totais dos créditos sendo exibidos, separados por adquirente.',
					placement: 'bottom'
				},
				{
					target: '[data-tour="botaovoltar-section"]',
					content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
					placement: 'bottom'
				},
			]
			setSteps(stepsTemp)
		} else {
			setSteps([
				{
					target: '[data-tour="calendario-section"]',
					content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
					disableBeacon: true,
					placement: 'bottom'
				},
				{
					target: '[data-tour="pesquisar-section"]',
					content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
					placement: 'bottom'
				},
			])
		}
	},[creditsPageArray])
  
	const handleTutorialEnd = () => {
		setRunTutorial(false)
		if (creditsPageArray.length > 0){

		} else{
   
		}
	}

	return(
		<div className='appPage'>
			<div className='page-vendas-background'>
				<div className='page-content-vendas'>
					<div className='vendas-title-container'>
						<h1 className='vendas-title'>Calendário de Créditos</h1>
					</div>
					<hr className='hr-global'/>
					<div className='component-container-vendas' data-tour="calendario-section">
						{runTutorial &&
							<Joyride
								steps={steps}
								run={runTutorial}
								continuous={true}
								scrollToFirstStep={false}
								showProgress={true}
								showSkipButton={true}
								scrollOffset={80}
								styles={{
									options: {
										primaryColor: '#99cc33',
										textColor: '#0a3d70',
										zIndex: 10000,
									}
								}}
								callback={(data) => {
									if (data.status === 'finished' || data.status === 'skipped') {
										handleTutorialEnd()
									}
								}}
								locale={{
									back: 'Voltar',
									close: 'Fechar',
									last: 'Finalizar',
									next: 'Próximo',
									skip: 'Pular',
									nextLabelWithProgress: 'Próximo ({step} de {steps})',
								}}
							/>	
						}
						{creditsPageArray !== null ?
							(creditsPageArray.length > 0 ? (
                <NewDisplayData 
                  dataArray={creditsPageArray} 
                  adminDataArray={creditsPageAdminArray} 
                  totals={creditsTotal} 
                  onGoBack={resetValues}
                  setRunTutorial={setRunTutorial}
                  location={location}
                  onExcelDownload={handleExcelDownload}
                  onPDFDownload={handlePDFDownload}
                  downloading={downloading}
                />
							) : (
								<>
									<div className='select-container-calendario'>
										<div className='select-wrapper'>
											<h5>Adquirente</h5>
											<Select 
												className='seletor-adq-select fixed-width-select' 
												id='adquirente'
												options={listaAdministradoras}
												getOptionLabel={(option) => option.nomeAdquirente}
												getOptionValue={(option) => option.codigoAdquirente}
												onChange={(option) => handleAdmin(option)}
												value={getSelectedAdminOption()}
												menuPortalTarget={document.body}
												menuPosition="fixed"
												placeholder="Selecione uma adquirente..."
												isClearable={true}
												styles={{
													control: (base) => ({
														...base,
														minWidth: 250,
														width: '100%',
													}),
													menu: (base) => ({
														...base,
														minWidth: 250,
														width: '100%',
													}),
													valueContainer: (base) => ({
														...base,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}),
													singleValue: (base) => ({
														...base,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														maxWidth: '90%',
													}),
												}}
											/>
										</div>
										<div className='select-wrapper'>
											<h5>Bandeira</h5>
											<Select 
												className='seletor-adq-select fixed-width-select' 
												id='bandeira'
												options={listaBandeiras}
												getOptionLabel={(option) => option.descricaoBandeira}
												getOptionValue={(option) => option.codigoBandeira}
												onChange={(option) => handleBan(option)}
												value={getSelectedBanOption()}
												menuPortalTarget={document.body}
												menuPosition="fixed"
												placeholder="Selecione uma bandeira..."
												isClearable={true}
												styles={{
													control: (base) => ({
														...base,
														minWidth: 250,
														width: '100%',
													}),
													menu: (base) => ({
														...base,
														minWidth: 250,
														width: '100%',
													}),
													valueContainer: (base) => ({
														...base,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}),
													singleValue: (base) => ({
														...base,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														maxWidth: '90%',
													}),
												}}
											/>
										</div>
									</div>
									<MyCalendar 
										onLoadData={handleLoadData} 
										getCalendarDate={handleDateRangeChange} 
										btnDisabled={btnDisabledCredits} 
									/>
								</>
							)
						) : null}
						<button 
							className='btn btn-success-dados btn-tutorial px-2 py-1'
							onClick={() => setRunTutorial(true)}
							style={{
								position: 'relative',
								bottom: '0px',
								right: '-10px',
								zIndex: 10,
								padding: '10px 15px',
								background: 'none',
								color: '#99cc33',
								border: 'none',
								borderRadius: '5px',
								cursor: 'pointer'
							}}
						>
							<FiHelpCircle />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Creditos