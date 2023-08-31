import { useContext, useEffect, useState } from 'react'
import DetalhesVenda from '../../components/DetalhesVenda'
import { AuthContext } from '../../contexts/auth'
import DetalhesCredito from '../../components/DetalhesCredito'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './date-picker.css'
import GerarRelatorio from '../../components/Componente_GerarRelatorio'

import './relatorios.css'

const Relatorios = () =>{
    const { 
        dateConvertSearch,
        converteData,
        cnpj, 
        setVendas, 
        returnVendas, 
        returnCreditos, 
        loadAdquirentes, 
        loadBandeiras,
        adquirentes,
        bandeiras,
     } = useContext(AuthContext)

    const [ vendasRelatorios, setVendasRelatorios ] = useState([])
    const [ creditosRelatorios, setCreditosRelatorios ] = useState([])

    const [dataInicial, setDataInicial] = useState(new Date())
    const [dataFinal, setDataFinal] = useState(new Date())

    const [adqSelecionada, setAdqSelecionada] = useState('')
    const [banSelecionada, setBanSelecionada] = useState('')

    useEffect(()=>{
        async function init(){
            loadAdquirentes()
            loadBandeiras()
        }
        init()
    },[])
    
    async function handleSubmit(e){
        e.preventDefault()
        const vendasTemp = await returnVendas(dateConvertSearch(dataInicial), dateConvertSearch(dataFinal), cnpj, adqSelecionada, banSelecionada)
        const creditosTemp = await returnCreditos(dateConvertSearch(dataInicial), dateConvertSearch(dataFinal), cnpj)
        setVendasRelatorios(vendasTemp)
        setCreditosRelatorios(creditosTemp)
    }

    useEffect(()=>{
        console.log('vendasRelatorios: ', vendasRelatorios )

    },[vendasRelatorios])

    useEffect(()=>{
        console.log('creditosRelatorios: ', creditosRelatorios )

    },[creditosRelatorios])

    useEffect(()=>{
        console.log('dataInicial: ', dateConvertSearch(dataInicial))

    },[dataInicial])

    useEffect(()=>{
        console.log('dataFinal: ', dateConvertSearch(dataFinal))

    },[dataFinal])
////////////////////////////////////////////////////////////////////////////////////////
function DateRangePicker() {

    const handleStartDateChange = date => {
      setDataInicial(date)
    }
  
    const handleEndDateChange = date => {
      setDataFinal(date)
    }
  
    return (
      <div className='picker'>
        <div className='pickerContainer'>
          <label className='label-picker'>Data Inicial:</label>
            <DatePicker className='date-picker-css'
              selected={dataInicial}
              onChange={handleStartDateChange}
              selectsStart
              startDate={dataInicial}
              endDate={dataFinal}
            />
        </div>
        
        <div className='pickerContainer'>
          <label className='label-picker'>Data Final:</label>
            <DatePicker className='date-picker-css'
              selected={dataFinal}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={dataInicial}
              endDate={dataFinal}
              minDate={dataInicial}
            />
        </div>
      </div>
    )
  }
////////////////////////////////////////////////////////////////////////////////////////


    return(
        <div className='appPage'>
            <div className='relatorios-page-container'>
                <div className='dados-busca-relatorios'>
                    <div className='form-dados-busca-relatorios'>
                        <DateRangePicker />
                        <div className='seletor-relatorio-container'>
                            <select className='select-relatorios' id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
                                <option value=''>Todas</option>
                                {adquirentes.map((ADQ)=>(
                                    <option key={ADQ.codigoAdquirente} value = {ADQ.codigoAdquirente}>{ADQ.nomeAdquirente}</option>
                                ))}
                            </select>
                            <select className='select-relatorios' id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                <option value=''>Todas</option>
                                {bandeiras.map((BAN)=>(
                                    <option key={BAN.codigoBandeira} value = {BAN.codigoBandeira}>{BAN.descricaoBandeira}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleSubmit} className='btn btn-primary'>Pesquisar</button>
                    </div>
                </div>
                <div className='result-container-relatorios'>
                    <div className='table-container-relatorios'>
                        <h1 className='h1-relatorios'>Vendas</h1>
                        { vendasRelatorios.length > 0 ? <DetalhesCredito array={ vendasRelatorios }/> : <></> }
                        { vendasRelatorios.length > 0 ? <GerarRelatorio array={ vendasRelatorios }/> : <></> }
                    </div>
                    <div className='table-container-relatorios'>
                        <h1 className='h1-relatorios'>Créditos</h1>
                        { creditosRelatorios.length > 0 ? <DetalhesCredito array={ creditosRelatorios }/> : <></> }
                        { creditosRelatorios.length > 0 ? <GerarRelatorio array={ creditosRelatorios } /> : <></> }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Relatorios