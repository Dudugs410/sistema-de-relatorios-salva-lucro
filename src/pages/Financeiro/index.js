import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../../styles/global.scss'
import Select from 'react-select'
import './financeiro.scss'
import MyCalendar from '../../components/Componente_Calendario'
import base64PDFdownload from '../../components/Componente_Base64PDF'

const Financeiro = () =>{
    const location = useLocation()

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [tipoRelatorio, setTipoRelatorio] = useState(null)
    const [formatoRelatorio, setFormatoRelatorio] = useState(null)

    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
    const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname)
    }, [location])

    const opcoesRelatorio = [{value: 0, label:'Previsão de Recebimento'}, {value: 1, label:'Créditos por Data e Banco'}, {value: 2, label: 'Antecipações'}, {value:3, label: 'Gravame/Cessão'}, {value:4, label:'Posição Contábil'}]
    const opcoesFormato = [{value: 0 , label: 'PDF' }, {value: 1 , label: 'Excel' } ]

    const handleRelatorio = selectedOption => {
       setTipoRelatorio(selectedOption)
    }

    const handleFormato = selectedOption => {
        setFormatoRelatorio(selectedOption)
    }

    const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
    const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))

    useEffect(()=>{
        if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
            setDataBuscaInicial(dataBusca[0])
            setDataBuscaFinal(dataBusca[1])
            setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
            setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
        }
    },[dataBusca])

    function handleExport(e){
        e.preventDefault()
        base64PDFdownload()
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
              <h1 className='title-global'>Relatórios Financeiros</h1>
            </div>
            <div className='container-financeiro' style={{width: '100%'}}>
            <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>
                    <form className='form-container-relatorios'>
                        <div className='select-elements-container'>
                            <div className='container-select'>
                                <span className='span-picker'>Tipo de Relatório</span>
                                <Select
                                    value={tipoRelatorio} 
                                    onChange={handleRelatorio}
                                    placeholder="Selecione"
                                    options={opcoesRelatorio}
                                    isSearchable={false}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                />
                            </div>
                            <div className='container-select'>
                                <span className='span-picker'>Formato</span>
                                <Select 
                                    value={formatoRelatorio}
                                    onChange={handleFormato}
                                    placeholder="Selecione"
                                    options={opcoesFormato}
                                    isSearchable={false}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                />
                            </div>
                        </div>
                        <div className='btn-container-financeiro'>
                            <button className='btn btn-primary btn-global' onClick={handleExport}>Exportar</button>
                        </div>
                    </form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Financeiro