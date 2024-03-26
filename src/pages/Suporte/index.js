import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import '../ExportacaoSysmo'
import MyCalendar from '../../components/Componente_Calendario'
import base64PDFdownload from '../../components/Componente_Base64PDF'
import { FiActivity, FiCheckSquare, FiCopy, FiDatabase, FiEdit, FiFilePlus, FiLock, FiPlus, FiSearch, FiTrash, FiUpload } from 'react-icons/fi'
import Select from 'react-select'
import '../../styles/global.scss'
import './suporte.scss'
import RadioSelect from '../../components/Componente_RadioSelect'
import { adquirentesStatic } from '../../contexts/static'

const Suporte = () =>{
    const location = useLocation();
    const { isDarkTheme, setLoading, adquirentes, loadAdquirentes} = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
    const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

    useEffect(()=>{
        async function inicializar(){
            await loadAdquirentes();
        }
        inicializar()
    },[])

    useEffect(()=>{
        if(adquirentes){
            console.log('adquirentes: ', adquirentes)
        }
    },[adquirentes])

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
                <table className="table table-striped table-hover table-bordered table-suporte">
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

    const PlaceHolder2 = () =>{
        return(
            <div className='table-suporte-container'>
                <table className="table table-striped table-hover table-bordered table-suporte">
                    <thead>
                        <tr>
                            <th scope="col">Ver</th>
                            <th scope="col">CNPJ</th>
                            <th scope="col">Razão Social</th>
                            <th scope="col">Código</th>
                            <th scope="col">Estabelecimento</th>
                            <th scope="col">Administradora</th>
                            <th scope="col">Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td scope="row"><FiSearch /></td>
                            <td scope="row"></td>
                            <td scope="row"></td>
                            <td scope="row"></td>
                            <td scope="row">000000002579766</td>
                            <td scope="row">Greencard</td>
                            <td scope="row"><FiTrash /></td> 
                        </tr>
                        <tr>
                            <td><FiSearch /></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>000000008445680</td>
                            <td>Ticket</td>
                            <td><FiTrash /></td>
                        </tr>
                        <tr>
                            <td><FiSearch /></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>000000012969575</td>
                            <td>Ticket</td>
                            <td><FiTrash /></td>
                        </tr>
                        <tr>
                            <td scope="row"><FiSearch /></td>
                            <td scope="row"></td>
                            <td scope="row"></td>
                            <td scope="row"></td>
                            <td scope="row">000000002579766</td>
                            <td scope="row">Greencard</td>
                            <td scope="row"><FiTrash /></td> 
                        </tr>
                        <tr>
                            <td><FiSearch /></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>000000008445680</td>
                            <td>Ticket</td>
                            <td><FiTrash /></td>
                        </tr>
                        <tr>
                            <td><FiSearch /></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>000000012969575</td>
                            <td>Ticket</td>
                            <td><FiTrash /></td>
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
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Estabelecimento</b></h6>
                            <input className='input-suporte' type='text'/>
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>CNPJ</b></h6>
                            <input className='input-suporte' type='text'/>    
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Razão Social</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className={`hr-global ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiCheckSquare />&nbsp;Consultar Status</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiActivity />&nbsp;Credenciar</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiCopy />&nbsp;Duplicação</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const AutStone = ({ isDarkTheme }) =>{
        return(
            <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                <div className='suporte-content'>
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Estabelecimento</b></h6>
                            <input className='input-suporte' type='text'/>
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>CNPJ</b></h6>
                            <input className='input-suporte' type='text'/>    
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Razão Social</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className={`hr-global ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const AutRedeCard = ({isDarkTheme}) =>{
        return(
            <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                <div className='suporte-content'>
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Estabelecimento</b></h6>
                            <input className='input-suporte' type='text'/>
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>CNPJ</b></h6>
                            <input className='input-suporte' type='text'/>    
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Razão Social</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className={`hr-global ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiActivity />&nbsp;Credenciar</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    const AutC6 = ({ isDarkTheme }) =>{
        return(
            <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                <div className='suporte-content'>
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Estabelecimento</b></h6>
                            <input className='input-suporte' type='text'/>
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>CNPJ</b></h6>
                            <input className='input-suporte' type='text'/>    
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Razão Social</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className={`hr-global ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const radioOptions = [{value: 0, label: 'Identificados'},{value: 1, label: 'Pendentes'}]
    const [radioOption, setRadioOption] = useState(null)

    const GestaoAdq = ({isDarkTheme}) =>{
        return(
            <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                <div className='suporte-content'>
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Estabelecimento</b></h6>
                            <input className='input-suporte' type='text'/>
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>CNPJ</b></h6>
                            <input className='input-suporte' type='text'/>    
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Razão Social</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='input-block'>
                            <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Código do Cliente</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='radio-suporte'>
                        <RadioSelect options={radioOptions} onSelect={(e) => {setRadioOption(e)}}/>
                        </div>
                        <div className='input-block'>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className={`hr-global ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}/>
                    <PlaceHolder2 />
                </div>
            </div>
        )
    }

    const ConsultaArquivo = ({isDarkTheme}) =>{
        return(
            <div className='suporte-content'>
                <div className='input-suporte'>
                    <div className='input-block'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Nome do Arquivo</b></h6>
                        <input className='input-suporte' type='text'/>
                    </div>
                    <div className='input-block'>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiSearch />&nbsp;Filtrar</button>
                    </div>
                </div>
                <div className='consulta-arquivos'>

                </div>
            </div>
        )
    }

    const CorrigirAdq = ({isDarkTheme}) =>{
        return(
            <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                <div>
                    <p>Realiza a correção dos cruzamentos entre Clientes x Adquirentes cadastrados incorretamente.</p>
                    <br/><br/>
                </div>
                <div className='input-suporte-correcao'>
                    <div className='input-block-correcao'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Adquirente *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Cód do Estabelecimento na Adquirente *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>CNPJ Origem *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Razão Social Origem</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>CNPJ Destino *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Razão Social Destino</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <hr className='hr-global'/>
                    <div className='input-block-correcao'>
                        <button className={`btn btn-global btn-correcao ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Aplicar Correção</button>
                    </div>
                    <div className='input-block-corração'>
                        <p className='p-correcao'>Campos com * são obrigatórios</p>
                    </div>
                </div>
            </div>
        )
    }

    

    const [adqSelecionada, setAdqSelecionada] = useState(null)
    const [adqfiltradas, setAdqFiltradas] = useState(null)

    const handleAdqChange = (adq) =>{
        setAdqSelecionada(adq)
    }

    useEffect(()=>{
        console.log('adqSelecionada: ', adqSelecionada)
    },[adqSelecionada])

    useEffect(()=>{     
        if (adquirentes && adquirentes.length > 0) {
            const sortedOptions = adquirentes
                .map((ADQ) => ({
                    value: ADQ.codigoAdquirente,
                    label: ADQ.nomeAdquirente,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) // Sort options alphabetically by label
            let todos = {value: 'todos', label: 'TODOS'}
            sortedOptions.unshift(todos)
            setAdqFiltradas(sortedOptions)
        } else {
            setAdqFiltradas([])
        } 
    },[adquirentes])

    const RelatorioCliAdq = ({isDarkTheme, adqSelecionada}) =>{
        return(
            <div className={`container-cielo ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} >
                <div>
                    <p>Gera um arquivo Excel com todos <b>Clientes</b> que possuem a <b>Adquirente</b> selecionada.</p>
                    <br/><br/>
                </div>
                <div className='input-suporte-cli-adq'>
                    <div className='input-block-cli-adq'>
                        <h6 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><b>Adquirente *</b></h6>
                        {adqfiltradas.length > 0 ? (
                            <Select
                                className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
                                options={adqfiltradas}
                                onChange={handleAdqChange}
                                value={adqSelecionada}
                            />
                        ) : <></>}
                    </div>
                    <br/>
                    <div className='input-block-cli-adq'>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiFilePlus /> &nbsp; Gerar Excel</button>
                    </div>
                </div>
            </div>
        )
    } 

    const opcoes = [
        {value: 0, label:'Autorização Cielo', componente: AutCielo}, 
        {value: 1, label:'Autorização Stone', componente: AutStone}, 
        {value: 2, label: 'Autorização Redecard', componente: AutRedeCard},
        {value: 3, label: 'Autorização C6-Bank', componente: AutC6},
        {value: 4, label: 'Gestão de Adquirentes', componente: GestaoAdq},
        {value: 5, label: 'Consulta de Arquivos Importados', componente: ConsultaArquivo},
        {value: 6, label: 'Corrigir Cadastro de Adquirente', componente: CorrigirAdq},
        {value: 7, label: 'Clientes por Adquirentes', componente: RelatorioCliAdq},
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
            <div className='page-suporte-content'>
                <div className=''>
                    <form className='form-suporte'>
                        <h5 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Tipo</h5>
                        <Select
                            value={tipoOpcao} 
                            onChange={handleTipoOpcao}
                            placeholder="Selecione"
                            options={opcoes}
                            isSearchable={false}
                        />
                    </form>
                    <hr className='hr-global'/>
                    {tipoOpcao && (
                        <div style={{width: '100%', height: '100%'}}>
                            <h5 className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} style={{paddingTop: '5px', paddingBottom: '5px'}}>{tipoOpcao.label}</h5>
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