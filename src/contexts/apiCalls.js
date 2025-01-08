import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api, { config } from '../services/api'

import md5 from 'md5'

import { useContext } from 'react'
import { AuthContext } from './auth'
import { dateConvert } from './dateConverter'

const ApiCalls = () => {
    const { setLoading } = useContext(AuthContext)

    async function returnBandeiras(){
        setLoading(true)
        await api.get('/bandeira')
        .then( response => {
        setLoading(false)
        return response.data
        })
        .catch(error =>{
        setLoading(false)
        })
    }

    async function returnGrupos(){
        setLoading(true)
        await api.get('/grupo')
        .then( response => {
          setLoading(false)
          return response.data
        })
        .catch(error =>{
          setLoading(false)
        })
      }
  
      async function returnAdministradoras(){
        setLoading(true)
        await api.get('/adquirente')
        .then( response => {
          setLoading(false)
          return response.data
        })
        .catch(error =>{
          setLoading(false)
        })
      }

      async function returnVendasPeriodo(datainicial, datafinal, cnpj, adquirente, bandeira){
        setLoading(true)
        let buscou
        buscou = false

        if((datainicial === '' || undefined) || (cnpj === '' || undefined)){
          alert('Favor selecionar uma data e cliente válidos')
          return 0
        }
    
        setLoading(true)
        let params = {}
    
        if(((adquirente !== '') && (bandeira !== '')) && (buscou === false)){
          params = {
            datainicial: datainicial,
            datafinal: datafinal,
            cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
            adquirente: adquirente,
            bandeira: bandeira,
          }
          buscou = true
        }
    
        else if(((adquirente !== '') && (bandeira === '')) && (buscou === false)){
          params = {
            datainicial: datainicial,
            datafinal: datafinal,
            cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
            adquirente: adquirente,
          }
          buscou = true
        }
    
        else if(((bandeira !== '') && (adquirente === '')) && (buscou === false)){
          params = {
            datainicial: datainicial,
            datafinal: datafinal,
            cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
            bandeira: bandeira,
          }
          buscou = true
        }
    
        else{
          params = {
            datainicial: datainicial,
            datafinal: datafinal,
            cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
          }
        }
        
          let config = {
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: params
          }
    
        await api.get('vendas', config)
            .then((response) => {
              setLoading(false)
              buscou = false
              return(response.data.VENDAS)
            })
            .catch((error) => {
            setLoading(false)
            })
    }

    async function returnCreditos(cnpj, datainicial, datafinal){
        setLoading(true);
        let params = {
          cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
          dataInicial: dateConvert(datainicial),
          dataFinal: dateConvert(datafinal),
        }
      
        let config = {
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: params
        }
      
        try {
          const response = await api.get('recebimentos', config)
          const recebimentosData = response.data
          setLoading(false)
            return recebimentosData
        } catch (error) {
          setLoading(false)
        }
    }

    return(
        <ApiCallContext.Provider
          value={{

            
          }}
        >
          {children}
        </ApiCallContext.Provider>
      )



}



export default ApiCalls

