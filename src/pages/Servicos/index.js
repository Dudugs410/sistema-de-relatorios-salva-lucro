

import './servicos.scss'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import DateRangePicker from '../../components/Componente_DateRangePicker'
import Cookies from 'js-cookie'


/*
TODO:
    - calendario -> marcar data inicial e data final
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
        dateConvert 
    } = useContext(AuthContext)

    const [arrayTeste, setArrayTeste] = useState([])
    const [ajustesTemp, setAjustesTemp] = useState([])
    const [totalAjustes, setTotalAjustes] = useState([])
    const [buscou, setBuscou] = useState([])

    async function buscarAjustes(){
        const response = await loadAjustes(Cookies.get('cnpj'), dataInicial, dataFinal)
        setAjustesTemp(response)
    }
    
    useEffect(()=>{
        setDataInicial(new Date())
        setDataFinal(new Date())
        ajustesTemp.length = 0
        totalAjustes.length = 0
    },[])

    useEffect(()=>{
        async function inicializar(){
          if(grupos.length === 0){
            setGrupos(JSON.parse(sessionStorage.getItem('grupos')))       
          }
        }
        inicializar()
      },[])

    useEffect(() => {
        if(ajustesTemp !== undefined){
            let totalTemp = [];
            console.log('totalTemp: ', totalTemp);
          
            ajustesTemp.forEach((elemento) => {
              let obj = { descricao: '', valor: 0 };
              let found = false;
          
              for (let i = 0; i < totalTemp.length; i++) {
                if (totalTemp[i].descricao === elemento.descricao) {
                  console.log(
                    'total ajuste desc: ',
                    totalTemp[i].descricao,
                    'elemento desc: ',
                    elemento.descricao
                  );
                  obj.valor = elemento.valor;
                  totalTemp[i].valor += elemento.valor;
                  found = true;
                  break;
                }
              }
          
              if (!found) {
                obj.descricao = elemento.descricao;
                obj.valor = elemento.valor;
                totalTemp.push(obj);
              }
            });   

            console.log('totalTemp', totalTemp);
            setTotalAjustes(totalTemp)
        }
      }, [ajustesTemp]);

      useEffect(()=>{
        console.log('totalAjustes: ', totalAjustes)
      },[totalAjustes])

    function CardServicos(filialAjuste){
                return(
                        <div className='card-filial'>
                            <div className='card-ajuste-container'>
                                <div className='card-ajuste'>
                                    <h5 className='h5-valores'>Adquirente:</h5>
                                    <span className='span-valores'>{filialAjuste.nome_adquirente}</span>
                                </div>
                                <div className='card-ajuste'>
                                    <h5 className='h5-valores'>{filialAjuste.descricao}</h5>
                                    <span className='span-valores red'>{filialAjuste.valor}</span>
                                </div>
                                <div className='card-ajuste'>
                                    <h5 className='h5-valores'>Data</h5>
                                    <span className='span-valores'>{dateConvert(filialAjuste.data)}</span>
                                </div>
                            </div>
                        </div>
                )
    }

    function CardServicosTotais(filialAjuste){
        return(
            <div className='card-ajuste'>
                <h5 className='h5-valores'>{filialAjuste.descricao}</h5>
                <span className='span-valores red'>{filialAjuste.valor}</span>
            </div>
        )
}

    function handleBuscar(e){
        e.preventDefault()
        buscarAjustes()
    }

    function handleBuscar2(){
        buscarAjustes()
    }

    return(
        <div className='appPage app-page-servicos'>
            <div className='page-servicos-background'>
                <div className='page-content-servicos'>
                    <div className='vendas-title-container'>
                        <h1 className='vendas-title'>Serviços</h1>
                    </div>
                    {/* <div className='hr-container'>
                        <hr className='hr-ajustes'/>
                    </div> */}
                    <div className='date-picker-ajustes'>
                        <div className='label-picker-servicos'>
                            <DateRangePicker/>
                        </div>
                        <div className='btn-container-servicos'>
                            <button className='btn btn-primary btn-busca-servicos' onClick={handleBuscar}>Pesquisar</button>
                        </div>
                    </div>
                            { totalAjustes !== undefined && (totalAjustes.map((elemento) => {
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
                            }))}
                    {/* <div className='hr-container'>
                        <hr className='hr-ajustes'/>
                    </div> */}
                    <div className='container-ajustes'>

                        <div className='filial-container'>
                            { ajustesTemp !== undefined && (ajustesTemp.map((elemento) => {
                                return(
                                    CardServicos(elemento)
                                )
                            }))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Servicos