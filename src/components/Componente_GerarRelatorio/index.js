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

// Helper function to get nested object values (for old structure)
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

	const addExcelHeader = (worksheet, title, dateRangeStr) => {
		const headersLength = getHeadersLength()
		const lastColumnLetter = String.fromCharCode(64 + headersLength)
		
		worksheet.mergeCells(`A1:${lastColumnLetter}1`)
		const titleRow1 = worksheet.getCell('A1')
		titleRow1.value = 'SALVALUCRO 3.0'
		titleRow1.font = { bold: true, size: 14 }
		titleRow1.alignment = { horizontal: 'center', vertical: 'middle' }
		
		worksheet.mergeCells(`A2:${lastColumnLetter}2`)
		const titleRow2 = worksheet.getCell('A2')
		titleRow2.value = title
		titleRow2.font = { bold: true, size: 12 }
		titleRow2.alignment = { horizontal: 'center', vertical: 'middle' }
		
		worksheet.mergeCells(`A3:${lastColumnLetter}3`)
		const titleRow3 = worksheet.getCell('A3')
		titleRow3.value = dateRangeStr ? `Período: ${dateRangeStr}` : `Data de Exportação: ${currentDateTime}`
		titleRow3.font = { size: 10 }
		titleRow3.alignment = { horizontal: 'center', vertical: 'middle' }
		
		worksheet.mergeCells(`A4:${lastColumnLetter}4`)
		const titleRow4 = worksheet.getCell('A4')
		titleRow4.value = `Gerado em: ${currentDateTime}`
		titleRow4.font = { size: 9, italic: true }
		titleRow4.alignment = { horizontal: 'center', vertical: 'middle' }
		
		worksheet.addRow([])
	}
	
	const getHeadersLength = () => {
		switch (tipo) {
			case 'vendas': return 19 // Added more columns for new structure
			case 'creditos': return 18
			case 'servicos': return 7
			case 'taxas': return 8
			default: return 0
		}
	}

	// EXCEL ////////////////////////////////////////////////////////////

	const exportToExcel = () => {
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
		
		const dateRangeStr = getDateRangeString()
		const reportTitle = `${exportName} - ${tipoRelatorio}`
		
		addExcelHeader(worksheet, reportTitle, dateRangeStr)
    
		let headers = []
		if (tipo === 'vendas') {
			headers = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Desconto %', 'Cartão', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC', 'Status', 'Número PV', 'RO']
		} else if (tipo === 'creditos') {
			headers = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Data do Crédito', 'Data da Venda', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'Banco', 'Agência', 'Conta', 'NSU', 'Código Autorização', 'Parcela', 'QTD Parc']
		} else if (tipo === 'servicos') {
			headers = ['CNPJ', 'Razão Social', 'Código do estabelecimento', 'Adquirente', 'Valor', 'Data', 'Descrição']
		} else if (tipo === 'taxas') {
			headers = ['Adquirente', 'Bandeira', 'Produto', 'Modalidade', 'Taxa Penúltimo Mês', 'Taxa Último Mês', 'Taxa Cadastrada', 'Comparativo']
		}
		
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
			// Add data rows with new structure
			tableData.forEach((rowData, index) => {
				const values = [
					rowData.CNPJ,
					rowData.ADMINISTRADORA,
					rowData.BANDEIRA,
					(rowData.PRODUTO || "").trim(),
					rowData.MODALIDADE,
					Number(rowData.VALORBRUTO),
					Number(rowData.VALORLIQUIDO),
					Number(rowData.TAXA),
					Number(rowData.DESCONTO),
					rowData.CARTAO,
					rowData.NSU,
					new Date(rowData.DATAVENDA),
					rowData.HORAVENDA || 'N/A',
					new Date(rowData.DATACREDITO),
					rowData.AUTORIZACAO,
					rowData.PARCELA,
					rowData.STATUS,
					rowData.NUMEROPV,
					rowData.RO
				]
			
				worksheet.addRow(values)
			})

			worksheet.columns = [
				{ key: 'cnpj', width: columnWidth },
				{ key: 'adquirente', width: columnWidth },
				{ key: 'bandeira', width: columnWidth },
				{ key: 'produto', width: columnWidth },
				{ key: 'subproduto', width: columnWidth },
				{ key: 'valorBruto', width: columnWidth },
				{ key: 'valorLiquido', width: columnWidth },
				{ key: 'taxa', width: columnWidth },
				{ key: 'desconto', width: columnWidth },
				{ key: 'cartao', width: columnWidth},
				{ key: 'nsu', width: columnWidth },
				{ key: 'dataVenda', width: columnWidth },
				{ key: 'horaVenda', width: columnWidth },
				{ key: 'dataCredito', width: columnWidth },
				{ key: 'codigoAutorizacao', width: columnWidth },
				{ key: 'quantidadeParcelas', width: columnWidth },
				{ key: 'status', width: columnWidth },
				{ key: 'numeroPV', width: columnWidth },
				{ key: 'ro', width: columnWidth }
			]

			worksheet.getColumn('valorBruto').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('valorLiquido').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('taxa').numFmt = '0.00"%'
			worksheet.getColumn('desconto').numFmt = '0.00"%'
			worksheet.getColumn('dataVenda').numFmt = 'dd/mm/yyyy'
			worksheet.getColumn('dataCredito').numFmt = 'dd/mm/yyyy'
		
		} else if (tipo === 'creditos'){
			// Keep old structure for credits for now
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

			worksheet.getColumn('valorBruto').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('valorLiquido').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('valorDesconto').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('taxa').numFmt = '0.00"%'
			worksheet.getColumn('dataCredito').numFmt = 'dd/mm/yyyy'
			worksheet.getColumn('dataVenda').numFmt = 'dd/mm/yyyy'
		
		} else if (tipo === 'servicos'){
			// Keep old structure for services for now
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

			worksheet.columns = [
				{ key: 'cnpj', width: columnWidth },
				{ key: 'razao_social', width: (columnWidth * 2) + 10 },
				{ key: 'codigo_estabelecimento', width: (columnWidth * 2) + 10 },
				{ key: 'nome_adquirente', width: columnWidth },
				{ key: 'valor', width: columnWidth },
				{ key: 'data', width: columnWidth },
				{ key: 'descricao', width: (columnWidth * 2) + 10 }
			]

			worksheet.getColumn('valor').numFmt = '"R$"#,##0.00'
			worksheet.getColumn('data').numFmt = 'dd/mm/yyyy'
		
		} else if (tipo === 'taxas'){
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

			worksheet.getColumn('taxaPenultimoMes').numFmt = '0.00"%'
			worksheet.getColumn('taxaUltimoMes').numFmt = '0.00"%'
			worksheet.getColumn('taxaCadastrada').numFmt = '0.00"%'
			worksheet.getColumn('comparativo').numFmt = '0.00"%'
		}

		worksheet.eachRow((row, rowNumber) => {
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
		
		if (tipo !== 'taxas') {
			const totalsRow = worksheet.addRow([])
			
			let totalValue = 0
			if (tipo === 'vendas') {
				totalValue = tableData.reduce((sum, row) => sum + Number(row.VALORBRUTO), 0)
			} else if (tipo === 'creditos') {
				totalValue = tableData.reduce((sum, row) => sum + Number(row.valorLiquido), 0)
			} else if (tipo === 'servicos') {
				totalValue = tableData.reduce((sum, row) => sum + Math.abs(Number(row.valor)), 0)
			}
			
			const totalLabelCell = totalsRow.getCell(1)
			totalLabelCell.value = 'TOTAL GERAL'
			totalLabelCell.font = { bold: true }
			totalLabelCell.alignment = { horizontal: 'right' }
			
			let valueColIndex = tipo === 'vendas' ? 6 : (tipo === 'creditos' ? 8 : 5)
			const totalValueCell = totalsRow.getCell(valueColIndex)
			totalValueCell.value = totalValue
			totalValueCell.numFmt = '"R$"#,##0.00'
			totalValueCell.font = { bold: true }
			totalValueCell.alignment = { horizontal: 'center' }
		}
		
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
			columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Desconto %', 'Cartão', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC', 'Status', 'Número PV'];
			rows = tableData.map(rowData => {
				const valorBruto = Number(rowData.VALORBRUTO)
				const valorLiquido = Number(rowData.VALORLIQUIDO)
				const desconto = Number(rowData.DESCONTO)

				totalBruto += valorBruto
				totalLiquido += valorLiquido

				return [
					rowData.CNPJ,
					rowData.ADMINISTRADORA,
					rowData.BANDEIRA,
					(rowData.PRODUTO || "").trim(),
					rowData.MODALIDADE,
					`R$ ${valorBruto.toFixed(2)}`,
					`R$ ${valorLiquido.toFixed(2)}`,
					`${Number(rowData.TAXA).toFixed(2)}%`,
					`${desconto.toFixed(2)}%`,
					rowData.CARTAO,
					rowData.NSU,
					dateConvert(rowData.DATAVENDA),
					rowData.HORAVENDA || 'N/A',
					dateConvert(rowData.DATACREDITO),
					rowData.AUTORIZACAO,
					rowData.PARCELA,
					rowData.STATUS,
					rowData.NUMEROPV
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
			doc.addPage()
			doc.setFontSize(12)

			doc.setLineWidth(0.5)
			const pageWidth = doc.internal.pageSize.getWidth()
			const margin = 10
			doc.line(margin, 30, pageWidth - margin, 30)

			const totals = []
			if(tipo !== 'servicos'){
				totals.push(['Total Bruto', `R$ ${totalBruto.toFixed(2)}`])
				totals.push(['Total Líquido', `R$ ${totalLiquido.toFixed(2)}`])
			} else {
				totals.push(['Total', `R$ ${totalServicos.toFixed(2)}`])
			}
	
			doc.autoTable({
				body: totals,
				startY: 35,
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