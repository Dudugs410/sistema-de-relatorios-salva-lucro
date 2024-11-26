import './servicos.scss'
import { useContext, useEffect } from 'react' 
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import DisplayData from '../../components/Componente_DisplayData'


const Servicos = () =>{
  const location = useLocation()

  useEffect(() => {
      localStorage.setItem('currentPath', location.pathname)
  }, [location])

	const {
	  servicesPageArray, setServicesPageArray,
	  servicesPageAdminArray, setServicesPageAdminArray,
	  servicesDateRange, setServicesDateRange,
	  loadServices, servicesTableData,
    btnDisabledServices, setBtnDisabledServices,
    groupServicesByAdmin,
    exportServices,
	} = useContext(AuthContext)

  useEffect(()=>{
    if(servicesPageArray.length>0){
      setServicesPageAdminArray(groupServicesByAdmin(servicesPageArray))
    }
  },[servicesPageArray])

  const resetValues = () => {
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setBtnDisabledServices(false)
    servicesTableData.length = 0
  }

  async function handleLoadData(e) {
    e.preventDefault()
    try {
      setBtnDisabledServices(true)
      toast.dismiss()
      await toast.promise(loadData(), {
        pending: 'Carregando...',
      })
      setBtnDisabledServices(false)
    } catch (error) {
      console.error('Error handling busca:', error)
      setBtnDisabledServices(false)
    }
  }
  
  async function loadData() {
    try {
      setServicesPageArray(await loadServices(servicesDateRange[0].toLocaleDateString('pt-BR'), servicesDateRange[1].toLocaleDateString('pt-BR')))
    } catch (error) {
      console.error('Error fetching sales data:', error)
      toast.dismiss()
      toast.error(error)
      throw error
    }
  }

  useEffect(()=>{
    if(servicesPageArray.length > 0){
      exportServices(servicesPageArray)
    }
  },[servicesPageArray, localStorage.getItem('currentPath')])

  const handleDateRangeChange = (dateRange) => {
    setServicesDateRange(dateRange)
  }

	return(
		<div className='appPage'>
		  <div className='page-vendas-background'>
			<div className='page-content-vendas'>
			  <div className='vendas-title-container'>
				<h1 className='vendas-title'>Serviços</h1>
			  </div>
			  <div className='component-container-vendas'>
          { servicesPageArray !== null ?
            (servicesPageArray.length > 0 ? (
              <DisplayData 
                dataArray={servicesPageArray} 
                adminDataArray={servicesPageAdminArray} 
                totals={null} 
                onGoBack={resetValues}
              />
              ) : (
              <MyCalendar 
                onLoadData={handleLoadData} 
                getCalendarDate={handleDateRangeChange} 
                btnDisabled={btnDisabledServices}
              />
              )
            )
          : null }
			    </div>
			  </div>
		  </div>
		</div>
	)
}

export default Servicos

