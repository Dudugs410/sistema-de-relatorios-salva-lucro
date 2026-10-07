import { useEffect, useContext, useState, useCallback, useMemo } from 'react'
import Select from 'react-select'
import { useLocation } from 'react-router-dom'
import Joyride from 'react-joyride'
import { toast } from 'react-toastify'
import { FiUser } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import MyCalendar from '../../components/Componente_Calendario'
import NewDisplayData from '../../components/Component_NewDisplayData'
import api from '../../services/api'
import { getThemeColor } from '../../util/contextUtils'
import { formatDateToYYYYMMDD } from '../../util/formatters'
import '../../styles/global.scss'
import './OpenFinance.scss'
import PageShell from '../../components/PageShell'
import TutorialButton from '../../components/TutorialButton'
import { selectStyles, selectTheme } from '../../util/selectStyles'

const toNumber = (value) => Number(value) || 0

const formatCurrency = (value) =>
  toNumber(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDateOnly = (isoDate) => {
  if (!isoDate || typeof isoDate !== 'string') return 'N/A'
  const [year, month, day] = isoDate.split('T')[0].split('-')
  return year && month && day ? `${day}/${month}/${year}` : isoDate
}

const formatCNPJ = (cnpj) => {
  if (!cnpj) return 'N/A'
  const cleaned = cnpj.replace(/\D/g, '')
  return cleaned.length === 14
    ? cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    : cnpj
}

const orNA = (value) => (value === undefined || value === null || value === '' ? 'N/A' : value)

const OPERATION_LABELS = { 1: 'Crédito', '-1': 'Débito' }
const getOperationLabel = (item) => OPERATION_LABELS[item?.Operação] || 'Outros'

const EMPTY_TOTALS = { total: 0, income: 0, expense: 0, count: 0 }

const SELECTED_CLIENT_KEY = 'selectedOFClient'
const SELECTED_BANK_KEY = 'selectedOFBank'

const readStoredJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

const BASE_TUTORIAL_STEPS = [
  {
    target: '[data-tour="cliente-section"]',
    content: 'Selecione o cliente/filial desejado para consultar o extrato.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="banco-section"]',
    content: 'Selecione o banco desejado para consultar o extrato.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="calendario-section"]',
    content: 'Selecione o período desejado para consulta.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="pesquisar-section"]',
    content: 'Clique em "Pesquisar" para realizar a consulta do extrato bancário.',
    placement: 'bottom',
  },
]

const RESULT_TUTORIAL_STEPS = [
  {
    target: '[data-tour="totals-section"]',
    content: 'Resumo dos valores totais do extrato.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="tabela-section"]',
    content: 'Extrato bancário com todas as transações do período selecionado.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="botaovoltar-section"]',
    content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
    placement: 'bottom',
  },
]

const TABLE_COLUMNS = [
  { key: 'Data', header: 'Data', accessor: (item) => formatDateOnly(item?.Data) },
  { key: 'Descrição', header: 'Descrição', accessor: (item) => orNA(item?.Descrição) },
  {
    key: 'Valor',
    header: 'Valor',
    render: (item) => {
      const valor = toNumber(item?.Valor)
      return <span className={valor >= 0 ? 'extrato-valor-positivo' : 'extrato-valor-negativo'}>{formatCurrency(valor)}</span>
    },
  },
  { key: 'Categoria', header: 'Categoria', accessor: (item) => orNA(item?.Categoria) },
  { key: 'Operação', header: 'Operação', render: getOperationLabel },
  { key: 'CnpjPagador', header: 'CNPJ Pagador', render: (item) => formatCNPJ(item?.CnpjPagador) },
  { key: 'NomePagador', header: 'Pagador', accessor: (item) => orNA(item?.NomePagador) },
  { key: 'CnpjRecebedor', header: 'CNPJ Recebedor', render: (item) => formatCNPJ(item?.CnpjRecebedor) },
  { key: 'NomeRecebedor', header: 'Recebedor', accessor: (item) => orNA(item?.NomeRecebedor) },
  { key: 'Complemento', header: 'Complemento', accessor: (item) => orNA(item?.Complemento) },
]

const FILTER_CONFIG = {
  categoria: { label: 'Categoria', accessor: (item) => orNA(item?.Categoria) },
  operacao: { label: 'Operação', accessor: getOperationLabel },
}



const formatClientOptionLabel = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <FiUser size={16} />
    <span>{label}</span>
  </div>
)

