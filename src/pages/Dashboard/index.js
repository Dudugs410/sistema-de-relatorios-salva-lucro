/* eslint-disable default-case */

import './dashboard.css'

//////
import TabelaGenerica from '../../components/TabelaGenerica'
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
        loadGrupos,
        recebimentosDash,
        loadRecebimentos, 
        cnpj, 
        dateConvertSearch, 
        dateConvertYYYYMMDD,
        modalCliente,
        returnTotalMes,
        retornaRecebimentos,
        teste, 
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

    const [dadosVendas4dias, setDadosVendas4dias] = useState({labels:[], data:[]})

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
/////////////////////////////////////////////////////////////////////////////////////////////

//novos dados Dashboard

//vendas dos últimos 4 dias - ok

    const [vendas4dias, setVendas4dias] = useState([])

    const [total4diasTabela, setTotal4diasTabela] = useState(0.00)
    const [totalMesTabela, setTotalMesTabela] = useState(0.00)

    function convert(date, index){

        const newDate = new Date(date)
        newDate.setDate(newDate.getDate() + index)

        const year = newDate.getFullYear()
        const month = String(newDate.getMonth() + 1).padStart(2, '0')
        const day = String(newDate.getDate()).padStart(2, '0')

        const convertedDate = `${year}-${month}-${day}`
        return convertedDate
    }

    useEffect(()=>{
        let temp = []
        async function init(){
            for(let i = 0; i <= 4; i++){
                let dataAtual = new Date()
                dataAtual.setDate(dataAtual.getDate() - 4)
                dataAtual = convert(dataAtual, i)
                await vendasDash.map((venda) => {
                    if(venda.dataVenda === dataAtual){
                        let obj = {
                            dataVenda: venda.dataVenda,
                            valorLiquido: venda.valorLiquido,
                            administradora: venda.adquirente.nomeAdquirente
                        }
                        temp.push(obj)
                    }
                })
            }
        }
        init()
        setVendas4dias(temp)
    },[vendasDash])
//

// Vendas dos últimos 4 dias, quebradas por administradora - ok

const [adm4dias, setAdm4dias] = useState([])

useEffect(()=>{
    const temp = totalPorAdministradora(vendas4dias)
    setAdm4dias(temp)
},[vendas4dias])

useEffect(()=>{
    console.log('vendasDash: ',vendasDash)
    console.log('adm4dias: ', adm4dias)
},[adm4dias])

// total dos últimos 4 dias + total do mês

const [arrayTotalMes, setArrayTotalMes] = useState([])
const [totalMes, setTotalMes] = useState({})

useEffect(()=>{
    if(cnpj !== null){
        let dataInicial = new Date()
        dataInicial.setDate(1)
        let currentDate = new Date();
        let nextMonthFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        let dataFinal = new Date(nextMonthFirstDay.getTime() - 1);
    
        async function loadTotais(){
          let dataAtual = new Date()
          dataAtual.setDate(1)
          let i = dataAtual
          let resp = []
    
          for(i; i<= dataFinal; i.setDate(i.getDate() + 1)){
            
            await returnTotalMes(cnpj, i)
            .then((response) => {
              let obj = (response)
              resp.push(obj)
            })
          }
          setArrayTotalMes(resp)
        }
        loadTotais()
        console.log('arrayTotalMes: ', arrayTotalMes)
    }
  },[cnpj])

useEffect(()=>{
    if((cnpj !== null) && (teste === false)){
        let temp = {
            valorDescontos: 0,
            valorLiquido: 0,
            valorVendido: 0,
        }
        console.log(temp.valorDescontos, temp.valorLiquido, temp.valorVendido)
        console.log('arrayTotalMes: ',arrayTotalMes)

        const somaTotalDescontos = (array) => {
            return array.reduce((sum, item) => sum + item.valordescontos, 0);
          }
        
        const somaTotalLiquido = (array) => {
            return array.reduce((sum, item) => sum + item.valorliquido, 0);
        }

        const somaTotalVendido = (array) => {
            return array.reduce((sum, item) => sum + item.valorvendido, 0);
        }

        temp.valorDescontos = somaTotalDescontos(arrayTotalMes)
        temp.valorLiquido = somaTotalLiquido(arrayTotalMes)
        temp.valorVendido = somaTotalVendido(arrayTotalMes)

        setTotalMes(temp)
    }
},[arrayTotalMes])

useEffect(()=>{
    console.log('totalMes: ', totalMes)
},[totalMes])

const [total4dias, setTotal4dias] = useState(null)

useEffect(()=>{

    const somaTotal4dias = (array) => {
        return array.reduce((sum, item) => sum + item.valorLiquido, 0);
    }
    setTotal4dias(somaTotal4dias(vendas4dias))
    console.log('total4Dias: ',total4dias)
},[vendas4dias])

//valores da tabela 

useEffect(()=>{
    if((total4dias !== null) && (total4dias !== undefined)){
        setTotal4diasTabela(total4dias)
    }
},[total4dias])

useEffect(()=>{
    console.log('Total4diasTabela: ',total4diasTabela)
},[total4diasTabela])

