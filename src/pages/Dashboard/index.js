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

import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'
import '../../index.scss'

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
        converteData,
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
        setIsDarkTheme,
        loadAjustes,
        admServicosAux,
        setAdmServicosAux,
        graficoServicosAux,
        setGraficoServicosAux,
        totalServicosHojeAux,
        setTotalServicosHojeAux,
        totalServicosMesAux,
        setTotalServicosMesAux,
    } = useContext(AuthContext)

    useEffect(()=>{
        setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
    },[])

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

    const [totalServicosHoje, setTotalServicosHoje] = useState(0)
    const [totalServicosMes, setTotalServicosMes] = useState(0)

    const [admVendas, setAdmVendas] = useState([])
    const [admCreditos, setAdmCreditos] = useState([])
    const [admServicos, setAdmServicos] = useState([])

    const [graficoVendas, setGraficoVendas] = useState({ labels: [], data: [] })
    const [graficoCreditos, setGraficoCreditos] = useState({ labels: [], data: [] })
    const [graficoServicos, setGraficoServicos] = useState({labels: [], data: []})

    const [cnpjSelecionado, setCnpjSelecionado] = useState(false)

    const [inicializou, setInicializou] = useState(false)
    
    const [loadingVendasDash, setLoadingVendasDash] = useState(null)
    const [loadingCreditosDash, setLoadingCreditosDash] = useState(null)

    // ajustes/serviços

    const [servicos, setServicos] = useState([])

    //

    useEffect(()=>{
        if(sessionStorage.getItem('inicializou')){
            setInicializou(sessionStorage.getItem('inicializou'))
        }
    },[])

    async function loadDashboard(){
        
    }

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

      async function inicializaServicos(){

        function firstDay() {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            
            return firstDay
        }

        function lastDay() {
            const today = new Date();
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            return lastDay
        }

        const servicosTemp = await loadAjustes(cnpj, firstDay(), lastDay())
        setServicos(servicosTemp)
      }

      useEffect(() => {
        if(servicos.length > 0){
            let temp = []
            let objAdq = {}
            servicos.map((servico) => {
                if(temp.length === 0){
                    objAdq = {
                        nomeAdquirente: servico.nome_adquirente,
                        total: servico.valor,
                        id: 0,
                        vendas: [servico]
                    }
                    temp.push(objAdq)

                } else {
                    const existingObject = temp.find(obj => obj.nomeAdquirente === servico.nome_adquirente);
                    if (existingObject) {
                        existingObject.total += servico.valor;
                        existingObject.vendas.push(servico)
                    } else {
                    temp.push({
                        nomeAdquirente: servico.nome_adquirente,
                        total: servico.valor,
                        id: temp.length,
                        vendas: [servico]
                    })
                    }
            }})
            setAdmServicos(sortArray(temp))        
            if(temp.length > 0){
                setAdmServicosAux(sortArray(temp))
            }

              const totalMesTemp = servicos.reduce((total, obj) => total + obj.valor, 0)
              setTotalServicosMes(totalMesTemp)
              setTotalServicosMesAux(totalMesTemp)


              let dataHoje = new Date()
              dataHoje = converteData(dataHoje)
              let totalHoje = 0
              servicos.forEach((servico) => {
                  if(servico.data === dataHoje){
                      totalHoje += servico.valor
                  }
              })
              setTotalServicosHoje(totalHoje)    
              if(totalHoje > 0){
                  setTotalServicosHojeAux(totalHoje)
              }
        } else {
            console.log('não tem dados')
        }
      }, [servicos])

