import { useEffect, useRef } from 'react';

const THROTTLE_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

export function useUserActivity(onActive, onIdle, idleTimeout = 10 * 60 * 1000) {
  const lastActivityTimeRef = useRef(Date.now());
  const lastRefreshTimeRef = useRef(Date.now());
  const idleCheckTimeout = useRef(null);
  const logInterval = useRef(null);

  const updateActivity = () => {
    lastActivityTimeRef.current = Date.now();

    // Check if enough time has passed to allow a refresh
    if (Date.now() - lastRefreshTimeRef.current > THROTTLE_INTERVAL) {
      onActive(); // Trigger the refresh if allowed
      lastRefreshTimeRef.current = Date.now(); // Update the last refresh time
    }

    // Reset idle check when activity is detected
    resetIdleCheck();
  };

  const resetIdleCheck = () => {
    if (idleCheckTimeout.current) clearTimeout(idleCheckTimeout.current);

    idleCheckTimeout.current = setTimeout(() => {
      const idleTime = Date.now() - lastActivityTimeRef.current;
      if (idleTime >= idleTimeout) {
        console.log('User has gone idle.');
        onIdle();
      }
    }, idleTimeout);
  };

  const logTimeLeftUntilIdle = () => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTimeRef.current;
    const timeLeftUntilIdle = Math.max((idleTimeout - timeSinceLastActivity) / 1000, 0);
    console.log(`Time left until idle: ${timeLeftUntilIdle.toFixed(0)} seconds`);
  };

  useEffect(() => {
    // Register activity events
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // Start initial idle check and logging interval
    resetIdleCheck();
    logInterval.current = setInterval(logTimeLeftUntilIdle, 5000); // Log every 5 seconds

    return () => {
      // Clean up events, timeout, and logging interval on unmount
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      if (idleCheckTimeout.current) clearTimeout(idleCheckTimeout.current);
      if (logInterval.current) clearInterval(logInterval.current);
    };
  }, [onActive, onIdle, idleTimeout]);

  return;
}
