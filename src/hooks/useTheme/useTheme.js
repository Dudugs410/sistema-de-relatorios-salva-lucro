import { useState, useEffect } from 'react';

export const useTheme = (updateUser) => {
    const [isChecked, setIsChecked] = useState(() => {
        // Get theme from user data or localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.TEMA !== undefined) {
            return userData.TEMA;
        }
        
        const savedIsChecked = localStorage.getItem('isChecked');
        return savedIsChecked ? JSON.parse(savedIsChecked) : false;
    });

    const toggleTheme = () => {
        const updatedChecked = !isChecked;
        setIsChecked(updatedChecked);
        
        // Update localStorage
        localStorage.setItem('isChecked', updatedChecked);
        
        // Update user data if available
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            userData.TEMA = updatedChecked;
            localStorage.setItem('user', JSON.stringify(userData));
            if (updateUser) {
                updateUser(userData);
            }
        }

        // Apply to DOM
        document.documentElement.setAttribute('data-theme', updatedChecked ? 'dark' : 'light');
        
        return updatedChecked;
    };

    // Initialize theme on mount
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isChecked ? 'dark' : 'light');
    }, []);

    return {
        isChecked,
        toggleTheme,
        setIsChecked
    };
};