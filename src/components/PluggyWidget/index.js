import React, { useContext } from 'react'
import Cookies from 'js-cookie'

import { PluggyConnect } from 'react-pluggy-connect'

const PluggyWidget = ({setId}) => {

  const onSuccess = (itemData) => {
    console.log('Pluggy Widget Item Data: ', itemData)
    console.log('ID: ', itemData.item.id)
    Cookies.set('itemID', itemData.item.id)
    setId(itemData.item.id)
  }
  
  const onError = (error) => {
    console.log('Error:', error)
  }

  return (
    <PluggyConnect
      connectToken={Cookies.get('pluggy_connect_token')}
      clientUserId={'teste'}
      includeSandbox={true}
      avoidDuplicates={true}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}

export default PluggyWidget