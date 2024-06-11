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

const Suporte = () =>{
    const location = useLocation();
    const { loadAdmins} = useContext(AuthContext)

    const [adminsList, setAdminsList] = useState([])
    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

    useEffect(() => {
        async function inicializar() {
            try {
                const response = await loadAdmins();
                setAdminsList(response); // Update state with the API response
            } catch (error) {
                console.error('Error loading admins:', error); // Log any errors
            }
        }
        inicializar();
    }, []);

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

    function handleLoadData(){
        console.log('loadData')
    }

    function handleDateRangeChange(){
        console.log('handleDateRangeChange')
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
            <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>        
        )
    }

    const AutCielo = () =>{
        return(
            <div className='container-cielo'>
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
                            <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className='hr-global'/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiCheckSquare />&nbsp;Consultar Status</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiActivity />&nbsp;Credenciar</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiCopy />&nbsp;Duplicação</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const AutStone = () =>{
        return(
            <div className='container-cielo'>
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
                            <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className='hr-global'/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const AutRedeCard = () =>{
        return(
            <div className='container-cielo' >
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
                            <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className='hr-global'/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiActivity />&nbsp;Credenciar</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    const AutC6 = () =>{
        return(
            <div className='container-cielo' >
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
                            <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className='hr-global'/>
                    <PlaceHolder />
                    <div className='input-suporte'>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiLock />&nbsp;Autorizar</button>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiUpload />&nbsp;Atualizar Status</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const radioOptions = [{value: 0, label: 'Identificados'},{value: 1, label: 'Pendentes'}]
    const [radioOption, setRadioOption] = useState(null)

    const GestaoAdq = () =>{
        return(
            <div className='container-cielo' >
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
                            <h6><b>Código do Cliente</b></h6>
                            <input className='input-suporte' type='text'/>                    
                        </div>
                        <div className='input-block'>
                            <div className='radio-suporte'><RadioSelect options={radioOptions} onSelect={(e) => {setRadioOption(e)}}/></div>
                        </div>
                        <div className='input-block'>
                            <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                        </div>
                    </div>
                    <hr className='hr-global'/>
                    <PlaceHolder2 />
                </div>
            </div>
        )
    }

    const ConsultaArquivo = () =>{
        return(
            <div className='suporte-content'>
                <div className='input-suporte'>
                    <div className='input-block'>
                        <h6><b>Nome do Arquivo</b></h6>
                        <input className='input-suporte' type='text'/>
                    </div>
                    <div className='input-block'>
                        <button className='btn btn-global'><FiSearch />&nbsp;Filtrar</button>
                    </div>
                </div>
                <div className='consulta-arquivos'>

                </div>
            </div>
        )
    }

    const CorrigirAdq = () =>{
        return(
            <div className='container-cielo' >
                <div>
                    <p>Realiza a correção dos cruzamentos entre Clientes x adminsList cadastrados incorretamente.</p>
                    <br/><br/>
                </div>
                <div className='input-suporte-correcao'>
                    <div className='input-block-correcao'>
                        <h6><b>Adquirente *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6><b>Cód do Estabelecimento na Adquirente *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6><b>CNPJ Origem *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6><b>Razão Social Origem</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6><b>CNPJ Destino *</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <div className='input-block-correcao'>
                        <h6><b>Razão Social Destino</b></h6>
                        <input className='input-suporte input-correcao' type='text'/>                    
                    </div>
                    <br/>
                    <hr className='hr-global'/>
                    <div className='input-block-correcao'>
                        <button className='btn btn-global btn-correcao'>Aplicar Correção</button>
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
        if (adminsList && adminsList.length > 0) {
            const sortedOptions = adminsList
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
    },[adminsList])

    const RelatorioCliAdq = () =>{
        return(
            <div className='container-cielo' style={{marginBottom: '300px'}} >
                <div>
                    <p>Gera um arquivo Excel com todos <b>Clientes</b> que possuem a <b>Adquirente</b> selecionada.</p>
                    <br/><br/>
                </div>
                <div className='input-suporte-cli-adq'>
                    <div className='select-container'>
                        <h6><b>Adquirente *</b></h6>
                        {adqfiltradas.length > 0 ? (
                            <Select
                                options={adqfiltradas}
                                onChange={handleAdqChange}
                                value={adqSelecionada}
                            />
                        ) : <></>}
                    </div>
                    <br/>
                    <div className='input-block-cli-adq'>
                        <button className='btn btn-global'><FiFilePlus /> &nbsp; Gerar Excel</button>
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
        {value: 7, label: 'Clientes por Adquirente', componente: RelatorioCliAdq},
    ]
    const [tipoOpcao, setTipoOpcao] = useState(null)
    
    const handleTipoOpcao = selectedOption =>{
        setTipoOpcao(selectedOption)
    }

    return(
      <div className='appPage'>
        <div className='page-background-global'>
          <div className='page-content-global page-content-exportacao'>
            <div className='title-container-global'>
              <h1 className='title-global'>Suporte</h1>
            </div>
            <hr className='hr-global'/>
            <div className='page-suporte-content'>
                <div className=''>
                    <form className='form-suporte'>
                        <h5>Tipo</h5>
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
                            <h5 style={{paddingTop: '5px', paddingBottom: '5px'}}>{tipoOpcao.label}</h5>
                            {tipoOpcao.componente && <tipoOpcao.componente />} {/* Render the component if it exists */}
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