import { React, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import api, { config } from '../services/api'

import md5 from 'md5'

export const AuthContext = createContext({})

function AuthProvider({ children }){
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState(undefined)
  const [userList, setUserList] = useState([])

////////////////////////////////////////////////////////////////

  const [dataInicial, setDataInicial] = useState(new Date())
  const [dataFinal, setDataFinal] = useState(null)
  const [cnpj, setCnpj] = useState('03.953.552/0001-02')
  const [vendas, setVendas] = useState([])
  const [bandeiras, setBandeiras] = useState([])
  const [clientes, setClientes] = useState([])
  const [vendasDiaAtual, setVendasDiaAtual] = useState([])
  const [vendas5dias, setVendas5Dias] = useState([])
  const [totalLiquido, setTotalLiquido] = useState(0)
  const [totalDebito, setTotalDebito] = useState(0)
  const [totalCredito, setTotalCredito] = useState(0)
  const [totalVoucher, setTotalVoucher] = useState(0)

  const [detalhes, setDetalhes] = useState(false)
  
  const navigate = useNavigate()

useEffect(() =>{
  console.log('auth.js')
},[])

  /////Login do usuário

  async function submitLogin(login, password){
    setLoading(true)
    await api.post('/token', { client_id: login, client_secret: md5(password) })
    .then(async response => {
        Cookies.set('token', response.data.acess_token)
        setAccessToken(Cookies.get('token'))
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
    console.log('logout()')
    sessionStorage.clear()
    setIsSignedIn(false)
    setUserData({})
    Cookies.remove('token')
    localStorage.setItem('isSignedIn', false)
    navigate('/')
    console.log('************fim logout()************')
  }

  function expired(){
    alert('Sessão expirada. Faça o Login novamente')
    sessionStorage.clear()
    setIsSignedIn(false)
    setUserData({})
    Cookies.remove('token')
    localStorage.setItem('isSignedIn', false)
    navigate('/')
    console.log('************fim sessão expirada************')
  }

  //////////////////////////////////////////////////////////////////

  //Vendas**********************************************************

    async function loadBandeiras(){
      await api.get('/bandeira')
      .then( async response => {
        setBandeiras(response)
      })
      .catch(error =>{
        console.log(error)
      })
    }
  
    async function loadVendas(){
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
            setVendas(response.data)
            return response.data
            })
            .catch((error) => {
            console.log(error)
            })
    }

    async function loadVendasDiaAtual(){
      let params = {
        data: '2023-05-01',
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
        console.log('teste: ' + response)
        let vendasHoje = []
        vendasHoje.push(response.data.map((venda) => { return venda.valorBruto} ))
        setVendasDiaAtual(vendasHoje)
      })
      console.log(vendasDiaAtual)
    }

    async function handleBusca(){
      console.log(cnpj, dataInicial)
      await buscar()
  }


  async function buscar() {
    setCnpj('03953552000102');
    await loadVendas();
    if (!dataFinal) {
      alert(`executou a busca do dia ${dataInicial}`);
        console.log(vendas)
        setDetalhes(true)
        
    } else {
      if (dataFinal < dataInicial) {
        alert('A Data Final não pode ser menor que a data inicial. Favor selecionar uma data válida.');
        return;
      } else if (dataFinal === '' || dataInicial === '') {
        alert('Favor selecionar um período de datas válido');
        return;
      } else {
        alert(`Executou busca entre os dias ${dataInicial} e ${dataFinal}`);
      }
    }
  }

  function totalVendasLiquido(){
    setTotalLiquido(vendas.reduce((total, venda) => total + venda.valorLiquido, 0))
  }

  function dateConvert(date){
    let newDate = new Date(date)
    let day = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    let convertedDate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year
    
    return convertedDate
  }

  function dateConvertYYYYMMDD(date){
    return date.toISOString().split('T')[0]
  }
////////////////////////////////////////////////////////////////////////

  return(
    <AuthContext.Provider sdfsdfsd
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
        expired,
        dateConvert,
        dateConvertYYYYMMDD,


        //////////////////

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
        loadVendasDiaAtual,
        detalhes,
        setDetalhes,
        handleBusca,
        buscar,
        totalVendasLiquido,
        totalLiquido,
        setTotalLiquido
        
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

