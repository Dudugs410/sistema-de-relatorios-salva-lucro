import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'

export const useTheme = (updateUser) => {
    const [isChecked, setIsChecked] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [preferences, setPreferences] = useState(null)

    // Load theme from API
    const loadThemeFromAPI = useCallback(async () => {
        const userId = localStorage.getItem('userID')
        const token = localStorage.getItem('token')
        
        if (!userId || !token) {
            setIsLoading(false)
            return false
        }

        try {
            const response = await api.get('PreferenciasUsuario', {
                params: { codigo: userId }
            })
            
            if (response.data && response.data.TEMA !== undefined) {
                const themeValue = response.data.TEMA === true || response.data.TEMA === 'true'
                setIsChecked(themeValue)
                setPreferences(response.data)
                document.documentElement.setAttribute('data-theme', themeValue ? 'dark' : 'light')
                localStorage.setItem('isChecked', JSON.stringify(themeValue))
                
                // Update user data
                const userData = JSON.parse(localStorage.getItem('user'))
                if (userData) {
                    userData.TEMA = themeValue
                    localStorage.setItem('user', JSON.stringify(userData))
                }
                
                setIsLoading(false)
                return true
            }
            
            setIsLoading(false)
            return false
        } catch (error) {
            console.error('Error loading theme from API:', error)
            // Fallback to localStorage
            const savedIsChecked = localStorage.getItem('isChecked')
            const themeValue = savedIsChecked ? JSON.parse(savedIsChecked) : false
            setIsChecked(themeValue)
            document.documentElement.setAttribute('data-theme', themeValue ? 'dark' : 'light')
            setIsLoading(false)
            return false
        }
    }, [])

    // Load theme on mount
    useEffect(() => {
        loadThemeFromAPI()
    }, [loadThemeFromAPI])

    // Toggle theme and save to API
    const toggleTheme = useCallback(async () => {
        const updatedChecked = !isChecked
        setIsChecked(updatedChecked)
        
        // Apply to DOM immediately
        document.documentElement.setAttribute('data-theme', updatedChecked ? 'dark' : 'light')
        
        // Update localStorage
        localStorage.setItem('isChecked', JSON.stringify(updatedChecked))
        
        // Update user data
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData) {
            userData.TEMA = updatedChecked
            localStorage.setItem('user', JSON.stringify(userData))
            if (updateUser) {
                updateUser(userData)
            }
        }

        // Save to API
        const userId = localStorage.getItem('userID')
        const token = localStorage.getItem('token')
        
        if (userId && token) {
            try {
                const getCurrentDate = () => new Date().toISOString().split('T')[0]
                const now = getCurrentDate()
                
                // Check if preferences exist
                let existingPrefs = null
                try {
                    const prefsResponse = await api.get('PreferenciasUsuario', {
                        params: { codigo: userId }
                    })
                    existingPrefs = prefsResponse.data
                } catch (e) {
                    console.log('No existing preferences found')
                }
                
                const currentIconCode = existingPrefs?.ICONE || 1
                const currentColorScheme = existingPrefs?.ESQUEMACORES || 'salvalucro'
                
                const payload = {
                    USUCODIGO: parseInt(userId),
                    TEMA: updatedChecked,
                    ICONE: currentIconCode,
                    ESQUEMACORES: currentColorScheme,
                    USUARIOMODIFICACAO: parseInt(userId),
                    DATAMODIFICACAO: now,
                    USUARIOINSERCAO: parseInt(userId),
                    DATAINSERCAO: now,
                    ATIVO: true
                }
                
                if (existingPrefs?.CODIGO) {
                    payload.CODIGO = existingPrefs.CODIGO
                    await api.put('PreferenciasUsuario', payload)
                } else {
                    await api.post('PreferenciasUsuario', payload)
                }
            } catch (error) {
                console.error('Failed to save theme to database:', error)
            }
        }
        
        return updatedChecked
    }, [isChecked, updateUser])

    // Set theme directly (for syncing with other components)
    const setTheme = useCallback(async (themeValue) => {
        const booleanValue = themeValue === true || themeValue === 'true'
        setIsChecked(booleanValue)
        document.documentElement.setAttribute('data-theme', booleanValue ? 'dark' : 'light')
        localStorage.setItem('isChecked', JSON.stringify(booleanValue))
        
        // Update user data
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData) {
            userData.TEMA = booleanValue
            localStorage.setItem('user', JSON.stringify(userData))
            if (updateUser) {
                updateUser(userData)
            }
        }
        
        // Save to API
        const userId = localStorage.getItem('userID')
        const token = localStorage.getItem('token')
        
        if (userId && token) {
            try {
                const getCurrentDate = () => new Date().toISOString().split('T')[0]
                const now = getCurrentDate()
                
                let existingPrefs = null
                try {
                    const prefsResponse = await api.get('PreferenciasUsuario', {
                        params: { codigo: userId }
                    })
                    existingPrefs = prefsResponse.data
                } catch (e) {}
                
                const currentIconCode = existingPrefs?.ICONE || 1
                const currentColorScheme = existingPrefs?.ESQUEMACORES || 'salvalucro'
                
                const payload = {
                    USUCODIGO: parseInt(userId),
                    TEMA: booleanValue,
                    ICONE: currentIconCode,
                    ESQUEMACORES: currentColorScheme,
                    USUARIOMODIFICACAO: parseInt(userId),
                    DATAMODIFICACAO: now,
                    USUARIOINSERCAO: parseInt(userId),
                    DATAINSERCAO: now,
                    ATIVO: true
                }
                
                if (existingPrefs?.CODIGO) {
                    payload.CODIGO = existingPrefs.CODIGO
                    await api.put('PreferenciasUsuario', payload)
                } else {
                    await api.post('PreferenciasUsuario', payload)
                }
            } catch (error) {
                console.error('Failed to save theme to database:', error)
            }
        }
    }, [updateUser])

    return {
        isChecked,
        isLoading,
        preferences,
        toggleTheme,
        setTheme,
        setIsChecked,
        loadThemeFromAPI,
        reloadTheme: loadThemeFromAPI
    }
}