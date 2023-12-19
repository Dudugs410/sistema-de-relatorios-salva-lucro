import React from 'react';

const InstallPWAButton = () => {
  const handleInstallPWA = () => {
    // Check if the browser supports PWA installation
    if ('beforeinstallprompt' in window) {
      // Show the installation prompt
      window.addEventListener('beforeinstallprompt', (event) => {
        // Prevent the browser from automatically showing the prompt
        event.preventDefault();
        // Store the event to use it later
        const deferredPrompt = event;
        // Show your custom UI here or redirect to the installation prompt
        deferredPrompt.prompt();
      });
    } else {
      // The browser doesn't support PWA installation
      alert('PWA installation is not supported in this browser.');
    }
  };

  return (
    <button onClick={handleInstallPWA}>
      Install PWA
    </button>
  );
};

export default InstallPWAButton;