import { useEffect, useContext, useState } from 'react'
import Select from 'react-select'
import '../Vendas/vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'
import { FiHelpCircle } from 'react-icons/fi'

const Creditos = () =>{
	const location = useLocation()

  const resetValues = () => {
    setCreditsPageArray([])
    setCreditsPageAdminArray([])
    setBtnDisabledCredits(false)
    setCreditsTotal({
      debit: 0,
      credit: 0,
      voucher: 0,
      total: 0
    })
    creditsTableData.length = 0
    // Clear select states
    setAdministradora(null)
    setBandeira(null)
    // Clear localStorage items
    localStorage.removeItem('selectedAdmCredits')
    localStorage.removeItem('selectedBanCredits')
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
      localStorage.setItem('selectedAdmCredits', JSON.stringify(option))
    }
  
    const handleBan = (option) => {
      console.log('executou função', option)
      setBandeira(option?.codigoBandeira || null)
      localStorage.setItem('selectedBanCredits', JSON.stringify(option))
    }
  
	const {
	  creditsPageArray, setCreditsPageArray,
	  creditsPageAdminArray, setCreditsPageAdminArray,
	  creditsDateRange, setCreditsDateRange,
	  loadCredits, loadTotalCredits, creditsTotal, setCreditsTotal, tableData,
	  groupByAdmin, loadAdmins, loadBanners,
    btnDisabledCredits, setBtnDisabledCredits,
    exportCredits, creditsTableData,
	} = useContext(AuthContext)
  

	useEffect(()=>{
		if(creditsPageArray.length>0){
		  setCreditsPageAdminArray(groupByAdmin(creditsPageArray))
		  loadTotalCredits(creditsPageArray)
		}
	  },[creditsPageArray])

async function handleLoadData(e) {
  e.preventDefault()
  try {
    setBtnDisabledCredits(true)
    toast.dismiss()
    await toast.promise(loadData(), {
      pending: 'Carregando...',
    })
    setBtnDisabledCredits(false)
  } catch (error) {
    console.error('Error handling busca:', error)
    toast.dismiss()
    toast.error('Ocorreu um Erro')
    setBtnDisabledCredits(false)
  }
}

async function loadData() {
  try {
    const creditsData = await loadCredits(creditsDateRange[0].toLocaleDateString('pt-BR'), creditsDateRange[1].toLocaleDateString('pt-BR'))
    setCreditsPageArray(creditsData)
    return creditsData
  } catch (error) {
    console.error('Error fetching credits data:', error)
    throw error
  }
}

  useEffect(()=>{
    if(creditsPageArray.length > 0){
      exportCredits(creditsPageArray)
    }
  },[creditsPageArray, localStorage.getItem('currentPath')])

  const handleDateRangeChange = (dateRange) => {
    setCreditsDateRange(dateRange)
  }

  const handleGoBack = () => {
	  resetValues()
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

    // Joyride state
  
    const [runTutorial, setRunTutorial] = useState(false)
    const [steps, setSteps] = useState([
      {
        target: '[data-tour="calendario-section"]',
        content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
        disableBeacon: true,
        placement: 'bottom'
      },
      {
        target: '[data-tour="pesquisar-section"]',
        content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
        placement: 'bottom'
      },
    ])

    useEffect(()=>{
      if(creditsPageArray.length > 0){
          let stepsTemp = [
            {
              target: '[data-tour="modalidade-section"]',
              content: 'Valores totais dos créditos exibidos, por modalidade.',
              disableBeacon: true,
              placement: 'bottom'
            },
            {
              target: '[data-tour="exportacao-section"]',
              content: 'Exporta os créditos sendo exibidos para os formatos Excel ou PDF.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="bandeiraadquirente-section"]',
              content: 'Filtra os créditos de acordo com a combinação de bandeira/adquirente selecionada.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="tabelavendas-section"]',
              content: 'Créditos do período selecionado. Podem ser filtrados por bandeira/adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="totaladq-section"]',
              content: 'Valores totais dos créditos sendo exibidos, separados por adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="botaovoltar-section"]',
              content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
              placement: 'bottom'
            },
        ]
        setSteps(stepsTemp)
      } else {
        setSteps([
          {
            target: '[data-tour="calendario-section"]',
            content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
            disableBeacon: true,
            placement: 'bottom'
          },
          {
            target: '[data-tour="pesquisar-section"]',
            content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
            placement: 'bottom'
          },
        ])
      }
    },[creditsPageArray])
  
  const handleTutorialEnd = () => {
    setRunTutorial(false)
    if (creditsPageArray.length > 0){

    } else{
   
    }
  }

	return(
		<div className='appPage'>
		  <div className='page-vendas-background'>
			<div className='page-content-vendas'>
			  <div className='vendas-title-container'>
				  <h1 className='vendas-title'>Calendário de Créditos</h1>
			  </div>
        <hr className='hr-global'/>
			  <div className='component-container-vendas' data-tour="calendario-section">
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
                  }
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
          { creditsPageArray !== null ?
            (creditsPageArray.length > 0 ? (
                <DisplayData 
                  dataArray={creditsPageArray} 
                  adminDataArray={creditsPageAdminArray} 
                  totals={creditsTotal} 
                  onGoBack={resetValues}
                  setRunTutorial={setRunTutorial}
                  location={location}
                />
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
                    btnDisabled={btnDisabledCredits} 
                  />
                </>
              )
            ) : null }
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
			    </div>
			  </div>
		  </div>
		</div>
	)
  }

export default Creditos