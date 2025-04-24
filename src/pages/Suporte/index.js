import React, { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import '../ExportacaoSysmo'
import MyCalendar from '../../components/Componente_Calendario'
import base64PDFdownload from '../../components/Componente_Base64PDF'
import { FiSearch, FiTrash } from 'react-icons/fi'
import Select from 'react-select'
import '../../styles/global.scss'
import './suporte.scss'
import AutC6 from './AutC6.js'
import AutCielo from './AutCielo.js'
import AutRedeCard from './AutRedeCard.js'
import AutStone from './AutStone.js'
import ConsultaArquivo from './ConsultaArquivo.js'
import CorrigirAdq from './CorrigirAdq.js'
import GestaoAdq from './GestaoAdq.js'
import RelatorioCliAdq from './RelatorioCliAdq.js'

const Suporte = () =>{
    const location = useLocation()
    const { loadAdmins} = useContext(AuthContext)

    const [adminsList, setAdminsList] = useState([])
    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
    }, [location])

    useEffect(() => {
        async function inicializar() {
            try {
                const response = await loadAdmins()
                setAdminsList(response) // Update state with the API response
            } catch (error) {
                console.error('Error loading admins:', error) // Log any errors
            }
        }
        inicializar()
    }, [])

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

    const opcoes = [
        { value: 0, label: 'Autorização Cielo', componente: AutCielo, props: { PlaceHolder: PlaceHolder } },
        { value: 1, label: 'Autorização Stone', componente: AutStone, props: { PlaceHolder: PlaceHolder } },
        { value: 2, label: 'Autorização Redecard', componente: AutRedeCard, props: { PlaceHolder: PlaceHolder } },
        { value: 3, label: 'Autorização C6-Bank', componente: AutC6, props: { PlaceHolder: PlaceHolder } },
        { value: 4, label: 'Gestão de Adquirentes', componente: GestaoAdq, props: { PlaceHolder2: PlaceHolder2 } },
        { value: 5, label: 'Consulta de Arquivos Importados', componente: ConsultaArquivo },
        { value: 6, label: 'Corrigir Cadastro de Adquirente', componente: CorrigirAdq },
        { value: 7, label: 'Clientes por Adquirente', componente: RelatorioCliAdq, props: { adqfiltradas: adqfiltradas, handleAdqChange: handleAdqChange, adqSelecionada: adqSelecionada } },
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
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </form>
                    <hr className='hr-global'/>
                    {tipoOpcao && (
                        <div style={{ width: '100%', height: '100%' }}>
                            <h5 style={{ paddingTop: '5px', paddingBottom: '5px' }}>{tipoOpcao.label}</h5>
                            {tipoOpcao.componente && React.createElement(tipoOpcao.componente, tipoOpcao.props)} {/* Render the component if it exists */}
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