/* eslint-disable default-case */

import './dashboard.css'

//////

//////
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import LoadingModal from '../../components/LoadingModal'
import ModalCliente from '../../components/ModalCliente'
//////
import PieChart from '../../components/00Teste'

import { adquirentesStatic, bandeirasStatic, recebimentosStatic, vendasStatic } from '../../contexts/static'
import TabelaGenerica from '../../components/Componente_TabelaAdm'




const Dashboard = () => {
    
    const {  
        loading,
        returnVendas,
        returnCreditos,
        returnTotalMes,
        cnpj, 
        dateConvertSearch, 
        modalCliente,
        teste,
        converteData,
        setCnpj,
        setBandeiras,
        setVendas,
        setAdquirentes,

    } = useContext(AuthContext)

    const [vetorVendasMes, setVetorVendasMes] = useState([])
    const [vetorCreditosMes, setVetorCreditosMes] = useState([])

    const [vendas4dias, setVendas4dias] = useState([])
    const [creditos5dias, setCreditos5dias] = useState([])

    const [totalVendas4dias, setTotalVendas4dias] = useState(0)
    const [totalCreditos5dias, setTotalCreditos5dias] = useState(0)

    const [vendasMes, setVendasMes] = useState([])
    const [somatorioVendasMes, setSomatorioVendasMes] = useState(0)

    const [creditosMes, setCreditosMes] = useState([])
    const [somatorioCreditosHoje, setSomatorioCreditosHoje] = useState(0)

    const [admVendas, setAdmVendas] = useState([])
    const [admCreditos, setAdmCreditos] = useState([])

    const [graficoVendas, setGraficoVendas] = useState({ labels: [], data: [] })
    const [graficoCreditos, setGraficoCreditos] = useState({ labels: [], data: [] })

    const [cnpjSelecionado, setCnpjSelecionado] = useState(false)

    useEffect(()=>{
        if(teste){
            setCnpj(0)
            setCnpjSelecionado(true)
        }
    },[])

    async function inicializaVendas4dias(){
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

    async function inicializaVendas4diasMes(){
        const temp = await returnTotalMes(cnpj)
        setVendasMes(temp)
    }

    async function inicializaCreditos5dias(){
        let creditosTemp
        let data = new Date()
        let newdata = dateConvertSearch(data)

        creditosTemp = await returnCreditos( newdata, newdata, cnpj)
        setCreditos5dias(creditosTemp)
    }

    async function inicializaVetorCreditosMes(){
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;
        const ultimoDiaDoMes = new Date(anoAtual, mesAtual, 0).getDate();

        const creditosTemp = []

        for (let day = 1; day <= ultimoDiaDoMes; day++) {
            creditosTemp.push(await returnCreditos(`${anoAtual}-${mesAtual}-${day}`, `${anoAtual}-${mesAtual}-${day}`, cnpj))
        }
        setVetorCreditosMes(creditosTemp)
    }

///////////////////////////////////////////////////////////////////////////////
//// Inicializar Dados de Vendas e Créditos ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        async function inicializar(){
            if((cnpj !== null && cnpj !== '') && teste !== true){
                console.log('inicializando dados de vendas e créditos...')
                await inicializaVendas4dias()
                await inicializaVendas4diasMes()
                await inicializaVetorVendasMes()

                await inicializaCreditos5dias()
                await inicializaVetorCreditosMes()
            }
            else if(teste === true){
                
                setVendas(vendasStatic)
                setAdquirentes(adquirentesStatic)
                setBandeiras(bandeirasStatic)


                let label = ['Cielo', 'Alelo', 'Vero', 'GetNet']
                let data = [12395.66, 8750.43, 15322.56, 19430.22]
                setTotalVendas4dias(55898.87)
                setSomatorioVendasMes(78264.85)

                let label2 = ['Cielo', 'Alelo', 'Vero', 'GetNet', 'Ticket']
                let data2 = [33395.66, 12350.43, 43322.56, 21430.22, 11563.85]
                setSomatorioCreditosHoje(26344.55)
                setTotalCreditos5dias(122062.72)
                

                setGraficoVendas({ labels: label, data: data })
                setGraficoCreditos({ labels: label2, data: data2 })
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
        console.log('Creditos5dias: ', creditos5dias)
        let dataHoje = new Date()
        dataHoje = converteData(dataHoje)
        let totalHoje = 0
        let total5dias = 0
        creditos5dias.forEach((venda) => {
            if(venda.dataCredito === dataHoje){
                totalHoje += venda.valorLiquido
            }
        })
        creditos5dias.forEach((venda) => {
            for(let i = 0; i < 5; i++){
                let dataHoje2 = new Date()
                dataHoje2.setDate(dataHoje2.getDate() + i)
                dataHoje2 = converteData(dataHoje2)
                if(venda.dataCredito === dataHoje){
                    total5dias += venda.valorLiquido
                }
            }
        })

        setSomatorioCreditosHoje(totalHoje)
        setTotalCreditos5dias(total5dias)
    },[creditos5dias])

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

                    if(!(temp.find((objeto) => objeto.nomeAdquirente === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
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

        temp.forEach((adq) => {
            let vendasTemp = []
            vendasTemp.length = 0
            vetorVendasMes.forEach((vendasDia) => {
                if(vendasDia.length > 0){
                    vendasDia.forEach((venda) => {
                        if(venda.adquirente.nomeAdquirente === adq.nomeAdquirente){
                            vendasTemp.push(venda)
                        }
                        adq.vendas = vendasTemp
                    })
                }
            })
        })
        if(teste === true){
            temp = [
                {
                    nomeAdquirente: 'Cielo',
                    total: 27568.00,
                    id: 0,
                    vendas: vendasStatic.VENDAS,
                },
                {
                    nomeAdquirente: 'Alelo',
                    total: 5587.00,
                    id: 1,
                    vendas: vendasStatic.VENDAS,
                },
                {
                    nomeAdquirente: 'Vero',
                    total: 3220.00,
                    id: 2,
                    vendas: vendasStatic.VENDAS,
                },
                {
                    nomeAdquirente: 'Ticket',
                    total: 326.60,
                    id: 3,
                    vendas: vendasStatic.VENDAS,
                }
            ]
        }

        setAdmVendas(temp)
    },[vetorVendasMes])

    useEffect(()=>{
        console.log(admVendas)
        if(teste !== true){
            console.log('admVendas: ', admVendas)
            setGraficoVendas(carregaGrafico(admVendas))
        }
    },[admVendas])

    useEffect(()=>{
        console.log('vetorCreditosMes: ',vetorCreditosMes)
        let temp = []

        vetorCreditosMes.forEach((array)=>{
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

                    if(!(temp.find((objeto) => objeto.nomeAdquirente === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
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

        temp.forEach((adq) => {
            let creditosTemp = []
            creditosTemp.length = 0
            vetorCreditosMes.forEach((creditosDia) => {
                if(creditosDia.length > 0){
                    creditosDia.forEach((credito) => {
                        if(credito.adquirente.nomeAdquirente === adq.nomeAdquirente){
                            creditosTemp.push(credito)
                        }
                        adq.vendas = creditosTemp
                    })
                }
            })
        })

        if(teste === true){
            temp = [
                {
                    nomeAdquirente: 'Cielo',
                    total: 27568.00,
                    id: 0,
                    vendas: recebimentosStatic,
                },
                {
                    nomeAdquirente: 'Alelo',
                    total: 5587.00,
                    id: 1,
                    vendas: recebimentosStatic,
                },
                {
                    nomeAdquirente: 'GetNet',
                    total: 3220.00,
                    id: 2,
                    vendas: recebimentosStatic,
                },
                {
                    nomeAdquirente: 'Vero',
                    total: 3220.00,
                    id: 3,
                    vendas: recebimentosStatic,
                },
                {
                    nomeAdquirente: 'Ticket',
                    total: 326.60,
                    id: 4,
                    vendas: recebimentosStatic,
                }
            ]
        }
        setAdmCreditos(temp)
    },[vetorCreditosMes])

    useEffect(()=>{
        if(teste !== true){
            console.log('admCreditos: ', admCreditos)
            setGraficoCreditos(carregaGrafico(admCreditos))
        }
    },[admCreditos])
    
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
        <div className='appPage'>
        { modalCliente && ( <ModalCliente/> ) }
        { loading && (<LoadingModal/>) }
        {cnpj && (
                        <div className='content-area dash'>
                <div className='chart-table-block'>
                    <div className='data-group-area'>
                        <div className='graph-data'>
                            <h1 className='title-chart'>Vendas:</h1>
                            <PieChart data01 = {graficoVendas} arrayAdm={admVendas}/>
                        </div>
                        <div className='table-data'>
                            <table className="table dash-table det-table dash-body-flex tbody-sticky table-chart-dash">
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
                            <TabelaGenerica Array={admVendas} />
                        </div>
                    </div>
                </div>
                <div className='data-group-area'>
                    <div className='graph-data'>
                        <h1 className='title-chart'>Créditos:</h1>
                        <PieChart data01 = {graficoCreditos} arrayAdm={admCreditos}/>
                    </div>
                    
                    <div className='table-data'>
                        <table className="table dash-table det-table dash-body-flex tbody-sticky table-chart-dash">
                                <thead className='dash-thead'>
                                    <tr className='dash-tr'>
                                        <th className='dash-th' scope="col">Previsão de Hoje</th>
                                        <th className='dash-th' scope="col">Previsão Próx 5 Dias</th>
                                    </tr>
                                </thead>
                                <tbody className='dash-tbody dash-tbody-bg'>
                                    <tr className='dash-tr'>
                                        <td className='cell-text dash-td' data-label="Previsão de Hoje">R$ {somatorioCreditosHoje.toFixed(2).replace('.',',')}</td>
                                        <td className='cell-text dash-td' data-label="Previsão Próx 5 Dias">R$ {totalCreditos5dias.toFixed(2).replace('.',',')}</td>
                                    </tr>
                                </tbody>
                        </table>
                        <TabelaGenerica Array={admCreditos}/>
                    </div>
                </div>            
            </div>
        )}
        </div> 
    </>  
  )  
}

export default Dashboard