/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'

import { FiFilePlus } from 'react-icons/fi'

import './GerarRelatorio.scss'
import { AuthContext } from '../../contexts/auth'

export default function GerarRelatorio({ onExport, filteredData }) {

	const { 
		dateConvert, exportName,
		salesTableData, creditsTableData, servicesTableData, taxesTableData,
		salesDateRange, creditsDateRange, servicesDateRange,
	} = useContext(AuthContext)

	const [tipoRelatorio, setTipoRelatorio] = useState('')
	const [currentDateTime, setCurrentDateTime] = useState('')
	const [tipo, setTipo] = useState('')
	const [tableData, setTableData] = useState([])
	const [downloading, setDownloading] = useState(false)

	// Update datetime
	useEffect(() => {
		const updateDateTime = () => {
		  const now = new Date()
		  const day = ('0' + now.getDate()).slice(-2)
		  const month = ('0' + (now.getMonth() + 1)).slice(-2)
		  const year = now.getFullYear()
		  const formattedDate = `${day}-${month}-${year}`
		  const hour = ('0' + now.getHours()).slice(-2)
		  const minute = ('0' + now.getMinutes()).slice(-2)
		  const second = ('0' + now.getSeconds()).slice(-2)
		  const formattedTime = `${hour}.${minute}.${second}`
		  const formattedDateTime = `${formattedDate} ${formattedTime}`

		  if (formattedDateTime !== currentDateTime) {
			setCurrentDateTime(formattedDateTime)
		  }
		}

		updateDateTime()
		const intervalId = setInterval(updateDateTime, 30000)
		return () => clearInterval(intervalId)
	}, [currentDateTime])

	// In GerarRelatorio.jsx - Update getModelo function
	const getModelo = () => {
	const currentPath = localStorage.getItem('currentPath')
	switch (currentPath) {
		case '/vendas':
		return 'VENDA'
		case '/creditos':
		return 'RECEBIMENTO'
		case '/creditos-data-banco':  // Add this case
		return 'DATA_BANCO'
		case '/servicos':
		return 'AJUSTE'
		default:
		return 'VENDA'
	}
	}

	// Update getStorageKeys function to include DATA_BANCO
	const getStorageKeys = () => {
	const currentPath = localStorage.getItem('currentPath')
	switch (currentPath) {
		case '/vendas':
		return { ban: 'selectedBan', adm: 'selectedAdm' }
		case '/creditos':
		return { ban: 'selectedBanCredits', adm: 'selectedAdmCredits' }
		case '/creditos-data-banco':  // Add this case
		return { ban: 'selectedBanCredits', adm: 'selectedAdmCredits' }  // Reuse same keys or create new ones
		case '/servicos':
		return { ban: 'selectedBanServices', adm: 'selectedAdmServices' }
		default:
		return { ban: 'selectedBan', adm: 'selectedAdm' }
	}
	}

	useEffect(() => {
		const currentPath = localStorage.getItem('currentPath')
		
		switch (currentPath) {
			case '/vendas':
				setTipoRelatorio('Relatório de Vendas')
				setTipo('vendas')
				break
			case '/creditos':
				setTipoRelatorio('Relatório de Créditos')
				setTipo('creditos')
				break
			case '/servicos':
				setTipoRelatorio('Relatório de Serviços')
				setTipo('servicos')
				break
			case '/taxas':
				setTipoRelatorio('Relatório de Taxas')
				setTipo('taxas')
				break
			default:
				break
		}
	}, [])

	useEffect(() => {
		if (!tipo) return
		
		let newTableData = []
		
		switch (tipo) {
			case 'vendas':
				newTableData = filteredData && filteredData.length > 0 ? filteredData : salesTableData
				break
			case 'creditos':
				newTableData = filteredData && filteredData.length > 0 ? filteredData : creditsTableData
				break
			case 'servicos':
				newTableData = filteredData && filteredData.length > 0 ? filteredData : servicesTableData
				break
			case 'taxas':
				newTableData = filteredData && filteredData.length > 0 ? filteredData : taxesTableData
				break
			default:
				return
		}

		if (JSON.stringify(newTableData) !== JSON.stringify(tableData)) {
			setTableData(newTableData)
		}
	}, [tipo, salesTableData, creditsTableData, servicesTableData, taxesTableData, filteredData, tableData])

	const getDateRangeString = () => {
		const currentPath = localStorage.getItem('currentPath')
		let dateRange = null
		
		if (currentPath === '/vendas' && salesDateRange && salesDateRange.length === 2) {
			dateRange = salesDateRange
		} else if (currentPath === '/creditos' && creditsDateRange && creditsDateRange.length === 2) {
			dateRange = creditsDateRange
		} else if (currentPath === '/servicos' && servicesDateRange && servicesDateRange.length === 2) {
			dateRange = servicesDateRange
		}
		
		if (dateRange && dateRange[0] && dateRange[1]) {
			const formatDateForConvert = (date) => {
				if (date instanceof Date) {
					const day = ('0' + date.getDate()).slice(-2)
					const month = ('0' + (date.getMonth() + 1)).slice(-2)
					const year = date.getFullYear()
					return `${day}/${month}/${year}`
				}
				return date
			}
			
			const startDate = formatDateForConvert(dateRange[0])
			const endDate = formatDateForConvert(dateRange[1])
			
			if (startDate === endDate) {
				return startDate
			}
			return `${startDate} a ${endDate}`
		}
		return ''
	}

	// Helper function to get the request object for the API
	const getRequestObject = (format) => {
		const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
		const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
		const dataInicial = localStorage.getItem('dataInicial')
		const dataFinal = localStorage.getItem('dataFinal')
		
		// Get dynamic storage keys based on current path
		const storageKeys = getStorageKeys()
		const bandeira = JSON.parse(localStorage.getItem(storageKeys.ban)) || ''
		const adquirente = JSON.parse(localStorage.getItem(storageKeys.adm)) || ''
		
		// Format date function
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
		let ban = bandeira?.codigoBandeira || ''
		let adq = adquirente?.codigoAdquirente || ''

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
			modelo: getModelo() // 'VENDA', 'RECEBIMENTO', or 'AJUSTE'
		}
	}

	// Generic download function using the API
	const downloadReport = async (format) => {
		setDownloading(true)
		
		try {
			const requestObject = getRequestObject(format)
			
			console.log(`Downloading ${format} report with request:`, requestObject)
			
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
				const dateRangeStr = getDateRangeString()
				const fileName = dateRangeStr 
					? `${tipoRelatorio} - ${exportName} - ${dateRangeStr}.${fileExtension}`
					: `${tipoRelatorio} - ${exportName} - ${currentDateTime}.${fileExtension}`
				a.download = fileName
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
				
				console.log(`${format} report downloaded successfully`)
			} else {
				console.error('API returned unsuccessful response:', response.data)
				alert(response.data.mensagem || `Failed to generate ${format} report`)
			}
		} catch (err) {
			console.error(`Error downloading ${format} report:`, err)
			alert(err.response?.data?.mensagem || err.message || `An error occurred while generating the ${format} report`)
		} finally {
			setDownloading(false)
		}
	}

	// Excel download handler
	const exportToExcel = async () => {
		if (!tableData || tableData.length === 0) {
			alert('Sem dados para a exportação.')
			return
		}
		await downloadReport('XLSX')
	}

	// PDF download handler
	const generatePdf = async () => {
		if (!tableData || tableData.length === 0) {
			alert('Sem dados para exportar')
			return
		}
		await downloadReport('PDF')
	}

	return(
		<>
			<div data-tour="exportacao-section" className='container'>
				<div className='export-column'>
					<button 
						className="btn btn-exportar btn-exportar-excel" 
						onClick={exportToExcel}
						disabled={downloading}
					>
						{downloading ? 'Gerando...' : 'Download Excel'} <FiFilePlus />
					</button>
				</div>
				<div className='export-column'>
					<button 
						className='btn btn-exportar btn-exportar-pdf' 
						onClick={generatePdf}
						disabled={downloading}
					>
						{downloading ? 'Gerando...' : 'Download PDF'} <FiFilePlus />
					</button>
				</div>
			</div>
		</>
	)
}