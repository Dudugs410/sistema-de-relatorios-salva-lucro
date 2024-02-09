import Calendar from 'react-calendar'
import './servicos.scss'
import { useContext, useEffect, useState, createContext } from 'react' 
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
// import DateRangePicker from '../../components/Componente_TabelaServicos'
import Cookies from 'js-cookie'
import BuscarClienteServicos from '../../components/Componente_BuscarClienteServicos'
import TabelaServicos from '../../components/Componente_TabelaServicos'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'

/*
TODO:
    x calendario -> marcar data inicial e data final
    x tabela p vizualizar as infos (igual outras tabelas)
    x arrumar css / layout igual das outras paginas
    - componente botão 
    - paginação

*/

export const ServicosContext = createContext({})

const Servicos = () =>{
	const location = useLocation()

    const { 
        loadAjustes,
        setGrupos,
        grupos, 
        ajustes,
        setAjustes,
        cnpj, 
        dataInicial, 
        setDataInicial, 
        dataFinal, 
        setDataFinal, 
        dateConvert,
        isDarkTheme,
		setIsDarkTheme,

    } = useContext(AuthContext)

	const [arrayAdm, setArrayAdm] = useState([])
    const [detalhes, setDetalhes] = useState(false)
    const [cnpjBusca, setCnpjBusca] = useState(Cookies.get('cnpj'))
    const [totalAjustes, setTotalAjustes] = useState(0)
    const [dataBusca, setDataBusca] = useState([new Date(), new Date()])
    const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
    const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))

    useEffect(()=>{
        async function inicializar(){
            if(grupos.length === 0){
            setGrupos(JSON.parse(sessionStorage.getItem('grupos')))       
            }
        }
        inicializar()
        },[])

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
        setDetalhes(true);
    }, [ajustes]);

    function MyCalendar() {
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
                detalhes, 
                setDetalhes,
                cnpjBusca,
                setCnpjBusca,
                dataFinalExibicao,
                dataInicialExibicao,
            }}>

            <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                <div className={`page-servicos-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`page-content-servicos ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                        <div className={`servicos-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                            <h1 className={`servicos-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Servicos</h1>
                        </div>
                        <hr className="hr-recebimentos"/>
                        {/* algo de total de ajustes, gerar relatorio? */}
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