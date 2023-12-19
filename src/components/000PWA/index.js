import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PWAInstallerPrompt = ({
  render: InstallButton,
  callback,
}) => {
  const createStatus = (object) => {
    return {
      isInstallAllowed: true, // Ensure it's initially true
      // ... other status properties
    };
  };
  
  const [installStatus, setInstallStatus] = useState(createStatus({}));
  const [installEvent, setInstallEvent] = useState(null);
  
  useEffect(() => {
    if (callback) { callback(installStatus); }
  }, [installStatus]);
  
  const beforeAppInstallPromptHandler = (e) => {
    e.preventDefault();
    if (!installStatus.isInstalling) {
      if (!installStatus.isInstallSuccess) {
        setInstallEvent(e);
        if (!installStatus.isInstallAllowed) {
          setInstallStatus(createStatus({ isInstallAllowed: true, isInstallCancelled: installStatus.isInstallCancelled }));
        }
      }
    }
  };
  
  const appInstalledHandler = (e) => {
    if (!installStatus.isInstallSuccess) {
      window.removeEventListener('beforeinstallprompt', beforeAppInstallPromptHandler);
      e.preventDefault();
      setInstallStatus(createStatus({ isInstallSuccess: true })); 
    }
  }
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', beforeAppInstallPromptHandler); 
    window.addEventListener('appinstalled', appInstalledHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeAppInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleOnInstall = () => {
    if (installEvent && installEvent.prompt) {
      setInstallStatus(createStatus({ isInstallWatingConfirm: true }));
      installEvent.prompt();
      installEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setInstallStatus(createStatus({ isInstalling: true, isInstallAllowed: false }));
        } else {
          setInstallStatus(createStatus({ isInstallCancelled: true, isInstallAllowed: true }));
        }
      }).catch(() => {
        setInstallStatus(createStatus({ isInstallFailed: true, isInstallAllowed: true }));
      });
      setInstallEvent(null);
    } else {
      console.error('installEvent not available or prompt method not supported');
    }
  }
  
  return <InstallButton onClick={handleOnInstall} isInstallAllowed={installStatus.isInstallAllowed} />;
}

PWAInstallerPrompt.propTypes = {
  render: PropTypes.func.isRequired,
  callback: PropTypes.func,
};

PWAInstallerPrompt.defaultProps = { 
  callback: undefined
};

export default PWAInstallerPrompt;