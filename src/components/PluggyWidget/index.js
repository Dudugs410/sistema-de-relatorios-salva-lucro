import React, { useContext } from 'react'
import Cookies from 'js-cookie'

import { PluggyConnect } from 'react-pluggy-connect'

const PluggyWidget = ({setId, setResponseData}) => {

  const onSuccess = (itemData) => {
    console.log('Pluggy Widget Item Data: ', itemData)
    console.log('ID: ', itemData.item.id)
    Cookies.set('itemID', itemData.item.id)
    localStorage.setItem('pluggyResponseData', JSON.stringify(itemData.item))
    let pluggyData = {
        id: itemData.item.id,
        accounts: [],
        loans: [],
        investments: [],
        identity: [],
        bills: [],
    }
    console.log('pluggy data antes do storage: ', pluggyData)
    localStorage.setItem('pluggyData', JSON.stringify(pluggyData))
    setId(itemData.item.id)
    setResponseData(itemData.item)
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