useEffect(()=>{
    if((totalMes.valorLiquido !== null) && totalMes.valorLiquido !== undefined){
        setTotalMesTabela(totalMes.valorLiquido)
    }

},[totalMes])

useEffect(()=>{
    console.log('TotalMes: ',totalMesTabela)
},[totalMesTabela])

// novos dados RECEBIMENTOS/CREDITOS

const [creditos, setCreditos] = useState([])
const [creditos5dias, setCreditos5dias] = useState([])
const [totalCredito5dias, setTotalCredito5dias] = useState(0.00)
const [totalCreditoHoje, setTotalCreditoHoje] = useState(0.00)
const [creditosAdm, setCreditosAdm] = useState([])

async function loadCreditos(){
    console.log('loadCreditos5dias')
    let dataInicial = new Date()
    let dataFinal = new Date()
    dataInicial.setDate(dataInicial.getDate() + 1)
    dataFinal.setDate(dataFinal.getDate() + 5)
    try {
        const credTemp = await retornaRecebimentos(cnpj, dateConvertSearch(dataInicial), dateConvertSearch(dataFinal))
        setCreditos(credTemp)
    } catch (error) {
        console.log(error)
    }
}

useEffect(()=>{
    loadCreditos()
},[cnpj])

useEffect(()=>{
    console.log('Créditos: ', creditos)
    async function loadCreditos5dias(){
        let temp = []
        async function init(){
            for(let i = 0; i <= 5; i++){
                let dataAtual = new Date()
                dataAtual = convert(dataAtual, i)
                creditos.map((credito) => {
                    if(credito.dataCredito === dataAtual){
                        let obj = {
                            dataCredito: credito.dataCredito,
                            valorLiquido: credito.valorLiquido,
                            administradora: credito.adquirente.nomeAdquirente
                        }
                        temp.push(obj)
                    }
                })
            }
        }
        init()
        setCreditos5dias(temp)
    }

    loadCreditos5dias()
},[creditos])

useEffect(()=>{
    console.log('creditos5dias: ', creditos5dias)
    async function init(){
        let total5 = 0.00
        let totalHoje = 0.00

        for(let i = 0; i <= 5; i++){
            let dataAtual = new Date()
            dataAtual = convert(dataAtual, i)
            // eslint-disable-next-line no-loop-func
            creditos.map((credito) => {
                if(credito.dataCredito === dataAtual){
                   totalHoje += credito.valorLiquido
                }
                else{
                    total5 += credito.valorLiquido
                }
            })
        }
        setTotalCreditoHoje(totalHoje)
        setTotalCredito5dias(total5)
    }
    init()

    console.log('créditos hoje: ',totalCreditoHoje)
    console.log('créditos 5 dias: ',totalCredito5dias)

},[creditos5dias])

useEffect(()=>{
    console.log('créditos hoje: ',totalCreditoHoje)

},[totalCreditoHoje])

useEffect(()=>{
    console.log('créditos 5 dias: ',totalCredito5dias)

},[totalCredito5dias])

//Créditos por Administradoras

useEffect(()=>{
    console.log('CREDITOS ADMINISTRADORA')
    const temp = totalPorAdministradora(creditos5dias)
    console.log(temp)
    setCreditosAdm(temp)

},[creditos5dias])

useEffect(()=>{
    console.log('creditosAdm: ', adm4dias)
},[creditosAdm])

function totalPorAdministradora(array){

    console.log('total por administradora')
    let temp = []

    array.forEach(element => {
        if(temp.length === 0){
            let novoObjeto = { 
                nomeAdquirente: element.administradora, 
                total: element.valorLiquido,
                id: 0,
                vendas: []
            }
            temp.push(novoObjeto)
        }else{
            let novoObjeto = { 
                nomeAdquirente: element.administradora, 
                total: element.valorLiquido,
                id: 0,
                vendas: []
            }
            
            if(!(temp.find((objeto) => objeto.nomeAdquirente === element.administradora))){
                novoObjeto.id = (temp.length)
                temp.push(novoObjeto)
            }
            else{
                for(let i = 0; i < temp.length; i++){
                    if(temp[i].nomeAdquirente === element.administradora){
                        temp[i].total += element.valorLiquido
                    }
                }
            }
        }
    })

    temp.forEach(element =>{
        let vendasTemp = []
        vendas4dias.forEach(venda =>{
            if(element.nomeAdquirente === venda.administradora)
            {
                vendasTemp.push(venda)
            }
        })
        element.vendas = vendasTemp
    })
    console.log('vetor de adquirentes: ',temp)
    return temp
    }

