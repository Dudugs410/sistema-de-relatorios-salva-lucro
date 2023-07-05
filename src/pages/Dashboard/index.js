/* eslint-disable default-case */

import './dashboard.css'

//////
import Cookies from "js-cookie"
//////
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import LoadingModal from '../../components/LoadingModal'
//////
import Grafico from '../../components/Grafico'


const Dashboard = () => {
    
    const { setIsSignedIn, setAccessToken } = useContext(AuthContext)
    const { vendas, vendasDash, loading, loadPeriodo, cnpj, dateConvertSearch, dateConvertYYYYMMDD } = useContext(AuthContext)

    const vendasDias = []

    let somaValorLiquido
    let somaValorCredito
    let somaValorDebito
    let somaValorVoucher

    const data01 = [];
    
    const data02 = [
        { name: 'dia 01', total: 2 },
        { name: 'dia 02', total: 200 },
        { name: 'dia 03', total: 300 },
        { name: 'dia 04', total: 150 },
        { name: 'dia 05', total: 250 },
    ];

    const dataRecebiveis01 = [
        { name: 'dia 01', total: 11 },
        { name: 'dia 02', total: 200 },
        { name: 'dia 03', total: 300 },
        { name: 'dia 04', total: 150 },
        { name: 'dia 05', total: 250 },
    ]

    const dataRecebiveis02 = [
        { name: 'dia 01', total: 12 },
        { name: 'dia 02', total: 200 },
        { name: 'dia 03', total: 300 },
        { name: 'dia 04', total: 150 },
        { name: 'dia 05', total: 250 },
    ]


    useEffect(() => {
        setIsSignedIn(sessionStorage.getItem('isSignedIn'))
        setAccessToken(Cookies.get('token'))
    },[setAccessToken, setIsSignedIn])

    useEffect(()=>{
        async function inicializar(){
            await iniciaDashboard()
        }
        inicializar()
    },[])

    useEffect(()=>{
        loadDados()
        loadTotalLiquido(vendasDias)
    },[vendasDash])

    async function iniciaDashboard() {
        let dataAnterior = new Date()
        dataAnterior.setDate(dataAnterior.getDate() - 5);
        try {
        await loadPeriodo(dateConvertSearch(dataAnterior), dateConvertSearch(new Date()), cnpj)
        } catch (error) {
        console.log(error)
        }
    }

    function loadDados(){
        vendasDias.length = 0
        for(let i = 0; i < 5; i++){
            loadDia(vendasDash, i)
        }
    }

    function loadDia(vendas, indice){
        let dataTemp = new Date();
        dataTemp.setDate(dataTemp.getDate() - 5 + indice);
        dataTemp = dateConvertYYYYMMDD(dataTemp);
        
        let arrayTemp = vendas.filter((objeto) => objeto.dataVenda === dataTemp);
        vendasDias.push(arrayTemp);
    }

    function loadTotalDia(vendasDias){
        loadTotalCredito(vendasDias)
        loadTotalDebito(vendasDias)
        loadTotalVoucher(vendasDias)

    }

    function loadTotalLiquido(vendasDias){
        somaValorLiquido = vendasDias.map((posicao) => {
            return posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0);
          });
          console.log(somaValorLiquido);
          for(let i = 0; i < 5; i++){
            let dataTemp = new Date();
            dataTemp.setDate(dataTemp.getDate() - 5 + i)
            let valorConvertido = parseFloat(somaValorLiquido[i].toFixed(2))
            console.log('valor convertido', valorConvertido)
            data01.push({
                name: `${dateConvertYYYYMMDD(dataTemp)}`,
                total: valorConvertido,
            })
          }
          console.log(data01)
    }

    function loadTotalCredito(vendasDias){
        somaValorCredito = vendasDias.map((posicao) => {
            return posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0);
          });
          console.log(somaValorCredito)
    }

    function loadTotalDebito(vendasDias){
        somaValorDebito = vendasDias.map((posicao) => {
            return posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0);
          });

          console.log(somaValorDebito)
    }

    function loadTotalVoucher(vendasDias){
        somaValorVoucher = vendasDias.map((posicao) => {
            return posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0);
          });

          console.log(somaValorVoucher)
    }

    function loadTotalAdm(vendasDias){
        
    }

    function handleLoad(){
        console.log('handleLoad')
        loadTotalLiquido(vendasDias)
    }

    function handleShow(){
        console.log('handleShow')
        console.log(vendasDias)

    }
        


  return(
    <>
        { loading ? <LoadingModal/> : <div className='appPage'>

            <button className='btn btn-success' onClick={handleLoad}>Load Dados</button>
            <button className='btn btn-warning' onClick={handleShow}>Log Dados</button>

            <div className='content-area dash'>
                <div className='data-group-area'>
                    <div className='graph-data'>
                        <Grafico className='custom-chart' data01={data01} data02={data02} color01="#9acd32" color02="#6e9eff"/>
                    </div>

                    <div className='graph-data'>
                        <Grafico className='custom-chart' data01={dataRecebiveis01} data02={dataRecebiveis02} color01="#6e9eff" color02="#9acd32" />
                    </div>
                </div>
                
                <div className='data-group-area'>
                    <div className='table-data'>
                        <table className="table dash-table">
                            <thead className='dash-thead'>
                                <tr className='dash-tr'>
                                    <th className='dash-th' scope="col">Débito</th>
                                    <th className='dash-th' scope="col">Crédito</th>
                                    <th className='dash-th' scope="col">Voucher</th>
                                </tr>
                            </thead>
                            <tbody className='dash-tbody'>
                                <tr className='dash-tr'>
                                    <td className='cell-text dash-td' data-label="Débito">Débito</td>
                                    <td className='cell-text dash-td' data-label="Crédito">Crédito</td>
                                    <td className='cell-text dash-td' data-label="Voucher">Voucher</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div className='table-data'>
                        <table className="table dash-table">
                                <thead className='dash-thead'>
                                    <tr className='dash-tr'>
                                        <th className='dash-th' scope="col">Débito</th>
                                        <th className='dash-th' scope="col">Crédito</th>
                                        <th className='dash-th' scope="col">Voucher</th>
                                    </tr>
                                </thead>
                                <tbody className='dash-tbody'>
                                    <tr className='dash-tr'>
                                        <td className='cell-text dash-td' data-label="Débito">Débito</td>
                                        <td className='cell-text dash-td' data-label="Crédito">Crédito</td>
                                        <td className='cell-text dash-td' data-label="Voucher">Voucher</td>
                                    </tr>
                                </tbody>
                        </table>
                    </div>
                </div>            
            </div>
        </div> }
    </>  
  )  
}

export default Dashboard