///////////////////////////////////////////////////////////////////////////////
//// Inicializar Dados de Vendas e Créditos ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        async function inicializar(){
            if(cnpj !== null && cnpj !== ''){
                await inicializaVendas4dias()
                await inicializaVendas4diasMes()
                await inicializaVetorVendasMes()
                await inicializaCreditos5dias()
                await inicializaVetorCreditosMes()
                await inicializaServicos()

                setInicializou(true)
                setInicializouAux(true)
                sessionStorage.setItem('inicializou', true)
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
            const total = vendasMes.reduce((total, obj) => total + obj.valorvendido, 0)
            setSomatorioVendasMes(total)
            if(total > 0){
                setSomatorioVendasMesAux(total)
            }
        }
        inicializar()
    },[vendasMes])

    useEffect(()=>{
        if(vendas4dias === null){
            setTotalVendas4dias(0)
            setTotalVendas4diasAux(0)
            return
        }
        const totalTemp = vendas4dias.reduce((total, obj) => total + obj.valorBruto, 0)
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
                            total: venda.valorBruto,
                            id: 0,
                            vendas: []
                        }
                        temp.push(novoObj)
                    }else{
                        let novoObj = {
                            nomeAdquirente: venda.adquirente.nomeAdquirente,
                            total: venda.valorBruto,
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
                                    temp[i].total += venda.valorBruto
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

            setAdmVendas(sortArray(temp))
            if(temp.length > 0){
                setAdmVendasAux(sortArray(temp))
            }
    },[vetorVendasMes])

    useEffect(()=>{
        setGraficoVendas(carregaGrafico(admVendas))
        if(admVendasAux.length > 0){
            setGraficoVendasAux(carregaGrafico(admVendasAux))
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
    
            setAdmCreditos(sortArray(temp))
            if(temp.length > 0){
                setAdmCreditosAux(sortArray(temp))
            }
    },[vetorCreditosMes])

    useEffect(()=>{
        setGraficoCreditos(carregaGrafico(admCreditos))
        if(admCreditosAux.length > 0){
            setGraficoCreditosAux(carregaGrafico(admCreditosAux))
        }

    },[admCreditos])

    useEffect(()=>{
        setGraficoServicos(carregaGrafico(admServicos))
        if(admServicosAux.length > 0){
            setGraficoServicosAux(carregaGrafico(admServicosAux))
        }
    },[admServicos])

    function carregaGrafico(array){
        let label = []
        let data = []

        array.forEach((posicao) => {
            const valorTotal = posicao.total
            const nomeAdq = posicao.nomeAdquirente
            label.push(nomeAdq)
            data.push(Number(valorTotal.toFixed(2)))
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
                        { inicializouAux === true ? <PieChart data01 = {graficoVendasAux} arrayAdm={admVendasAux} tipo = '0'/> : <PieChart data01 = {graficoVendas} arrayAdm={admVendas}/>}
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
                        { inicializouAux === true ? <PieChart data01 = {graficoCreditosAux} arrayAdm={admCreditosAux} tipo = '0'/> : <PieChart data01 = {graficoCreditos} arrayAdm={admCreditos}/>}
                        <div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                        { loadingCreditosDash && (<LoadingModal/>) }
                            {inicializouAux ? <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHojeAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão de Hoje' valor={somatorioCreditosHoje.toFixed(2)} />}
                            {inicializouAux ? <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5diasAux.toFixed(2)} /> : <TabelaHorizontal header='Previsão Próx 5 Dias' valor={totalCreditos5dias.toFixed(2)} />}
                        </div>
                    </div>
                </div>
                <div className={`data-group-area ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`graph-data ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <h1 className={`title-chart ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Serviços:</h1>
                        { inicializouAux === true ? <PieChart data01 = {graficoServicosAux} arrayAdm={admServicosAux} tipo = '1'/> : <PieChart data01 = {graficoServicos} arrayAdm={admServicos}/>}
                        <div className={`dash-table-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                        { loadingCreditosDash && (<LoadingModal/>) }
                            {inicializouAux ? <TabelaHorizontal header='Total de Hoje' valor={totalServicosHojeAux.toFixed(2)} /> : <TabelaHorizontal header='Total de Hoje' valor={totalServicosHoje.toFixed(2)} />}
                            {inicializouAux ? <TabelaHorizontal header='Total do Mês' valor={totalServicosMesAux.toFixed(2)} /> : <TabelaHorizontal header='Total do Mês' valor={totalServicosMes.toFixed(2)} />}
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