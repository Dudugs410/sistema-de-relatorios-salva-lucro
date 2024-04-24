import { useContext, useEffect, useState } from "react"
import MyCalendar from "../../components/Componente_Calendario"
import { AuthContext } from "../../contexts/auth"
import { FiFilePlus } from "react-icons/fi"
import Select from 'react-select'

import '../Financeiro/financeiro.scss'
import '../../styles/global.scss'


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
        <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`page-content-global page-content-financeiro ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                    <h1 className={`title-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Vendas Delivery</h1>          
                </div>
                <hr className="hr-recebimentos"/>
                <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                    <div>
                        <div>
                            <h5 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Relatório Detalhado de Vendas</h5>
                        </div>
                        <div className=''>
                            <div className='input-block-cli-adq'>
                            <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>        
                                <hr className='hr-global'/>
                                <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Aplicativo</b></h6>
                                <Select
                                    className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
                                    options={appOptions}
                                    onChange={handleAppChange}
                                    value={appSelecionado}
                                />
                            </div>
                            <br/>
                            <div className=''>
                                <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Gerar</b></h6>
                                <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiFilePlus /> &nbsp; Excel</button>
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