import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import '../../styles/global.scss'
import Select from 'react-select'
import './exportacao.scss'
import MyCalendar from '../../components/Componente_Calendario'
import RadioSelect from '../../components/Componente_RadioSelect'
import { toast } from 'react-toastify'

const ExportacaoSysmo = () =>{
    const location = useLocation()
    const { loadBanners, loadAdmins, loadSysmo, btnDisabledSysmo, setBtnDisabledSysmo } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])

    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)

    const [bannersList, setBannersList] = useState([])
    const [adminsList, setAdminsList] = useState([])

    const [banOptions, setBanOptions] = useState([])
    const [admOptions, setAdmOptions] = useState([])

    const [selectedBan, setSelectedBan] = useState('Selecione')
    const [selectedAdm, setSelectedAdm] = useState('Selecione')

    const [obj, setObj] = useState({})

    const [type, setType] = useState('')
    const radioOptions = [
        {value: 'Vendas', label: 'Vendas'}, 
        {value: 'Recebimentos', label: 'Créditos'}
    ]

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
    }, [location])

    useEffect(()=>{
        async function inicialize(){
          if(bannersList.length === 0){
            const response = await loadBanners()
            setBannersList(response)
          }
          
          if(adminsList.length === 0){
            const response = await loadAdmins()
            setAdminsList(response)
          }
        }
        inicialize()
      },[])

    useEffect(() => {
        if(bannersList && bannersList.length > 0){
            const bannersListOptions = bannersList.map(banner => ({ value: banner.codigoBandeira, label: banner.descricaoBandeira }))
            bannersListOptions.unshift({label: "TODOS", value: 0})
            setBanOptions(bannersListOptions)
        }
    }, [bannersList])
    

    useEffect(() => {
        if (adminsList && adminsList.length > 0) {
            const adminsListOptions = adminsList.map(admin => ({ value: admin.codigoAdquirente, label: admin.nomeAdquirente }))
            adminsListOptions.unshift({label: "TODOS", value: 0})
            setAdmOptions(adminsListOptions)
        }
    }, [adminsList])

    const [dataInicialExibicao, setDataInicialExibicao] = useState(new Date().toLocaleDateString('pt-BR'))
    const [dataFinalExibicao, setDataFinalExibicao] = useState(new Date().toLocaleDateString('pt-BR'))

    useEffect(()=>{
        if((dataBusca[0] !== undefined) && (dataBusca[1] !== undefined)){
            setDataBuscaInicial(dataBusca[0])
            setDataBuscaInicial(dataBusca[1])
            setDataInicialExibicao(dataBusca[0].toLocaleDateString('pt-BR'))
            setDataFinalExibicao(dataBusca[1].toLocaleDateString('pt-BR'))
        }
    },[dataBusca])

    function handleBan(e){
        setSelectedBan(e)
    }

    function handleAdq(e){
        setSelectedAdm(e)
    }

    useEffect(()=>{
        setObj({
            TIPO: type,
            Bandeira: selectedBan.value,
            Adquirente: selectedAdm.value,
            Data: dataBusca[0].toLocaleDateString('pt-BR'),  
        })
    },[type, selectedBan, selectedAdm, dataBusca])

    async function handleLoadData(e) {
        e.preventDefault()
        try {
          setBtnDisabledSysmo(true)
          toast.dismiss()
          await toast.promise(loadData(), {
            pending: 'Carregando...',
            success: 'arquivo gerado com sucesso',
            error: 'Ocorreu um Erro',
          })
          setBtnDisabledSysmo(false)
        } catch (error) {
          setBtnDisabledSysmo(false)
          console.error('Error handling busca:', error)
        }
    }

    async function loadData() {
        try {
          await loadSysmo(obj)
        } catch (error) {
          console.error('Error fetching sales data:', error)
          throw error
        }
      }

    function handleDateRangeChange(){
        console.log('handleDateRangeChange')
    }

    return(
    <div className='appPage'>
        <div className='page-background-global'>
            <div className='page-content-global page-content-exportacao'>
                <div className='title-container-global'>
                    <h1 className='title-global'>Exportação Sysmo</h1>
                </div>
                <hr className='hr-global'/>
                <div className='component-container-sysmo'>
                    <div className='select-component'>
                        <p className='radio-title-sysmo'>Tipo:</p>
                        <RadioSelect options={radioOptions} onSelect={(e) => {setType(e)}}/>
                    </div>
                    <div className='select-component-container'>
                        <div className='select-component'>
                            <span className='span-picker'>Bandeira</span>
                            <Select
                                value={selectedBan}
                                onChange={handleBan}
                                placeholder="Selecione"
                                options={banOptions}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                        </div>
                        <div className='select-component'>
                            <span className='span-picker'>Adquirente</span>
                            <Select 
                                value={selectedAdm} 
                                onChange={handleAdq}
                                placeholder="Selecione"
                                options={admOptions}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                        </div>
                    </div>
                </div>
                <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange} btnDisabled={btnDisabledSysmo}/>
            </div>
        </div>
    </div>
    )
}

export default ExportacaoSysmo