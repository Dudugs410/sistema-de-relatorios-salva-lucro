
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(AuthContext)
  
  return {
    isChecked: theme,
    toggleTheme,
    setIsChecked: (value) => {
      console.warn('setIsChecked should not be used directly. Use toggleTheme instead.')
    }
  }
}