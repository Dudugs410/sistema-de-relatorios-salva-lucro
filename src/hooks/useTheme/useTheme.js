// useTheme.js - Simplified to use context

import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(AuthContext)
  
  return {
    isChecked: theme,
    toggleTheme,
    setIsChecked: (value) => {
      // This should only be used internally by the AuthProvider
      console.warn('setIsChecked should not be used directly. Use toggleTheme instead.')
    }
  }
}