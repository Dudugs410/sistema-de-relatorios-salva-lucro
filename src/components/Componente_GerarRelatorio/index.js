/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'

import { FiFilePlus } from 'react-icons/fi'

import './GerarRelatorio.scss'
import { imgExport } from '../../contexts/images'
import Cookies from 'js-cookie'
import { AuthContext } from '../../contexts/auth'

export default function GerarRelatorio({tableData, tipo}){

	const { dateConvert } = useContext(AuthContext)
	const [tipoRelatorio, setTipoRelatorio] = useState('')

	const storedNomeCliente = Cookies.get('Selecionado')
	const decodedNomeCliente = storedNomeCliente ? decodeURIComponent(storedNomeCliente) : ''
	let nomeCliente = decodedNomeCliente

	const [currentDateTime, setCurrentDateTime] = useState('')

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

	useEffect(()=>{
		switch (tipo) {
			case 'vendas':
				setTipoRelatorio('Relatório de Vendas')
				break
			case 'creditos':
				setTipoRelatorio('Relatório de Créditos')
				break
			default:
				break
		}
	},[])

	// EXCEL ////////////////////////////////////////////////////////////
	
	const exportToExcel = () => {
    
		if (!tableData || tableData.length === 0) {
			alert('No data to export.')
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
						return Number(valor.toFixed(2));
					} else if (key === 'taxa') {
						// Keep the numeric value unchanged, format with 2 decimal places
						const valor = Number(rowData[key])
						return Number(valor.toFixed(2));
					} else if (key === 'dataVenda' || key === 'dataCredito') {
						return new Date(rowData[key]);
						} else {
						return rowData[key];
						}
				});
			
				const row = worksheet.addRow(values);

				// Apply styles only to the very first row (header row)
				if (index === 0) {
				  const headerRow = worksheet.getRow(1); // Assuming the header row is the first row
				  headerRow.eachCell((cell) => {
					cell.alignment = { horizontal: 'center' };
					cell.font = { bold: true };
				  });
				}
			});

			const columnWidth = 15; // Set the width to 15 (adjust as needed)

			worksheet.columns.forEach((column, colNumber) => {
				column.width = columnWidth;
			  
				// Check if the current column's key is an exception
				const excludedColumns = ['dataVenda', 'dataCredito', 'taxa', 'valorBruto', 'valorLiquido', 'valorDesconto'];
				if (!excludedColumns.includes(column.key)) {
					column.alignment = { horizontal: 'center' };
				}
				
			});
		
			// Generate Excel file
			workbook.xlsx.writeBuffer()
				.then((buffer) => {
					saveExcelFile(buffer, `${tipoRelatorio} - ${nomeCliente} - ${currentDateTime}.xlsx`)
				})
				.catch((error) => {
					console.error('Error generating Excel file:', error)
				})
		} else if (tipo === 'creditos'){
			// Add data rows
			tableData.forEach((rowData) => {
				const values = Object.keys(rowData).map((key) => {
					// Check if the key is a numeric field that should have "R$" added
					if (key === 'valorBruto' || key === 'valorLiquido' || key === 'valorDesconto') {
						// Keep the numeric value unchanged, format with 2 decimal places
						return Number(rowData[key].toFixed(2));
					} else if (key === 'taxa') {
						// Keep the numeric value unchanged, format with 2 decimal places
						return Number(rowData[key].toFixed(2));
					} else if(key === 'dataVenda' || key === 'dataCredito'){
						return new Date(rowData[key]);
					} else {
						return rowData[key];
					}
				});
			
				worksheet.addRow(values);
			});
		
			const columnWidth = 15; // Set the width to 15 (adjust as needed)

			worksheet.columns.forEach((column) => {
				column.width = columnWidth;
			  });

			// Generate Excel file
			workbook.xlsx.writeBuffer()
			.then((buffer) => {
				saveExcelFile(buffer, `${tipoRelatorio} - ${nomeCliente} - ${currentDateTime}.xlsx`)
			})
			.catch((error) => {
				console.error('Error generating Excel file:', error)
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
			console.log('tableData: ', tableData)
			alert('Sem dados para exportar')
			return
		} else{
			if(tipo === 'vendas'){
				const columns = ['CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Data Venda', 'Hora Venda', 'Data Crédito', 'Código Autorização', 'QTD PARC']
				const rows = tableData.map(rowData => [rowData.cnpj, rowData.adquirente, rowData.bandeira, rowData.produto, rowData.subproduto, `R$ ${rowData.valorBruto}`, `R$ ${rowData.valorLiquido}`, `${rowData.taxa}%`, `R$ ${rowData.valorDesconto}`, rowData.nsu, dateConvert(rowData.dataVenda), rowData.horaVenda, dateConvert(rowData.dataCredito), rowData.codigoAutorizacao, rowData.quantidadeParcelas ])
		
				const columnStyles = {};
		
				for (let i = 0; i < columns.length; i++) {
					columnStyles[i] = { 
					align: 'center',
					valign: 'middle',
					halign : 'center', };
				}
		
				const doc = new jsPDF({
					orientation: 'landscape',
					unit: 'mm',
					format: 'a3',
				})
		
				const styles = {
					cellPadding: 2, // Adjust the padding as needed
					align: 'center', // Set the text alignment to center
				  };
		
				var myImg = imgExport
		
				doc.autoTable({
					head: [columns],
					body: rows,
					margin: {top: 30},
					headStyles : {
						fillColor : [10, 61, 112],
						valign: 'middle',
						halign : 'center',
					},
					styles: styles,
					columnStyles: columnStyles,
					didDrawPage: function (data) {
						// Add an image to each page in the top right corner
						const imageWidth = 80 // Adjust width as needed
						const imageHeight = 13 // Adjust height as needed
						const positionX = 310
						const positionY = 8
		
						const text = `${tipoRelatorio} ${nomeCliente}`;
						const textX = 14; // Adjust the X-coordinate as needed
						const textY = 18; // Adjust the Y-coordinate as needed
		
						doc.text(text, textX, textY);
		
						doc.addImage(myImg, 'PNG', positionX, positionY, imageWidth, imageHeight)
					}
				})
			
				doc.save(`${tipoRelatorio} - ${nomeCliente} - ${currentDateTime}.pdf`)
			} else if(tipo === 'creditos'){
				const columns = [ 'CNPJ', 'Adquirente', 'Bandeira', 'Produto', 'Subproduto', 'Data do Crédito', 'Data da Venda', 'ValorBruto', 'Valor Líquido', 'Taxa', 'Valor Desconto', 'NSU', 'Código Autorização', 'Parcela', 'QTD Parc']
				const rows = tableData.map(rowData => [rowData.cnpj, rowData.adquirente, rowData.bandeira, rowData.produto, rowData.subproduto, dateConvert(rowData.dataCredito), dateConvert(rowData.dataVenda), `R$ ${rowData.valorBruto.toFixed(2)}`, `R$ ${rowData.valorLiquido.toFixed(2)}`, `${rowData.taxa.toFixed(2)}%`, `R$ ${rowData.valorDesconto.toFixed(2)}`, rowData.nsu, rowData.codigoAutorizacao, rowData.parcela, rowData.totalParcelas ])
		
				const columnStyles = {};
		
				for (let i = 0; i < columns.length; i++) {
					columnStyles[i] = { 
					align: 'center',
					valign: 'middle',
					halign : 'center', };
				}
		
				const doc = new jsPDF({
					orientation: 'landscape',
					unit: 'mm',
					format: 'a3',
				})
		
				const styles = {
					cellPadding: 2, // Adjust the padding as needed
					align: 'center', // Set the text alignment to center
				  };
		
				var myImg = imgExport
		
				doc.autoTable({
					head: [columns],
					body: rows,
					margin: {top: 30},
					headStyles : {
						fillColor : [10, 61, 112],
						valign: 'middle',
						halign : 'center',
					},
					styles: styles,
					columnStyles: columnStyles,
					didDrawPage: function (data) {
						// Add an image to each page in the top right corner
						const imageWidth = 80 // Adjust width as needed
						const imageHeight = 13 // Adjust height as needed
						const positionX = 310
						const positionY = 8
		
						const text = `${tipoRelatorio} ${nomeCliente}`;
						const textX = 14; // Adjust the X-coordinate as needed
						const textY = 18; // Adjust the Y-coordinate as needed
		
						doc.text(text, textX, textY);
		
						doc.addImage(myImg, 'PNG', positionX, positionY, imageWidth, imageHeight)
					}
				})
			
				doc.save(`${tipoRelatorio} - ${nomeCliente} - ${currentDateTime}.pdf`)
			}
		}
	}
    

	return(
		<>
			<div className='container'>
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