/////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        zerarValores()        
            if(cnpj && (cnpj !== '')){
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
    },[cnpj])

    useEffect(()=>{
        if(vendasDash){
            loadDados()
            loadTotalLiquido(vendasDias)
            loadTotalDia(vendasDias)
        }
    },[vendasDash])

    useEffect(()=>{
        if(recebimentosDash){
            loadDadosRecebiveis()
            loadTotalLiquidoRecebimentos(recebimentosDias)
            loadTotalDiaRecebimentos(recebimentosDias)
        }
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

        if((cnpj) && (teste ===true)){
            somaValorLiquido = vendasDias.map((posicao) => {
            return posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0);
            });
            for(let i = 0; i < 5; i++){
            let dataTemp = new Date();
            dataTemp.setDate(dataTemp.getDate() - 5 + i)
            let valorConvertido = parseFloat(somaValorLiquido[i])
            label.push(`${dateConvertSearch(dataTemp).replaceAll('-','/')}`)
            data.push(Number(valorConvertido.toFixed(2)))
            }
            setDadosVendas({labels: label, data: data})
            setLiquido(somaValorLiquido)
        }

        else{

            let label = ['01-01-2023','02-01-2023','03-01-2023','04-01-2023','05-01-2023']
            let data = [2053.00, 11598.99, 12898.50, 8795.12, 32155.02]

            setDadosVendas({ labels: label, data: data })
            setLiquido(data.slice(-5))
        }
    }

    async function loadTotalLiquidoRecebimentos(recebimentosDias) {
        dadosRecebimentos.length = 0
        let label = []
        let data = [0, 0, 0, 0, 0]
        if((cnpj !== null) && (teste === false)){
            recebimentosDias.forEach((posicao) => {
                const valorTotal = posicao.reduce((sum, objeto) => sum + objeto.valorLiquido, 0)
                data.push(Number(valorTotal.toFixed(2)))
              })
            
              for (let i = 0; i < 5; i++) {
                let dataTemp = new Date()
                dataTemp.setDate(dataTemp.getDate() - 1 + i)
                label.push(`${dateConvertSearch(dataTemp).replaceAll('-','/')}`)
              }
            
              setDadosRecebimentos({ labels: label, data: data })
              setRecebimentoLiquido(data.slice(-5))
        }
        else{

            let label = ['01-01-2023','02-01-2023','03-01-2023','04-01-2023','05-01-2023']
            let data = [2053.00, 11598.99, 12898.50, 8795.12, 32155.02]

            setDadosRecebimentos({ labels: label, data: data })
            setRecebimentoLiquido(data.slice(-5))
        }
      }

  return(
    <>
        { modalCliente && ( <ModalCliente/> ) }
        { loading && (<LoadingModal/>) } 
        <div className='appPage'>
            <div className='content-area dash'>
                <div className='data-group-area'>
                    <div className='graph-data'>
                        <h1 className='title-chart'>Vendas:</h1>
                        <PieChart data01 = {dadosVendas}/>
                    </div>
                    <div className='table-data'>
                        <table className="table dash-table det-table dash-body-flex tbody-sticky">
                            <thead className='dash-thead'>
                                <tr className='dash-tr'>
                                    <th className='dash-th' scope="col">Débito</th>
                                    <th className='dash-th' scope="col">Crédito</th>
                                    <th className='dash-th' scope="col">Voucher</th>
                                    <th className='dash-th' scope="col">Total Últimos 4 dias</th>
                                    <th className='dash-th' scope="col">Total do Mês</th>
                                </tr>
                            </thead>
                            <tbody className='dash-tbody dash-tbody-bg'>
                                <tr className='dash-tr'>
                                    <td className='cell-text dash-td' data-label="Débito">R$ {debito.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Crédito">R$ {credito.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Voucher">R$ {voucher.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Total Últimos 4 dias">R$ {total4diasTabela.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Total do Mês">R$ {totalMesTabela.toFixed(2).replace('.',',')}</td>
                                </tr>
                            </tbody>
                        </table>
                        <TabelaGenerica Array={adm4dias}/>
                    </div>
                </div>
                
                <div className='data-group-area'>
                    <div className='graph-data'>
                        <h1 className='title-chart'>Créditos:</h1>
                        <PieChart data01 = {dadosRecebimentos}/>
                    </div>
                    
                    <div className='table-data'>
                        <table className="table dash-table det-table dash-body-flex tbody-sticky">
                                <thead className='dash-thead'>
                                    <tr className='dash-tr'>
                                        <th className='dash-th' scope="col">Débito</th>
                                        <th className='dash-th' scope="col">Crédito</th>
                                        <th className='dash-th' scope="col">Voucher</th>
                                        <th className='dash-th' scope="col">Previsão de Hoje</th>
                                        <th className='dash-th' scope="col">Previsão Próx 4 Dias</th>
                                    </tr>
                                </thead>
                                <tbody className='dash-tbody dash-tbody-bg'>
                                    <tr className='dash-tr'>
                                    <td className='cell-text dash-td' data-label="Débito">R$ {recebimentoDebito.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Crédito">R$ {recebimentoCredito.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Voucher">R$ {recebimentoVoucher.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Previsão de Hoje">R$ {totalCreditoHoje.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Previsão Próx 4 Dias">R$ {totalCredito5dias.toFixed(2).replace('.',',')}</td>
                                    </tr>
                                </tbody>
                        </table>
                        <TabelaGenerica Array={creditosAdm}/>
                    </div>
                </div>            
            </div>
        </div> 
    </>  
  )  
}

export default Dashboard