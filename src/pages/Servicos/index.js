

import './servicos.css'
import GerarRelatorio from '../../components/Componente_GerarRelatorio'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import DateRangePicker from '../../components/Componente_DateRangePicker'

const Servicos = () =>{

    const { loadAjustes, cnpj, alerta, dataInicial, dataFinal, dateConvert } = useContext(AuthContext)

    const [arrayTeste, setArrayTeste] = useState([])
    const [ajustesTemp, setAjustesTemp] = useState([])
    const [buscou, setBuscou] = useState([])

    async function buscarAjustes(){
        const response = await loadAjustes(sessionStorage.getItem('cnpj'), dataInicial, dataFinal)
        setAjustesTemp(response)
    }

    useEffect(()=>{
        console.log(ajustesTemp)
        if(buscou === false){
            buscarAjustes()
            if(ajustesTemp.length === 0){
                alerta('Não existem ajustes para o período selecionado')
            }
            setBuscou(true)
        }
    },[ajustesTemp])

    useEffect(()=>{
        console.log(cnpj)
        buscarAjustes()
    },[cnpj])

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


    function handleBuscar(e){
        e.preventDefault()
        buscarAjustes()
    }

    return(
        <div className='appPage app-page-servicos'>
            <div className='servicos-page'>
                <div className='date-picker-ajustes'>
                    <DateRangePicker/>
                    <div className='btn-container-servicos'>
                        <button className='btn btn-primary btn-busca-servicos' onClick={handleBuscar}>Pesquisar</button>
                    </div>
                </div>
                <div className='header-tabs-container'>
                    <div className='header-tabs'>
                        <span className='span-tab-servicos'>Filiais</span>
                    </div>
                    <div className='header-tabs'>
                        <span className='span-tab-servicos'>Produtos</span>
                    </div>
                    <div className='header-tabs'>
                        <span className='span-tab-servicos'>Administradoras</span>
                    </div>
                    <div className='header-tabs'>
                        <span className='span-tab-servicos'>Bandeiras</span>
                    </div>
                </div>
                <div className='container-ajustes'>
                    <div className='card-resumo-total-ajustes'>
                        <div className='card-resumo-content-container'>
                            <h1 className='h1-total-ajustes'>Resumo Total</h1>
                            <div className='card-ajuste-container'>
                                <div className='card-ajuste'>
                                    <h5 className='h5-valores'>Ajuste a Débito</h5>
                                    <span className='span-valores'>R$ 100,12</span>
                                </div>
                                <div className='card-ajuste'>
                                    <h5 className='h5-valores'>Ajuste a Crédito</h5>
                                    <span className='span-valores'>R$ 100,12</span>
                                </div>
                                <div className='card-ajuste'>
                                    <h5 className='h5-valores'>Aluguel de POS</h5>
                                    <span className='span-valores'>R$ 100,12</span>
                                </div>
                                <div className='card-ajuste'>
                                    <h5 className='h5-valores'>Total </h5>
                                    <span className='span-valores'>R$ 100,12</span>
                                </div>
                            </div>
                            <GerarRelatorio array={ arrayTeste }/>
                        </div>
                    </div>

                    <div className='filial-container'>
                        { ajustesTemp.map((elemento) => {
                            return(
                                CardServicos(elemento)
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Servicos