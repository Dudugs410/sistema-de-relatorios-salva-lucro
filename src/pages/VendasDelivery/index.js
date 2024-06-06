import { useContext, useEffect, useState } from "react"
import MyCalendar from "../../components/Componente_Calendario"
import { AuthContext } from "../../contexts/auth"
import { FiFilePlus } from "react-icons/fi"
import Select from 'react-select'

import '../Financeiro/financeiro.scss'
import '../../styles/global.scss'
import './vendasDelivery.scss'


const VendasDelivery = () => {

    const { isDarkTheme } = useContext(AuthContext)

    const handleDateChange = date => {
        setDataBusca(date)
    }

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
    const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
    const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

    useEffect(()=>{
        if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
            setDataBuscaInicial(dataBusca[0])
            setDataBuscaInicial(dataBusca[1])
            setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
            setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
        }
    },[dataBusca])

    const appOptions = [
        { value: 0, label: 'iFood'}
    ]

    const [appSelecionado, setAppSelecionado] = useState(null)

    const handleAppChange = (opcao) =>{
        setAppSelecionado(opcao)
    }

    function handleLoadData(){
        console.log('loadData')
    }

    function handleDateRangeChange(){
        console.log('handleDateRangeChange')
    }

    return(
        <div className='appPage'>
          <div className='page-background-global'>
            <div className='page-content-global page-content-financeiro'>
                <div className='title-container-global'>
                    <h1 className='title-global'>Vendas Delivery</h1>       
                </div>
                <hr className='hr-global'/>
                <div className='container-cielo'>
                    <div>
                        <div>
                            <h5>Relatório Detalhado de Vendas</h5>
                        </div>
                        <div>
                            <div className='input-block-cli-adq'>
                            <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>        
                            <div className='export-container-delivery'>
                                <div className='export-container-delivery-child'>
                                    <h6><b>Aplicativo: </b></h6>
                                    <Select
                                        styles={{'min-width': '250px'}}
                                        options={appOptions}
                                        onChange={handleAppChange}
                                        value={appSelecionado}
                                    />
                                </div>
                                <div className='export-container-delivery-child'>
                                    {/*<h6><b>Gerar: </b></h6>*/}
                                    <button className='btn btn-global'><FiFilePlus /> &nbsp; Excel</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )
}

export default VendasDelivery