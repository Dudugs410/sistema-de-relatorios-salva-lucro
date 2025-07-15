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

export default function GerarRelatorio(){

	const { 
		dateConvert, exportName,
		salesTableData, creditsTableData, servicesTableData, taxesTableData,
	} = useContext(AuthContext)

	const [tipoRelatorio, setTipoRelatorio] = useState('')
	const [currentDateTime, setCurrentDateTime] = useState('')
	const [tipo, setTipo] = useState('')
	const [tableData, setTableData] = useState([])

	useEffect(()=>{
		console.log('export: SALES -> ', salesTableData)
	},[salesTableData])

	useEffect(()=>{
		console.log('export: CREDITS -> ', creditsTableData)
	},[creditsTableData])

	useEffect(()=>{
		console.log('export: SERVICES -> ', servicesTableData)
	},[servicesTableData])

	useEffect(()=>{
		console.log('export: TAXES -> ', taxesTableData)
	},[taxesTableData])

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

		  setCurrentDateTime(formattedDateTime)
		}

		// Update the date and time initially
		updateDateTime()
	
		// Update the date and time every second (optional)
		const intervalId = setInterval(updateDateTime, 1000)
	
		// Cleanup the interval on component unmount
		return () => clearInterval(intervalId)
	  }, [])

	useEffect(() => {
	switch (localStorage.getItem('currentPath')) {
		case '/vendas':
		setTipoRelatorio('Relatório de Vendas')
		setTipo('vendas')
		setTableData(salesTableData)
		break
		case '/creditos':
		setTipoRelatorio('Relatório de Créditos')
		setTipo('creditos')
		setTableData(creditsTableData)
		break
		case '/servicos':
		setTipoRelatorio('Relatório de Serviços')
		setTipo('servicos')
		setTableData(servicesTableData)
		break // Add missing break
		default:
		break
	}
	}, [salesTableData, creditsTableData, servicesTableData]) // Add dependencies

	// EXCEL ////////////////////////////////////////////////////////////
	
	const exportToExcel = () => {

		if (!tableData || tableData.length === 0) {
			alert('Sem dados para a exportação.')
			return
		}
    
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Sheet 1')
    
		// Add headers
		const headers = Object.keys(tableData[0])
		worksheet.addRow(headers)
    
		if(tipo === 'vendas'){
			// Add data rows
			tableData.forEach((rowData, index) => {
				const values = Object.keys(rowData).map((key) => {
					// Check if the key is a numeric field that should have "R$" added
					if (key === 'valorBruto' || key === 'valorLiquido' || key === 'valorDesconto') {
						// Keep the numeric value unchanged, format with 2 decimal places
						const valor = Number(rowData[key])
						return Number(valor.toFixed(2))
					} else if (key === 'taxa') {
						// Keep the numeric value unchanged, format with 2 decimal places
						const valor = Number(rowData[key])
						return Number(valor.toFixed(2))
					} else if (key === 'dataVenda' || key === 'dataCredito') {
						return new Date(rowData[key])
						} else {
						return rowData[key]
						}
				})
			
				const row = worksheet.addRow(values)

				// Apply styles only to the very first row (header row)
				if (index === 0) {
				  const headerRow = worksheet.getRow(1) // Assuming the header row is the first row
				  headerRow.eachCell((cell) => {
					cell.alignment = { horizontal: 'center' }
					cell.font = { bold: true }
				  })
				}
			})

			const columnWidth = 15 // Set the width to 15 (adjust as needed)

			worksheet.columns.forEach((column, colNumber) => {
				column.width = columnWidth
			  
				// Check if the current column's key is an exception
				const excludedColumns = ['dataVenda', 'dataCredito', 'taxa', 'valorBruto', 'valorLiquido', 'valorDesconto'];
				if (!excludedColumns.includes(column.key)) {
					column.alignment = { horizontal: 'center' }
				}
				
			})
		
			// Generate Excel file
			workbook.xlsx.writeBuffer()
				.then((buffer) => {
					saveExcelFile(buffer, `${tipoRelatorio} - ${exportName} - ${currentDateTime}.xlsx`)
				})
				.catch((error) => {
					console.error('Erro ao gerar arquivo excel: ', error)
				})
		} else if (tipo === 'creditos'){
			// Add data rows
			tableData.forEach((rowData) => {
				const values = Object.keys(rowData).map((key) => {
					// Check if the key is a numeric field that should have "R$" added
					if (key === 'valorBruto' || key === 'valorLiquido' || key === 'valorDesconto') {
						// Keep the numeric value unchanged, format with 2 decimal places
						return Number(rowData[key].toFixed(2))
					} else if (key === 'taxa') {
						// Keep the numeric value unchanged, format with 2 decimal places
						return Number(rowData[key].toFixed(2))
					} else if(key === 'dataVenda' || key === 'dataCredito'){
						return new Date(rowData[key])
					} else {
						return rowData[key]
					}
				})
			
				worksheet.addRow(values)
			})
		
			const columnWidth = 15 // Set the width to 15 (adjust as needed)

			worksheet.columns.forEach((column) => {
				column.width = columnWidth
			  })

			// Generate Excel file
			workbook.xlsx.writeBuffer()
			.then((buffer) => {
				saveExcelFile(buffer, `${tipoRelatorio} - ${exportName} - ${currentDateTime}.xlsx`)
			})
			.catch((error) => {
				console.error('Erro ao gerar arquivo Excel: ', error)
			})
		} else if (tipo === 'servicos'){
			// Add data rows
			tableData.forEach((rowData) => {
				const values = Object.keys(rowData).map((key) => {
					// Check if the key is a numeric field that should have "R$" added
					if (key === 'valor') {
						// Keep the numeric value unchanged, format with 2 decimal places
						return Number(rowData[key].toFixed(2))
					} else if(key === 'data'){
						return new Date(rowData[key])
					} else {
						return rowData[key]
					}
				})
			
				worksheet.addRow(values)
			})
		
			const columnWidth = 15 // Set the width to 15 (adjust as needed)

			worksheet.columns.forEach((column) => {
				column.width = columnWidth
			  })

			// Generate Excel file
			workbook.xlsx.writeBuffer()
			.then((buffer) => {
				saveExcelFile(buffer, `${tipoRelatorio} - ${exportName} - ${currentDateTime}.xlsx`)
			})
			.catch((error) => {
				console.error('Erro ao gerar arquivo Excel: ', error)
			})
		}
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
		} else {
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
				console.log('tableData VENDAS: ', tableData)
				columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC'];
				rows = tableData.map(rowData => {
					const valorBruto = Number(rowData.valorBruto)
					const valorLiquido = Number(rowData.valorLiquido)
					const valorDesconto = Number(rowData.valorDesconto)
	
					totalBruto += valorBruto
					totalLiquido += valorLiquido
					totalDesconto += valorDesconto
	
					return [
						rowData.cnpj, rowData.adquirente, rowData.bandeira, rowData.produto, rowData.subproduto,
						`R$ ${valorBruto.toFixed(2)}`, `R$ ${valorLiquido.toFixed(2)}`, `${Number(rowData.taxa).toFixed(2)}%`, `R$ ${valorDesconto.toFixed(2)}`,
						rowData.nsu, dateConvert(rowData.dataVenda), rowData.horaVenda, dateConvert(rowData.dataCredito), rowData.codigoAutorizacao, rowData.quantidadeParcelas
					]
				})
			} else if (tipo === 'creditos') {
				console.log('tableData CREDITOS: ', tableData)
				columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Data do Crédito', 'Data da Venda', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Código Autorização', 'Parcela', 'QTD Parc'];
				rows = tableData.map(rowData => {
					const valorBruto = Number(rowData.valorBruto)
					const valorLiquido = Number(rowData.valorLiquido)
					const valorDesconto = Number(rowData.valorDesconto)
	
					totalBruto += valorBruto
					totalLiquido += valorLiquido
					totalDesconto += valorDesconto
	
					return [
						rowData.cnpj, rowData.adquirente, rowData.bandeira, rowData.produto, rowData.subproduto,
						dateConvert(rowData.dataCredito), dateConvert(rowData.dataVenda),
						`R$ ${valorBruto.toFixed(2)}`, `R$ ${valorLiquido.toFixed(2)}`, `${Number(rowData.taxa).toFixed(2)}%`, `R$ ${valorDesconto.toFixed(2)}`,
						rowData.nsu, rowData.codigoAutorizacao, rowData.parcela, rowData.totalParcelas
					]
				})
			} else if (tipo === 'servicos') {
				console.log('tableData SERVIÇOS: ', tableData)
				columns = ['CNPJ', 'Razão Social', 'Código do estabelecimento', 'Adquirente', 'Valor', 'Data', 'Descrição']
				rows = tableData.map(rowData => {
					const valor = Number(rowData.valor)
					totalServicos += valor
					return [
						rowData.cnpj, rowData.razao_social, rowData.codigo_estabelecimento, rowData.adquirente,
						`R$ ${valor.toFixed(2)}`, dateConvert(rowData.data), rowData.descricao
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
	
			doc.save(`${tipoRelatorio} - ${exportName} - ${currentDateTime}.pdf`)
		}
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
