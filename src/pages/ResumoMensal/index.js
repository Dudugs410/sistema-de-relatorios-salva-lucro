import { useEffect, useContext, useState, useCallback } from 'react'
import Select from 'react-select'
import Joyride from 'react-joyride'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiFilePlus } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import MyCalendar from '../../components/Componente_Calendario'
import api from '../../services/api'
import { getThemeColor } from '../../util/contextUtils'
import { formatDateToYYYYMMDD } from '../../util/formatters'
import '../Vendas/vendas.scss'
import '../../index.scss'
import PageShell from '../../components/PageShell'
import TutorialButton from '../../components/TutorialButton'
import { selectStyles, selectTheme } from '../../util/selectStyles'

const SELECTED_ADM_KEY = 'selectedAdmCredits'
const SELECTED_BAN_KEY = 'selectedBanCredits'


const TUTORIAL_STEPS = [
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
    target: '[data-tour="exportacao-section"]',
    content: 'Gera o relatório gerencial do período selecionado em PDF.',
    placement: 'bottom',
  },
]

const readStoredJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

const resolveClients = () => {
  const cliente = readStoredJSON('selectedClientBody')
  const grupo = readStoredJSON('selectedGroupBody')
  if (cliente?.label === 'TODOS') {
    return (grupo?.clients?.map((client) => client.CODIGOCLIENTE) || []).join(', ')
  }
  if (cliente?.cod) return String(cliente.cod)
  if (cliente?.value) return String(cliente.value)
  const cnpj = localStorage.getItem('cnpj')
  return cnpj === 'todos' ? String(localStorage.getItem('groupCode')) : String(cnpj)
}

const buildFileName = (dataInicial, dataFinal) => {
  const dateRangeStr = dataInicial === dataFinal ? dataInicial : `${dataInicial}_a_${dataFinal}`
  const groupName = readStoredJSON('selectedGroupBody')?.label || localStorage.getItem('clientName') || ''
  const cliente = readStoredJSON('selectedClientBody')
  const clientPart = cliente?.label === 'TODOS'
    ? 'TODAS_FILIAIS'
    : cliente?.label || localStorage.getItem('clientName') || ''
  return `Relatório_Gerencial_${groupName}_${clientPart}_${dateRangeStr}.pdf`
}

