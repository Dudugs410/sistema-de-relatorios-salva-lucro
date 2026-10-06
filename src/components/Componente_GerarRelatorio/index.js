/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { FiFilePlus } from 'react-icons/fi'
import './GerarRelatorio.scss'
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify'

export default function GerarRelatorio({ onExport, filteredData, tipoRelatorio }) {
  console.log('[GerarRelatorio] tipoRelatorio prop:', tipoRelatorio)

  const {
    dateConvert, exportName,
    salesTableData, creditsTableData, servicesTableData, taxesTableData,
    salesDateRange, creditsDateRange, servicesDateRange,
  } = useContext(AuthContext)

  const [tipoRelatorioLabel, setTipoRelatorioLabel] = useState('')
  const [currentDateTime, setCurrentDateTime] = useState('')
  const [tipo, setTipo] = useState('')
  const [tableData, setTableData] = useState([])
  const [downloading, setDownloading] = useState(false)

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

  const getEndpoint = () => {
    const currentPath = localStorage.getItem('currentPath')

    if (currentPath === '/vendas' && tipoRelatorio?.value === 'resumido') {
      return 'relatorios/resumido'
    }

    return 'relatorios/detalhado'
  }

  const getStorageKeys = () => {
    const currentPath = localStorage.getItem('currentPath')
    switch (currentPath) {
      case '/vendas':
        return { ban: 'selectedBan', adm: 'selectedAdm' }
      case '/creditos':
        return { ban: 'selectedBanCredits', adm: 'selectedAdmCredits' }
      case '/creditos-data-banco':
        return { ban: 'selectedBanCredits', adm: 'selectedAdmCredits' }
      case '/servicos':
        return { ban: 'selectedBanServices', adm: 'selectedAdmServices' }
      default:
        return { ban: 'selectedBan', adm: 'selectedAdm' }
    }
  }

  useEffect(() => {
    const currentPath = localStorage.getItem('currentPath')

    switch (currentPath) {
      case '/vendas':
        setTipoRelatorioLabel('Relatório de Vendas')
        setTipo('vendas')
        break
      case '/creditos':
        setTipoRelatorioLabel('Relatório de Créditos')
        setTipo('creditos')
        break
      case '/servicos':
        setTipoRelatorioLabel('Relatório de Serviços')
        setTipo('servicos')
        break
      case '/taxas':
        setTipoRelatorioLabel('Relatório de Taxas')
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

  const getRequestObject = (format) => {
    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
    const dataInicial = localStorage.getItem('dataInicial')
    const dataFinal = localStorage.getItem('dataFinal')

    const storageKeys = getStorageKeys()
    const bandeira = JSON.parse(localStorage.getItem(storageKeys.ban)) || ''
    const adquirente = JSON.parse(localStorage.getItem(storageKeys.adm)) || ''

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
    let ban = bandeira?.codigoBandeira || ''
    let adq = adquirente?.codigoAdquirente || ''

    return {
      dataInicial: formatDateToYYYYMMDD(dataInicial),
      dataFinal: formatDateToYYYYMMDD(dataFinal),
      clientes: clientesString,
      nomeGrupo: nomeGrupo,
      bandeira: ban,
      adquirente: adq,
      produto: '',
      modalidade: '',
      arquivo: format,
      modelo: getModelo()
    }
  }

  const downloadReport = async (format) => {
    setDownloading(true)

    try {
      const requestObject = getRequestObject(format)
      const endpoint = getEndpoint()

      console.log('[GerarRelatorio] endpoint:', endpoint)
      console.log('[GerarRelatorio] modelo:', requestObject.modelo)
      console.log('[GerarRelatorio] tipoRelatorio used:', tipoRelatorio)

      const response = await api.post(endpoint, requestObject)

      if (response.data.success === true && response.data.formato === format) {
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
        const suffix = tipoRelatorio?.value === 'resumido' ? ' - Resumido' : ''
        const fileName = dateRangeStr
          ? `${tipoRelatorioLabel}${suffix} - ${exportName} - ${dateRangeStr}.${fileExtension}`
          : `${tipoRelatorioLabel}${suffix} - ${exportName} - ${currentDateTime}.${fileExtension}`
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

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

  const exportToExcel = async () => {
    if (!tableData || tableData.length === 0) {
      toast.warning('Sem dados para exportar.')
      return
    }
    await downloadReport('XLSX')
  }

  const generatePdf = async () => {
    if (!tableData || tableData.length === 0) {
      toast.warning('Sem dados para exportar.')
      return
    }
    await downloadReport('PDF')
  }

  return (
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