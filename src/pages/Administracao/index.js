import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../../styles/global.scss'
import '../ExportacaoSysmo'
import MyCalendar from '../../components/Componente_Calendario'
import base64PDFdownload from '../../components/Componente_Base64PDF'
import RadioSelect from '../../components/Componente_RadioSelect'
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi'
import './administracao.scss'

const Administracao = () =>{
    const location = useLocation()
    const [dataBusca, setDataBusca] = useState([new Date, new Date])

    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
    const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

    const [tipo, setTipo] = useState('')
    const radioOptions = [
        {value: '0', label: 'Taxa Redecen'},
        {value: '1', label: 'Taxa Padrão'},
        {value: '2', label: 'Taxa Personalizada'}
    ]

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname)
    }, [location])

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
        base64PDFdownload()
    }

    const PlaceHolder = () =>{
        return(
            <table class="table table-striped table-hover table-bordered">
                <thead>
                    <tr>
                        <th colspan="6"><FiPlus className='icon' />Adicionar</th>
                    </tr>
                </thead>
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Bandeira</th>
                    <th scope="col">Modalidade</th>
                    <th scope="col">Tipo Taxa</th>
                    <th scope="col">% Taxa</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row"><FiEdit className='icon' /></th>
                        <td>Amex</td>
                        <td>Crédito À Vista</td>
                        <td>Redecen</td>
                        <td>1.36</td>
                        <td><FiTrash className='icon'/></td>
                </tr>
                <tr>
                    <th scope="row"><FiEdit className='icon' /></th>
                        <td>Amex</td>
                        <td>Crédito parcelado s/juros 2 a 6x</td>
                        <td>Redecen</td>
                        <td>2.19</td>
                        <td><FiTrash className='icon'/></td>
                </tr>
                <tr>
                    <th scope="row"><FiEdit className='icon' /></th>
                        <td>Elo</td>
                        <td>Crédito parcelado s/juros 2 a 6x</td>
                        <td>Redecen</td>
                        <td>1.74</td>
                        <td><FiTrash  className='icon' /></td>
                </tr>
            </tbody>
        </table>
        )
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
          <div className='page-content-global page-content-exportacao'>
            <div className='title-container-global'>
              <h1 className='title-global'>Análise Inicial</h1>
            </div>
            <div className=''>
                <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>
                <div className=''>
                    <form className=''>
                        <div className='component-container'>
                            <h5 style={{fontWeight: 'bold'}}>Tipo de Taxa</h5>
                            <br/>
                            <RadioSelect options={radioOptions} onSelect={(e) => {setTipo(e)}}/>
                            <br/>
                        </div>
                        <div className='component-container'>
                            <br/>
                            <h5 style={{fontWeight: 'bold'}}>Cadastro de Taxas Comparativas</h5>
                            <br/>
                            <PlaceHolder />
                            <br/>
                        </div>
                        <div className='btn-container-financeiro'>
                            <button className='btn btn-primary btn-global' onClick={handleExport}>Gerar PDF</button>
                        </div>
                    </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Administracao