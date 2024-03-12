import { useEffect, useContext, createContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import '../../styles/global.scss'
import Select from 'react-select'
import './financeiro.scss'
import MyCalendar from '../../components/Componente_Calendario';
import base64PDFdownload from '../../components/Componente_Base64PDF';

const Financeiro = () =>{
    const location = useLocation();
    const { isDarkTheme, loading, setLoading } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [tipoRelatorio, setTipoRelatorio] = useState(null)
    const [formatoRelatorio, setFormatoRelatorio] = useState(null)
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
        setLoading(true)
        console.log('dataBusca: ', dataBusca)
        base64PDFdownload()
        setLoading(false)
    }

    return(
      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-global page-content-exportacao ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`title-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Relatórios Financeiros</h1>
            </div>
            <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
            <div className='container-financeiro'>
                <MyCalendar dataInicialExibicao={dataInicialExibicao} dataFinalExibicao={dataFinalExibicao} dataBusca={dataBusca} handleDateChange={handleDateChange} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
                    <form className='form-container-relatorios'>
                        <div className='select-elements-container'>
                            <div className='container-select'>
                                <span className={`span-picker ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Tipo de Relatório</span>
                                <Select
                                    value={tipoRelatorio} 
                                    onChange={handleRelatorio}
                                    placeholder="Selecione"
                                    options={opcoesRelatorio}
                                    isSearchable={false}
                                />
                            </div>
                            <div className='container-select'>
                                <span className={`span-picker ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Formato</span>
                                <Select 
                                    value={formatoRelatorio} 
                                    onChange={handleFormato}
                                    placeholder="Selecione"
                                    options={opcoesFormato}
                                    isSearchable={false}
                                />
                            </div>
                        </div>
                        <div className='btn-container-financeiro'>
                            <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleExport}>Exportar</button>
                        </div>
                    </form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Financeiro