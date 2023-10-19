import React from 'react'

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'

import { FiFilePlus } from 'react-icons/fi'

import './GerarRelatorio.scss'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth'
import { imgExport } from '../../contexts/images'

export default function GerarRelatorio({tableData, dataAtual}){

  const { dateConvert } = useContext(AuthContext)

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
    
        // Add data rows
        tableData.forEach((rowData) => {
          const values = Object.values(rowData)
          worksheet.addRow(values);
        })
    
        // Generate Excel file
        workbook.xlsx.writeBuffer()
          .then((buffer) => {
            saveExcelFile(buffer, `Relatorio_de_vendas_${dataAtual}.xlsx`)
          })
          .catch((error) => {
            console.error('Error generating Excel file:', error)
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
        let logoUrl = '../../assets/salva-lucro-logo.png';
      
        const columns = ['Adquirente', 'Bandeira', 'Produto', 'NSU', 'CNPJ', 'Código da Venda', 'Código da Autorização', 'Número PV', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Data da Venda', 'Hora da Venda', 'Data do Crédito', 'Qtd Parcelas'];
        const rows = tableData.map(rowData => [rowData.adquirente, rowData.bandeira, rowData.produto, rowData.nsu, rowData.cnpj, rowData.codigoVenda, rowData.codigoAutorizacao, rowData.numeroPV, rowData.valorBruto, rowData.valorLiquido, rowData.taxa, rowData.dataVenda, rowData.horaVenda, rowData.dataCredito, rowData.parcelas]);

        const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3',
        })

        var myImg = imgExport

        doc.autoTable({
        head: [columns],
        body: rows,
        margin: {top: 30},
        headStyles : {
          fillColor : [153, 204, 51],
          valign: 'middle',
          halign : 'center',
        },
        didDrawPage: function (data) {
          // Add an image to each page in the top right corner
          const imageWidth = 80 // Adjust width as needed
          const imageHeight = 13 // Adjust height as needed
          const positionX = 310
          const positionY = 8

          doc.addImage(myImg, 'JPEG', positionX, positionY, imageWidth, imageHeight);
        }
        })
    
        doc.save(`Relatorio_de_vendas_${dataAtual}.pdf`)
    }
    

    return(
        <>
            <div className='container'>
                <button className="btn btn-exportar btn-exportar-excel" onClick={exportToExcel}>Download Excel <FiFilePlus /></button>
                <button className='btn btn-exportar btn-exportar-pdf' onClick={generatePdf}>Download PDF <FiFilePlus /></button>
            </div>
        </>
    )
}
