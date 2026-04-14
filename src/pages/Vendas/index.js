import { useEffect, useContext, useState } from 'react'
import Select from 'react-select'
import './vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'
import { FiCalendar, FiHelpCircle } from 'react-icons/fi'
import Teste from '../../components/000_ComponenteTeste'

const Vendas = () =>{
  const location = useLocation()

  const resetValues = () => {
    setSalesPageArray([])
    setSalesPageAdminArray([])
    setBtnDisabledSales(false)
    setSalesTotal({
      debit: 0,
      credit: 0,
      voucher: 0,
      total: 0
    })
    salesTableData.length = 0
  }

  useEffect(()=>{
    resetValues()
  },[])

  useEffect(() => {
      localStorage.setItem('currentPath', location.pathname)
  }, [location])

  const [bandeira, setBandeira] = useState(null)
  const [administradora, setAdministradora] = useState(null)

  const [listaBandeiras, setListaBandeiras] = useState([])
  const [listaAdministradoras, setListaAdministradoras] = useState([])

  useEffect(()=>{
    const inicializar = async () =>{
      setListaBandeiras(await loadBanners())
      setListaAdministradoras(await loadAdmins())
    }
    inicializar()
  },[])

  useEffect(()=>{
    if(listaBandeiras.length>0){
      console.log('bandeiras: ', listaBandeiras)
    }
  },[listaBandeiras])

  useEffect(()=>{
    if(listaAdministradoras.length>0){
      console.log('administradoras: ', listaAdministradoras)
    }
  },[listaAdministradoras])

  const handleAdmin = (option) => {
    console.log('executou função', option)
    setAdministradora(option?.codigoAdquirente || null)
    localStorage.setItem('selectedAdm', JSON.stringify(option)) 
  }

  const handleBan = (option) => {
    console.log('executou função', option)
    setBandeira(option?.codigoBandeira || null)
    localStorage.setItem('selectedBan', JSON.stringify(option)) 
  }

  const {
    salesPageArray, setSalesPageArray,
    salesPageAdminArray, setSalesPageAdminArray,
    salesDateRange, setSalesDateRange,
    loadSales, loadTotalSales, salesTotal, setSalesTotal, salesTableData,
    btnDisabledSales, setBtnDisabledSales,
    groupByAdmin, loadBanners, loadAdmins,
    exportSales, 
    isCheckedCalendar, setIsCheckedCalendar,
    
  } = useContext(AuthContext)

  useEffect(()=>{
    if(salesPageArray && salesPageArray.length > 0){
      setSalesPageAdminArray(groupByAdmin(salesPageArray))
      loadTotalSales(salesPageArray)
    } else if (salesPageArray === null) {
      handleResetOnError()
    }
  },[salesPageArray])

  const handleResetOnError = () => {
    resetValues()
    toast.error('Ocorreu um erro ao carregar os dados de vendas. A página foi redefinida.')
  }

  async function handleLoadData(e) {
    e.preventDefault()
    try {
      setBtnDisabledSales(true)
      toast.dismiss()
      await toast.promise(loadData(), {
        pending: 'Carregando...',
      })
      setBtnDisabledSales(false)
    } catch (error) {
      setBtnDisabledSales(false)
      console.error('Error handling busca:', error)
      handleResetOnError()
    }
  }

  async function loadData() {
    try {
      const data = await loadSales(salesDateRange[0].toLocaleDateString('pt-BR'), salesDateRange[1].toLocaleDateString('pt-BR'))
      setSalesPageArray(data)
    } catch (error) {
      console.error('Error fetching sales data:', error)
      throw error
    }
  }

  useEffect(()=>{
    if(salesPageArray && salesPageArray.length > 0){
      exportSales(salesPageArray)
    }
  },[salesPageArray, localStorage.getItem('currentPath')])

  const handleDateRangeChange = (dateRange) => {
    setSalesDateRange(dateRange)
  }

  const CustomCheckbox = ({ isChecked, handleCheckboxChange }) => {
    return (
        <label className="checkbox-label">
          <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className='checkbox-input'
          />
          <span className='checkbox-custom'></span>
          <span className='checkbox-icon'>
              <FiCalendar className={`calendar-icon ${isCheckedCalendar ? 'isCheckedCalendar' : ''}`} size={20} />
          </span>
        </label>
    )
}

const handleCheckboxChangeCalendar = () => {
  setIsCheckedCalendar(!isCheckedCalendar)
  }

  const [runTutorial, setRunTutorial] = useState(false)
  const [steps, setSteps] = useState([
    {
      target: '[data-tour="calendario-section"]',
      content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
      placement: 'center',
    },
  ])

    useEffect(()=>{
      if(salesPageArray.length > 0){
        let stepsTemp = [
            {
              target: '[data-tour="modalidade-section"]',
              content: 'Valores totais das vendas exibidas, por modalidade.',
              disableBeacon: true,
              placement: 'bottom',
            },
            {
              target: '[data-tour="exportacao-section"]',
              content: 'Exporta as vendas sendo exibidas para os formatos Excel ou PDF.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="bandeiraadquirente-section"]',
              content: 'Filtra as vendas de acordo com a combinação de bandeira/adquirente selecionada.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="tabelavendas-section"]',
              content: 'Vendas do período selecionado. Podem ser filtradas por bandeira/adquirente.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="totaladq-section"]',
              content: 'Valores totais das vendas sendo exibidas, separadas por adquirente.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="botaovoltar-section"]',
              content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
              placement: 'bottom',
            },
        ]
        setSteps(stepsTemp)
      } else {
        setSteps([
          {
            target: '[data-tour="calendario-section"]',
            content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
            disableBeacon: true,
            placement: 'center',
          },
          {
            target: '[data-tour="pesquisar-section"]',
            content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
            placement: 'center',
          },
        ])
      }
    },[salesPageArray])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
    if (salesPageArray.length > 0){

    } else{
    
    }
  }

  // Get the selected option object for Adquirente
  const getSelectedAdminOption = () => {
    if (!administradora || listaAdministradoras.length === 0) return null
    return listaAdministradoras.find(option => option.codigoAdquirente === administradora)
  }

  // Get the selected option object for Bandeira
  const getSelectedBanOption = () => {
    if (!bandeira || listaBandeiras.length === 0) return null
    return listaBandeiras.find(option => option.codigoBandeira === bandeira)
  }

  return(
    <div className='appPage'>
      <div className='page-background-global'>
        <div className='page-content-global'>
          <div className='vendas-title-container'>
            <h1 className='vendas-title'>Calendário de Vendas</h1>
          </div>
          <hr className='hr-global'/>
          <div data-tour="calendario-section" className='component-container-vendas'>
              { runTutorial &&
                <Joyride
                  steps={steps}
                  run={runTutorial}
                  continuous={true}
                  scrollToFirstStep={false}
                  showProgress={true}
                  showSkipButton={true}
                  scrollOffset={80}
                  styles={{
                    options: {
                      primaryColor: '#99cc33',
                      textColor: '#0a3d70',
                      zIndex: 10000,
                    },
                  }}
                  callback={(data) => {
                    if (data.status === 'finished' || data.status === 'skipped') {
                      handleTutorialEnd()
                    }
                  }}
                  locale={{
                    back: 'Voltar',
                    close: 'Fechar',
                    last: 'Finalizar',
                    next: 'Próximo',
                    skip: 'Pular',
                    nextLabelWithProgress: 'Próximo ({step} de {steps})',
                  }}
                />	
              }
            {salesPageArray !== null ? (
              salesPageArray.length > 0 ? (
                <>
                  <DisplayData
                    dataArray={salesPageArray}
                    adminDataArray={salesPageAdminArray}
                    totals={salesTotal}
                    onGoBack={resetValues}
                    setRunTutorial={setRunTutorial}
                    location={location}
                  />
                  <Teste/>
                </>
                ) : (
                  <>
                    <div className='select-container-calendario'>
                      <div className='select-wrapper'>
                        <h5>Adquirente</h5>
                        <Select 
                          className='seletor-adq-select fixed-width-select' 
                          id='adquirente'
                          options={listaAdministradoras}
                          getOptionLabel={(option) => option.nomeAdquirente}
                          getOptionValue={(option) => option.codigoAdquirente}
                          onChange={(option) => handleAdmin(option)}
                          value={getSelectedAdminOption()}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          placeholder="Selecione uma adquirente..."
                          isClearable={true}
                          styles={{
                            control: (base) => ({
                              ...base,
                              minWidth: 250,
                              width: '100%',
                            }),
                            menu: (base) => ({
                              ...base,
                              minWidth: 250,
                              width: '100%',
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }),
                            singleValue: (base) => ({
                              ...base,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '90%',
                            }),
                          }}
                        />
                      </div>
                      <div className='select-wrapper'>
                        <h5>Bandeira</h5>
                        <Select 
                          className='seletor-adq-select fixed-width-select' 
                          id='bandeira'
                          options={listaBandeiras}
                          getOptionLabel={(option) => option.descricaoBandeira}
                          getOptionValue={(option) => option.codigoBandeira}
                          onChange={(option) => handleBan(option)}
                          value={getSelectedBanOption()}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          placeholder="Selecione uma bandeira..."
                          isClearable={true}
                          styles={{
                            control: (base) => ({
                              ...base,
                              minWidth: 250,
                              width: '100%',
                            }),
                            menu: (base) => ({
                              ...base,
                              minWidth: 250,
                              width: '100%',
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }),
                            singleValue: (base) => ({
                              ...base,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '90%',
                            }),
                          }}
                        />
                      </div>
                    </div>
                    <MyCalendar
                      onLoadData={handleLoadData}
                      getCalendarDate={handleDateRangeChange}
                      btnDisabled={btnDisabledSales}
                    />
                  </>
                )
              ) : null }
              <>
                <button 
                className='btn btn-success-dados btn-tutorial px-2 py-1'
                    onClick={() => setRunTutorial(true)}
                    style={{
                    position: 'relative',
                    bottom: '0px',
                    right: '-10px',
                    zIndex: 10,
                    padding: '10px 15px',
                    background: 'none',
                    color: '#99cc33',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                    }}
                >
                <FiHelpCircle />
                </button>
                <Teste/>
              </>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vendas