const buildClientOptions = () => {
  const groups = readStoredJSON('groupsStorage') || []
  const clients = new Map()
  groups.forEach((group) => {
    (group.CLIENTES || []).forEach((client) => {
      if (!clients.has(client.CNPJ)) {
        clients.set(client.CNPJ, {
          value: client.CNPJ,
          label: client.NOMECLIENTE,
          cod: client.CODIGOCLIENTE,
          groupName: group.NOMEGRUPO,
        })
      }
    })
  })
  return [...clients.values()].sort((a, b) => a.label.localeCompare(b.label))
}

const toBankOption = (bank) => ({
  value: String(bank.CODIGO),
  label: String(bank.NOME || bank.NOMECEDENTE || bank.CODIGOBANCO || 'Banco sem nome'),
})

const summarize = (rows) =>
  rows.reduce(
    (totals, item) => {
      totals.total += item.Valor
      if (item.Operação === 1) totals.income += item.Valor
      else if (item.Operação === -1) totals.expense += Math.abs(item.Valor)
      return totals
    },
    { ...EMPTY_TOTALS, count: rows.length }
  )

const OpenFinance = () => {
  const location = useLocation()
  const { loadBanks } = useContext(AuthContext)

  const [clientOptions, setClientOptions] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)

  const [bankOptions, setBankOptions] = useState([])
  const [bankCode, setBankCode] = useState(null)
  const [loadingBanks, setLoadingBanks] = useState(false)

  const [bankData, setBankData] = useState([])
  const [bankDataAdmin, setBankDataAdmin] = useState([])
  const [bankTotal, setBankTotal] = useState(EMPTY_TOTALS)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [dateRange, setDateRange] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [runTutorial, setRunTutorial] = useState(false)

  useEffect(() => {
    const options = buildClientOptions()
    if (options.length === 0) toast.error('Nenhum grupo encontrado')
    setClientOptions(options)
    const saved = readStoredJSON(SELECTED_CLIENT_KEY)
    setSelectedClient(options.find((client) => client.cod === saved?.cod) || null)
  }, [])

  useEffect(() => {
    setBankOptions([])
    setBankCode(null)

    if (!selectedClient?.cod) {
      setLoadingBanks(false)
      localStorage.removeItem(SELECTED_CLIENT_KEY)
      return
    }
    localStorage.setItem(SELECTED_CLIENT_KEY, JSON.stringify(selectedClient))

    let cancelled = false
    const fetchBankOptions = async () => {
      setLoadingBanks(true)
      const banks = (await loadBanks(selectedClient.cod)) || []
      if (cancelled) return

      const options = banks
        .filter((bank) => bank && bank.CODIGO !== undefined && bank.CODIGO !== null)
        .map(toBankOption)
        .sort((a, b) => a.label.localeCompare(b.label))

      setBankOptions(options)
      if (options.length === 0) {
        toast.info('Nenhum banco cadastrado para este cliente')
      } else {
        const saved = readStoredJSON(SELECTED_BANK_KEY)
        setBankCode((options.find((option) => option.value === String(saved?.value)) || options[0]).value)
      }
      setLoadingBanks(false)
    }

    fetchBankOptions()
    return () => {
      cancelled = true
    }
  }, [selectedClient, loadBanks])

  const resetValues = useCallback(() => {
    setBankData([])
    setBankDataAdmin([])
    setBtnDisabled(false)
    setBankTotal(EMPTY_TOTALS)
    setIsDataLoaded(false)
    setRunTutorial(false)
  }, [])

  const handleClientChange = (option) => {
    setSelectedClient(option)
    resetValues()
  }

  const handleBankChange = (option) => {
    setBankCode(option?.value || null)
    if (option) localStorage.setItem(SELECTED_BANK_KEY, JSON.stringify(option))
    else localStorage.removeItem(SELECTED_BANK_KEY)
  }

  const loadBankData = async (e) => {
    if (e) e.preventDefault()

    if (!bankCode) {
      toast.warning('Por favor, selecione um banco')
      return
    }
    if (!dateRange || dateRange.length < 2) {
      toast.warning('Por favor, selecione um período')
      return
    }

    const bankName = bankOptions.find((option) => option.value === bankCode)?.label || 'Banco não informado'

    setBtnDisabled(true)
    toast.dismiss()
    const loadingToastId = toast.loading('Carregando dados bancários...')

    try {
      const response = await api.get('/ExtratoBancario', {
        params: {
          codigoBanco: bankCode,
          DataInicial: formatDateToYYYYMMDD(dateRange[0]),
          DataFinal: formatDateToYYYYMMDD(dateRange[1]),
        },
      })
      toast.dismiss(loadingToastId)

      const data = Array.isArray(response.data) ? response.data : []
      if (data.length === 0) {
        toast.info('Não há dados para o período/banco selecionados')
        return
      }

      const rows = data.map((item) => ({
        ...item,
        Valor: toNumber(item.Valor),
        DataFormatada: formatDateOnly(item.Data),
        ValorFormatado: formatCurrency(item.Valor),
        CategoriaDisplay: orNA(item.Categoria),
        CnpjPagadorFormatado: formatCNPJ(item.CnpjPagador),
        CnpjRecebedorFormatado: formatCNPJ(item.CnpjRecebedor),
        OperacaoDisplay: getOperationLabel(item),
        NOMEBANCO: bankName,
        CODIGO: bankCode,
        CLIENTE: selectedClient?.label || 'Cliente não informado',
      }))

      const totals = summarize(rows)
      setBankData(rows)
      setBankTotal(totals)
      setBankDataAdmin([{ adminName: bankName, total: totals.total }])
      setIsDataLoaded(true)
      toast.success(`Dados carregados com sucesso! Encontradas ${rows.length} transações.`)
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.error('Error loading bank data:', error)
      toast.error(error.response?.data?.message || 'Erro ao carregar dados bancários')
    } finally {
      setBtnDisabled(false)
    }
  }

  const selectedBankOption = bankOptions.find((option) => option.value === bankCode) || null

  const tutorialSteps = useMemo(
    () => (bankData.length > 0 ? [...BASE_TUTORIAL_STEPS, ...RESULT_TUTORIAL_STEPS] : BASE_TUTORIAL_STEPS),
    [bankData]
  )

  const startTutorial = () => {
    setRunTutorial(false)
    setTimeout(() => setRunTutorial(true), 50)
  }

  return (
    <PageShell title='Extrato Bancário'>
        {!isDataLoaded ? (
          <>
            {runTutorial && (
              <Joyride
                steps={tutorialSteps}
                run={runTutorial}
                continuous={true}
                scrollToFirstStep={true}
                showProgress={true}
                showSkipButton={true}
                scrollOffset={80}
                disableOverlayClose={true}
                styles={{
                  options: {
                    primaryColor: getThemeColor('--highlight-color', '#99cc33'),
                    textColor: '#0a3d70',
                    zIndex: 10000,
                  },
                }}
                callback={(data) => {
                  if (data.status === 'finished' || data.status === 'skipped') {
                    setRunTutorial(false)
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
            )}

            <div className='page-filters'>
              <div className='page-filter' data-tour="cliente-section">
                <h5 className='page-filter__label'>Cliente / Filial</h5>
                <Select
                  className='seletor-cliente-select fixed-width-select'
                  id='cliente'
                  options={clientOptions}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.cod}
                  onChange={handleClientChange}
                  value={selectedClient}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  placeholder="Selecione um cliente/filial..."
                  isClearable={true}
                  formatOptionLabel={formatClientOptionLabel}
                  styles={selectStyles}
                  theme={selectTheme}
                />
              </div>
              <div className='page-filter' data-tour="banco-section">
                <h5 className='page-filter__label'>Banco</h5>
                <Select
                  className='seletor-banco-select fixed-width-select'
                  id='banco'
                  options={bankOptions}
                  onChange={handleBankChange}
                  value={selectedBankOption}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  placeholder={!selectedClient ? 'Selecione um cliente primeiro' : loadingBanks ? 'Carregando bancos...' : 'Selecione um banco...'}
                  isClearable={true}
                  isLoading={loadingBanks}
                  isDisabled={!selectedClient || loadingBanks}
                  styles={selectStyles}
                  theme={selectTheme}
                />
              </div>
            </div>

            <div data-tour="calendario-section">
              <MyCalendar
                onLoadData={loadBankData}
                getCalendarDate={setDateRange}
                btnDisabled={btnDisabled || loadingBanks || !bankCode || !selectedClient}
                customButtonText="Pesquisar"
              />
            </div>

            <TutorialButton onStart={startTutorial} />
          </>
        ) : (
          <NewDisplayData
            dataArray={bankData}
            adminDataArray={bankDataAdmin}
            totals={bankTotal}
            onGoBack={resetValues}
            setRunTutorial={setRunTutorial}
            location={location}
            runTutorial={runTutorial}
            tutorialSteps={tutorialSteps}
            hideTotals={false}
            hideTables={false}
            customTableColumns={TABLE_COLUMNS}
            customFilterConfig={FILTER_CONFIG}
            customExportPage="openfinance"
          />
        )}
        <hr className='hr-global'/>
    </PageShell>
  )
}

export default OpenFinance
