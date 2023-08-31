import React, { useState } from 'react'

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'

import { FiFilePlus } from 'react-icons/fi'

import './GerarRelatorio.css'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth'

export default function GerarRelatorio({array}){

  const { dateConvert } = useContext(AuthContext)

  const [tableData, setTableData] = useState([])
  const dataAtual = new Date()

  // Tratamento do Array de vendas/créditos /////////////////////////////

  async function gerarDados( array ){
    let tableDataTemp = []
    tableDataTemp.length = 0
    console.log('vendas ao gerar Dados: ', array)
    if (array.length > 0) {
      array.map((venda) => {
        tableDataTemp.push({
          adquirente: venda.adquirente.nomeAdquirente,
          bandeira: venda.bandeira.descricaoBandeira,
          produto: venda.produto.descricaoProduto,
          nsu: venda.nsu,
          cnpj: venda.cnpj,
          codigoVenda: venda.codigoVenda,
          codigoAutorizacao: venda.codigoAutorizacao,
          numeroPV: venda.numeroPV,
          valorBruto: 'R$' + venda.valorBruto.toFixed(2).replaceAll('.', ','),
          valorLiquido: 'R$' + venda.valorLiquido.toFixed(2).replaceAll('.', ','),
          taxa: 'R$' + venda.taxa.toFixed(2).replaceAll('.', ','),
          dataVenda: dateConvert(venda.dataVenda),
          horaVenda: venda.horaVenda,
          dataCredito: dateConvert(venda.dataCredito),
          parcelas: venda.quantidadeParcelas,
        })
      })
      console.log('tableData: ', tableDataTemp)
      setTableData(tableDataTemp)
    }
  }

  useEffect(()=>{
    gerarDados(array)
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
        const columns = ['Adquirente', 'Bandeira', 'Produto', 'NSU', 'CNPJ', 'Código da Venda', 'Código da Autorização', 'Número PV', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Data da Venda', 'Hora da Venda', 'Data do Crédito', 'Qtd Parcelas'];
        const rows = tableData.map(rowData => [rowData.adquirente, rowData.bandeira, rowData.produto, rowData.nsu, rowData.cnpj, rowData.codigoVenda, rowData.codigoAutorizacao, rowData.numeroPV, rowData.valorBruto, rowData.valorLiquido, rowData.taxa, rowData.dataVenda, rowData.horaVenda, rowData.dataCredito, rowData.parcelas]);
    
        if (!tableData || tableData.length === 0) {
          alert('No data to export.')
          return
        }

        const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a1',
        })
    
        doc.autoTable({
        head: [columns],
        body: rows,
        })
    
        doc.save(`Relatorio_de_vendas_${dataAtual}.pdf`)
    }
    

    return(
        <>
            <div className='container'>
                <button className="btn btn-success btn-exportar" onClick={exportToExcel}>Download Excel <FiFilePlus /></button>
                <button className='btn btn-danger btn-exportar' onClick={generatePdf}>Download PDF <FiFilePlus /></button>
            </div>
        </>
    )
}
