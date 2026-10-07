import { useState, useCallback } from 'react'
import { fetchDashboard } from '../../services/reportsService'
import { transformDashboardData, toChartData, sumAcquirers } from '../../util/reportTransforms'
import { isUnauthorized } from './isUnauthorized'

const EMPTY_CHART = { data: [], labels: [] }

const initialSales = () => ({ sales: [], totalLast4: 0, totalMonth: 0, chart: EMPTY_CHART })
const initialCredits = () => ({ credits: [], predictToday: 0, predictNext5: 0, chart: EMPTY_CHART })
const initialServices = () => ({ services: [], totalToday: 0, totalMonth: 0, chart: EMPTY_CHART })

export const useDashboard = ({ fetchingData, setFetchingData, setChangedOption, onUnauthorized }) => {
  const [isLoadedDashboard, setIsLoadedDashboard] = useState(false)
  const [isLoadedSalesDashboard, setIsLoadedSalesDashboard] = useState(false)
  const [isLoadedCreditsDashboard, setIsLoadedCreditsDashboard] = useState(false)
  const [isLoadedServicesDashboard, setIsLoadedServicesDashboard] = useState(false)
  const [salesDashboard, setSalesDashboard] = useState(initialSales)
  const [creditsDashboard, setCreditsDashboard] = useState(initialCredits)
  const [servicesDashboard, setServicesDashboard] = useState(initialServices)

  const setAllLoaded = useCallback((loaded) => {
    setIsLoadedSalesDashboard(loaded)
    setIsLoadedCreditsDashboard(loaded)
    setIsLoadedServicesDashboard(loaded)
    setIsLoadedDashboard(loaded)
  }, [])

  const resetDashboard = useCallback(() => {
    setAllLoaded(false)
    setSalesDashboard(initialSales())
    setCreditsDashboard(initialCredits())
    setServicesDashboard(initialServices())
  }, [setAllLoaded])

  const loadDashboard = async () => {
    setSalesDashboard(null)
    setCreditsDashboard(null)
    setServicesDashboard(null)
    setAllLoaded(false)

    try {
      if (!fetchingData) setFetchingData(true)

      const data = transformDashboardData(await fetchDashboard())
      const { vendas, creditos, ajustes } = data

      setSalesDashboard({
        totalLast4: vendas.valorTotaldias,
        totalMonth: vendas.valorTotalMes,
        chart: toChartData(vendas.totalAdquirentes),
        sales: vendas.totalAdquirentes,
        totalAdmin: sumAcquirers(vendas.totalAdquirentes),
      })
      setIsLoadedSalesDashboard(true)

      setCreditsDashboard({
        totalCreditsToday: creditos.valorTotaldias,
        totalCreditsNext5: creditos.valorTotalMes,
        chart: toChartData(creditos.totalAdquirentes),
        credits: creditos.totalAdquirentes,
        totalAdmin: sumAcquirers(creditos.totalAdquirentes),
      })
      setIsLoadedCreditsDashboard(true)

      setServicesDashboard({
        totalServicesToday: ajustes.valorTotaldias,
        totalServicesMonth: ajustes.valorTotalMes,
        chart: toChartData(ajustes.totalAdquirentes),
        services: ajustes.totalAdquirentes,
        totalAdmin: sumAcquirers(ajustes.totalAdquirentes),
      })
      setIsLoadedServicesDashboard(true)

      setIsLoadedDashboard(true)
      setChangedOption(false)
      setFetchingData(false)
      return data
    } catch (error) {
      console.log('Error in dashboard loading:', error)
      setFetchingData(false)
      if (isUnauthorized(error)) onUnauthorized()
    }
  }

  return {
    loadDashboard,
    resetDashboard,
    isLoadedDashboard,
    setIsLoadedDashboard,
    salesDashboard,
    isLoadedSalesDashboard,
    setIsLoadedSalesDashboard,
    creditsDashboard,
    isLoadedCreditsDashboard,
    setIsLoadedCreditsDashboard,
    servicesDashboard,
    isLoadedServicesDashboard,
    setIsLoadedServicesDashboard,
  }
}
