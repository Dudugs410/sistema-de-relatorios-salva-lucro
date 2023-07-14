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
import PieChart from '../../components/00Teste'


const Dashboard = () => {
    
    const { accessToken, vendas, vendasDash, loading, loadPeriodo, cnpj, dateConvertSearch, dateConvertYYYYMMDD } = useContext(AuthContext)

    const vendasDias = []

    let somaValorLiquido = 0
    let somaValorCredito = 0
    let somaValorDebito = 0
    let somaValorVoucher = 0

    const [liquido, setLiquido] = useState(0)
    const [credito, setCredito] = useState(0)
    const [debito, setDebito] = useState(0)
    const [voucher, setVoucher] = useState(0)

    const data01 = []
    
    const data02 = [
        { name: 'dia 01', total: 2 },
        { name: 'dia 02', total: 200 },
        { name: 'dia 03', total: 300 },
        { name: 'dia 04', total: 150 },
        { name: 'dia 05', total: 250 },
    ]

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

    useEffect(()=>{
        async function inicializar(){
            await iniciaDashboard()
        }
        if(vendasDias.length === 0){
            inicializar()
        }
    },[])

    useEffect(()=>{
        loadDados()
        loadTotalLiquido(vendasDias)
        loadTotalDia(vendasDias)
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
        if(vendasDias.length > 0){
            vendasDias.map((objeto) => {
                objeto.map((vendaArray) => {
                    switch(vendaArray.produto.descricaoProduto){
                        case 'Crédito':
                            somaValorCredito += vendaArray.valorLiquido
                            setCredito(somaValorCredito)
                            break
                        case 'Débito':
                            somaValorDebito += vendaArray.valorLiquido
                            setDebito(somaValorDebito)
                            break
                        case 'Voucher':
                            somaValorVoucher += vendaArray.valorLiquido
                            setVoucher(somaValorVoucher)
                            break
                    }
                    return 0
                })
                return 0
            })
            console.log(somaValorCredito, somaValorDebito, somaValorVoucher)
        }
        else{
            console.log(vendasDias)
        }
    }

    function loadTotalLiquido(vendasDias){
        data01.length = 0
        somaValorLiquido = vendasDias.map((posicao) => {
            return posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0);
          });
          console.log(somaValorLiquido);
          for(let i = 0; i < 5; i++){
            let dataTemp = new Date();
            dataTemp.setDate(dataTemp.getDate() - 5 + i)
            let valorConvertido = parseFloat(somaValorLiquido[i])
            data01.push({
                name: `${dateConvertYYYYMMDD(dataTemp)}`,
                total: valorConvertido.toFixed(2),
            })
          }
          setLiquido(somaValorLiquido)
          console.log(data01)
    }

  return(
    <>
        { loading ? <LoadingModal/> : <div className='appPage'>
            <div className='content-area dash'>
                <div className='data-group-area'>
                    
                    <div className='graph-data'>
                        <h1 className='title-chart'>Vendas:</h1>
                        <PieChart data01 = {dataRecebiveis01}/>
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
                                    <td className='cell-text dash-td' data-label="Débito">R$ {debito.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Crédito">R$ {credito.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Voucher">R$ {voucher.toFixed(2).replace('.',',')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className='data-group-area'>
                    <div className='graph-data'>
                        <h1 className='title-chart'>Recebíveis:</h1>
                        <PieChart data01 = {dataRecebiveis01}/>
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