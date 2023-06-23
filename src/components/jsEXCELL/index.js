import React from 'react'
import ExcelJS from 'exceljs'

import { FiFilePlus } from 'react-icons/fi'

function ExportToExcelButton({tableData}) {

  const exportToExcel = () => {
    console.log('Data: ', tableData)
    console.log('tableData: ', tableData)
    alert('ExportToExcelButton')

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
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer()
      .then((buffer) => {
        saveExcelFile(buffer, 'my_excel_file.xlsx')
      })
      .catch((error) => {
        console.error('Error generating Excel file:', error)
      });
  };

  const saveExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
  }

  return (
    <div>
      {/* Render the ExportToExcelButton component */}
      <button className="btn btn-success" onClick={exportToExcel}>
        Gerar Excel <FiFilePlus />
      </button>
    </div>
  )
}

export default ExportToExcelButton;