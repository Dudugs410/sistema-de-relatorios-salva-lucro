import Calendar from 'react-calendar'
import './servicos.scss'
import { useContext, useEffect, useState, createContext } from 'react' 
import { AuthContext } from '../../contexts/auth'
// import DateRangePicker from '../../components/Componente_TabelaServicos'
import GerarRelatorio from '../../components/Componente_GerarRelatorio'
import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'
import BuscarClienteServicos from '../../components/Componente_BuscarClienteServicos'
import TabelaServicos from '../../components/Componente_TabelaServicos'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'

import '../Vendas/Calendar.scss'


export const ServicosContext = createContext({})

const Servicos = () =>{
	const location = useLocation()

useEffect(() => {
    sessionStorage.setItem('currentPath', location.pathname);
}, [location]);

    const { 
        cnpj,
		setCnpj,
        loadAjustes,
        ajustes,
        setAjustes,
        dataInicial, 
        setDataInicial,
        gerarDados,
		tableData,
        dataFinal, 		
        bandeiras, 
		loadBandeiras,
        setGrupos,
        grupos, 
		adquirentes,
		loadAdquirentes,
        setDataFinal, 
        dateConvert,
        isDarkTheme,
		setIsDarkTheme,
        detalhes,
    } = useContext(AuthContext)

	const [arrayRelatorio, setArrayRelatorio] = useState([])
	const [arrayAdm, setArrayAdm] = useState([])
    const [cnpjBusca, setCnpjBusca] = useState(Cookies.get('cnpj'))
    const [ajustesTemp, setAjustesTemp] = useState([])
    const [dataBusca, setDataBusca] = useState([new Date(), new Date()])
    const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
    const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
	
	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
	},[])

	useEffect(()=>{
		async function inicializar(){
			if(bandeiras.length === 0){
				await loadBandeiras()
			}
      
			if(grupos.length === 0){
				setGrupos(JSON.parse(sessionStorage.getItem('grupos')))     
			}
      
			if(adquirentes.length === 0){
				await loadAdquirentes()
			}
		}
		inicializar()
	},[])

    useEffect(()=>{
		setAjustes([])
		setCnpj(Cookies.get('cnpj'))
	},[])

	const [tipo, setTipo] = useState('servicos')

	useEffect(()=>{
	  setTipo('servicos')
	  Cookies.set('tipo', 'servicos')
	},[])

    useEffect(()=>{
		setCnpjBusca(cnpj)
	},[cnpj])

    useEffect(()=>{
        if(detalhes){
          setAjustesTemp(loadAjustes(cnpjBusca, dataBusca[0], dataBusca[1]))
    }
    },[cnpjBusca])
    useEffect(()=>{
        setDataInicial(new Date())
        setDataFinal(new Date())
        ajustes.length = 0
    },[])

    function handleDateChange(date){
        setDataBusca(date)
        // console.log(dataBusca)
    }
    
    useEffect(()=>{
		console.log(dataBusca)
		if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
            setDataInicial(dataBusca[0])
            setDataFinal(dataBusca[1])
            setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
            setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
		}
	  },[dataBusca])

    useEffect(()=>{
        const groupedData = {};
        let adq_total_value = 0;

        // Iterate through each person in the data
        ajustes.forEach(ajuste => {
        const adq_name = ajuste.nome_adquirente;
        adq_total_value += ajuste['valor']

        // Check if a group already exist
        if (!groupedData[adq_name]) {
            // If not, create a new group 
            groupedData[adq_name] = [ajuste];
            groupedData[adq_name]['valor_total'] = ajuste['valor']
        } else {
            // If a group already exists, add to the existing group
            groupedData[adq_name].push(ajuste);
            groupedData[adq_name]['valor_total'] += ajuste['valor']
        }
        });

        // converte para obj aceito pela tabelaAdm generica
        let admArray = [];
        Object.keys(groupedData).forEach( (groupName, i) => {
            admArray.push({'id': i, 'nomeAdquirente': groupName, 'total': groupedData[groupName].valor_total})
        })
        admArray.push({'id': 't', 'nomeAdquirente': 'Total de ajustes', 'total': adq_total_value})
        
        const ajustes_agrupados = {'grupos': groupedData, 'admArray': admArray, 'total_ajustes': adq_total_value, 'ajustes': ajustes}
        setArrayAdm(admArray)

        if(ajustes.length > 0){
            setArrayRelatorio(gerarDados(ajustes))
            // setArrayAdm(separaAdm(ajustes))
        }

    }, [ajustes]);

    function MyCalendar() {

        let customDayStyle

        if(isDarkTheme){
            customDayStyle = {color: 'white'}
        } else if (isDarkTheme === false){
            customDayStyle = {color: 'black'}
        }
 
        return (
			<div>
				<Calendar
					style={{ color:'white' }}
					className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
					onChange={ handleDateChange }
                    selectRange={ true }
					value={ dataBusca }
					tileClassName={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
				/>
                <hr/>
                <div className='container-busca'>
                    <span className={`span-busca ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    {dataInicialExibicao !== dataFinalExibicao ? 
                        <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong> ao dia <strong>${dataFinalExibicao}</strong>`}} /> : 
                        <span dangerouslySetInnerHTML={{__html: `Executar busca do dia <strong>${dataInicialExibicao}</strong>`}} />
                    }
                    </span>
                    <BuscarClienteServicos />
                </div>
			</div>
		)
	}

    return(
        <ServicosContext.Provider 
            value={{
                dataBusca, 
                setDataBusca, 
                cnpjBusca,
                setCnpjBusca,
                dataFinalExibicao,
                dataInicialExibicao,
                setCnpjBusca,

            }}>

            <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                <div className={`page-servicos-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`page-content-servicos ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <div className={`servicos-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                            <h1 className={`servicos-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Servicos</h1>
                        </div>
                        <hr className="hr-recebimentos"/>
						{ (detalhes) && (ajustes.length > 0) ? <GerarRelatorio className='export' tableData={tableData} detalhes={detalhes} tipo='servicos'/> : <></> }
                        <div className='component-container-servicos'>
                            { (detalhes) && (ajustes.length > 0)? <TabelaServicos array={ajustes}/> : <MyCalendar/> } 
                            <hr className="hr-recebimentos"/>
                            { (detalhes) && (ajustes.length > 0)? <TabelaGenericaAdm Array={arrayAdm} textColor={'red-global'}/> : <></> }
                            { (detalhes) && (ajustes.length > 0) ? <hr className='hr-recebimentos'/> : <></> }
                        </div>
                    </div>
                </div>
            </div>
        </ServicosContext.Provider>
    )
}

export default Servicos