import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

import { FiFilePlus } from 'react-icons/fi'

export default function PdfExportComponent2({ tableData }) {
  const generatePdf = () => {
    const columns = ['Adquirente', 'Bandeira', 'Produto', 'NSU', 'CNPJ', 'Código da Venda', 'Código da Autorização', 'Número PV', 'Valor Bruto', 'Valor Líquido', 'Taxa', 'Data da Venda', 'Hora da Venda', 'Data do Crédito', 'Qtd Parcelas'];
    const rows = tableData.map(rowData => [rowData.adquirente, rowData.bandeira, rowData.produto, rowData.nsu, rowData.cnpj, rowData.codigoVenda, rowData.codigoAutorizacao, rowData.numeroPV, rowData.valorBruto, rowData.valorLiquido, rowData.taxa, rowData.dataVenda, rowData.horaVenda, rowData.dataCredito, rowData.parcelas]);

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a1',
    })

    doc.autoTable({
      head: [columns],
      body: rows,
    })

    doc.save('my_pdf.pdf')
  }

  return (
    <>
      <button className='btn btn-danger' onClick={generatePdf}>
        Gerar PDF <FiFilePlus />
      </button>
    </>
  )
}