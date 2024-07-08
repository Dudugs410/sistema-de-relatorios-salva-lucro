import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import '../../styles/global.scss'
import Select from 'react-select'
import '../ExportacaoSysmo/exportacao.scss'
import '../ExportacaoMeta/meta.scss'
import MyCalendar from '../../components/Componente_Calendario'
import base64PDFdownload from '../../components/Componente_Base64PDF'
import RadioSelect from '../../components/Componente_RadioSelect'

const ExportacaoMetaSapiranga = () =>{
    const location = useLocation()
    const { loadBanners, loadAdmins } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])

    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)

    const [bannersList, setBannersList] = useState([])
    const [adminsList, setAdminsList] = useState([])

    const [banOptions, setBanOptions] = useState([])
    const [admOptions, setAdmOptions] = useState([])

    const [selectedBan, setSelectedBan] = useState('Selecione')
    const [selectedAdm, setSelectedAdm] = useState('Selecione')

    const [type, setType] = useState('')
    const radioOptions = [
        {value: 'Vendas', label: 'Vendas'}, 
        {value: 'Creditos', label: 'Créditos'}
    ]

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname)
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
        if(bannersList){
            if (bannersList.length > 0) {
                const bannersListOptions = bannersList.map(banner => ({ value: banner.codigoBandeira, label: banner.descricaoBandeira }))
                setBanOptions(bannersListOptions)
            }
        }
    }, [bannersList])

    useEffect(() => {
        if(adminsList){
            if (adminsList.length > 0) {
                const adminsListOptions = adminsList.map(admin => ({ value: admin.codigoAdquirente, label: admin.nomeAdquirente }))
                setAdmOptions(adminsListOptions)
            }
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

    function handleExport(e){
        e.preventDefault()
        base64PDFdownload()
    }

    function handleBan(e){
        setSelectedBan(e)
    }

    function handleAdq(e){
        setSelectedAdm(e)
    }

    function handleLoadData(){
        console.log('loadData')
    }

    function handleDateRangeChange(){
        console.log('handleDateRangeChange')
    }

    return(
    <div className='appPage'>
        <div className='page-background-global'>
            <div className='page-content-global page-content-exportacao'>
                <div className='title-container-global'>
                    <h1 className='title-global'>Exportação Meta Sapiranga</h1>
                </div>
                <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>
                <form>
                    <div className='select-container-meta'>
                        <RadioSelect options={radioOptions} onSelect={(e) => {setType(e)}}/>
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
                    <div className='btn-container-financeiro'>
                        <button className='btn btn-primary btn-global' onClick={handleExport}>Gerar Arquivo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default ExportacaoMetaSapiranga