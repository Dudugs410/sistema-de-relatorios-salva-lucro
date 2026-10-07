import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import {
  fetchDetailedReport,
  fetchLegacySales,
  fetchLegacyCredits,
  fetchLegacyServices,
} from '../../services/reportsService'
import {
  EMPTY_PRODUCT_TOTALS,
  computeSalesTotals,
  computeCreditsTotals,
  computeServicesTotal,
  groupSalesByAdmin,
  groupCreditsByAdmin,
  groupServicesByAdmin,
  transformSalesRows,
  transformCreditsRows,
  transformServicesRows,
} from '../../util/reportTransforms'
import { isUnauthorized } from './isUnauthorized'

const REPORT_MESSAGES = {
  sales: {
    empty: 'Nenhum dado encontrado para o período selecionado',
    failed: 'Erro ao carregar dados',
    error: 'Erro ao Carregar Vendas: ',
  },
  credits: {
    empty: 'Nenhum dado encontrado para o período selecionado',
    failed: 'Erro ao carregar dados de créditos',
    error: 'Erro ao Carregar Créditos: ',
  },
  services: {
    empty: 'Nenhum serviço/ajuste encontrado para o período selecionado',
    failed: 'Erro ao carregar dados de serviços/ajustes',
    error: 'Erro ao Carregar Serviços/Ajustes: ',
  },
}

const sameTotals = (a, b) => Object.keys(b).every((key) => a[key] === b[key])

const todayRange = () => [new Date(), new Date()]

