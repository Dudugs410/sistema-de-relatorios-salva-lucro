/* eslint-disable default-case */

import './dashboard.scss'

//////

//////
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import LoadingModal from '../../components/LoadingModal'
import ModalCliente from '../../components/ModalCliente'
//////
import PieChart from '../../components/GraficoDashboard'

import { adquirentesStatic, bandeirasStatic, recebimentosStatic, vendasStatic } from '../../contexts/static'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'




const Dashboard = () => {
    
    const {  
        loading,
        setLoading,
        returnVendas,
        returnCreditos,
        returnTotalMes,
        cnpj, 
        dateConvertSearch, 
        modalCliente,
        teste,
        setTeste,
        converteData,
        setCnpj,
        setBandeiras,
        setVendas,
        setAdquirentes,
        refresh,
        admVendasAux,
        setAdmVendasAux,
        admCreditosAux,
        setAdmCreditosAux,
        somatorioCreditosHojeAux,
        setSomatorioCreditosHojeAux,
        totalCreditos5diasAux,
        setTotalCreditos5diasAux,
        somatorioVendasMesAux,
        setSomatorioVendasMesAux,
        totalVendas4diasAux,
        setTotalVendas4diasAux,
        graficoVendasAux,
        setGraficoVendasAux,
        graficoCreditosAux,
        setGraficoCreditosAux,
        inicializouAux,
        setInicializouAux,
        isDarkTheme,
        getCli,


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

    const [inicializou, setInicializou] = useState(false)

    useEffect(()=>{
        if(teste){
            setCnpj(Cookies.get('cnpj'))
            setCnpjSelecionado(true)
        }
    },[])

    useEffect(()=>{
        if(sessionStorage.getItem('inicializou')){
            setInicializou(sessionStorage.getItem('inicializou'))
        }
    },[])

    useEffect(()=>{
        console.log('inicializou: ', inicializou)
    },[inicializou])

    async function inicializaVendas4dias(){
        let vendaDataInicial = new Date()
        let vendaDataFinal = new Date()

        vendaDataInicial.setDate(vendaDataInicial.getDate() - 4)
        vendaDataInicial = converteData(vendaDataInicial)

        vendaDataFinal.setDate(vendaDataFinal.getDate() -1)
        vendaDataFinal = converteData(vendaDataFinal)

        const vendasTemp = await returnVendas(vendaDataInicial, vendaDataFinal, cnpj)
        
        setVendas4dias(vendasTemp)
    }

    async function inicializaVetorVendasMes(){
        setLoading(true)
        
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;
        const ultimoDiaDoMes = new Date(anoAtual, mesAtual, 0).getDate();

        let vendasTemp = [];
        let paramDiasBusca = [];
        for (let day = 1; day <= ultimoDiaDoMes; day++) {
          paramDiasBusca.push({dataInicial: `${anoAtual}-${mesAtual}-${day}`, dataFinal: `${anoAtual}-${mesAtual}-${day}`, cnpj: cnpj});
        }
      
        const carregaVendasMes = paramDiasBusca.map(dia => returnVendas(dia.dataInicial, dia.dataFinal, dia.cnpj));
        const vendasPromises = await Promise.all(carregaVendasMes);
        vendasTemp = vendasPromises.filter(Boolean);
      
        setVetorVendasMes(vendasTemp);
        setLoading(false)
    }

    async function inicializaVendas4diasMes(){
        setLoading(true)
        const temp = await returnTotalMes(cnpj)
        setVendasMes(temp)
        setLoading(false)
    }

    async function inicializaCreditos5dias(){
        setLoading(true)
        let creditosTemp
        let data = new Date()
        let newdata = dateConvertSearch(data)

        creditosTemp = await returnCreditos( newdata, newdata, cnpj)
        setCreditos5dias(creditosTemp)
        setLoading(false)
    }

    async function inicializaVetorCreditosMes() {
        console.log('********** inicializaVetorCreditoMes **********');
        setLoading(true)
      
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;
        const ultimoDiaDoMes = new Date(anoAtual, mesAtual, 0).getDate();
      
        let creditosTemp = [];
        let paramDiasBusca = [];
        for (let day = 1; day <= ultimoDiaDoMes; day++) {
          paramDiasBusca.push({dataInicial: `${anoAtual}-${mesAtual}-${day}`, dataFinal: `${anoAtual}-${mesAtual}-${day}`, cnpj: cnpj});
        }
      
        const carregaCreditosMes = paramDiasBusca.map(dia => returnCreditos(dia.dataInicial, dia.dataFinal, dia.cnpj));
        const creditosPromises = await Promise.all(carregaCreditosMes);
        creditosTemp = creditosPromises.filter(Boolean);
      
        setVetorCreditosMes(creditosTemp);
        setLoading(false)
      }

///////////////////////////////////////////////////////////////////////////////
//// Inicializar Dados de Vendas e Créditos ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        console.log('inicializou ao carregar pagina: ', inicializou)
        setLoading(true)
        async function inicializar(){
            if((cnpj !== null && cnpj !== '') && (teste !== true)){
                console.log('inicializando dados de vendas e créditos...')
                await inicializaVendas4dias()
                await inicializaVendas4diasMes()
                await inicializaVetorVendasMes()

                await inicializaCreditos5dias()
                await inicializaVetorCreditosMes()

                setInicializou(true)
                setInicializouAux(true)
                sessionStorage.setItem('inicializou', true)

            } else if(teste === true){
                console.log('inicializando Dados Teste...')
                
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

        if(inicializouAux !== true){
            inicializar()
        }
        setLoading(false)
    },[cnpj])

    useEffect(()=>{
        setLoading(true)
        async function inicializar(){
            const total = vendasMes.reduce((total, obj) => total + obj.valorliquido, 0)
            setSomatorioVendasMes(total)
            if(total > 0){
                setSomatorioVendasMesAux(total)
            }
        }
        inicializar()
        setLoading(false)
    },[vendasMes])

    useEffect(()=>{
        setLoading(true)
        const totalTemp = vendas4dias.reduce((total, obj) => total + obj.valorLiquido, 0)
        setTotalVendas4dias(totalTemp)
        if(totalTemp > 0){
            setTotalVendas4diasAux(totalTemp)
        }
        setLoading(false)
    },[vendas4dias])
    
    useEffect(()=>{
        setLoading(true)
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
            
            if((totalHoje > 0) && (total5dias > 0)){
                setSomatorioCreditosHojeAux(totalHoje)
                setTotalCreditos5diasAux(total5dias)
            }
            setLoading(false)
    },[creditos5dias])

    const sortArray = (arrayAdq) => {
        const sortedArray = [...arrayAdq].sort((a, b) => {
          const nameA = a.nomeAdquirente.toUpperCase();
          const nameB = b.nomeAdquirente.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        return sortedArray;
      };

    useEffect(()=>{
        setLoading(true)
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
    
            setAdmVendas(sortArray(temp))

            if(temp.length > 0){
                setAdmVendasAux(sortArray(temp))
            }
            setLoading(false)
    },[vetorVendasMes])

    useEffect(()=>{
        setLoading(true)
        if(teste !== true){
            setGraficoVendas(carregaGrafico(admVendas))
            if(admVendasAux.length > 0){
                setGraficoVendasAux(carregaGrafico(admVendasAux))
            }
        }
        setLoading(false)
    },[admVendas])

    useEffect(()=>{
            let temp = []
            setLoading(true)
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
            setAdmCreditos(sortArray(temp))
            if(temp.length > 0){
                setAdmCreditosAux(sortArray(temp))
            }
            setLoading(false)
    },[vetorCreditosMes])

    useEffect(()=>{
        setLoading(true)
        console.log(admCreditos)
            if(teste !== true){
                setGraficoCreditos(carregaGrafico(admCreditos))
                if(admCreditosAux.length > 0){
                    setGraficoCreditosAux(carregaGrafico(admCreditosAux))
                }

            }
            setLoading(false)
    },[admCreditos])
    
    function carregaGrafico(array){
        setLoading(true)
        let label = []
        let data = []

        array.forEach((posicao) => {
            const valorTotal = posicao.total
            const nomeAdq = posicao.nomeAdquirente
            data.push(Number(valorTotal.toFixed(2)))
            label.push(nomeAdq)
        })
        const obj = {labels: label, data: data}
        setLoading(false)
        return obj    
    }

    useEffect(()=>{
        if(inicializouAux){
            console.log('***** Checando variáveis auxiliares após carregamento de dados *****')
            console.log('admCreditosAux: ', admCreditosAux,)
            console.log('somatorioCreditosHojeAux: ', somatorioCreditosHojeAux)
            console.log('totalCreditos5diasAux: ', totalCreditos5diasAux)
            console.log('somatorioVendasMesAux: ', somatorioVendasMesAux)
            console.log('totalVendas4diasAux: ', totalVendas4diasAux)
            console.log('graficoVendasAux: ', graficoVendasAux)
            console.log('graficoCreditosAux: ', graficoCreditosAux)
            console.log('inicializouAux: ', inicializouAux)
            console.log('************************************************************************')
        }
    },[])

  return(
    <>
        <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        { (modalCliente) && (!inicializouAux) && ( <ModalCliente/> ) }
        { loading && (<LoadingModal/>) }
        {cnpj && (
            <div className={`content-area dash ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                <div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Vendas:</h1>
                        { inicializouAux === true ? <PieChart data01 = {graficoVendasAux} arrayAdm={admVendasAux}/> : <PieChart data01 = {graficoVendas} arrayAdm={admVendas}/>}
                    </div>
                    <div className={`table-data table-data-dashboard ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <table className={`table dash-table det-table dash-body-flex tbody-sticky table-chart-dash${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                            <thead className='dash-thead'>
                                <tr className={`dash-tr ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                    <th className='dash-th' scope="col">Total Últimos 4 dias</th>
                                    <th className='dash-th' scope="col">Total do Mês</th>
                                </tr>
                            </thead>
                            <tbody className={`dash-tbody dash-tbody-bg ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                <tr className={`dash-tr ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                { inicializouAux === true ? <td className='cell-text dash-td' data-label="Total Últimos 4 dias">R$ {totalVendas4diasAux.toFixed(2).replace('.',',')}</td> : <td className='cell-text dash-td' data-label="Total Últimos 4 dias">R$ {totalVendas4dias.toFixed(2).replace('.',',')}</td>}
                                { inicializouAux === true ? <td className='cell-text dash-td' data-label="Total do Mês">R$ {somatorioVendasMesAux.toFixed(2).replace('.',',')}</td> : <td className='cell-text dash-td' data-label="Total do Mês">R$ {somatorioVendasMes.toFixed(2).replace('.',',')}</td>}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Créditos:</h1>
                        { inicializouAux === true ? <PieChart data01 = {graficoCreditosAux} arrayAdm={admCreditosAux}/> : <PieChart data01 = {graficoCreditos} arrayAdm={admCreditos}/>}
                    </div>
                    
                    <div className={`table-data table-data-dashboard ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <table className={`table dash-table det-table dash-body-flex tbody-sticky table-chart-dash${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                <thead className='dash-thead'>
                                    <tr className={`dash-tr ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                        <th className='dash-th' scope="col">Previsão de Hoje</th>
                                        <th className='dash-th' scope="col">Previsão Próx 5 Dias</th>
                                    </tr>
                                </thead>
                                <tbody className={`dash-tbody dash-tbody-bg ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                    <tr className={`dash-tr ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                        { inicializouAux === true ? <td className='cell-text dash-td' data-label="Previsão de Hoje">R$ {somatorioCreditosHojeAux.toFixed(2).replace('.',',')}</td> : <td className='cell-text dash-td' data-label="Previsão de Hoje">R$ {somatorioCreditosHoje.toFixed(2).replace('.',',')}</td>}
                                        { inicializouAux === true ? <td className='cell-text dash-td' data-label="Previsão Próx 5 Dias">R$ {totalCreditos5diasAux.toFixed(2).replace('.',',')}</td> : <td className='cell-text dash-td' data-label="Previsão Próx 5 Dias">R$ {totalCreditos5dias.toFixed(2).replace('.',',')}</td>}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>            
                </div>
            )}
        </div> 
    </>  
  )  
}

export default Dashboard

