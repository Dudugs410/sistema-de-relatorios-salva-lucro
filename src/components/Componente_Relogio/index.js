import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const Relogio = () => {
    const [currentTime, setCurrentTime] = useState(null)
  
    const retornaDiaAtual = useCallback(async () => {
        try {
            const response = await axios.get('http://worldtimeapi.org/api/ip')
            const currentDate = new Date(response.data.datetime)
            setCurrentTime(currentDate)
        } catch (error) {
            console.error('Error fetching current date and time:', error)
            setCurrentTime(new Date())
        }
    }, [])
  
    useEffect(() => {
        retornaDiaAtual()
    }, [retornaDiaAtual])
  
    useEffect(() => {
        if (!currentTime) return
        
        const intervalId = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
    
        return () => {
            clearInterval(intervalId)
        }
    }, [currentTime])
  
    return (
        <div>
            {currentTime ? (
                <div>{currentTime.toLocaleString('pt-BR')}</div>
            ) : (
                <div>Carregando...</div>
            )}
        </div>
    )
}
  
export default Relogio