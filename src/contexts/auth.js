/* eslint-disable default-case */
import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import jwtDecode from 'jwt-decode';

import Cookies from 'js-cookie'
import api, { config } from '../services/api'

import md5 from 'md5'

export const AuthContext = createContext({})

function AuthProvider({ children }){
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState(undefined)
  const [refreshToken, setRefreshToken] = useState(undefined)
  const [userList, setUserList] = useState([])

////////////////////////////////////////////////////////////////

  const [dataInicial, setDataInicial] = useState(new Date())
  const [dataFinal, setDataFinal] = useState(null)
  const [cnpj, setCnpj] = useState('03.953.552/0001-02')
  
  const [vendas, setVendas] = useState([])
  const [vendasDashboard, setVendasDashboard] = useState([])
  const [vendas5dias, setVendas5dias] = useState([])
  const [vendasHoje, setVendasHoje] = useState([])

  const [bandeiras, setBandeiras] = useState([])
  const [clientes, setClientes] = useState([])
  const [totalLiquido, setTotalLiquido] = useState(0)
  const [totalDebito, setTotalDebito] = useState(0)
  const [totalCredito, setTotalCredito] = useState(0)
  const [totalVoucher, setTotalVoucher] = useState(0)

  const [detalhes, setDetalhes] = useState(false)
  const [buscou, setBuscou] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() =>{
    setDataInicial(new Date())
    console.log('auth.js')
  },[])

  /////Login do usuário

  async function submitLogin(login, password){
    setLoading(true)
    await api.post('/token', { client_id: login, client_secret: md5(password) })
    .then(async response => {
        Cookies.set('token', response.data.acess_token)
        Cookies.set('refreshToken', response.data.refresh_token)
        setAccessToken(Cookies.get('token'))
        setRefreshToken(Cookies.get('refreshToken'))
        if(response.data.sucess === true){
          sessionStorage.setItem('isSignedIn', true)
        }
        try {
          const response = await api.get('/usuario', config(Cookies.get('token')));
          const userList = response.data;
          sessionStorage.setItem('userList', JSON.stringify(userList));
          const userMatch = userList.find((user) => user.LOGIN === login && user.SENHA === md5(password));
        
          if (userMatch) {
            console.log('User found:', userMatch);
            sessionStorage.setItem('isSignedIn', true);
            sessionStorage.setItem('userData', JSON.stringify(userMatch));
            localStorage.setItem('isSignedIn', true)
            setIsSignedIn(true);
          } else {
            console.log('User not found');
          }
        } catch (error) {
          console.error(error);
        }
      setLoading(false)
      
    })
    .catch(error =>{
        console.log('catch: ')
        console.log(error)
        alert(error.message)
        setLoading(false)
    })
    
    setLoading(false)
    console.log('************fim submitLogin()************')
  }
  
  /////desloga usuário
  function logout(){
    setLoading(true)
    console.log('logout()')
    sessionStorage.clear()
    setIsSignedIn(false)
    setUserData({})
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    localStorage.setItem('isSignedIn', false)
    setLoading(false)
    navigate('/')
    console.log('************fim logout()************')
  }

  function expired(){
    alert('Sessão expirada. Faça o Login novamente')
    sessionStorage.clear()
    setIsSignedIn(false)
    setUserData({})
    Cookies.remove('token')
    Cookies.remove('refreshToken')
    localStorage.setItem('isSignedIn', false)
    navigate('/')
    console.log('************fim sessão expirada************')
  }

  //////////////////////////////////////////////////////////////////

  //Vendas**********************************************************

    async function loadBandeiras(){
      setLoading(true)
      await api.get('/bandeira')
      .then( async response => {
        setBandeiras(response)
      })
      .catch(error =>{
        console.log(error)
      })
      setLoading(false)
    }
  
    async function loadVendas(){
      setLoading(true)
        let params = {
            data: dataInicial,
            cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
          }
          
          let config = {
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${Cookies.get('token')}`
            },
            params: params
          }

        await api.get('vendas', config)
            .then((response) => {
            setVendas(response.data.VENDAS)

            const valores = response.data.VENDAS.reduce((total, vendas) =>{
              total.total += vendas.valorLiquido
              switch(vendas.produto.descricaoProduto){
                case 'Crédito':
                  total.Credito += vendas.valorLiquido
                  break
                case 'Débito':
                  total.Debito += vendas.valorLiquido
                  break
                case 'Voucher':
                  total.Voucher += vendas.valorLiquido
                  break
              }

            return total
          },{Credito: 0, Debito:0, Voucher: 0, total:0})

            console.log('Valores Crédito: ' + valores.Credito)
            console.log('Valores Débito: ' + valores.Debito)
            console.log('Valores Voucher: ' + valores.Voucher)
            console.log('Total: ' + valores.total)

            setTotalCredito(valores.Credito)
            setTotalDebito(valores.Debito)
            setTotalVoucher(valores.Voucher)
            setTotalLiquido(valores.total)
   
            return response.data
            })
            .catch((error) => {
            console.log(error)
            })
            setLoading(false)
    }

    //vendas Dashboard

    async function loadVendasDashboard() {
      setLoading(true)
      setCnpj('03953552000102')
     
      let vendasTemp = []
      for(let i = 1; i < 6; i++){
          let dataTemp = new Date(dataInicial.getDate() - i);
          let params = {
              data: dataTemp,
              cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
            }
            
            let config = {
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${Cookies.get('token')}`
              },
              params: params
            }
  
          try{
              await api.get('vendas', config)
              .then((response) => {
                  vendasTemp.push(response.data.VENDAS)
                  return response.data
              })
                  .catch((error) => {
                  console.log(error)
              })
          } catch(error){
              console.log(error)
          }
      }
      setVendasDashboard(vendasTemp)
      console.log(vendasDashboard)
      setLoading(false)
  }

    //testar vendas

    async function vendasTeste(){
      setLoading(true)
      setCnpj('03953552000102')
      const dataTemp = '2023-05-31'

        let params = {
            data: dataTemp,
            cnpj: cnpj.replace(/[^a-zA-Z0-9 ]/g, ''),
          }
          
          let config = {
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${Cookies.get('token')}`
            },
            params: params
          }
          try{
            let vendasTest = await api.get('/vendas', config)
            setLoading(false)
            return vendasTest
          } catch (error){
            console.error(error)
            setLoading(false)
            return null
          }
    }
      

    //refresh

    async function refresh(){
      await api.post('/token/refresh/' + Cookies.get('refreshToken'), config(accessToken))
      .then((response) => {
        console.log (response)
        if(response.success){
          console.log(response)
          setAccessToken(response.acessToken)
          Cookies.set('token', accessToken)
          setRefreshToken(response.refreshToken)
          Cookies.set('refreshToken', refreshToken)
        }
        else{
          //expired()
          console.log('erro')
        }
      }).catch(error => console.log(error))
    }

  async function buscar() {
    setCnpj('03953552000102');
    setLoading(true)
    setBuscou(true)
    await loadVendas();
    if (!dataFinal) {
      alert(`executou a busca do dia ${dataInicial}`)
      setDetalhes(true)
    } else {
      if (dataFinal < dataInicial) {
        alert('A Data Final não pode ser menor que a data inicial. Favor selecionar uma data válida.')
        setLoading(false)
        return
      } else if (dataFinal === '' || dataInicial === '') {
        alert('Favor selecionar um período de datas válido')
        setLoading(false)
        return
      } else {
        alert(`Executou busca entre os dias ${dataInicial} e ${dataFinal}`)
      }
    }
    setLoading(false)
    console.log(vendas)
  }

  function dateConvert(date) {
    let parts = date.split('-')
    let year = parts[0]
    let month = parts[1]
    let day = parts[2]
  
    let convertedDate = day + '/' + month + '/' + year
    return convertedDate
  }

  function dateConvertYYYYMMDD(date){
    return date.toISOString().split('T')[0]
  }
////////////////////////////////////////////////////////////////////////

  return(
    <AuthContext.Provider
      value={{
        signed: !!userData,
        isSignedIn,
        setIsSignedIn,
        loading,
        setLoading,
        submitLogin,
        logout,
        userData,
        setUserData,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        expired,
        dateConvert,
        dateConvertYYYYMMDD,
        refresh,
        vendasTeste,


        //////////////////
        loadVendasDashboard,
        vendasDashboard,
        setVendasDashboard,
        vendas5dias,
        setVendas5dias,

        dataInicial,
        setDataInicial,
        dataFinal,
        setDataFinal,
        cnpj,
        setCnpj,
        vendas,
        setVendas,
        bandeiras,
        setBandeiras,
        loadBandeiras,
        clientes,
        setClientes,
        loadVendas,
        detalhes,
        setDetalhes,
        buscar,
        totalLiquido,
        setTotalLiquido,
        totalCredito,
        setTotalCredito,
        totalDebito,
        setTotalDebito,
        totalVoucher,
        setTotalVoucher,
        buscou,
        setBuscou,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

