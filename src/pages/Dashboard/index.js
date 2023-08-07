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
import { dateConvert } from '../../contexts/dateConverter'



const Dashboard = () => {
    
    const {  
        loading,
        returnVendas,
        returnCreditos,
        returnTotalDia,
        returnTotalMes,
        cnpj, 
        dateConvertSearch, 
        modalCliente,
        teste,
        converteData,
    } = useContext(AuthContext)

    const [vetorVendasMes, setVetorVendasMes] = useState([])
    

    const [vendas4dias, setVendas4dias] = useState([])
    const [creditosDashboard, setCreditosDashboard] = useState([])

    const [totalVendas4dias, setTotalVendas4dias] = useState(0)
    const [creditos5dias, setCreditos5dias] = useState(0)

    const [vendasMes, setVendasMes] = useState([])
    const [somatorioVendasMes, setSomatorioVendasMes] = useState(0)

    const [totalCreditosHoje, setTotalCreditosHoje] = useState(0)
    const [totalCreditos5dias, setTotalCreditos5dias] = useState(0)

    const [admVendas, setAdmVendas] = useState([])
    const [admCreditos, setAdmCreditos] = useState([])

    const [graficoVendas, setGraficoVendas] = useState({ labels: [], data: [] })
    const [graficoCreditos, setGraficoCreditos] = useState({ labels: [], data: [] })

    async function inicializaVendas(){
        let vendaDataInicial = new Date()
        let vendaDataFinal = new Date()

        vendaDataInicial.setDate(vendaDataInicial.getDate() - 4)
        vendaDataInicial = converteData(vendaDataInicial)

        vendaDataFinal.setDate(vendaDataFinal.getDate() -1)
        vendaDataFinal = converteData(vendaDataFinal)

        console.log('vendaDataInicial: ',vendaDataInicial)
        console.log('vendaDataFinal: ',vendaDataFinal)

        const vendasTemp = await returnVendas(vendaDataInicial, vendaDataFinal, cnpj)

        console.log('vendasTemp:', vendasTemp)
        setVendas4dias(vendasTemp)
    }

    async function inicializaVetorVendasMes(){
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;
        const ultimoDiaDoMes = new Date(anoAtual, mesAtual, 0).getDate();

        const vendasTemp = []

        for (let day = 1; day <= ultimoDiaDoMes; day++) {
            vendasTemp.push(await returnVendas(`${anoAtual}-${mesAtual}-${day}`, `${anoAtual}-${mesAtual}-${day}`, cnpj))
        }
        setVetorVendasMes(vendasTemp)
    }

    async function inicializaCreditos(){
        let creditosTemp
        let data = new Date()
        let newdata = dateConvertSearch(data)

        creditosTemp = await returnCreditos( newdata, newdata, cnpj)
        setCreditosDashboard(creditosTemp)
    }

    async function inicializaVendasMes(){
        const temp = await returnTotalMes(cnpj)
        setVendasMes(temp)
    }

    useEffect(()=>{
        async function inicializar(){
            if(cnpj !== null){
                await inicializaVendas()
                await inicializaCreditos()
                await inicializaVendasMes()
                await inicializaVetorVendasMes()
            }
        }
        inicializar()
    },[cnpj])

    useEffect(()=>{
        async function inicializar(){
            const total = vendasMes.reduce((total, obj) => total + obj.valorliquido, 0)
            setSomatorioVendasMes(total)

        }
        inicializar()
    },[vendasMes])

    useEffect(()=>{
        console.log('vendas4dias: ', vendas4dias)
        const totalTemp = vendas4dias.reduce((total, obj) => total + obj.valorLiquido, 0)
        setTotalVendas4dias(totalTemp)
    },[vendas4dias])
    
    useEffect(()=>{
        console.log('creditosDashboard: ', creditosDashboard)
    },[creditosDashboard])

    useEffect(()=>{
        console.log('vetorVendasMes: ',vetorVendasMes)
        let temp = []

        vetorVendasMes.forEach((array)=>{
            array.forEach((venda)=>{
                if(temp.length === 0){
                    let novoObj = {
                        nomeAdquirente: venda.adquirente.nomeAdquirente,
                        total: venda.valorLiquido,
                        id: 0,
                        vendas: []
                    }
                    temp.push(novoObj)
                }else{
                    let novoObj = {
                        nomeAdquirente: venda.adquirente.nomeAdquirente,
                        total: venda.valorLiquido,
                        id: 0,
                        vendas: []
                    }

                    if(!(temp.find((objeto) => objeto.nomeAdquirente === venda.adquirente.nomeAdquirente))){
                        novoObj.id = (temp.length)
                        temp.push(novoObj)
                    }

                    else{
                        for(let i = 0; i < temp.length; i++){
                            if(temp[i].nomeAdquirente === venda.adquirente.nomeAdquirente){
                                temp[i].total += venda.valorLiquido
                            }
                        }
                    }
                }
            })
        })

        let vetorVendas = vetorVendasMes

        temp.forEach(element =>{
            console.log('element: ', element)
            let vendasTemp = []
            vetorVendas.forEach((venda, index) =>{
                console.log('venda: ', venda)
                console.log('elemento: ', element.nomeAdquirente, 'venda: ', venda[index].adquirente.nomeAdquirente)
                if(element.nomeAdquirente === venda.adquirente.nomeAdquirente)
                {
                    vendasTemp.push(venda)
                }
            })
            element.vendas = vendasTemp
        })

        setAdmVendas(temp)
    },[vetorVendasMes])

    useEffect(()=>{
        console.log('admVendas: ', admVendas)
    },[admVendas])
    
    function carregaGrafico(array){
        let label = []
        let data = []

        console.log('carregaGrafico Array: ', array)
        array.forEach((posicao) => {
            const valorTotal = posicao.total
            const nomeAdq = posicao.nomeAdquirente
            data.push(Number(valorTotal.toFixed(2)))
            label.push(nomeAdq)
        })
        const obj = {labels: label, data: data}
        console.log('obj: ', obj)
        return obj    
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
                        <PieChart data01 = {graficoVendas}/>
                    </div>
                    <div className='table-data'>
                        <table className="table dash-table det-table dash-body-flex tbody-sticky">
                            <thead className='dash-thead'>
                                <tr className='dash-tr'>
                                    <th className='dash-th' scope="col">Total Últimos 4 dias</th>
                                    <th className='dash-th' scope="col">Total do Mês</th>
                                </tr>
                            </thead>
                            <tbody className='dash-tbody dash-tbody-bg'>
                                <tr className='dash-tr'>
                                    <td className='cell-text dash-td' data-label="Total Últimos 4 dias">R$ {totalVendas4dias.toFixed(2).replace('.',',')}</td>
                                    <td className='cell-text dash-td' data-label="Total do Mês">R$ {somatorioVendasMes.toFixed(2).replace('.',',')}</td>
                                </tr>
                            </tbody>
                        </table>
                        <TabelaGenerica/>
                    </div>
                </div>
                
                <div className='data-group-area'>
                    <div className='graph-data'>
                        <h1 className='title-chart'>Créditos:</h1>
                        <PieChart data01 = {graficoCreditos}/>
                    </div>
                    
                    <div className='table-data'>
                        <table className="table dash-table det-table dash-body-flex tbody-sticky">
                                <thead className='dash-thead'>
                                    <tr className='dash-tr'>
                                        <th className='dash-th' scope="col">Previsão de Hoje</th>
                                        <th className='dash-th' scope="col">Previsão Próx 5 Dias</th>
                                    </tr>
                                </thead>
                                <tbody className='dash-tbody dash-tbody-bg'>
                                    <tr className='dash-tr'>
                                        <td className='cell-text dash-td' data-label="Previsão de Hoje">R$ {9999.99.toFixed(2).replace('.',',')}</td>
                                        <td className='cell-text dash-td' data-label="Previsão Próx 5 Dias">R$ {9999.99.toFixed(2).replace('.',',')}</td>
                                    </tr>
                                </tbody>
                        </table>
                        <TabelaGenerica/>
                    </div>
                </div>            
            </div>
        </div> 
    </>  
  )  
}

export default Dashboard