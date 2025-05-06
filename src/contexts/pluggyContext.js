/* eslint-disable react/prop-types */
/* eslint-disable default-case */
import { React, createContext, useState } from 'react'

import Cookies from 'js-cookie'
import pluggyApi from '../services/pluggy'
import _ from 'lodash'
export const PluggyContext = createContext({})

function PluggyProvider({ children }){

    const [id, setId] = useState()

    const loadAccounts = async () => {
        console.log('loadAccounts: ')
        if(id){
            let params = {
                itemId: id
            }
            let config = {
                params: params
            }
            let resp = await pluggyApi.get('/accounts', config)
            console.log('accounts response: ', resp.data)
            return resp.data.results;
        }
    }

    return(
        <PluggyContext.Provider
            value={{
               id, setId,

               loadAccounts,
            }}
        >
            {children}
        </PluggyContext.Provider>
    )
}

export default PluggyProvider
