/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'

import { FiFilePlus } from 'react-icons/fi'

import './GerarRelatorio.scss'
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify'

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

	// Get modelo based on current path
	const getModelo = () => {
		const currentPath = localStorage.getItem('currentPath')
		switch (currentPath) {
			case '/vendas':
				return 'VENDA'
			case '/creditos':
				return 'RECEBIMENTO'
			case '/creditos-data-banco':
				return 'DATA_BANCO'
			case '/servicos':
				return 'AJUSTES'
			default:
				return 'VENDA'
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
			case '/creditos-data-banco':
				setTipoRelatorio('Relatório de Créditos - Data Banco')
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
		} else if (currentPath === '/creditos-data-banco' && creditsDateRange && creditsDateRange.length === 2) {
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
		
		// Get bandeira and adquirente from report-specific localStorage keys
		let bandeira = ''
		let adquirente = ''
		
		try {
			const bandeiraData = localStorage.getItem('reportBandeira')
			if (bandeiraData) {
				const parsed = JSON.parse(bandeiraData)
				bandeira = parsed?.codigoBandeira || ''
			}
		} catch (e) {
			console.warn('Error parsing report bandeira data:', e)
			bandeira = ''
		}
		
		try {
			const adquirenteData = localStorage.getItem('reportAdquirente')
			if (adquirenteData) {
				const parsed = JSON.parse(adquirenteData)
				adquirente = parsed?.codigoAdquirente || ''
			}
		} catch (e) {
			console.warn('Error parsing report adquirente data:', e)
			adquirente = ''
		}
		
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

		// Log the values for debugging
		console.log('Report values:', {
			bandeira,
			adquirente,
			currentPath: localStorage.getItem('currentPath')
		})

		return {
			dataInicial: formatDateToYYYYMMDD(dataInicial),
			dataFinal: formatDateToYYYYMMDD(dataFinal),
			clientes: clientesString,
			nomeGrupo: nomeGrupo,
			bandeira: bandeira || '',
			adquirente: adquirente || '',
			produto: '',
			modalidade: '',
			arquivo: format, // 'PDF' or 'XLSX'
			modelo: getModelo() // 'VENDA', 'RECEBIMENTO', 'AJUSTE', or 'DATA_BANCO'
		}
	}

	// Generic download function using the API
	const downloadReport = async (format) => {
		setDownloading(true)
		
		try {
			const requestObject = getRequestObject(format)
			
			// Log the full request for debugging
			console.log('Full request object:', requestObject)
			
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
				
				// Success toast message
				toast.success(`${format} baixado com sucesso!`)
			} else {
				console.error('API returned unsuccessful response:', response.data)
				toast.error(response.data.mensagem || `Falha ao gerar relatório ${format}`)
			}
		} catch (err) {
			console.error(`Error downloading ${format} report:`, err)
			toast.error(err.response?.data?.mensagem || err.message || `Ocorreu um erro ao gerar o relatório ${format}`)
		} finally {
			setDownloading(false)
		}
	}

	// Excel download handler
	const exportToExcel = async () => {
		if (!tableData || tableData.length === 0) {
			toast.warning('Sem dados para exportar.')
			return
		}
		await downloadReport('XLSX')
	}

	// PDF download handler
	const generatePdf = async () => {
		if (!tableData || tableData.length === 0) {
			toast.warning('Sem dados para exportar.')
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