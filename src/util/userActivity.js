import { useEffect, useRef } from 'react';

export const useUserActivity = (onInactive, timeout = 10 * 60 * 1000) => {
  const timer = useRef(null);

  const resetTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(onInactive, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'click', 'keypress'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer on mount

    return () => {
      clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, onInactive]);
};
