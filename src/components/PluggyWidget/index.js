import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

import { PluggyConnect } from 'react-pluggy-connect'

const PluggyWidget = ({setId, setResponseData}) => {

  const onSuccess = (itemData) => {
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
    localStorage.setItem('pluggyData', JSON.stringify(pluggyData))
    setId(itemData.item.id)
    setResponseData(itemData.item)
  }

  const onError = (error) => {
    console.error('Pluggy Connect error:', error)
    toast.error('Erro ao conectar com a instituição bancária')
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