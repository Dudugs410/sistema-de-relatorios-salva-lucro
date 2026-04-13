/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'

import { FiFilePlus } from 'react-icons/fi'

import './GerarRelatorio.scss'
import { imgExport } from '../../contexts/images'
import { AuthContext } from '../../contexts/auth'

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

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

	// FIXED: Prevent infinite loops in datetime update
	useEffect(() => {
		const updateDateTime = () => {
		  const now = new Date()

		  // Format date components
		  const day = ('0' + now.getDate()).slice(-2)
		  const month = ('0' + (now.getMonth() + 1)).slice(-2)
		  const year = now.getFullYear()
		  const formattedDate = `${day}-${month}-${year}`

		  // Format time components
		  const hour = ('0' + now.getHours()).slice(-2)
		  const minute = ('0' + now.getMinutes()).slice(-2)
		  const second = ('0' + now.getSeconds()).slice(-2)
		  const formattedTime = `${hour}.${minute}.${second}`
		  const formattedDateTime = `${formattedDate} ${formattedTime}`

		  // FIXED: Only update if the value actually changed
		  if (formattedDateTime !== currentDateTime) {
			setCurrentDateTime(formattedDateTime)
		  }
		}

		// Update the date and time initially
		updateDateTime()
	
		// FIXED: Update less frequently (every 30 seconds instead of every second)
		const intervalId = setInterval(updateDateTime, 30000)
	
		// Cleanup the interval on component unmount
		return () => clearInterval(intervalId)
	}, [currentDateTime]) // FIXED: Add currentDateTime as dependency

	// FIXED: Separate effects to prevent infinite loops
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
	}, []) // FIXED: Empty dependency array - runs only once

	// FIXED: Separate effect for setting tableData
	useEffect(() => {
		if (!tipo) return // Wait until tipo is set
		
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

		// FIXED: Only update if the data actually changed
		if (JSON.stringify(newTableData) !== JSON.stringify(tableData)) {
			setTableData(newTableData)
		}
	}, [tipo, salesTableData, creditsTableData, servicesTableData, taxesTableData, filteredData, tableData])

	// Helper function to get date range string
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
			// Convert Date objects to strings in the format expected by dateConvert
			const formatDateForConvert = (date) => {
				if (date instanceof Date) {
					const day = ('0' + date.getDate()).slice(-2)
					const month = ('0' + (date.getMonth() + 1)).slice(-2)
					const year = date.getFullYear()
					return `${day}/${month}/${year}`
				}
				return date // If it's already a string, return as is
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

	// Helper function to add formatted header to worksheet
	const addExcelHeader = (worksheet, title, dateRangeStr) => {
		// Merge cells for title (A1 to last column)
		const headersLength = getHeadersLength()
		const lastColumnLetter = String.fromCharCode(64 + headersLength)
		
		// Add company name
		worksheet.mergeCells(`A1:${lastColumnLetter}1`)
		const titleRow1 = worksheet.getCell('A1')
		titleRow1.value = 'SALVALUCRO 3.0'
		titleRow1.font = { bold: true, size: 14 }
		titleRow1.alignment = { horizontal: 'center', vertical: 'middle' }
		
		// Add report title
		worksheet.mergeCells(`A2:${lastColumnLetter}2`)
		const titleRow2 = worksheet.getCell('A2')
		titleRow2.value = title
		titleRow2.font = { bold: true, size: 12 }
		titleRow2.alignment = { horizontal: 'center', vertical: 'middle' }
		
		// Add date range
		worksheet.mergeCells(`A3:${lastColumnLetter}3`)
		const titleRow3 = worksheet.getCell('A3')
		titleRow3.value = dateRangeStr ? `Período: ${dateRangeStr}` : `Data de Exportação: ${currentDateTime}`
		titleRow3.font = { size: 10 }
		titleRow3.alignment = { horizontal: 'center', vertical: 'middle' }
		
		// Add generation date
		worksheet.mergeCells(`A4:${lastColumnLetter}4`)
		const titleRow4 = worksheet.getCell('A4')
		titleRow4.value = `Gerado em: ${currentDateTime}`
		titleRow4.font = { size: 9, italic: true }
		titleRow4.alignment = { horizontal: 'center', vertical: 'middle' }
		
		// Add empty row as separator
		worksheet.addRow([])
	}
	
	const getHeadersLength = () => {
		switch (tipo) {
			case 'vendas': return 16
			case 'creditos': return 18 // Updated from 15 to 18 for banco, agencia, conta
			case 'servicos': return 7
			case 'taxas': return 8
			default: return 0
		}
	}

	// EXCEL ////////////////////////////////////////////////////////////

	const exportToExcel = () => {

		// Use the current tableData which now includes filtered data
		if (!tableData || tableData.length === 0) {
			alert('Sem dados para a exportação.')
			return
		}

		console.log(`Exporting ${tableData.length} filtered records to Excel`)
    
		const workbook = new ExcelJS.Workbook()
		workbook.creator = 'SalvaLucro 3.0'
		workbook.lastModifiedBy = 'SalvaLucro 3.0'
		workbook.created = new Date()
		workbook.modified = new Date()
		
		const worksheet = workbook.addWorksheet(tipoRelatorio)
		
		// Get date range for header
		const dateRangeStr = getDateRangeString()
		const reportTitle = `${exportName} - ${tipoRelatorio}`
		
		// Add formatted header
		addExcelHeader(worksheet, reportTitle, dateRangeStr)
    
		// Define headers based on table type
		let headers = []
		if (tipo === 'vendas') {
			headers = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'Cartão', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC']
		} else if (tipo === 'creditos') {
			headers = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Data do Crédito', 'Data da Venda', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'Banco', 'Agência', 'Conta', 'NSU', 'Código Autorização', 'Parcela', 'QTD Parc']
		} else if (tipo === 'servicos') {
			headers = ['CNPJ', 'Razão Social', 'Código do estabelecimento', 'Adquirente', 'Valor', 'Data', 'Descrição']
		} else if (tipo === 'taxas') {
			headers = ['Adquirente', 'Bandeira', 'Produto', 'Modalidade', 'Taxa Penúltimo Mês', 'Taxa Último Mês', 'Taxa Cadastrada', 'Comparativo']
		}
		
		// Add header row with styling
		const headerRow = worksheet.addRow(headers)
		headerRow.eachCell((cell) => {
			cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FF0A3D70' }
			}
			cell.alignment = { horizontal: 'center', vertical: 'middle' }
			cell.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			}
		})
		
    	const columnWidth = 20
		
		if(tipo === 'vendas'){
			// Add data rows
			tableData.forEach((rowData, index) => {
				const values = [
					rowData.cnpj,
					getNestedValue(rowData, 'adquirente.nomeAdquirente'),
					getNestedValue(rowData, 'bandeira.descricaoBandeira'),
					getNestedValue(rowData, 'produto.descricaoProduto'),
					getNestedValue(rowData, 'modalidade.descricaoModalidade'),
					Number(rowData.valorBruto),
					Number(rowData.valorLiquido),
					Number(rowData.taxa),
					Number(rowData.valorDesconto),
					rowData.cartao,
					rowData.nsu,
					new Date(rowData.dataVenda),
					rowData.horaVenda,
					new Date(rowData.dataCredito),
					rowData.codigoAutorizacao,
					rowData.quantidadeParcelas
				]
			
				worksheet.addRow(values)
			})

			// Format columns
			worksheet.columns = [
				{ key: 'cnpj', width: columnWidth },
				{ key: 'adquirente', width: columnWidth },
				{ key: 'bandeira', width: columnWidth },
				{ key: 'produto', width: columnWidth },
				{ key: 'subproduto', width: columnWidth },
				{ key: 'valorBruto', width: columnWidth },
				{ key: 'valorLiquido', width: columnWidth },
				{ key: 'taxa', width: columnWidth },
				{ key: 'valorDesconto', width: columnWidth },
				{ key: 'cartao', width: columnWidth},
				{ key: 'nsu', width: columnWidth },
				{ key: 'dataVenda', width: columnWidth },
				{ key: 'horaVenda', width: columnWidth },
				{ key: 'dataCredito', width: columnWidth },
				{ key: 'codigoAutorizacao', width: columnWidth },
				{ key: 'quantidadeParcelas', width: columnWidth }
			]

			// Format currency and percentage columns
			worksheet.getColumn('valorBruto').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('valorLiquido').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('valorDesconto').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('taxa').numFmt = '0.00"%'

			// Format date columns
			worksheet.getColumn('dataVenda').numFmt = 'dd/mm/yyyy'
			worksheet.getColumn('dataCredito').numFmt = 'dd/mm/yyyy'
		
		} else if (tipo === 'creditos'){
			// Add data rows with banco, agencia, conta after Valor Desconto
			tableData.forEach((rowData, index) => {
				const values = [
					rowData.cnpj,
					getNestedValue(rowData, 'adquirente.nomeAdquirente'),
					getNestedValue(rowData, 'bandeira.descricaoBandeira'),
					getNestedValue(rowData, 'produto.descricaoProduto'),
					getNestedValue(rowData, 'modalidade.descricaoModalidade'),
					new Date(rowData.dataCredito),
					new Date(rowData.dataVenda),
					Number(rowData.valorBruto),
					Number(rowData.valorLiquido),
					Number(rowData.taxa),
					Number(rowData.valorDesconto),
					rowData.banco || '',
					rowData.agencia || '',
					rowData.conta || '',
					rowData.nsu,
					rowData.codigoAutorizacao,
					rowData.parcela || '',
					rowData.totalParcelas || rowData.quantidadeParcelas
				]
			
				worksheet.addRow(values)
			})

			// Format columns for creditos with additional columns after Valor Desconto
			worksheet.columns = [
				{ key: 'cnpj', width: columnWidth },
				{ key: 'adquirente', width: columnWidth },
				{ key: 'bandeira', width: columnWidth },
				{ key: 'produto', width: columnWidth },
				{ key: 'subproduto', width: columnWidth },
				{ key: 'dataCredito', width: columnWidth },
				{ key: 'dataVenda', width: columnWidth },
				{ key: 'valorBruto', width: columnWidth },
				{ key: 'valorLiquido', width: columnWidth },
				{ key: 'taxa', width: columnWidth },
				{ key: 'valorDesconto', width: columnWidth },
				{ key: 'banco', width: columnWidth },
				{ key: 'agencia', width: columnWidth },
				{ key: 'conta', width: columnWidth },
				{ key: 'nsu', width: columnWidth },
				{ key: 'codigoAutorizacao', width: columnWidth },
				{ key: 'parcela', width: columnWidth },
				{ key: 'quantidadeParcelas', width: columnWidth }
			]

			// Format currency and percentage columns
			worksheet.getColumn('valorBruto').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('valorLiquido').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('valorDesconto').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('taxa').numFmt = '0.00"%'

			// Format date columns
			worksheet.getColumn('dataCredito').numFmt = 'dd/mm/yyyy'
			worksheet.getColumn('dataVenda').numFmt = 'dd/mm/yyyy'
		
		} else if (tipo === 'servicos'){
			// Add data rows
			tableData.forEach((rowData, index) => {
				const values = [
					rowData.cnpj,
					rowData.razao_social,
					rowData.codigo_estabelecimento,
					rowData.nome_adquirente,
					Number(rowData.valor),
					new Date(rowData.data),
					rowData.descricao
				]
			
				worksheet.addRow(values)
			})

			// Format columns for servicos
			worksheet.columns = [
				{ key: 'cnpj', width: columnWidth },
				{ key: 'razao_social', width: (columnWidth * 2) + 10 },
				{ key: 'codigo_estabelecimento', width: (columnWidth * 2) + 10 },
				{ key: 'nome_adquirente', width: columnWidth },
				{ key: 'valor', width: columnWidth },
				{ key: 'data', width: columnWidth },
				{ key: 'descricao', width: (columnWidth * 2) + 10 }
			]

			// Format currency column
			worksheet.getColumn('valor').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('data').numFmt = 'dd/mm/yyyy'
		
		} else if (tipo === 'taxas'){
			// Add data rows
			tableData.forEach((rowData, index) => {
				const values = [
					rowData.adquirente,
					rowData.bandeira,
					rowData.produto,
					rowData.modalidade,
					Number(rowData.taxaMediaPenultimoMes),
					Number(rowData.taxaMediaUltimoMes),
					Number(rowData.taxaCadastrada),
					Number(rowData.comparativo)
				]
			
				worksheet.addRow(values)
			})

			// Format columns for taxas
			worksheet.columns = [
				{ key: 'adquirente', width: columnWidth },
				{ key: 'bandeira', width: columnWidth },
				{ key: 'produto', width: columnWidth },
				{ key: 'modalidade', width: columnWidth },
				{ key: 'taxaPenultimoMes', width: columnWidth },
				{ key: 'taxaUltimoMes', width: columnWidth },
				{ key: 'taxaCadastrada', width: columnWidth },
				{ key: 'comparativo', width: columnWidth }
			]

			// Format percentage columns
			worksheet.getColumn('taxaPenultimoMes').numFmt = '0.00"%'
			worksheet.getColumn('taxaUltimoMes').numFmt = '0.00"%'
			worksheet.getColumn('taxaCadastrada').numFmt = '0.00"%'
			worksheet.getColumn('comparativo').numFmt = '0.00"%'
		}

		// Style all data rows with borders and alignment
		worksheet.eachRow((row, rowNumber) => {
			// Skip header rows (first 5 rows are header info)
			if (rowNumber > 5) {
				row.eachCell((cell) => {
					cell.alignment = { horizontal: 'center', vertical: 'middle' }
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					}
				})
			}
		})
		
		// Add totals row at the bottom
		if (tipo !== 'taxas') {
			const lastRow = worksheet.rowCount
			const totalsRow = worksheet.addRow([])
			
			// Calculate totals
			let totalValue = 0
			if (tipo === 'vendas') {
				totalValue = tableData.reduce((sum, row) => sum + Number(row.valorBruto), 0)
			} else if (tipo === 'creditos') {
				totalValue = tableData.reduce((sum, row) => sum + Number(row.valorLiquido), 0)
			} else if (tipo === 'servicos') {
				totalValue = tableData.reduce((sum, row) => sum + Math.abs(Number(row.valor)), 0)
			}
			
			// Add total label and value
			const totalLabelCell = totalsRow.getCell(1)
			totalLabelCell.value = 'TOTAL GERAL'
			totalLabelCell.font = { bold: true }
			totalLabelCell.alignment = { horizontal: 'right' }
			
			// Find the value column index
			let valueColIndex = tipo === 'vendas' ? 6 : (tipo === 'creditos' ? 8 : 5)
			const totalValueCell = totalsRow.getCell(valueColIndex)
			totalValueCell.value = totalValue
			totalValueCell.numFmt = '"R$"#,##0.00'
			totalValueCell.font = { bold: true }
			totalValueCell.alignment = { horizontal: 'center' }
		}
		
		// Generate Excel file
		workbook.xlsx.writeBuffer()
			.then((buffer) => {
				saveExcelFile(buffer, `${tipoRelatorio} - ${exportName} - ${currentDateTime}.xlsx`)
			})
			.catch((error) => {
				console.error('Erro ao gerar arquivo excel: ', error)
			})
	}
    
	const saveExcelFile = (buffer, fileName) => {
		const data = new Blob([buffer], { type: 'application/octet-stream' })
		const url = URL.createObjectURL(data)
		const link = document.createElement('a')
		link.href = url
		link.download = fileName
		link.click()
	}

	// PDF ////////////////////////////////////////////////////////////

	const generatePdf = () => {
		// Use the current tableData which now includes filtered data
		if (!tableData || tableData.length === 0) {
			alert('Sem dados para exportar')
			return
		}

		console.log(`Exporting ${tableData.length} filtered records to PDF`)
    
		const doc = new jsPDF({
			orientation: 'landscape',
			unit: 'mm',
			format: 'a3',
		})

		var myImg = imgExport

		let columns = []
		let rows = []
		let totalBruto = 0
		let totalDesconto = 0
		let totalLiquido = 0
		let totalServicos = 0

		if (tipo === 'vendas') {
			columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'Cartão', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC'];
			rows = tableData.map(rowData => {
				const valorBruto = Number(rowData.valorBruto)
				const valorLiquido = Number(rowData.valorLiquido)
				const valorDesconto = Number(rowData.valorDesconto)

				totalBruto += valorBruto
				totalLiquido += valorLiquido
				totalDesconto += valorDesconto

				return [
					rowData.cnpj,
					getNestedValue(rowData, 'adquirente.nomeAdquirente'),
					getNestedValue(rowData, 'bandeira.descricaoBandeira'),
					getNestedValue(rowData, 'produto.descricaoProduto'),
					getNestedValue(rowData, 'modalidade.descricaoModalidade'),
					`R$ ${valorBruto.toFixed(2)}`,
					`R$ ${valorLiquido.toFixed(2)}`,
					`${Number(rowData.taxa).toFixed(2)}%`,
					`R$ ${valorDesconto.toFixed(2)}`,
					getNestedValue(rowData, 'cartao'),
					rowData.nsu,
					dateConvert(rowData.dataVenda),
					rowData.horaVenda,
					dateConvert(rowData.dataCredito),
					rowData.codigoAutorizacao,
					rowData.quantidadeParcelas
				]
			})
		} else if (tipo === 'creditos') {
			columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Data do Crédito', 'Data da Venda', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'Banco', 'Agência', 'Conta', 'NSU', 'Código Autorização', 'Parcela', 'QTD Parc'];
			rows = tableData.map(rowData => {
				const valorBruto = Number(rowData.valorBruto)
				const valorLiquido = Number(rowData.valorLiquido)
				const valorDesconto = Number(rowData.valorDesconto)

				totalBruto += valorBruto
				totalLiquido += valorLiquido
				totalDesconto += valorDesconto

				return [
					rowData.cnpj,
					getNestedValue(rowData, 'adquirente.nomeAdquirente'),
					getNestedValue(rowData, 'bandeira.descricaoBandeira'),
					getNestedValue(rowData, 'produto.descricaoProduto'),
					getNestedValue(rowData, 'modalidade.descricaoModalidade'),
					dateConvert(rowData.dataCredito),
					dateConvert(rowData.dataVenda),
					`R$ ${valorBruto.toFixed(2)}`,
					`R$ ${valorLiquido.toFixed(2)}`,
					`${Number(rowData.taxa).toFixed(2)}%`,
					`R$ ${valorDesconto.toFixed(2)}`,
					rowData.banco || '',
					rowData.agencia || '',
					rowData.conta || '',
					rowData.nsu,
					rowData.codigoAutorizacao,
					rowData.parcela || '',
					rowData.totalParcelas || rowData.quantidadeParcelas
				]
			})
		} else if (tipo === 'servicos') {
			columns = ['CNPJ', 'Razão Social', 'Código do estabelecimento', 'Adquirente', 'Valor', 'Data', 'Descrição']
			rows = tableData.map(rowData => {
				const valor = Number(rowData.valor)
				totalServicos += Math.abs(valor)
				return [
					rowData.cnpj,
					rowData.razao_social,
					rowData.codigo_estabelecimento,
					rowData.nome_adquirente,
					`R$ ${Math.abs(valor).toFixed(2)}`,
					dateConvert(rowData.data),
					rowData.descricao
				]
			})
		} else if (tipo === 'taxas') {
			columns = ['Adquirente', 'Bandeira', 'Produto', 'Modalidade', 'Taxa Penúltimo Mês', 'Taxa Último Mês', 'Taxa Cadastrada', 'Comparativo']
			rows = tableData.map(rowData => {
				return [
					rowData.adquirente,
					rowData.bandeira,
					rowData.produto,
					rowData.modalidade,
					`${rowData.taxaMediaPenultimoMes.toFixed(2)} %`,
					`${rowData.taxaMediaUltimoMes.toFixed(2)} %`,
					`${rowData.taxaCadastrada.toFixed(2)} %`,
					`${rowData.comparativo.toFixed(2)} %`
				]
			})
		}

		// Get date range for header
		const dateRangeStr = getDateRangeString()
		const headerText = dateRangeStr ? `${exportName} - ${tipoRelatorio} - ${dateRangeStr}` : `${exportName} - ${tipoRelatorio} - ${currentDateTime.replace(/-/g, '/').replace(/\./g, ':')}`

		const columnStyles = {}
		for (let i = 0; i < columns.length; i++) {
			columnStyles[i] = {
				align: 'center',
				valign: 'middle',
				halign: 'center',
			}
		}

		const styles = {
			cellPadding: 2,
			align: 'center',
		}

		doc.autoTable({
			head: [columns],
			body: rows,
			margin: { top: 30 },
			headStyles: {
				fillColor: [10, 61, 112],
				valign: 'middle',
				halign: 'center',
			},
			styles: styles,
			columnStyles: columnStyles,
			didDrawPage: function (data) {
				const imageWidth = 80
				const imageHeight = 13
				const positionX = 310
				const positionY = 8

				const textX = 14
				const textY = 18

				doc.text(headerText, textX, textY)
				doc.addImage(myImg, 'PNG', positionX, positionY, imageWidth, imageHeight)
			}
		})

		if(tipo !== 'taxas'){
		// Add totals to the last page
		doc.addPage()
		doc.setFontSize(12)

		// Draw horizontal line further down
		doc.setLineWidth(0.5)
		const pageWidth = doc.internal.pageSize.getWidth()
		const margin = 10
		doc.line(margin, 30, pageWidth - margin, 30)

		// Add some spacing for totals
		const totals = []
		if(tipo !== 'servicos'){
				totals.push(['Total Bruto', `R$ ${totalBruto.toFixed(2)}`])
				totals.push(['Total Desconto', `R$ ${totalDesconto.toFixed(2)}`])
				totals.push(['Total Líquido', `R$ ${totalLiquido.toFixed(2)}`])
			} else {
				totals.push(['Total', `R$ ${totalServicos.toFixed(2)}`])
			}
	
			// Draw totals without header
			doc.autoTable({
				body: totals,
				startY: 35,  // Adjusted Y coordinate for the table start position
				styles: {
					cellPadding: 2,
					align: 'center',
				},
				columnStyles: {
					0: { halign: 'left' },
					1: { halign: 'right' }
				},
				didDrawPage: function (data) {
					const imageWidth = 80
					const imageHeight = 13
					const positionX = 310
					const positionY = 8
	
					doc.text(headerText, 14, 18)
					doc.addImage(myImg, 'PNG', positionX, positionY, imageWidth, imageHeight)
				}
			})
		}
		doc.save(`${tipoRelatorio} - ${exportName} - ${currentDateTime}.pdf`)
	}

	return(
		<>
			<div data-tour="exportacao-section" className='container'>
				<div className='export-column'>
					<button className="btn btn-exportar btn-exportar-excel" onClick={exportToExcel}>Download Excel <FiFilePlus /></button>
				</div>
				<div className='export-column'>
					<button className='btn btn-exportar btn-exportar-pdf' onClick={generatePdf}>Download PDF <FiFilePlus /></button>
				</div>
			</div>
		</>
	)
}