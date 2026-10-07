import React from 'react'

const InstallPWAButton = () => {
  const handleInstallPWA = () => {
    if ('beforeinstallprompt' in window) {
      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        const deferredPrompt = event
        deferredPrompt.prompt()
      })
    } else {
      alert('PWA installation is not supported in this browser.')
    }
  }

  return (
    <button onClick={handleInstallPWA}>
      Install PWA
    </button>
  )
}

export default InstallPWAButton