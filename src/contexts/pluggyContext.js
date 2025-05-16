/* eslint-disable react/prop-types */
/* eslint-disable default-case */
import { React, createContext, useState } from 'react'

import Cookies from 'js-cookie'
import pluggyApi from '../services/pluggy'
import _ from 'lodash'
export const PluggyContext = createContext({})

function PluggyProvider({ children }){

    const [id, setId] = useState()
    const [itemId, setItemId] = useState()

    const loadAccounts = async () => {
        console.log('loadAccounts: ')
        if(id){
            console.log('ID: ', id)

            let params = {
                itemId: id,
            }
            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/accounts', config)
            console.log('accounts response: ', resp.data)
            return resp.data.results;
        }
    }

    const loadItem = async () => {
        let body = {
            "connectorId": 0,
            "parameters": {
                "user": "user-ok",
                "password": "password-ok"
            },
            "clientUserId": localStorage.getItem('UserID')
        }

        let resp = await pluggyApi.get('/items', body)
            console.log('items response: ', resp.data)
            return resp.data.results; // or just resp.data if no results field


    }

    const loadItemByID = async () => {
        console.log('loadItem: ')
        if(id) {
            let resp = await pluggyApi.get(`/items/${id}`)
            console.log('items by ID response: ', resp.data)
            return resp.data.results; // or just resp.data if no results field
        }
    }

        const loadTransactions = async () => {
        console.log('loadTransactions (accountID): ')
        let accountID = Cookies.get('accountID')
        if(accountID) {
            let resp = await pluggyApi.get(`/transactions`)
            console.log('transactions response: ', resp.data)
            return resp.data.results; // or just resp.data if no results field
        }
    }

    return(
        <PluggyContext.Provider
            value={{
               id, setId,
               itemId, setItemId,

               loadAccounts, loadItem, loadItemByID, loadTransactions
            }}
        >
            {children}
        </PluggyContext.Provider>
    )
}

export default PluggyProvider
