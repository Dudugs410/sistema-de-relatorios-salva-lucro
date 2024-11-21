<<<<<<< HEAD
// userActivity.js

import { useEffect, useRef } from 'react';

const THROTTLE_INTERVAL = 10 * 60 * 1000; // 10 minutes
const TOKEN_EXPIRATION_THRESHOLD = 10 * 60 * 1000; // Show modal 10 minutes before token expires
const TOKEN_EXPIRATION_TIME = 120 * 60 * 1000; // 2 hours (7200 seconds)

export function useUserActivity(onActive, onIdle, idleTimeout = 10 * 60 * 1000, onExpiryWarning) {
  const lastActivityTimeRef = useRef(Date.now());
  const lastRefreshTimeRef = useRef(Date.now());
  const idleCheckTimeout = useRef(null);
  const logInterval = useRef(null);
  const expiryWarningTimeout = useRef(null);

  const updateActivity = () => {
    lastActivityTimeRef.current = Date.now();

    // Check if enough time has passed to allow a refresh
    if (Date.now() - lastRefreshTimeRef.current > THROTTLE_INTERVAL) {
      onActive(); // Trigger the refresh if allowed
      lastRefreshTimeRef.current = Date.now(); // Update the last refresh time
    }

    resetIdleCheck();
    checkForExpiryWarning();
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

  const checkForExpiryWarning = () => {
    const timeSinceLastRefresh = Date.now() - lastRefreshTimeRef.current;
    const timeUntilExpiration = TOKEN_EXPIRATION_TIME - timeSinceLastRefresh;

    if (timeUntilExpiration <= TOKEN_EXPIRATION_THRESHOLD) {
      onExpiryWarning(); // Trigger modal 10 minutes before token expires
    }
  };

  const logTimeLeftUntilIdle = () => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTimeRef.current;
    const timeLeftUntilIdle = Math.max((idleTimeout - timeSinceLastActivity) / 1000, 0);
    console.log(`Time left until idle: ${timeLeftUntilIdle.toFixed(0)} seconds`);
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    resetIdleCheck();
    checkForExpiryWarning();
    logInterval.current = setInterval(logTimeLeftUntilIdle, 5000); // Log every 5 seconds

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      if (idleCheckTimeout.current) clearTimeout(idleCheckTimeout.current);
      if (logInterval.current) clearInterval(logInterval.current);
      if (expiryWarningTimeout.current) clearTimeout(expiryWarningTimeout.current);
    };
  }, [onActive, onIdle, idleTimeout, onExpiryWarning]);

  return;
}
=======
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
>>>>>>> f82e60ebbc06fd26937593ca5c833f81800d019c
