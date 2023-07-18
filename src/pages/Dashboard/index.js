/* eslint-disable default-case */

import './dashboard.css'

//////
import Cookies from "js-cookie"
//////
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import LoadingModal from '../../components/LoadingModal'
import ModalCliente from '../../components/ModalCliente'
//////
import PieChart from '../../components/00Teste'


const Dashboard = () => {
    
    const { 
        vendasDash, 
        loading, 
        loadPeriodo,
        recebimentosDash,
        loadRecebimentos, 
        cnpj, 
        dateConvertSearch, 
        dateConvertYYYYMMDD,
        modalCliente, 
    } = useContext(AuthContext)

    const vendasDias = []
    const recebimentosDias = []

    let somaValorLiquido = 0
    let recebimentos = 0

    let somaValorCredito = 0
    let somaValorDebito = 0
    let somaValorVoucher = 0

    let somaRecebimentoCredito = 0
    let somaRecebimentoDebito = 0
    let somaRecebimentoVoucher = 0

    

    const [liquido, setLiquido] = useState(0)
    const [credito, setCredito] = useState(0)
    const [debito, setDebito] = useState(0)
    const [voucher, setVoucher] = useState(0)

    const [recebimentoLiquido, setRecebimentoLiquido] = useState(0)
    const [recebimentoCredito, setRecebimentoCredito] = useState(0)
    const [recebimentoDebito, setRecebimentoDebito] = useState(0)
    const [recebimentoVoucher, setRecebimentoVoucher] = useState(0)

    const [dadosVendas, setDadosVendas] = useState({labels:[] , data:[]})
    const [dadosRecebimentos, setDadosRecebimentos] = useState({labels:[] , data:[]})

    function zerarValores(){
        somaValorLiquido = 0
        recebimentos = 0
    
        somaValorCredito = 0
        somaValorDebito = 0
        somaValorVoucher = 0
    
        somaRecebimentoCredito = 0
        somaRecebimentoDebito = 0
        somaRecebimentoVoucher = 0

        setLiquido(0)
        setCredito(0)
        setDebito(0)
        setVoucher(0)

        setRecebimentoLiquido(0)
        setRecebimentoCredito(0)
        setRecebimentoDebito(0)
        setRecebimentoVoucher(0)
    }

    useEffect(()=>{
        console.log('CNPJ', cnpj)
        zerarValores()
        if(modalCliente === false){
            if(cnpj !== ''){
                async function inicializarVendas(){
                    await iniciaDashboard()
                }
                async function inicializarRecebimentos(){
                    await iniciaRecebimentos()
                }
                
                if(vendasDias.length === 0 ){
                    inicializarVendas()
                }
                if(recebimentosDias.length === 0){
                    inicializarRecebimentos()
                }
            }
        }
    },[cnpj])

    useEffect(()=>{
        loadDados()
        loadTotalLiquido(vendasDias)
        loadTotalDia(vendasDias)
    },[vendasDash])

    useEffect(()=>{
        loadDadosRecebiveis()
        loadTotalLiquidoRecebimentos(recebimentosDias)
        loadTotalDiaRecebimentos(recebimentosDias)
    },[recebimentosDash])

    async function iniciaDashboard() {
        let dataAnterior = new Date()
        dataAnterior.setDate(dataAnterior.getDate() - 5);
        try {
        await loadPeriodo(dateConvertSearch(dataAnterior), dateConvertSearch(new Date()), cnpj)
        } catch (error) {
        console.log(error)
        }
    }

    async function iniciaRecebimentos(){
        let dataInicial = new Date()
        let dataFinal = new Date()
        dataInicial.setDate(dataInicial.getDate() - 1)
        dataFinal.setDate(dataFinal.getDate() + 4)
        try {
            await loadRecebimentos(cnpj, dateConvertSearch(dataInicial), dateConvertSearch(dataFinal))
        } catch (error) {
            console.log(error)
        }

    }

    function loadDados(){
        vendasDias.length = 0
        recebimentosDias.length = 0

        for(let i = 0; i < 5; i++){
            loadDia(vendasDash, i)
            recebimentosDias.push(loadDias(recebimentosDash, i -1))
        }
    }

    function loadDadosRecebiveis(){
        recebimentosDias.length = 0

        for(let i = 0; i < 5; i++){
            recebimentosDias.push(loadDias(recebimentosDash, i))
        }
    }

    function loadDia(vendas, indice){
        let dataTemp = new Date();
        dataTemp.setDate(dataTemp.getDate() - 5 + indice);
        dataTemp = dateConvertYYYYMMDD(dataTemp);
        
        let arrayTemp = vendas.filter((objeto) => objeto.dataVenda === dataTemp);
        vendasDias.push(arrayTemp);
    }

    function loadDias(vendas, indice){
        let dataTemp = new Date();
        dataTemp.setDate(dataTemp.getDate() - 5 + indice);
        dataTemp = dateConvertYYYYMMDD(dataTemp);
        
        let arrayTemp = vendas.filter((objeto) => objeto.dataVenda === dataTemp);
        return arrayTemp
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
        }
        else{
            console.log(vendasDias)
        }
    }

    function loadTotalDiaRecebimentos(recebimentosDias){
        if(recebimentosDias.length > 0){
            recebimentosDias.map((objeto) => {
                objeto.map((recebimentoArray) => {
                    switch(recebimentoArray.produto.descricaoProduto){
                        case 'Crédito':
                            somaRecebimentoCredito += recebimentoArray.valorLiquido
                            setRecebimentoCredito(somaRecebimentoCredito)
                            break
                        case 'Débito':
                            somaRecebimentoDebito += recebimentoArray.valorLiquido
                            setRecebimentoDebito(somaRecebimentoDebito)
                            break
                        case 'Voucher':
                            somaRecebimentoVoucher += recebimentoArray.valorLiquido
                            setRecebimentoVoucher(somaValorVoucher)
                            break
                    }
                    return 0
                })
                return 0
            })
        }
        else{
            console.log(vendasDias)
        }
    }

    async function loadTotalLiquido(vendasDias){
        dadosVendas.length = 0
        let label = []
        let data = []
        somaValorLiquido = vendasDias.map((posicao) => {
        return posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0);
        });
        for(let i = 0; i < 5; i++){
        let dataTemp = new Date();
        dataTemp.setDate(dataTemp.getDate() - 5 + i)
        let valorConvertido = parseFloat(somaValorLiquido[i])
        label.push(`${dateConvertYYYYMMDD(dataTemp)}`)
        data.push(Number(valorConvertido.toFixed(2)))
        }
        setDadosVendas({labels: label, data: data})
        setLiquido(somaValorLiquido)
    }

    async function loadTotalLiquidoRecebimentos(recebimentosDias) {
        dadosRecebimentos.length = 0
        let label = []
        let data = [0, 0, 0, 0, 0]
      
        recebimentosDias.forEach((posicao) => {
          const valorTotal = posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0)
          data.push(Number(valorTotal.toFixed(2)))
        })
      
        for (let i = 0; i < 5; i++) {
          let dataTemp = new Date()
          dataTemp.setDate(dataTemp.getDate() - 1 + i)
          label.push(`${dateConvertYYYYMMDD(dataTemp)}`)
        }
      
        setDadosRecebimentos({ labels: label, data: data })
        setRecebimentoLiquido(data.slice(-5))
      }

  return(
    <>
        { modalCliente ? <ModalCliente/> : 
        <>
            { loading ? <LoadingModal/> : <div className='appPage'>
                <div className='content-area dash'>
                    <div className='data-group-area'>
                        
                        <div className='graph-data'>
                            <h1 className='title-chart'>Vendas:</h1>
                            <PieChart data01 = {dadosVendas}/>
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
                            <h1 className='title-chart'>Recebimentos:</h1>
                            <PieChart data01 = {dadosRecebimentos}/>
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
                                        <td className='cell-text dash-td' data-label="Débito">R$ {recebimentoDebito.toFixed(2).replace('.',',')}</td>
                                        <td className='cell-text dash-td' data-label="Crédito">R$ {recebimentoCredito.toFixed(2).replace('.',',')}</td>
                                        <td className='cell-text dash-td' data-label="Voucher">R$ {recebimentoVoucher.toFixed(2).replace('.',',')}</td>
                                        </tr>
                                    </tbody>
                            </table>
                        </div>
                    </div>            
                </div>
            </div> }
        </>}
        
    </>  
  )  
}

export default Dashboard