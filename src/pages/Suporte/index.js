import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import '../ExportacaoSysmo'
import MyCalendar from '../../components/Componente_Calendario'
import base64PDFdownload from '../../components/Componente_Base64PDF'
import { FiActivity, FiCheckSquare, FiCopy, FiDatabase, FiEdit, FiLock, FiPlus, FiSearch, FiTrash, FiUpload } from 'react-icons/fi'
import Select from 'react-select'
import '../../styles/global.scss'
import './suporte.scss'

const Suporte = () =>{
    const location = useLocation();
    const { isDarkTheme, setLoading } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
    const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

    const handleDateChange = date => {
        setDataBusca(date)
    }

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
        setLoading(true)
        base64PDFdownload()
        setLoading(false)
    }

    const PlaceHolder = () =>{
        return(
            <div className='table-suporte-container'>
                <table class="table table-striped table-hover table-bordered table-suporte">
                    <thead>
                        <tr>
                            <th scope="col">Estabelecimento</th>
                            <th scope="col">CNPJ</th>
                            <th scope="col">Razão Social</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td scope="row">1017619040</td>
                            <td scope="row">82.311.580/0001-00</td>
                            <td scope="row">L. A. DALLACQUA E CIA LTDA</td>
                            <td scope="row">Duplicação Indisponível</td> 
                        </tr>
                        <tr>
                            <td>2809033719</td>
                            <td>82.311.580/0001-00</td>
                            <td>L. A. DALLACQUA E CIA LTDA</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>2809032593</td>
                            <td>82.311.580/0001-00	</td>
                            <td>L. A. DALLACQUA E CIA LTDA</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const suporte = () =>{
        return(
            <MyCalendar dataInicialExibicao={dataInicialExibicao}  dataFinalExibicao={dataFinalExibicao} dataBusca={dataBusca} handleDateChange={handleDateChange}/>        
        )
    }

    const AutCielo = ({ isDarkTheme }) =>{
        return(
            <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                <div>
                    <h4>Prezado Cliente</h4>
                    <p>Para que possamos ter acesso aos arquivos de extratos da Administradora Cielo, é necessária sua autorização eletrônica, para isso, nosso sistema está integrado com o portal da Cielo.
                    <br/><br/>
                    Selecione na lista abaixo, um código de Estabelecimento e clique no botão "Autorizar" para prosseguir.</p>
                </div>
                <div className='suporte-content'>
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <h6><b>Estabelecimento</b></h6>
                            <input className='input-suporte' type='text'/>
                        </div>
                        <div className='input-block'>
                            <h6><b>CNPJ</b></h6>
                            <input className='input-suporte' type='text'/>    
                        </div>
                        <div className='input-block'>
                            <h6><b>Razão Social</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className={`hr-global ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiLock />&nbsp;Autorizar</button>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiCheckSquare />&nbsp;Consultar Status</button>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiActivity />&nbsp;Credenciar</button>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiUpload />&nbsp;Atualizar Status</button>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiCopy />&nbsp;Duplicação</button>
                    </div>
                </div>
            </div>
        )
    }

    const opcoes = [
        {value: 0, label:'Autorização Cielo', componente: AutCielo}, 
        {value: 1, label:'Autorização Stone', componente: AutCielo}, 
        {value: 2, label: 'Autorização Redecard', componente: AutCielo},
        {value: 3, label: 'Autorização c6-bank', componente: AutCielo},
        {value: 4, label: 'Gestão de Adquirentes', componente: AutCielo},
        {value: 5, label: 'Consulta Arquivo', componente: AutCielo},
        {value: 6, label: 'Emissor de Relatórios', componente: AutCielo},
        {value: 7, label: 'Relatório de Importação', componente: AutCielo},
        {value: 8, label: 'Corrigir Cadastro', componente: AutCielo},
        {value: 9, label: 'Clientes por AdquirentesEmissor de Relatórios', componente: AutCielo},
    ]
    const [tipoOpcao, setTipoOpcao] = useState(null)
    useEffect(()=>{
        if(tipoOpcao){
            console.log('tipoOpcao: ', tipoOpcao)
        }
    },[tipoOpcao])
    

    const handleTipoOpcao = selectedOption =>{
        setTipoOpcao(selectedOption)
    }

    return(
      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-global page-content-exportacao ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`title-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Suporte</h1>
            </div>
            <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
            <div className=''>
                <div className=''>
                    <form className=''>
                        <h5>Tipo</h5>
                        <Select
                            value={tipoOpcao} 
                            onChange={handleTipoOpcao}
                            placeholder="Selecione"
                            options={opcoes}
                            isSearchable={false}
                        />
                    </form>
                    {tipoOpcao && (
                        <div style={{width: '100'}}>
                            <h5>{tipoOpcao.label}</h5>
                            {tipoOpcao.componente && <tipoOpcao.componente isDarkTheme={isDarkTheme} />} {/* Render the component if it exists */}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Suporte