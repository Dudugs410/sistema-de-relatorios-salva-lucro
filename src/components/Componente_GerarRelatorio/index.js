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

	// EXCEL ////////////////////////////////////////////////////////////
	
	const exportToExcel = () => {
		// Use the current tableData which now includes filtered data
		if (!tableData || tableData.length === 0) {
			alert('Sem dados para a exportação.')
			return
		}

		console.log(`Exporting ${tableData.length} filtered records to Excel`)
    
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Sheet 1')
    
		// Define headers based on table type
		let headers = []
		if (tipo === 'vendas') {
			headers = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC']
		} else if (tipo === 'creditos') {
			headers = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Data do Crédito', 'Data da Venda', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Código Autorização', 'Parcela', 'QTD Parc']
		} else if (tipo === 'servicos') {
			headers = ['CNPJ', 'Razão Social', 'Código do estabelecimento', 'Adquirente', 'Valor', 'Data', 'Descrição']
		} else if (tipo === 'taxas') {
			headers = ['Adquirente', 'Bandeira', 'Produto', 'Modalidade', 'Taxa Penúltimo Mês', 'Taxa Último Mês', 'Taxa Cadastrada', 'Comparativo']
		}
		
		worksheet.addRow(headers)
    
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
					rowData.nsu,
					new Date(rowData.dataVenda),
					rowData.horaVenda,
					new Date(rowData.dataCredito),
					rowData.codigoAutorizacao,
					rowData.quantidadeParcelas
				]
			
				const row = worksheet.addRow(values)

				// Apply styles only to the very first row (header row)
				if (index === 0) {
				  const headerRow = worksheet.getRow(1)
				  headerRow.eachCell((cell) => {
					cell.alignment = { horizontal: 'center' }
					cell.font = { bold: true }
				  })
				}
			})

			// Format columns
			worksheet.columns = [
				{ key: 'cnpj', width: 20 },
				{ key: 'adquirente', width: 15 },
				{ key: 'bandeira', width: 15 },
				{ key: 'produto', width: 15 },
				{ key: 'subproduto', width: 15 },
				{ key: 'valorBruto', width: 12 },
				{ key: 'valorLiquido', width: 12 },
				{ key: 'taxa', width: 10 },
				{ key: 'valorDesconto', width: 12 },
				{ key: 'nsu', width: 15 },
				{ key: 'dataVenda', width: 12 },
				{ key: 'horaVenda', width: 10 },
				{ key: 'dataCredito', width: 12 },
				{ key: 'codigoAutorizacao', width: 15 },
				{ key: 'quantidadeParcelas', width: 10 }
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
			// Add data rows
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
					rowData.nsu,
					rowData.codigoAutorizacao,
					rowData.parcela || '',
					rowData.totalParcelas || rowData.quantidadeParcelas
				]
			
				worksheet.addRow(values)

				// Apply styles to header row
				if (index === 0) {
					const headerRow = worksheet.getRow(1)
					headerRow.eachCell((cell) => {
					  cell.alignment = { horizontal: 'center' }
					  cell.font = { bold: true }
					})
				}
			})

			// Format columns for creditos
			worksheet.columns = [
				{ key: 'cnpj', width: 20 },
				{ key: 'adquirente', width: 15 },
				{ key: 'bandeira', width: 15 },
				{ key: 'produto', width: 15 },
				{ key: 'subproduto', width: 15 },
				{ key: 'dataCredito', width: 12 },
				{ key: 'dataVenda', width: 12 },
				{ key: 'valorBruto', width: 12 },
				{ key: 'valorLiquido', width: 12 },
				{ key: 'taxa', width: 10 },
				{ key: 'valorDesconto', width: 12 },
				{ key: 'nsu', width: 15 },
				{ key: 'codigoAutorizacao', width: 15 },
				{ key: 'parcela', width: 10 },
				{ key: 'quantidadeParcelas', width: 10 }
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

				// Apply styles to header row
				if (index === 0) {
					const headerRow = worksheet.getRow(1)
					headerRow.eachCell((cell) => {
					  cell.alignment = { horizontal: 'center' }
					  cell.font = { bold: true }
					})
				}
			})

			// Format columns for servicos
			worksheet.columns = [
				{ key: 'cnpj', width: 20 },
				{ key: 'razao_social', width: 25 },
				{ key: 'codigo_estabelecimento', width: 15 },
				{ key: 'nome_adquirente', width: 15 },
				{ key: 'valor', width: 12 },
				{ key: 'data', width: 12 },
				{ key: 'descricao', width: 25 }
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

				// Apply styles to header row
				if (index === 0) {
					const headerRow = worksheet.getRow(1)
					headerRow.eachCell((cell) => {
					  cell.alignment = { horizontal: 'center' }
					  cell.font = { bold: true }
					})
				}
			})

			// Format columns for taxas
			worksheet.columns = [
				{ key: 'adquirente', width: 15 },
				{ key: 'bandeira', width: 15 },
				{ key: 'produto', width: 15 },
				{ key: 'modalidade', width: 15 },
				{ key: 'taxaPenultimoMes', width: 15 },
				{ key: 'taxaUltimoMes', width: 15 },
				{ key: 'taxaCadastrada', width: 15 },
				{ key: 'comparativo', width: 15 }
			]

			// Format percentage columns
			worksheet.getColumn('taxaPenultimoMes').numFmt = '0.00"%'
			worksheet.getColumn('taxaUltimoMes').numFmt = '0.00"%'
			worksheet.getColumn('taxaCadastrada').numFmt = '0.00"%'
			worksheet.getColumn('comparativo').numFmt = '0.00"%'
		}

		// Center align all cells
		worksheet.eachRow((row, rowNumber) => {
			row.eachCell((cell) => {
				cell.alignment = { horizontal: 'center', vertical: 'middle' }
			})
		})
		
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
			columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC'];
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
					rowData.nsu,
					dateConvert(rowData.dataVenda),
					rowData.horaVenda,
					dateConvert(rowData.dataCredito),
					rowData.codigoAutorizacao,
					rowData.quantidadeParcelas
				]
			})
		} else if (tipo === 'creditos') {
			columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Data do Crédito', 'Data da Venda', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Código Autorização', 'Parcela', 'QTD Parc'];
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
				totalServicos += valor
				return [
					rowData.cnpj,
					rowData.razao_social,
					rowData.codigo_estabelecimento,
					rowData.nome_adquirente,
					`R$ ${valor.toFixed(2)}`,
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

				const text = `${tipoRelatorio} ${exportName} - ${currentDateTime.replace(/-/g, '/').replace(/\./g, ':')}`
				const textX = 14
				const textY = 18

				doc.text(text, textX, textY)
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
	
					const text = `${tipoRelatorio} ${exportName} - ${currentDateTime.replace(/-/g, '/').replace(/\./g, ':')}`
					const textX = 14
					const textY = 18
	
					doc.text(text, textX, textY)
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