export const useReports = ({ onUnauthorized }) => {
  const [salesPageArray, setSalesPageArray] = useState([])
  const [salesPageAdminArray, setSalesPageAdminArray] = useState([])
  const [salesTotal, setSalesTotal] = useState(EMPTY_PRODUCT_TOTALS)
  const [salesDateRange, setSalesDateRange] = useState(todayRange)
  const [salesTableData, setSalesTableData] = useState([])
  const [btnDisabledSales, setBtnDisabledSales] = useState(false)
  const [errorSales, setErrorSales] = useState(false)
  const [canceledSales, setCanceledSales] = useState(false)

  const [creditsPageArray, setCreditsPageArray] = useState([])
  const [creditsPageAdminArray, setCreditsPageAdminArray] = useState([])
  const [creditsTotal, setCreditsTotal] = useState(EMPTY_PRODUCT_TOTALS)
  const [creditsDateRange, setCreditsDateRange] = useState(todayRange)
  const [creditsTableData, setCreditsTableData] = useState([])
  const [btnDisabledCredits, setBtnDisabledCredits] = useState(false)
  const [errorCredits, setErrorCredits] = useState(false)
  const [canceledCredits, setCanceledCredits] = useState(false)

  const [servicesPageArray, setServicesPageArray] = useState([])
  const [servicesPageAdminArray, setServicesPageAdminArray] = useState([])
  const [servicesTotal, setServicesTotal] = useState({ total: 0 })
  const [servicesDateRange, setServicesDateRange] = useState(todayRange)
  const [servicesTableData, setServicesTableData] = useState([])
  const [btnDisabledServices, setBtnDisabledServices] = useState(false)
  const [errorServices, setErrorServices] = useState(false)
  const [canceledServices, setCanceledServices] = useState(false)

  const reportSetters = {
    sales: { setError: setErrorSales, setBtnDisabled: setBtnDisabledSales },
    credits: { setError: setErrorCredits, setBtnDisabled: setBtnDisabledCredits },
    services: { setError: setErrorServices, setBtnDisabled: setBtnDisabledServices },
  }

  const loadReport = async (model, startDate, endDate, additionalFilters) => {
    const { setError, setBtnDisabled } = reportSetters[model]
    const messages = REPORT_MESSAGES[model]
    try {
      setError(false)
      const data = await fetchDetailedReport(model, startDate, endDate, additionalFilters)
      setBtnDisabled(false)

      const rows = data.dados
      if (data.success === true && rows && rows.length > 0) {
        if (model === 'services') localStorage.setItem('servicesData', JSON.stringify(rows))
        return rows
      }
      if (data.success === true) toast.info(data.mensagem || messages.empty)
      else toast.error(data.mensagem || messages.failed)
      return []
    } catch (error) {
      console.error(`Error loading ${model}:`, error)
      setBtnDisabled(false)
      if (error.code === 'ERR_CANCELED') {
        setError(false)
      } else if (isUnauthorized(error)) {
        toast.error('Sessão Expirada')
        onUnauthorized()
        return
      } else {
        toast.error(messages.error + (error.response?.data?.mensagem || error.message))
        setError(true)
      }
      return []
    }
  }

  const newLoadSales = (startDate, endDate, additionalFilters = {}) => loadReport('sales', startDate, endDate, additionalFilters)
  const newLoadCredits = (startDate, endDate, additionalFilters = {}) => loadReport('credits', startDate, endDate, additionalFilters)
  const newLoadServices = (startDate, endDate, additionalFilters = {}) => loadReport('services', startDate, endDate, additionalFilters)

  const newLoadTotalSales = (sales) => {
    const result = sales && sales.length > 0 ? computeSalesTotals(sales) : EMPTY_PRODUCT_TOTALS
    if (!sameTotals(salesTotal, result)) setSalesTotal(result)
  }

  const newLoadTotalCredits = (credits) => {
    setCreditsTotal(credits && credits.length > 0 ? computeCreditsTotals(credits) : EMPTY_PRODUCT_TOTALS)
  }

  const newLoadTotalServices = (services) => {
    const result = services && services.length > 0 ? computeServicesTotal(services) : { total: 0 }
    if (servicesTotal.total !== result.total) setServicesTotal(result)
    return result
  }

  const loadTotalSales = (sales) => {
    if (sales && sales.length > 0) newLoadTotalSales(sales)
  }

  const loadTotalCredits = (credits) => {
    if (credits && credits.length > 0) newLoadTotalCredits(credits)
  }

  const exportSales = (data) => {
    if (!data || data.length === 0) {
      if (salesTableData.length > 0) setSalesTableData([])
      return
    }
    const rows = transformSalesRows(data)
    if (JSON.stringify(salesTableData) !== JSON.stringify(rows)) setSalesTableData(rows)
  }

  const exportCredits = (data) => {
    if (!data || data.length === 0) return []
    const rows = transformCreditsRows(data)
    localStorage.setItem('creditsTableData', JSON.stringify(rows))
    setCreditsTableData(rows)
    return rows
  }

  const exportServices = (data) => {
    if (data.length === 0) {
      setServicesTableData([])
      return
    }
    setServicesTableData(transformServicesRows(data))
    return servicesTableData
  }

  const resetReports = useCallback(() => {
    setSalesPageArray([])
    setSalesPageAdminArray([])
    setSalesTotal(EMPTY_PRODUCT_TOTALS)
    setSalesDateRange(todayRange())
    setCreditsPageArray([])
    setCreditsPageAdminArray([])
    setCreditsTotal(EMPTY_PRODUCT_TOTALS)
    setCreditsDateRange(todayRange())
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setServicesDateRange(todayRange())
    setServicesTotal({ total: 0 })
    setErrorSales(false)
    setErrorCredits(false)
    setErrorServices(false)
    setCanceledSales(false)
    setCanceledCredits(false)
    setCanceledServices(false)
  }, [])

  return {
    resetReports,

    loadSales: fetchLegacySales,
    loadTotalSales,
    newLoadSales,
    newLoadTotalSales,
    newGroupByAdmin: groupSalesByAdmin,
    groupByAdmin: groupSalesByAdmin,
    salesDateRange,
    setSalesDateRange,
    salesPageArray,
    setSalesPageArray,
    salesPageAdminArray,
    setSalesPageAdminArray,
    salesTotal,
    setSalesTotal,
    btnDisabledSales,
    setBtnDisabledSales,
    salesTableData,
    setSalesTableData,
    exportSales,
    errorSales,
    canceledSales,
    setCanceledSales,

    loadCredits: fetchLegacyCredits,
    loadTotalCredits,
    newLoadCredits,
    newLoadCreditsDataBanco: newLoadCredits,
    newGroupByAdminCredits: groupCreditsByAdmin,
    newLoadTotalCredits,
    creditsPageArray,
    setCreditsPageArray,
    creditsPageAdminArray,
    setCreditsPageAdminArray,
    creditsDateRange,
    setCreditsDateRange,
    creditsTotal,
    setCreditsTotal,
    btnDisabledCredits,
    setBtnDisabledCredits,
    creditsTableData,
    setCreditsTableData,
    exportCredits,
    errorCredits,
    canceledCredits,
    setCanceledCredits,

    loadServices: fetchLegacyServices,
    newLoadServices,
    newGroupByAdminServices: groupServicesByAdmin,
    groupServicesByAdmin,
    newLoadTotalServices,
    servicesPageArray,
    setServicesPageArray,
    servicesPageAdminArray,
    setServicesPageAdminArray,
    servicesDateRange,
    setServicesDateRange,
    btnDisabledServices,
    setBtnDisabledServices,
    servicesTableData,
    setServicesTableData,
    exportServices,
    errorServices,
    canceledServices,
    setCanceledServices,
  }
}
