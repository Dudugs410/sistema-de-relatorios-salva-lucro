/* eslint-disable default-case */

import './dashboard.scss'

import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import LoadingModal from '../../components/LoadingModal'
import ModalCliente from '../../components/ModalCliente'
import TabelaHorizontal from '../../components/Componente_TabelaHorizontal'
//////
import PieChart from '../../components/GraficoDashboard'

import { adquirentesStatic, bandeirasStatic, recebimentosStatic, vendasStatic } from '../../contexts/static'
import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {

    const location = useLocation();

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);
    
    const {  
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
    
    const [loadingVendasDash, setLoadingVendasDash] = useState(null)
    const [loadingCreditosDash, setLoadingCreditosDash] = useState(null)

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

    async function inicializaVetorVendasMes() {
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;
        const ultimoDiaDoMes = new Date(anoAtual, mesAtual, 0).getDate();
      
        let vendasTemp = [];
        let paramDiasBusca = [];
        for (let day = 1; day <= ultimoDiaDoMes; day++) {
          paramDiasBusca.push({
            dataInicial: `${anoAtual}-${mesAtual}-${day}`,
            dataFinal: `${anoAtual}-${mesAtual}-${day}`,
            cnpj: cnpj, // Assuming cnpj is defined somewhere in your code
          });
        }
      
        try {
            setLoadingVendasDash(true)
          const carregaVendasMes = paramDiasBusca.map((dia) =>
            returnVendas(dia.dataInicial, dia.dataFinal, dia.cnpj)
          );
      
          const vendasPromises = await Promise.all(carregaVendasMes);
      
          vendasTemp = vendasPromises.filter((vendas) => vendas); // Filter out undefined values
        } catch (error) {
          // Handle error if any of the promises fail
          console.error('Error fetching vendas:', error);
        } finally {
          setLoadingVendasDash(false);
        }
      
        setVetorVendasMes(vendasTemp);
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

    async function inicializaVetorCreditosMes() {
        setLoadingCreditosDash(true)
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1;
        const ultimoDiaDoMes = new Date(anoAtual, mesAtual, 0).getDate();
      
        let creditosTemp = [];
        let paramDiasBusca = [];
        for (let day = 1; day <= ultimoDiaDoMes; day++) {
          paramDiasBusca.push({
            dataInicial: `${anoAtual}-${mesAtual}-${day}`,
            dataFinal: `${anoAtual}-${mesAtual}-${day}`,
            cnpj: cnpj, // Assuming cnpj is defined somewhere in your code
          });
        }
      
        try {
          const carregaCreditosMes = paramDiasBusca.map((dia) =>
            returnCreditos(dia.dataInicial, dia.dataFinal, dia.cnpj)
          );
      
          const creditosPromises = await Promise.all(carregaCreditosMes);
          creditosTemp = creditosPromises.filter((creditos) => creditos); // Filter out undefined values
        } catch (error) {
          // Handle error if any of the promises fail
          console.error('Error fetching creditos:', error);
        } finally {
          // Assuming setLoadingDash is the state updater for loadingDash
          setLoadingCreditosDash(false); // Set loading state to false after API calls finish
        }
      
        setVetorCreditosMes(creditosTemp);
      }

///////////////////////////////////////////////////////////////////////////////
//// Inicializar Dados de Vendas e Créditos ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        async function inicializar(){
            if((cnpj !== null && cnpj !== '') && (teste !== true)){
                await inicializaVendas4dias()
                await inicializaVendas4diasMes()
                await inicializaVetorVendasMes()

                await inicializaCreditos5dias()
                await inicializaVetorCreditosMes()

                setInicializou(true)
                setInicializouAux(true)
                sessionStorage.setItem('inicializou', true)
            } else if(teste === true){
                
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
            setLoadingCreditosDash(true)
            setLoadingVendasDash(true)
            inicializar().then(() => {
                setLoadingCreditosDash(false)
                setLoadingVendasDash(false)
            })
        }
    },[cnpj])

    useEffect(()=>{
        async function inicializar(){
            const total = vendasMes.reduce((total, obj) => total + obj.valorliquido, 0)
            setSomatorioVendasMes(total)
            if(total > 0){
                setSomatorioVendasMesAux(total)
            }
        }
        inicializar()
    },[vendasMes])

    useEffect(()=>{
        const totalTemp = vendas4dias.reduce((total, obj) => total + obj.valorLiquido, 0)
        setTotalVendas4dias(totalTemp)
        if(totalTemp > 0){
            setTotalVendas4diasAux(totalTemp)
        }
    },[vendas4dias])
    
    useEffect(()=>{
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
    },[vetorVendasMes])

    useEffect(()=>{
        if(teste !== true){
            setGraficoVendas(carregaGrafico(admVendas))
            if(admVendasAux.length > 0){
                setGraficoVendasAux(carregaGrafico(admVendasAux))
            }
        }
    },[admVendas])

    useEffect(()=>{
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
            setAdmCreditos(sortArray(temp))
            if(temp.length > 0){
                setAdmCreditosAux(sortArray(temp))
            }
    },[vetorCreditosMes])

    useEffect(()=>{
            if(teste !== true){
                setGraficoCreditos(carregaGrafico(admCreditos))
                if(admCreditosAux.length > 0){
                    setGraficoCreditosAux(carregaGrafico(admCreditosAux))
                }
            }
    },[admCreditos])
    
    function carregaGrafico(array){
        let label = []
        let data = []

        array.forEach((posicao) => {
            const valorTotal = posicao.total
            const nomeAdq = posicao.nomeAdquirente
            data.push(Number(valorTotal.toFixed(2)))
            label.push(nomeAdq)
        })
        const obj = {labels: label, data: data}
        return obj    
    }

  return(
    <>
        <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        { (modalCliente) && (!inicializouAux) && (Cookies.get('carregouModalCliente') === 'true') && ( <ModalCliente/> ) }
        {cnpj && (
            <div className={`content-area dash ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                <div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Vendas:</h1>
                        { inicializouAux === true ? <PieChart data01 = {graficoVendasAux} arrayAdm={admVendasAux}/> : <PieChart data01 = {graficoVendas} arrayAdm={admVendas}/>}
                        <div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                        { loadingVendasDash && (<LoadingModal/>) }
                            {inicializouAux ? <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4diasAux.toFixed(2)} /> : <TabelaHorizontal header='Total Últimos 4 dias' valor={totalVendas4diasAux.toFixed(2)} />}
                            {inicializouAux ? <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMesAux.toFixed(2)} /> : <TabelaHorizontal header='Total do Mês' valor={somatorioVendasMesAux.toFixed(2)} />}
                        </div>
                    </div>
                </div>
                <div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Créditos:</h1>
                        { inicializouAux === true ? <PieChart data01 = {graficoCreditosAux} arrayAdm={admCreditosAux}/> : <PieChart data01 = {graficoCreditos} arrayAdm={admCreditos}/>}
                        <div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                        { loadingCreditosDash && (<LoadingModal/>) }
                            {inicializouAux ? <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHojeAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHoje.toFixed(2)} />}
                            {inicializouAux ? <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5diasAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5dias.toFixed(2)} />}
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    </>  
  )  
}

export default Dashboard