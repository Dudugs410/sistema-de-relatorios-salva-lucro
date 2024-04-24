import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import '../../styles/global.scss'
import Select from 'react-select'
import '../ExportacaoSysmo'
import MyCalendar from '../../components/Componente_Calendario'
import base64PDFdownload from '../../components/Componente_Base64PDF'
import RadioSelect from '../../components/Componente_RadioSelect'

const ExportacaoMetaSapiranga = () =>{
    const location = useLocation();
    const { isDarkTheme, setLoading, bandeiras, loadBandeiras, adquirentes, loadAdquirentes } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])

    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)

    const [listaBan, setListaBan] = useState([])
    const [listaAdq, setListaAdq] = useState([])

    const [banSelecionada, setBanSelecionada] = useState('Selecione')
    const [adqSelecionada, setAdqSelecionada] = useState('Selecione')

    const [tipo, setTipo] = useState('')
    const radioOptions = [
        {value: 'Vendas', label: 'Vendas'}, 
        {value: 'Creditos', label: 'Créditos'}
    ]

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

    useEffect(()=>{
        async function inicializar(){
          if(bandeiras.length === 0){
            await loadBandeiras()
          }
          
          if(adquirentes.length === 0){
            await loadAdquirentes()
          }
        }
        //inicializar()
      },[])

/*      useEffect(() => {
        if (bandeiras.length > 0) {
            const listaBanOptions = bandeiras.map(bandeira => ({ value: bandeira.codigoBandeira, label: bandeira.descricaoBandeira }));
            setListaBan(listaBanOptions);
        }
    }, [bandeiras]);

    useEffect(() => {
        if (adquirentes.length > 0) {
            const listaAdqOptions = adquirentes.map(adquirente => ({ value: adquirente.codigoAdquirente, label: adquirente.nomeAdquirente }));
            setListaAdq(listaAdqOptions);
        }
    }, [adquirentes]); */

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
        base64PDFdownload()
        setLoading(false)
    }

    function handleBan(e){
        setBanSelecionada(e)
    }

    function handleAdq(e){
        setAdqSelecionada(e)
    }

    useEffect(()=>{
        console.log('Parâmetros Selecionados: ',
        'Tipo: ', tipo,
        'Bandeira: ', banSelecionada,
        'Adquirente: ', adqSelecionada,
        'Data: ', dataBusca)
    },[tipo])

    function handleLoadData(){
        console.log('loadData')
    }

    function handleDateRangeChange(){
        console.log('handleDateRangeChange')
    }

    return(
      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-global page-content-exportacao ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`title-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Exportação Meta Sapiranga</h1>
            </div>
            <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
            <div className=''>
            <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>
                <div className=''>
                    <form className=''>
                        <div className='component-container'>
                            <RadioSelect options={radioOptions} onSelect={(e) => {setTipo(e)}}/>
                            <div className=''>
                                <span className={`span-picker ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Bandeira</span>
                                <Select
                                    value={banSelecionada} 
                                    onChange={handleBan}
                                    placeholder="Selecione"
                                    options={listaBan}
                                />
                            </div>
                            <div className=''>
                                <span className={`span-picker ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Adquirente</span>
                                <Select 
                                    value={adqSelecionada} 
                                    onChange={handleAdq}
                                    placeholder="Selecione"
                                    options={listaAdq}
                                />
                            </div>
                        </div>
                        <div className='btn-container-financeiro'>
                            <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleExport}>Gerar Arquivo</button>
                        </div>
                    </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default ExportacaoMetaSapiranga