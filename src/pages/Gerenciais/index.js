import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import Select from 'react-select'

import '../../styles/global.scss'
import '../Financeiro/financeiro.scss'
import Calendar from 'react-calendar';
import MyCalendar from '../../components/Componente_Calendario';

const Gerenciais = () =>{
    const location = useLocation();
    const { isDarkTheme } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [tipoRelatorio, setTipoRelatorio] = useState('selecione')
    const [formatoRelatorio, setFormatoRelatorio] = useState('PDF')

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

    const opcoesRelatorio = [{value: 0, label:'Resumo Mensal'}, {value: 1, label:'Comparativo de Taxas'}, {value: 2, label: 'Vero - Não Autorizadas'}]
    const opcoesFormato = [{value: 0 , label: 'PDF' }]

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
          setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
          setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
        }
    },[dataBusca])

    function handleExport(e){
        e.preventDefault()
        console.log('dataBusca: ', dataBusca)
    }

  return(
      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`title-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Relatórios Gerenciais</h1>
            </div>
            <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
            <div className='container-financeiro'>
                <MyCalendar dataInicialExibicao={dataInicialExibicao} dataFinalExibicao={dataFinalExibicao} dataBusca={dataBusca} handleDateChange={handleDateChange} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
                    <form className='form-container-relatorios'>
                    <div className='select-elements-container'>
                        <div className='container-select'>
                            <span className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Tipo de Relatório</span>
                            <select 
                                className={`select-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} 
                                value={tipoRelatorio} 
                                onChange={handleRelatorio}>
                                <option value="">Selecione</option>
							    {opcoesRelatorio.map((option)=>(
								<option key={option.value} value={option.value}>{option.label}</option>
							    ))}
						    </select>
                        </div>
                        <div className='container-select'>
                            <span className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Formato</span>
                            <select
                                className={`select-global select-disabled-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} 
                                value={formatoRelatorio} 
                                onChange={handleFormato}
                                disabled
                                >
                                <option value="0">PDF</option>
						    </select>
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

export default Gerenciais