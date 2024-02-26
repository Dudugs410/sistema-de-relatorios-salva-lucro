import { useEffect, useContext, createContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import Select from 'react-select'

import '../../styles/global.scss'
import './financeiro.scss'
import Calendar from 'react-calendar';
import MyCalendar from '../../components/Componente_Calendario';

const Financeiro = () =>{
    const location = useLocation();
    const { isDarkTheme } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [tipoRelatorio, setTipoRelatorio] = useState('selecione')
    const [formatoRelatorio, setFormatoRelatorio] = useState('selecione')
    const [clickCount, setClickCount] = useState(0);

    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
    const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

    const opcoesRelatorio = [{value: 0, label:'Previsão de Recebimento'}, {value: 1, label:'Créditos por Data e Banco'}, {value: 2, label: 'Antecipações'}, {value:3, label: 'Gravame/Cessão'}, {value:4, label:'Posição Contábil'}]
    const opcoesFormato = [{value: 0 , label: 'PDF' }, {value: 1 , label: 'Excel' } ]

    const handleRelatorio = selectedOption => {
       setTipoRelatorio(selectedOption)
    }

    const handleFormato = selectedOption => {
        setFormatoRelatorio(selectedOption)
    }

    useEffect(()=>{
        console.log('tipo do relatório: ', tipoRelatorio)

    },[tipoRelatorio])

    useEffect(()=>{
        console.log('formato do relatório: ', formatoRelatorio)

    },[formatoRelatorio])

    const handleDateChange = date => {
        setDataBusca(date)
    }

    const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
    const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))

    useEffect(()=>{
        if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
            setDataBuscaInicial(dataBusca[0])
            setDataBuscaInicial(dataBusca[1])
            setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
            setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
        }
    },[dataBusca])

    function handleExport(e){
        e.preventDefault()
        console.log('dataBusca: ', dataBusca)
    }

    return(
      <div className={`app-page-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`title-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Relatórios Financeiros</h1>
            </div>
            <hr className="hr-global"/>
            <div className='container-financeiro'>
            <MyCalendar dataInicialExibicao={dataInicialExibicao} dataFinalExibicao={dataFinalExibicao} dataBusca={dataBusca} handleDateChange={handleDateChange} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
                <form className='form-container-relatorios'>
                    <div className='select-elements-container'>
                        <div className='container-select'>
                            <span>Tipo de Relatório</span>
                            <Select
                                className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
                                options={opcoesRelatorio}
                                onChange={handleRelatorio}
                                placeholder='Selecione'
                                value={tipoRelatorio}
                            />
                        </div>
                        <div className='container-select'>
                            <span>Formato</span>
                            <Select
                                className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
                                options={opcoesFormato}
                                onChange={handleFormato}
                                placeholder='Selecione'
                                value={formatoRelatorio}
                            />
                        </div>
                    </div>
                    <div className='btn-container-financeiro'>
                        <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleExport}>Exportar</button>
                    </div>
                </form>
            </div>
            <hr className='hr-global'/>
          </div>
        </div>
      </div>
    )
}

export default Financeiro