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
        setCnpj,
        grupos,
        setVendas, 
        returnVendas, 
        returnCreditos, 
        loadAdquirentes, 
        loadBandeiras,
        loadGrupos,
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

    const [buscou, setBuscou] = useState(false)

    useEffect(()=>{
      async function inicializar(){
        setCnpj(sessionStorage.getItem('cnpj'))
        if(bandeiras.length === 0){
          await loadBandeiras()
        }
        
        if(adquirentes.length === 0){
          await loadAdquirentes()
        }
        
        if(grupos.length === 0){
          await loadGrupos()        
        }
      }
      inicializar()
    },[])
    
    async function handleSubmit(e){
        e.preventDefault()
        const vendasTemp = await returnVendas(dateConvertSearch(dataInicial), dateConvertSearch(dataFinal), cnpj, adqSelecionada, banSelecionada)
        const creditosTemp = await returnCreditos(dateConvertSearch(dataInicial), dateConvertSearch(dataFinal), cnpj)
        setVendasRelatorios(vendasTemp)
        setCreditosRelatorios(creditosTemp)
        setBuscou(true)
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

  function RelatorioRenderer(){
    if(creditosRelatorios === undefined || vendasRelatorios === undefined){
      return 0;
    }
    else{
      return(
        <div className='result-container-relatorios'>
          <div className='table-container-relatorios'>
              <h1 className='h1-relatorios'>Vendas</h1>
              { vendasRelatorios.length > 0 ? <DetalhesCredito array={ vendasRelatorios }/> : <></> }
              <div className='hr-container'>
                <hr/>
              </div>
              { vendasRelatorios.length > 0 ? <GerarRelatorio array={ vendasRelatorios }/> : <></> }
          </div>
          <div className='hr-container'>
              <hr/>
          </div>
          <div className='table-container-relatorios'>
              <h1 className='h1-relatorios'>Créditos</h1>
              { creditosRelatorios.length > 0 ? <DetalhesCredito array={ creditosRelatorios }/> : <></> }
              <div className='hr-container'>
                <hr/>
              </div>
              { creditosRelatorios.length > 0 ? <GerarRelatorio array={ creditosRelatorios } /> : <></> }
              <div className='hr-container'>
                <hr/>
              </div>
          </div>
        </div>
      )
    }
  }

  function handleVoltar(){
    setBuscou(false)
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

    return(
        <div className='appPage app-page-relatorios'>
          <div className='page-relatorios-background'>
            <div className='relatorios-page-container'>
                <h1 className='h1-relatorios'>Relatórios</h1>
                <div className='hr-container'>
                        <hr/>
                    </div>
                <div className='dados-busca-relatorios-container'>
                  <div className='dropdown-container-relatorios'>
                    <DateRangePicker />
                    <SelectPicker />
                  </div>
                  <RadioSelect />
                </div>
                <div className='hr-container'>
                  <hr/>
                </div>
                <div className='btn-relatorios-container'>
                  { buscou ? <button onClick={handleVoltar} className='btn btn-secondary btn-submit btn-page-relatorios'>Voltar</button> : <button onClick={handleSubmit} className='btn btn-primary'>Pesquisar</button>}
                </div>
                <div className='hr-container'>
                  <hr/>
                </div>
                { buscou && <RelatorioRenderer/> }
            </div>
          </div>  
        </div>
    )
}

export default Relatorios