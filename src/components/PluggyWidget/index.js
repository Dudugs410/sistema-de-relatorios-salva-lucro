import React, { useContext } from 'react'
import Cookies from 'js-cookie'

import { PluggyConnect } from 'react-pluggy-connect'

const PluggyWidget = ({setId}) => {

  const onSuccess = (itemData) => {
    console.log('Item Data: ', itemData)
    console.log('ID: ', itemData.item.id)
    Cookies.set('id', itemData.item.id)
    setId(itemData.item.id)
  }
  
  const onError = (error) => {
    console.log('Error:', error)
  }

  return (
    <PluggyConnect
      connectToken={Cookies.get('accessToken')}
      includeSandbox={true}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}

export default PluggyWidget