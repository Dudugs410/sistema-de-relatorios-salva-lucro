// ThemeToggle.jsx - Simple component using context

import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(AuthContext)
  
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme ? '🌙' : '☀️'}
    </button>
  )
}