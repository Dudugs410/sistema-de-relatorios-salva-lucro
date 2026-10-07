import { createContext, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { usePreferences } from './usePreferences'
import { useSession } from './useSession'
import { useAppUi } from './useAppUi'
import { useDashboard } from './useDashboard'
import { useReports } from './useReports'
import { useRegistry } from './useRegistry'
import {
  alerta,
  converteData,
  dateConvert,
  dateConvertSearch,
  dateConvertYYYYMMDD,
  safeCurrencyFormat,
  safeToFixed,
  sortArray,
} from '../../util/formatters'

export const AuthContext = createContext({})

const useLatestCallback = () => {
  const ref = useRef(() => {})
  const call = useCallback((...args) => ref.current(...args), [])
  return [call, ref]
}

function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [onUnauthorized, logoutRef] = useLatestCallback()
  const [resetAppValues, resetRef] = useLatestCallback()

  const preferences = usePreferences()
  const ui = useAppUi({ onUnauthorized })
  const dashboard = useDashboard({
    fetchingData: ui.fetchingData,
    setFetchingData: ui.setFetchingData,
    setChangedOption: ui.setChangedOption,
    onUnauthorized,
  })
  const reports = useReports({ onUnauthorized })
  const registry = useRegistry({ onUnauthorized })
  const session = useSession({
    preferences,
    resetAppValues,
    loadGroupsList: ui.loadGroupsList,
    navigate,
  })

  resetRef.current = () => {
    dashboard.resetDashboard()
    reports.resetReports()
    ui.setCanceled(false)
    session.setIsSignedIn(false)
  }
  logoutRef.current = session.logout

  const { canceled, setFetchingData } = ui
  const allDashboardsLoaded =
    dashboard.isLoadedSalesDashboard && dashboard.isLoadedCreditsDashboard && dashboard.isLoadedServicesDashboard

  useEffect(() => {
    if (canceled) {
      resetAppValues()
      setFetchingData(false)
    }
  }, [canceled, resetAppValues, setFetchingData])

  useEffect(() => {
    if (allDashboardsLoaded) setFetchingData(false)
  }, [allDashboardsLoaded, setFetchingData])

  const { resetPreferences, ...preferencesValue } = preferences
  const { resetDashboard, ...dashboardValue } = dashboard
  const { resetReports, ...reportsValue } = reports

  const value = {
    ...session,
    ...preferencesValue,
    ...ui,
    ...dashboardValue,
    ...reportsValue,
    ...registry,
    resetAppValues,
    converteData,
    dateConvert,
    dateConvertSearch,
    dateConvertYYYYMMDD,
    safeToFixed,
    safeCurrencyFormat,
    alerta,
    sortArray,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
