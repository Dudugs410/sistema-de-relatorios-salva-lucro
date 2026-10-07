
import { useEffect, useRef } from 'react';

const THROTTLE_INTERVAL = 10 * 60 * 1000;
const TOKEN_EXPIRATION_THRESHOLD = 10 * 60 * 1000;
const TOKEN_EXPIRATION_TIME = 120 * 60 * 1000;

export function useUserActivity(onActive, onIdle, idleTimeout = 10 * 60 * 1000, onExpiryWarning) {
  const lastActivityTimeRef = useRef(Date.now());
  const lastRefreshTimeRef = useRef(Date.now());
  const idleCheckTimeout = useRef(null);
  const logInterval = useRef(null);
  const expiryWarningTimeout = useRef(null);

  const updateActivity = () => {
    lastActivityTimeRef.current = Date.now();

    if (Date.now() - lastRefreshTimeRef.current > THROTTLE_INTERVAL) {
      onActive();
      lastRefreshTimeRef.current = Date.now();
    }

    resetIdleCheck();
    checkForExpiryWarning();
  };

  const resetIdleCheck = () => {
    if (idleCheckTimeout.current) clearTimeout(idleCheckTimeout.current);

    idleCheckTimeout.current = setTimeout(() => {
      const idleTime = Date.now() - lastActivityTimeRef.current;
      if (idleTime >= idleTimeout) {
        onIdle();
      }
    }, idleTimeout);
  };

  const checkForExpiryWarning = () => {
    const timeSinceLastRefresh = Date.now() - lastRefreshTimeRef.current;
    const timeUntilExpiration = TOKEN_EXPIRATION_TIME - timeSinceLastRefresh;

    if (timeUntilExpiration <= TOKEN_EXPIRATION_THRESHOLD) {
      onExpiryWarning();
    }
  };

  const logTimeLeftUntilIdle = () => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTimeRef.current;
    const timeLeftUntilIdle = Math.max((idleTimeout - timeSinceLastActivity) / 1000, 0);
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    resetIdleCheck();
    checkForExpiryWarning();
    logInterval.current = setInterval(logTimeLeftUntilIdle, 5000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      if (idleCheckTimeout.current) clearTimeout(idleCheckTimeout.current);
      if (logInterval.current) clearInterval(logInterval.current);
      if (expiryWarningTimeout.current) clearTimeout(expiryWarningTimeout.current);
    };
  }, [onActive, onIdle, idleTimeout, onExpiryWarning]);

  return;
}
