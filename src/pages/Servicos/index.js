import Calendar from 'react-calendar'
import './servicos.scss'
import { useContext, useEffect, useState, createContext } from 'react' 
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import DateRangePicker from '../../components/Componente_TabelaServicos'
import Cookies from 'js-cookie'
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
        cnpj, 
        alerta, 
        dataInicial, 
        setDataInicial, 
        dataFinal, 
        setDataFinal, 
        dateConvert,
        isDarkTheme,
		setIsDarkTheme,
    } = useContext(AuthContext)

    const [arrayTeste, setArrayTeste] = useState([])
    const [ajustesTemp, setAjustesTemp] = useState([])
    const [ajustesAgrupados, setAjustesAgrupados] = useState([])
    const [dataBusca, setDataBusca] = useState(new Date())
    const [detalhes, setDetalhes] = useState(false)

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
        ajustesTemp.length = 0
        ajustesAgrupados.length = 0
    },[])
            
    function handleBuscar(e){
        e.preventDefault()
        buscarAjustes()
    } 
        
    async function buscarAjustes(){
        try {
            const response = await loadAjustes(Cookies.get('cnpj'), dataInicial, dataFinal)
            if ((response)){
                setAjustesTemp(response)
            } else {
                console.log('loadAjustes undefined? ', response)
            } 
        } catch (error) {
            console.log('erro ao buscarAjustes, ', error)
        }
    }

    function handleDateChange(date){
        setDataBusca(date)
        console.log(dataBusca)
    }
    
    useEffect(() => {
        if(dataBusca.length === 2 ){
            setDataInicial(dataBusca[0])
            setDataFinal(dataBusca[1])
        } else {
            setDataInicial(dataBusca)
            setDataFinal(dataBusca)
        }
    }, [dataBusca])


    // hook que agrupa por adquirente e calcula valor_total dos grupos de ajuste
    useEffect(()=>{
        const groupedData = {};
        let adq_total_value = 0;

        // Iterate through each person in the data
        ajustesTemp.forEach(ajuste => {
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
        
        const ajustes_agrupados = {'grupos': groupedData, 'admArray': admArray, 'total_ajustes': adq_total_value, 'ajustes': ajustesTemp}
        console.log('total ajustes:', ajustes_agrupados);
        setAjustesAgrupados(ajustes_agrupados)
        setDetalhes(true);
    }, [ajustesTemp]);

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
			</div>
		)
	}

    return(
    <ServicosContext.Provider 
        value={{
            detalhes, 
            setDetalhes,
            dataBusca, 
            setDataBusca, 
        }}>

        <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`page-servicos-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                <div className={`page-content-servicos ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <div className={`servicos-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
							<h1 className={`servicos-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Servicos</h1>
                    </div>

                    <hr className="hr-recebimentos"/>
                    
                    {/* 
                        algo de total de ajustes
                        e gerar relatorio?
                     */}

                    <div className='component-container-servicos'>

                        {/* <MyCalendar/>
                        <TabelaServicos array={ajustesTemp}/> */}
                        {(detalhes) && (ajustesAgrupados.ajustes.length > 0)? <TabelaServicos array={ajustesAgrupados.ajustes}/> : <MyCalendar/> } 

                        <hr className="hr-recebimentos"/>

                        {(detalhes) && (ajustesAgrupados.ajustes.length > 0)? <TabelaGenericaAdm Array={ajustesAgrupados.admArray} textColor={'red-global'}/> : <></> }

                        {(detalhes) && (ajustesTemp.length > 0)?
                        <></>
                        :
                        <div className='btn-container-servicos'>
                            <button className='btn btn-primary btn-busca-servicos' onClick={handleBuscar}>Pesquisar</button>
                        </div> 
                        }
                
                    </div>
                            {/* { ajustesAgrupados !== undefined && (ajustesAgrupados.map((elemento) => {
                                return(
                                    <div className='card-resumo-total-ajustes'>
                                    <div className='card-resumo-content-container'>
                                    <h1 className='h1-total-ajustes'>Resumo Total</h1>
                                            <div className='card-ajuste-container'>
                                            {CardServicosTotais(elemento)}                                            
                                            </div>
                                        </div>
                                    </div>
                                )
                            }))} */}

                </div>
            </div>
        </div>
    </ServicosContext.Provider>

    )
}

export default Servicos

// useEffect(() => {
                                    //     if(ajustesTemp !== undefined){
                                    //         let totalTemp = [];
                                    //         console.log('totalTemp: ', totalTemp);
                                          
                                    //         ajustesTemp.forEach((elemento) => {
                                    //           let obj = { descricao: '', valor: 0 };
                                    //           let found = false;
                                          
                                    //           for (let i = 0; i < totalTemp.length; i++) {
                                    //             if (totalTemp[i].descricao === elemento.descricao) {
                                    //               console.log(
                                    //                 'total ajuste desc: ',
                                    //                 totalTemp[i].descricao,
                                    //                 'elemento desc: ',
                                    //                 elemento.descricao
                                    //               );
                                    //               obj.valor = elemento.valor;
                                    //               totalTemp[i].valor += elemento.valor;
                                    //               found = true;
                                    //               break;
                                    //             }
                                    //           }
                                          
                                    //           if (!found) {
                                    //             obj.descricao = elemento.descricao;
                                    //             obj.valor = elemento.valor;
                                    //             totalTemp.push(obj);
                                    //           }
                                    //         });   
                                
                                    //         console.log('totalTemp', totalTemp);
                                    //         setAjustesAgrupados(totalTemp)
                                    //     }
                                    //   }, [ajustesTemp]);
                                
                                    //   useEffect(()=>{
                                    //     console.log('ajustesAgrupados: ', ajustesAgrupados)
                                    //   },[ajustesAgrupados])
                                
                                    // function CardServicos(filialAjuste){
                                    //             return(
                                    //                     <div className='card-filial'>
                                    //                         <div className='card-ajuste-container'>
                                    //                             <div className='card-ajuste'>
                                    //                                 <h5 className='h5-valores'>Adquirente:</h5>
                                    //                                 <span className='span-valores'>{filialAjuste.nome_adquirente}</span>
                                    //                             </div>
                                    //                             <div className='card-ajuste'>
                                    //                                 <h5 className='h5-valores'>{filialAjuste.descricao}</h5>
                                    //                                 <span className='span-valores red'>{filialAjuste.valor}</span>
                                    //                             </div>
                                    //                             <div className='card-ajuste'>
                                    //                                 <h5 className='h5-valores'>Data</h5>
                                    //                                 <span className='span-valores'>{dateConvert(filialAjuste.data)}</span>
                                    //                             </div>
                                    //                         </div>
                                    //                     </div>
                                    //             )
                                    // }
                                
                                    // function CardServicosTotais(filialAjuste){
                                    //     return(
                                    //         <div className='card-ajuste'>
                                    //             <h5 className='h5-valores'>{filialAjuste.descricao}</h5>
                                    //             <span className='span-valores red'>{filialAjuste.valor}</span>
                                    //         </div>
                                    //     )
                                    // }
                                
                                ///////////////////////////////////////////