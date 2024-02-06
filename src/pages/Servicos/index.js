import Calendar from 'react-calendar'
import './servicos.scss'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import DateRangePicker from '../../components/Componente_TabelaServicos'
import Cookies from 'js-cookie'
import TabelaServicos from '../../components/Componente_TabelaServicos'


/*
TODO:
    x calendario -> marcar data inicial e data final
    - tabela p vizualizar as infos (igual outras tabelas)

*/
const Servicos = () =>{

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
        const response = await loadAjustes(Cookies.get('cnpj'), dataInicial, dataFinal)
        setAjustesTemp(response)
        console.log('ajuste: ', response)
    }

    function handleDateChange(date){
        setDataBusca(date)
    }
    
    useEffect(() => {
        setDataInicial(dataBusca[0])
        setDataFinal(dataBusca[1])
        console.log(dataBusca)
    }, [dataBusca])


    // hook que agrupa por adquirente e calcula valor_total dos grupos de ajuste
    useEffect(()=>{
        const groupedData = {};
        let adq_total_value = 0;

        // Iterate through each person in the data
        ajustesTemp.forEach(ajuste => {
        const adq_name = ajuste.nome_adquirente;
        adq_total_value += ajuste['valor']

        // Check if a group already exists for the current fruit
        if (!groupedData[adq_name]) {
            // If not, create a new group with the current person
            groupedData[adq_name] = [ajuste];
            groupedData[adq_name]['valor_total'] = ajuste['valor']
        } else {
            // If a group already exists, add the current person to the existing group
            groupedData[adq_name].push(ajuste);
            groupedData[adq_name]['valor_total'] += ajuste['valor']
        }
        });
        
        const ajustes_agrupados = {'grupos': groupedData, 'total_ajustes': adq_total_value, 'ajustes': ajustesTemp}
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
        <div className='appPage app-page-servicos'>
            <div className='page-servicos-background'>
                <div className='page-content-servicos'>
                    <div className='vendas-title-container'>
                        <h1 className='vendas-title'>Serviços</h1>
                    </div>

                    <div className='date-picker-ajustes'>
                        <div className='label-picker-servicos'>
                        <MyCalendar/>
                        <TabelaServicos array={ajustesTemp}/>
                            {/* {!(ajustesTemp) && (ajustesTemp.length > 0)? <TabelaServicos array={ajustesTemp}/> : <MyCalendar/>} */}
                        </div>
                        <div className='btn-container-servicos'>
                            <button className='btn btn-primary btn-busca-servicos' onClick={handleBuscar}>Pesquisar</button>
                        </div>
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

                    <div className='container-ajustes'>

                        <div className='filial-container'>
                            {/* { ajustesTemp !== undefined && (ajustesTemp.map((elemento) => {
                                return(
                                    CardServicos(elemento)
                                )
                            }))} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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