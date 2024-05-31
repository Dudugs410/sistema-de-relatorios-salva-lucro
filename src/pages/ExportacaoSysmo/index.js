import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import '../../styles/global.scss'
import Select from 'react-select'
import './exportacao.scss'
import MyCalendar from '../../components/Componente_Calendario';
import base64PDFdownload from '../../components/Componente_Base64PDF';
import RadioSelect from '../../components/Componente_RadioSelect';
import Cookies from 'js-cookie'

const ExportacaoSysmo = () =>{
    const location = useLocation();
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
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

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
            const bannersListOptions = bannersList.map(banner => ({ value: banner.codigoBandeira, label: banner.descricaoBandeira }));
            bannersListOptions.unshift({label: "TODOS", value: 0}); // Add the new option as the first object
            setBanOptions(bannersListOptions);
        }
    }, [bannersList]);
    

    useEffect(() => {
        if (adminsList && adminsList.length > 0) {
            const adminsListOptions = adminsList.map(admin => ({ value: admin.codigoAdquirente, label: admin.nomeAdquirente }));
            adminsListOptions.unshift({label: "TODOS", value: 0}); // Add the new option as the first object
            setAdmOptions(adminsListOptions);
        }
    }, [adminsList]);

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
        console.log('handleExport...')
        loadSysmo(obj)
        base64PDFdownload()
        setBtnDisabledSysmo(false)
    }

    function handleBan(e){
        setSelectedBan(e)
    }

    function handleAdq(e){
        setSelectedAdm(e)
    }

    useEffect(()=>{
        /*if(type === 'Vendas'){
            setType('Venda')
        } else if(type === 'Creditos'){
            setType('Credito')
        }*/

        setObj({
            TIPO: type,
            Bandeira: selectedBan.value,
            Adquirente: selectedAdm.value,
            Data: dataBusca[0].toLocaleDateString('pt-BR'),  
        })
    },[type, selectedBan, selectedAdm, dataBusca])

    useEffect(()=>{
        console.log('obj : ', obj)
    },[obj])

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
                    <h1 className='title-global'>Exportação Sysmo</h1>
                </div>
                <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange} btnDisabled={btnDisabledSysmo}/>
                <form>
                    <div className='component-container'>
                        <RadioSelect options={radioOptions} onSelect={(e) => {setType(e)}}/>
                        <div className='select-container'>
                            <div className='select-component'>
                                <span className='span-picker'>Bandeira</span>
                                <Select
                                    value={selectedBan} 
                                    onChange={handleBan}
                                    placeholder="Selecione"
                                    options={banOptions}
                                />
                            </div>
                            <div className='select-component'>
                                <span className='span-picker'>Adquirente</span>
                                <Select 
                                    value={selectedAdm} 
                                    onChange={handleAdq}
                                    placeholder="Selecione"
                                    options={admOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='btn-container-financeiro'>
                        <button className='btn btn-primary btn-global' onClick={handleExport} disabled={btnDisabledSysmo}>Gerar Arquivo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default ExportacaoSysmo