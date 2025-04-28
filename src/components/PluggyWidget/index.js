import React from 'react'
import Cookies from 'js-cookie'

import { PluggyConnect } from 'react-pluggy-connect'

const PluggyWidget = () => {
  const onSuccess = (itemData) => {

  }

  const onError = (error) => {
    onClose()
  }

  return (
    <PluggyConnect
      connectToken={Cookies.get('accessToken')}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}

export default PluggyWidget