import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Relogio = () => {
    const [currentTime, setCurrentTime] = useState(null);
  
    useEffect(() => {
      const retornaDiaAtual = async () => {
        try {
          const response = await axios.get('http://worldtimeapi.org/api/ip');
          const currentDate = new Date(response.data.datetime);
          setCurrentTime(currentDate);
        } catch (error) {
          console.error('Error fetching current date and time:', error);
        }
      };
  
      retornaDiaAtual(); // Fetch the current time from the API when the component mounts
  
      let animationFrameId;
  
      const updateClock = () => {
        setCurrentTime(new Date());
        animationFrameId = requestAnimationFrame(updateClock);
      };
  
      animationFrameId = requestAnimationFrame(updateClock); // Start the clock
  
      return () => {
        cancelAnimationFrame(animationFrameId); // Cleanup on unmount
      };
    }, []);
  
    return (
      <div>
        {currentTime ? (
          <div>{currentTime.toLocaleString('pt-BR')}</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  };
  
  export default Relogio;