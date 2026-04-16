import { useEffect, useContext, useState, useCallback, useMemo, useRef } from 'react'
import Select from 'react-select'
import './vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import { FiCalendar, FiHelpCircle } from 'react-icons/fi'
import Teste from '../../components/000_ComponenteTeste'
import NewDisplayData from '../../components/Component_NewDisplayData'

const Vendas = () =>{
  const location = useLocation()

  // Refs to track data changes and prevent infinite loops
  const lastProcessedDataRef = useRef(null)
  const lastExportedDataRef = useRef(null)
  const isInitialMountRef = useRef(true)

  const resetValues = () => {
    setBandeira(null)
    setAdministradora(null)
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
    lastProcessedDataRef.current = null
    lastExportedDataRef.current = null
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
    newLoadSales,
    salesTotal, setSalesTotal, salesTableData, setSalesTableData,
    btnDisabledSales, setBtnDisabledSales,
    newGroupByAdmin,
    loadBanners, loadAdmins,
    exportSales, 
    isCheckedCalendar, setIsCheckedCalendar,
  } = useContext(AuthContext)

  // Memoize the grouped data to prevent recreation on every render
  const memoizedGroupedData = useMemo(() => {
    if (salesPageArray && salesPageArray.length > 0) {
      console.log('Computing grouped data...')
      return newGroupByAdmin(salesPageArray)
    }
    return []
  }, [salesPageArray, newGroupByAdmin])

  // Update admin array only when memoized value changes
  useEffect(() => {
    if (memoizedGroupedData.length > 0 && JSON.stringify(memoizedGroupedData) !== JSON.stringify(salesPageAdminArray)) {
      console.log('Setting salesPageAdminArray:', memoizedGroupedData.length)
      setSalesPageAdminArray(memoizedGroupedData)
    } else if (memoizedGroupedData.length === 0 && salesPageAdminArray.length > 0) {
      setSalesPageAdminArray([])
    }
  }, [memoizedGroupedData, salesPageAdminArray, setSalesPageAdminArray])

  // Memoize the totals calculation to prevent unnecessary updates
  const memoizedTotals = useMemo(() => {
    if (!salesPageArray || salesPageArray.length === 0) {
      return { debit: 0, credit: 0, voucher: 0, total: 0 }
    }
    
    let totalCredito = 0
    let totalDebito = 0
    let totalVoucher = 0
    let totalGeral = 0
    
    salesPageArray.forEach(sale => {
      const valor = sale.VALORBRUTO || 0
      const produto = (sale.PRODUTO || "").trim()
      
      totalGeral += valor
      
      if (produto === 'Crédito') {
        totalCredito += valor
      } else if (produto === 'Débito') {
        totalDebito += valor
      } else {
        totalVoucher += valor
      }
    })
    
    return {
      debit: totalDebito,
      credit: totalCredito,
      voucher: totalVoucher,
      total: totalGeral
    }
  }, [salesPageArray])

  // Update sales total when memoized values change
  useEffect(() => {
    const currentTotal = salesTotal
    if (currentTotal.debit !== memoizedTotals.debit ||
        currentTotal.credit !== memoizedTotals.credit ||
        currentTotal.voucher !== memoizedTotals.voucher ||
        currentTotal.total !== memoizedTotals.total) {
      console.log('Updating sales total:', memoizedTotals)
      setSalesTotal(memoizedTotals)
    }
  }, [memoizedTotals, salesTotal, setSalesTotal])

  // Memoize the transformed data for export to prevent unnecessary transformations
  const memoizedExportData = useMemo(() => {
    if (!salesPageArray || salesPageArray.length === 0) return []
    
    const isNewApiData = salesPageArray[0] && salesPageArray[0].CNPJ !== undefined
    
    if (isNewApiData) {
      return salesPageArray.map((item) => ({
        cnpj: item.CNPJ || '',
        razaosocial: item.RAZAOSOCIAL || '',
        numeroPV: item.NUMEROPV || '',
        adquirente: {
          codigoAdquirente: null,
          nomeAdquirente: item.ADMINISTRADORA || ''
        },
        produto: {
          codigoProduto: null,
          descricaoProduto: (item.PRODUTO || '').trim()
        },
        bandeira: {
          codigoBandeira: null,
          descricaoBandeira: item.BANDEIRA || ''
        },
        modalidade: {
          codigoModalidade: null,
          descricaoModalidade: item.MODALIDADE || ''
        },
        valorBruto: item.VALORBRUTO || 0,
        valorLiquido: item.VALORLIQUIDO || 0,
        valorDesconto: item.DESCONTO || 0,
        taxa: item.TAXA || 0,
        dataVenda: item.DATAVENDA || '',
        dataCredito: item.DATACREDITO || '',
        horaVenda: item.HORAVENDA || '',
        nsu: item.NSU || '',
        cartao: item.CARTAO || '',
        codigoAutorizacao: item.AUTORIZACAO || '',
        quantidadeParcelas: parseInt(item.PARCELA) || 0,
        status: item.STATUS || '',
        ro: item.RO || ''
      }))
    }
    
    return salesPageArray
  }, [salesPageArray])

  // Update sales table data when memoized export data changes
  useEffect(() => {
    if (memoizedExportData.length > 0) {
      const currentData = salesTableData
      const isDataSame = JSON.stringify(currentData) === JSON.stringify(memoizedExportData)
      
      if (!isDataSame) {
        console.log('Updating salesTableData:', memoizedExportData.length, 'records')
        setSalesTableData(memoizedExportData)
      }
    } else if (memoizedExportData.length === 0 && salesTableData.length > 0) {
      setSalesTableData([])
    }
  }, [memoizedExportData, salesTableData, setSalesTableData])

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
        pending: 'Carregando vendas...',
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
      const startDate = salesDateRange[0]
      const endDate = salesDateRange[1]
      
      const filters = {
        adquirente: administradora || "",
        bandeira: bandeira || "",
      }
      
      console.log('Calling newLoadSales with:', { startDate, endDate, filters })
      
      const data = await newLoadSales(startDate, endDate, filters)
      
      console.log('Data returned from newLoadSales:', data?.length, 'records')
      
      setSalesPageArray(data)
    } catch (error) {
      console.error('Error fetching sales data:', error)
      throw error
    }
  }

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

  useEffect(() => {
    if (salesPageArray && salesPageArray.length > 0) {
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
  }, [salesPageArray])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
  }

  const getSelectedAdminOption = () => {
    if (!administradora || listaAdministradoras.length === 0) return null
    return listaAdministradoras.find(option => option.codigoAdquirente === administradora)
  }

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
                  <NewDisplayData
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