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
        if(id){
            let params = {
                itemId: id,
            }

            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/accounts', config)
            return resp.data.results
        }
    }

    const loadIdentity = async () => {
        if(id){

            let params = {
                itemId: id,
            }

            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/identity', config)
            return resp.data
        }
    }

    const loadLoans = async () => {

        if(id){

            let params = {
                itemId: id,
            }
            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/loans', config)
            return resp.data.results
        }
    }

    const loadInvestments = async () => {
        if(id){

            let params = {
                itemId: id,
            }

            let config = {
                params: params
            }

            let resp = await pluggyApi.get('/investments', config)
            return resp.data.results
        }
    }

        const loadInvestmentTransactions = async () => {
        let investmentID = localStorage.getItem('investmentID')
        if(investmentID){
            let resp = await pluggyApi.get(`/investments/${investmentID}/transactions`)
            return resp.data
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
        return resp.data.results
    }

    const loadItemByID = async () => {
        if(id) {
            let resp = await pluggyApi.get(`/items/${id}`)
            return resp.data.results
        }
    }

    const loadTransactions = async (accountId) => {
        if (accountId) {
            try {
                let resp = await pluggyApi.get(`/transactions`, {
                    params: {
                        accountId: accountId
                    }
                })
                return resp.data.results
            } catch (error) {
                console.error('Error loading transactions:', error)
                throw error
            }
        }
        return []
    }

    const loadBills = async (accountId) => {
        if (accountId) {
            let resp = await pluggyApi.get('/bills', {
            params: {
                accountId: accountId
            }
            })
            return resp.data.results
        }
        return []
    }

    return(
        <PluggyContext.Provider
            value={{
               id, setId,
               itemId, setItemId,
               loadAccounts, loadTransactions,
               loadInvestments, loadInvestmentTransactions,
               loadIdentity, loadLoans,
               loadItem, loadItemByID,
               loadBills,
            }}
        >
            {children}
        </PluggyContext.Provider>
    )
}

export default PluggyProvider