import { useState, useCallback } from 'react'
import { fetchGroups } from '../../services/authService'
import { isUnauthorized } from './isUnauthorized'

export const useAppUi = ({ onUnauthorized }) => {
  const [exportName, setExportName] = useState('')
  const [isCheckedCalendar, setIsCheckedCalendar] = useState(true)
  const [changedOption, setChangedOption] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const [displayGroup, setDisplayGroup] = useState('')
  const [displayClient, setDisplayClient] = useState('')
  const [groupsList, setGroupsList] = useState([])
  const [clientsList, setClientsList] = useState([])
  const [canceled, setCanceled] = useState(false)

  const loadGroupsList = useCallback(async () => {
    try {
      const groups = await fetchGroups()
      setGroupsList(groups)
      setClientsList(groups?.[0]?.CLIENTES || [])
      return groups
    } catch (error) {
      console.error(error)
      if (isUnauthorized(error)) onUnauthorized()
      throw new Error(error.message)
    }
  }, [onUnauthorized])

  return {
    exportName,
    setExportName,
    isCheckedCalendar,
    setIsCheckedCalendar,
    changedOption,
    setChangedOption,
    fetchingData,
    setFetchingData,
    displayGroup,
    setDisplayGroup,
    displayClient,
    setDisplayClient,
    groupsList,
    setGroupsList,
    clientsList,
    loadGroupsList,
    canceled,
    setCanceled,
  }
}
