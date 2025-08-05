/* eslint-disable react/prop-types */
/* eslint-disable default-case */
import { React, createContext, useState } from 'react'

import Cookies from 'js-cookie'
import pluggyApi from '../services/pluggy'
import _ from 'lodash'
export const PluggyContext = createContext({})

function PluggyProvider({ children }){

    const [id, setId] = useState(() => {
        try {
            const storedData = localStorage.getItem('pluggyData')
            if (storedData) {
                const parsedData = JSON.parse(storedData)
                return parsedData.id || ''
            }
            return ''
        } catch (error) {
            console.error('Error reading from localStorage:', error)
            return ''
        }
    })

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

    const loadIdentity = async () => {
        console.log('loadIdentity: ->->->')
        if(id){
            console.log('ID: ', id)

            let params = {
                itemId: id,
            }
            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/identity', config)
            console.log('identity response: ', resp.data)
            return resp.data;
        }
    }

    const loadLoans = async () => {
        console.log('loadLoans: ')
        if(id){
            console.log('ID: ', id)

            let params = {
                itemId: id,
            }
            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/loans', config)
            console.log('loans response: ', resp.data)
            return resp.data.results;
        }
    }

    const loadInvestments = async () => {
        console.log('loadInvestments: ')
        if(id){
            console.log('ID: ', id)

            let params = {
                itemId: id,
            }

            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/investments', config)
            console.log('investments response: ', resp.data)
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
            return resp.data.results;


    }

    const loadItemByID = async () => {
        console.log('loadItem: ')
        if(id) {
            let resp = await pluggyApi.get(`/items/${id}`)
            console.log('items by ID response: ', resp.data)
            return resp.data.results;
        }
    }

    const loadTransactions = async () => {
        console.log('loadTransactions (accountID): ')
        let accountID = Cookies.get('accountID')
        if(accountID) {
            let resp = await pluggyApi.get(`/transactions`)
            console.log('transactions response: ', resp.data)
            return resp.data.results;
        }
    }

const loadBills = async (accountId) => {
  console.log('loadBills (accountID): ', accountId);
  if (accountId) {
    let resp = await pluggyApi.get('/bills', {
      params: {
        accountId: accountId
      }
    });
    console.log('bills response: ', resp.data);
    return resp.data.results;
  }
  return []; // Return empty array if no accountId
};

    return(
        <PluggyContext.Provider
            value={{
               id, setId,
               itemId, setItemId,

               loadAccounts, loadTransactions,
               loadInvestments, loadIdentity, loadLoans,
               loadItem, loadItemByID,
               loadBills,
            }}
        >
            {children}
        </PluggyContext.Provider>
    )
}

export default PluggyProvider

/*
    pluggyData = {
        id: int,
        accounts: [],
        loans: [],
        investments: []
    }
*/