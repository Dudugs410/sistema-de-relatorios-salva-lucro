import { useEffect, useContext, useState, useCallback, useMemo, useRef } from 'react'
import './vendas.scss'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import { FiCalendar } from 'react-icons/fi'
import NewDisplayData from '../../components/Component_NewDisplayData'
import PageShell from '../../components/PageShell'
import TutorialButton from '../../components/TutorialButton'

const Vendas = () =>{
  const location = useLocation()

  const lastProcessedDataRef = useRef(null)
  const lastExportedDataRef = useRef(null)
  const isInitialMountRef = useRef(true)

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
    lastProcessedDataRef.current = null
    lastExportedDataRef.current = null
    setRunTutorial(false)
    
    localStorage.removeItem('reportBandeira')
    localStorage.removeItem('reportAdquirente')
  }

  useEffect(() => {
    return () => {
      localStorage.removeItem('reportBandeira')
      localStorage.removeItem('reportAdquirente')
    }
  }, [])

  useEffect(() => {
    localStorage.removeItem('reportBandeira')
    localStorage.removeItem('reportAdquirente')
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  useEffect(()=>{
    resetValues()
  },[])

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

  const memoizedGroupedData = useMemo(() => {
    if (salesPageArray && salesPageArray.length > 0) {
      return newGroupByAdmin(salesPageArray)
    }
    return []
  }, [salesPageArray, newGroupByAdmin])

  useEffect(() => {
    if (memoizedGroupedData.length > 0 && JSON.stringify(memoizedGroupedData) !== JSON.stringify(salesPageAdminArray)) {
      setSalesPageAdminArray(memoizedGroupedData)
    } else if (memoizedGroupedData.length === 0 && salesPageAdminArray.length > 0) {
      setSalesPageAdminArray([])
    }
  }, [memoizedGroupedData, salesPageAdminArray, setSalesPageAdminArray])

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

  useEffect(() => {
    const currentTotal = salesTotal
    if (currentTotal.debit !== memoizedTotals.debit ||
        currentTotal.credit !== memoizedTotals.credit ||
        currentTotal.voucher !== memoizedTotals.voucher ||
        currentTotal.total !== memoizedTotals.total) {
      setSalesTotal(memoizedTotals)
    }
  }, [memoizedTotals, salesTotal, setSalesTotal])

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

  useEffect(() => {
    if (memoizedExportData.length > 0) {
      const currentData = salesTableData
      const isDataSame = JSON.stringify(currentData) === JSON.stringify(memoizedExportData)
      
      if (!isDataSame) {
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
      
      let adquirenteValue = administradora || ""
      let bandeiraValue = bandeira || ""
      
      if (!adquirenteValue) {
        const savedAdm = localStorage.getItem('reportAdquirente')
        if (savedAdm) {
          try {
            const parsed = JSON.parse(savedAdm)
            adquirenteValue = parsed?.codigoAdquirente || ""
          } catch (e) {}
        }
      }
      
      if (!bandeiraValue) {
        const savedBan = localStorage.getItem('reportBandeira')
        if (savedBan) {
          try {
            const parsed = JSON.parse(savedBan)
            bandeiraValue = parsed?.codigoBandeira || ""
          } catch (e) {}
        }
      }
      
      const filters = {
        adquirente: adquirenteValue,
        bandeira: bandeiraValue,
      }  
      const data = await newLoadSales(startDate, endDate, filters)      
      setSalesPageArray(data)
      
    } catch (error) {
      console.error('Error fetching sales data:', error)
      throw error
    }
  }

  const handleDateRangeChange = (dateRange) => {
    setSalesDateRange(dateRange)
  }

  const [runTutorial, setRunTutorial] = useState(false)
  const [tutorialSteps, setTutorialSteps] = useState([
    {
      target: '[data-tour="bandeiraadquirente-section"]',
      content: 'Selecione os filtros desejados para o relatório.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tour="calendario-section"]',
      content: 'Clique duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
      placement: 'bottom',
    },
  ])

  useEffect(() => {
    if (salesPageArray && salesPageArray.length > 0) {
      const isAjustes = location.pathname === '/servicos';
      
      let newSteps = [];
      
      if (!isAjustes) {
        newSteps.push({
          target: '[data-tour="modalidade-section"]',
          content: 'Valores totais das vendas exibidas, por modalidade.',
          disableBeacon: true,
          placement: 'bottom',
        });
      }
      
      newSteps.push({
        target: '[data-tour="exportacao-section"]',
        content: 'Exporta as vendas sendo exibidas para os formatos Excel ou PDF.',
        placement: 'bottom',
      });
      
      newSteps.push({
        target: '[data-tour="tabelavendas-section"]',
        content: 'Vendas do período selecionado. Podem ser filtradas por bandeira/adquirente.',
        placement: 'bottom',
      });
      
      if (!isAjustes) {
        newSteps.push({
          target: '[data-tour="totaladq-section"]',
          content: 'Valores totais das vendas sendo exibidas, separadas por adquirente.',
          placement: 'bottom',
        });
      }
      
      newSteps.push({
        target: '[data-tour="botaovoltar-section"]',
        content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
        placement: 'bottom',
      });
      
      setTutorialSteps(newSteps);
    } else {
      setTutorialSteps([
        {
          target: '[data-tour="bandeiraadquirente-section"]',
          content: 'Selecione os filtros desejados para o relatório.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '[data-tour="calendario-section"]',
          content: 'Clique duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '[data-tour="pesquisar-section"]',
          content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
          placement: 'bottom',
        },
      ]);
    }
  }, [salesPageArray, location.pathname]);

  const handleTutorialEnd = () => {
    setRunTutorial(false)
  }

  return(
    <PageShell title='Calendário de Vendas'>
        {salesPageArray !== null ? (
          salesPageArray.length > 0 ? (
            <NewDisplayData
              dataArray={salesPageArray}
              adminDataArray={salesPageAdminArray}
              totals={salesTotal}
              onGoBack={resetValues}
              setRunTutorial={setRunTutorial}
              location={location}
              runTutorial={runTutorial}
              tutorialSteps={tutorialSteps}
              listaBandeiras={listaBandeiras}
              listaAdministradoras={listaAdministradoras}
              showSelects={false}
            />
          ) : (
            <>
              <NewDisplayData
                dataArray={[]}
                adminDataArray={[]}
                totals={null}
                onGoBack={resetValues}
                setRunTutorial={setRunTutorial}
                location={location}
                runTutorial={runTutorial}
                tutorialSteps={tutorialSteps}
                listaBandeiras={listaBandeiras}
                listaAdministradoras={listaAdministradoras}
                showSelects={true}
                onSearch={handleLoadData}
                isSearching={btnDisabledSales}
              />
              <div data-tour="calendario-section">
                <MyCalendar
                  onLoadData={handleLoadData}
                  getCalendarDate={handleDateRangeChange}
                  btnDisabled={btnDisabledSales}
                />
              </div>
            </>
          )
        ) : null }
        <>
          <TutorialButton onStart={() => {
              setRunTutorial(false);
              setTimeout(() => {
                setRunTutorial(true);
              }, 50);
            }} />
        </>
    </PageShell>
  )
}

export default Vendas