const downloadBase64Pdf = (base64, fileName) => {
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const ResumoMensal = () => {
  const location = useLocation()
  const { loadAdmins, loadBanners, creditsDateRange, setCreditsDateRange } = useContext(AuthContext)

  const [bandeira, setBandeira] = useState(null)
  const [administradora, setAdministradora] = useState(null)
  const [dateRange, setDateRange] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [listaBandeiras, setListaBandeiras] = useState([])
  const [listaAdministradoras, setListaAdministradoras] = useState([])
  const [runTutorial, setRunTutorial] = useState(false)

  const resetValues = useCallback(() => {
    setAdministradora(null)
    setBandeira(null)
    setDateRange(null)
    localStorage.removeItem(SELECTED_ADM_KEY)
    localStorage.removeItem(SELECTED_BAN_KEY)
  }, [])

  useEffect(() => {
    resetValues()
  }, [resetValues])

  useEffect(() => {
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  useEffect(() => {
    const inicializar = async () => {
      setListaBandeiras((await loadBanners()) || [])
      setListaAdministradoras((await loadAdmins()) || [])
    }
    inicializar()
  }, [loadAdmins, loadBanners])

  const handleAdmin = (option) => {
    setAdministradora(option?.codigoAdquirente || null)
    localStorage.setItem(SELECTED_ADM_KEY, JSON.stringify(option))
  }

  const handleBan = (option) => {
    setBandeira(option?.codigoBandeira || null)
    localStorage.setItem(SELECTED_BAN_KEY, JSON.stringify(option))
  }

  const handleDateRangeChange = (range) => {
    setDateRange(range)
    setCreditsDateRange(range)
  }

  const getPeriod = () => {
    const range = dateRange?.length === 2 ? dateRange : creditsDateRange
    if (!range || range.length !== 2) return ['', '']
    return [formatDateToYYYYMMDD(range[0]), formatDateToYYYYMMDD(range[1])]
  }

  const handlePDFDownload = async () => {
    const [dataInicial, dataFinal] = getPeriod()
    if (!dataInicial || !dataFinal) {
      toast.warning('Selecione uma data ou período')
      return
    }

    setDownloading(true)
    try {
      const response = await api.post('relatorios/detalhado', {
        dataInicial,
        dataFinal,
        clientes: resolveClients(),
        nomeGrupo: readStoredJSON('selectedGroupBody')?.label || localStorage.getItem('clientName') || '',
        bandeira: readStoredJSON(SELECTED_BAN_KEY)?.codigoBandeira || '',
        adquirente: readStoredJSON(SELECTED_ADM_KEY)?.codigoAdquirente || '',
        produto: '',
        modalidade: '',
        arquivo: 'PDF',
        modelo: 'RESUMO',
      })

      if (response.data.success === true && response.data.formato === 'PDF') {
        downloadBase64Pdf(response.data.base64, buildFileName(dataInicial, dataFinal))
        toast.success('PDF baixado com sucesso!')
      } else {
        console.error('API returned unsuccessful response:', response.data)
        toast.error(response.data.mensagem || 'Erro ao gerar o relatório em PDF')
      }
    } catch (err) {
      console.error('Error downloading PDF report:', err)
      toast.error(err.response?.data?.mensagem || err.message || 'Erro ao gerar o relatório em PDF')
    } finally {
      setDownloading(false)
    }
  }

  const selectedAdminOption = listaAdministradoras.find((option) => option.codigoAdquirente === administradora) || null
  const selectedBanOption = listaBandeiras.find((option) => option.codigoBandeira === bandeira) || null

  const startTutorial = () => {
    setRunTutorial(false)
    setTimeout(() => setRunTutorial(true), 50)
  }

  return (
    <PageShell title='Resumo Mensal'>
        {runTutorial && (
          <Joyride
            steps={TUTORIAL_STEPS}
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

        <div className='page-filters' data-tour="bandeiraadquirente-section">
          <div className='page-filter'>
            <h5 className='page-filter__label'>Adquirente</h5>
            <Select
              className='seletor-adq-select fixed-width-select'
              id='adquirente'
              options={listaAdministradoras}
              getOptionLabel={(option) => option.nomeAdquirente}
              getOptionValue={(option) => option.codigoAdquirente}
              onChange={handleAdmin}
              value={selectedAdminOption}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              placeholder="Selecione uma adquirente..."
              isClearable={true}
              styles={selectStyles}
              theme={selectTheme}
              isDisabled={downloading}
            />
          </div>
          <div className='page-filter'>
            <h5 className='page-filter__label'>Bandeira</h5>
            <Select
              className='seletor-adq-select fixed-width-select'
              id='bandeira'
              options={listaBandeiras}
              getOptionLabel={(option) => option.descricaoBandeira}
              getOptionValue={(option) => option.codigoBandeira}
              onChange={handleBan}
              value={selectedBanOption}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              placeholder="Selecione uma bandeira..."
              isClearable={true}
              styles={selectStyles}
              theme={selectTheme}
              isDisabled={downloading}
            />
          </div>
        </div>

        <div data-tour="calendario-section">
          <MyCalendar getCalendarDate={handleDateRangeChange} />
        </div>

        <div data-tour="exportacao-section" className='export-area'>
          <div className='export-column'>
            <button
              className='btn btn-exportar btn-exportar-pdf'
              onClick={handlePDFDownload}
              disabled={downloading}
            >
              {downloading ? 'Gerando PDF...' : 'Download PDF'} <FiFilePlus />
            </button>
          </div>
        </div>
        <hr className='hr-global'/>

        <TutorialButton onStart={startTutorial} />
    </PageShell>
  )
}

export default ResumoMensal
