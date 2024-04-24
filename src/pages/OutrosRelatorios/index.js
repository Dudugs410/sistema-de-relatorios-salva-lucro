import { useEffect, useContext, createContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import '../../styles/global.scss'
import Select from 'react-select'
import '../Financeiro/financeiro.scss'
import '../Suporte/suporte.scss'
import './outrosRelatorios.scss'
import MyCalendar from '../../components/Componente_Calendario';
import base64PDFdownload from '../../components/Componente_Base64PDF';
import { FiFilePlus, FiPlus, FiTrash2 } from 'react-icons/fi';

const OutrosRelatorios = () =>{
    const location = useLocation();
    const { isDarkTheme } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState([new Date, new Date])
    const [tipoRelatorio, setTipoRelatorio] = useState(null)
    const [formatoRelatorio, setFormatoRelatorio] = useState(null)
    const [clickCount, setClickCount] = useState(0);

    const [dataBuscaInicial, setDataBuscaInicial] = useState(new Date)
    const [dataBuscaFinal, setDataBuscaFinal] = useState(new Date)

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname);
    }, [location]);

    const opcoesRelatorio = [{value: 0, label:'Previsão de Recebimento'}, {value: 1, label:'Créditos por Data e Banco'}, {value: 2, label: 'Antecipações'}, {value:3, label: 'Gravame/Cessão'}, {value:4, label:'Posição Contábil'}]
    const opcoesFormato = [{value: 0 , label: 'PDF' }, {value: 1 , label: 'Excel' } ]

    const handleRelatorio = selectedOption => {
       setTipoRelatorio(selectedOption)
    }

    const handleFormato = selectedOption => {
        setFormatoRelatorio(selectedOption)
    }

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
        base64PDFdownload()
    }

    const botao = <button className={`btn-outros-relatorios ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiTrash2 /></button>

    const PlaceHolder = () =>{
        return(
            <div className='table-suporte-container'>
                <table className="table table-striped table-hover table-bordered table-suporte">
                    <thead>
                        <tr>
                            <th scope="col">Cliente</th>
                            <th scope="col">Relatório</th>
                            <th scope="col">Data Inicial</th>
                            <th scope="col">Data Final</th>
                            <th scope="col">Status</th>
                            <th scope="col">Usuário</th>
                            <th scope="col">Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td scope="row">ZILLI</td>
                            <td scope="row">Relatório Resumo Mensal</td>
                            <td scope="row">01/02/2024</td>
                            <td scope="row">29/02/2024</td>
                            <td scope="row">Concluído</td>
                            <td scope="row">ALFREDO</td>
                            <td scope="row">{botao}</td> 
                        </tr>
                        <tr>
                            <td scope="row">ZILLI</td>
                            <td scope="row">Relatório Resumo Mensal</td>
                            <td scope="row">01/02/2024</td>
                            <td scope="row">29/02/2024</td>
                            <td scope="row">Concluído</td>
                            <td scope="row">ALFREDO</td>
                            <td scope="row">{botao}</td> 
                        </tr>
                        <tr>
                            <td scope="row">ZILLI</td>
                            <td scope="row">Relatório Resumo Mensal</td>
                            <td scope="row">01/02/2024</td>
                            <td scope="row">29/02/2024</td>
                            <td scope="row">Concluído</td>
                            <td scope="row">ALFREDO</td>
                            <td scope="row">{botao}</td> 
                        </tr>
                        <tr>
                            <td scope="row">ZILLI</td>
                            <td scope="row">Relatório Resumo Mensal</td>
                            <td scope="row">01/02/2024</td>
                            <td scope="row">29/02/2024</td>
                            <td scope="row">Concluído</td>
                            <td scope="row">ALFREDO</td>
                            <td scope="row">{botao}</td> 
                        </tr>
                        <tr>
                            <td scope="row">ZILLI</td>
                            <td scope="row">Relatório Resumo Mensal</td>
                            <td scope="row">01/02/2024</td>
                            <td scope="row">29/02/2024</td>
                            <td scope="row">Concluído</td>
                            <td scope="row">ALFREDO</td>
                            <td scope="row">{botao}</td> 
                        </tr>
                        <tr>
                            <td scope="row">ZILLI</td>
                            <td scope="row">Relatório Resumo Mensal</td>
                            <td scope="row">01/02/2024</td>
                            <td scope="row">29/02/2024</td>
                            <td scope="row">Concluído</td>
                            <td scope="row">ALFREDO</td>
                            <td scope="row">{botao}</td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const incluir = (e) => {
        e.preventDefault()
        console.log('botão bombando')
    }

    const [opcoesApresentacao, setOpcoesApresentacao] = useState ([
        { value: 0 ,label: 'Por Cliente' },
        { value: 1 ,label: 'Por Data' },
        { value: 2 ,label: 'Por Somente Erros' },
    ])

    const [apresentacao, setApresentacao] = useState(null)

    const [opcoesErro, setOpcoesErro] = useState ([
        { value: 0 ,label: 'Arquivo importado com erro' },
        { value: 1 ,label: 'Arquivo já foi lido em outro momento' },
        { value: 2 ,label: 'Arquivo sem movimento' },
        { value: 3 ,label: 'Cannot insert duplicate key row in object' },
        { value: 4 ,label: 'Erro ao atualizar tabelas' },
        { value: 5 ,label: 'Erro durante a leitura do arquivo' },
        { value: 6 ,label: 'Falha na comunicação com a API' },
        { value: 7 ,label: 'Não foi encontrado um layout compatível com o arquivo lido' },
    ])

    const [erro, setErro] = useState(null)

    const handleSelectApresentacao = (selecionado) =>{
        setApresentacao(selecionado)
    }

    useEffect(()=>{
        console.log('apresentacao: ', apresentacao)
    },[apresentacao])

    const handleSelectErro = (selecionado) =>{
        setErro(selecionado)
    }

    useEffect(()=>{
        console.log('erro: ', erro)

    },[erro])

    function handleLoadData(){
        console.log('loadData')
    }

    function handleDateRangeChange(){
        console.log('handleDateRangeChange')
    }

    return(
      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-background-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-global page-content-exportacao ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`title-container-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className='title-global'>Outros Relatórios</h1>
            </div>
            <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
            <div className='container-financeiro' style={{width: '100%'}}>
                <h5 className='subtitle'>Resumo Mensal Agendado</h5>
                <br/>
                <form className='form-container-relatorios'>
                    <div className='select-elements-container'>
                        <PlaceHolder />
                        <br/>
                        <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={incluir}><FiPlus/>&nbsp;Incluir</button>
                    </div>
                </form>
            </div>
            <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
            <div className='container-financeiro'>
                <h5 className='subtitle'>Relatório de Arquivos Importados</h5>
                <br/>
                <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/>
                <form className='form-container-relatorios'>
                    <div className='select-elements-container'>
                        <div className='input-block-correcao'>
                            <h6 className='subtitle'><b>CNPJ</b></h6>
                            <input className='input-suporte' type='text'/>
                            <br/>
                        </div>
                        <div className='input-block-correcao'>
                            <h6 className='subtitle'><b>Apresentação</b></h6>
                            <Select
                                className=""
                                options={opcoesApresentacao}
                                onChange={handleSelectApresentacao}
                                value={opcoesApresentacao.value}
                                placeholder="Selecione ou digite para filtrar"
                            />
                            <br/>
                        </div>
                        <div className='input-block-correcao'>
                            <h6 className='subtitle'><b>Mensagem de Erro</b></h6>
                            <Select
                                className=""
                                options={opcoesErro}
                                onChange={handleSelectErro}
                                value={opcoesErro.value}
                                placeholder="Selecione ou digite para filtrar"
                            />
                            <br/>
                        </div>
                        <div className='input-block-cli-adq'>
                            <h6 className='subtitle'><b>Gerar</b></h6>
                            <button className={`btn btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}><FiFilePlus /> &nbsp; XLS</button>
                        </div>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default OutrosRelatorios;