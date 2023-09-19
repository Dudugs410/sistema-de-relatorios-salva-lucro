import { useContext, useEffect, useState } from 'react'
import DetalhesVenda from '../../components/DetalhesVenda'
import { AuthContext } from '../../contexts/auth'
import DetalhesCredito from '../../components/DetalhesCredito'
import DateRangePicker from '../../components/Componente_DateRangePicker'

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
        dataInicial,
        dataFinal,
     } = useContext(AuthContext)

    const [ vendasRelatorios, setVendasRelatorios ] = useState([])
    const [ creditosRelatorios, setCreditosRelatorios ] = useState([])

    const [adqSelecionada, setAdqSelecionada] = useState('')
    const [banSelecionada, setBanSelecionada] = useState('')

    const [detalhado, setDetalhado] = useState(false)

    useEffect(()=>{
        function init(){
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

  function SelectPicker() {
  
    return (
      <div className='dados-busca-select-relatorios'>
        <div className='picker-container'>
          <label className='label-picker'>Adquirente</label>
          <div className='react-datepicker-wrapper'>
            <select className='date-picker-css' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
              <option value=''>Todas</option>
              {adquirentes.map((ADQ)=>(
                  <option key={ADQ.codigoAdquirente} value = {ADQ.codigoAdquirente}>{ADQ.nomeAdquirente}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='picker-container'>
          <label className='label-picker'>Bandeira</label>
          <div className='react-datepicker-wrapper'>
            <select className='date-picker-css'value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                <option value=''>Todas</option>
                {bandeiras.map((BAN)=>(
                    <option key={BAN.codigoBandeira} value = {BAN.codigoBandeira}>{BAN.descricaoBandeira}</option>
                ))}
            </select>
          </div>
        </div>
      </div>
    )
  }

  function RadioSelect(){
    return (
      <>
        <div className='radio-container'>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value='false' onChange={()=>{setDetalhado(false)}} />
            <label class="form-check-label radio-text" for="flexRadioDefault1">
              Simples
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value='false' onChange={()=>{setDetalhado(true)}} />
            <label class="form-check-label radio-text" for="flexRadioDefault2">
              Detalhado
            </label>
          </div>
        </div>
      </>
    )

  }

  useEffect(()=>{
    console.log('detalhado: ', detalhado)

  },[detalhado])

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

    return(
        <div className='appPage'>
            <div className='relatorios-page-container'>
                <h1 className='h1-relatorios'>Relatórios</h1>
                <div className='dados-busca-relatorios-container'>
                  <DateRangePicker />
                  <SelectPicker />
                  <RadioSelect />
                </div>
                <div className='btn-relatorios-container'>
                  <button onClick={handleSubmit} className='btn btn-primary'>Pesquisar</button>
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