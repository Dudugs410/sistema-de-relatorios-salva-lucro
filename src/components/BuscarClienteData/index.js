import { useState, useEffect, useContext } from "react"
import Cookies from "js-cookie"

import api, { config } from "../../services/api"

import './buscar.css'
import { AuthContext } from "../../contexts/auth"

import ReactDatePicker from "react-datepicker"
import './reactdatepicker.css'
const BuscarClienteData = () => {
    const [BAN, setBAN] = useState([])

    const [grupo, setGrupo] = useState('')
    const [cliente, setCliente] = useState('')
    const [adm, setAdm] = useState('')
    const [banSelecionada, setBanSelecionada] = useState('')

    const { dataInicial, setDataInicial, dataFinal, setDataFinal, cnpj, setCnpj, loadVendas, vendas, detalhes, setDetalhes, dateConvertYYYYMMDD, totalLiqido, setTotalLiquido, totalVendasLiquido, setTotalCredito, setTotalDebito, setTotalVoucher } = useContext(AuthContext)
    const { setLoading } = useContext(AuthContext)



    useEffect(() => {
        setCnpj('03.953.552/0001-02')
        const loadBandeiras = async () =>{
          const result = await api.get('/bandeira', config(Cookies.get('token')))
          console.log(result)
          setBAN(result.data)
          setLoading(false)
        }
        loadBandeiras()
      }, [setCnpj, setLoading])

      async function buscar() {
        setCnpj('03953552000102')
        await loadVendas()
        if (!dataFinal) {
            alert('executando busca do dia: ' + dataInicial)
            console.log(vendas)
            setDetalhes(true)
            
        } else {
          if (dataFinal < dataInicial) {
            alert('A Data Final não pode ser menor que a data inicial. Favor selecionar uma data válida.');
            return;
          } else if (dataFinal === '' || dataInicial === '') {
            alert('Favor selecionar um período de datas válido')
            return
          } else {
            alert(`Executou busca entre os dias ${dataInicial} e ${dataFinal}`)
          }
        }
      }

    function verify(){
        console.log('verificação')
        console.log('///////////')
        console.log('grupo: ' + grupo)
        console.log('cliente: ' + cliente)
        console.log('administradora: ' + adm)
        console.log('bandeira: ' + banSelecionada)
        console.log('data inicial: ' + dataInicial)
        console.log('data final: ' + dataFinal)
        console.log('cnpj: ' + cnpj)
    }

    function handleVerify(e){
        e.preventDefault()
        verify()
    }

    async function handleBusca(e){
        e.preventDefault()
        console.log(cnpj, dataInicial)
        await buscar()
    }

    function convertUTC(dateString){
        let [year, month, day] = dateString.split('/')

        let date = new Date(Date.UTC(year, month - 1, day))
        let utcString = date.toUTCString();

        return utcString
    }


    return(
        <>
            <div className='search-bar'>
                    <form className='date-container'>
                        <div className='date-column'>
                            <div className='select-card'>
                                <span>Grupo de Clientes</span>
                                <select value={grupo} onChange={(e) => {setGrupo(e.target.value)}}>
                                    <option defaultValue=''>selecione</option>
                                    <option>place_holder_01</option>
                                    <option>place_holder_02</option>
                                    <option>place_holder_03</option>
                                    <option>place_holder_04</option>
                                </select>
                            </div>
                        </div>

                        <div  className='date-column'>
                            <div className='select-card'>
                                <span>Cliente</span>
                                <select value={cliente} onChange={(e) => {setCliente(e.target.value)}}>
                                    <option defaultValue=''>selecione</option>
                                    <option>place_holder_01</option>
                                    <option>place_holder_02</option>
                                    <option>place_holder_03</option>
                                    <option>place_holder_04</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={handleBusca}>Pesquisar</button>
                        </div>

                        <div className='date-column'>
                            <div className='select-card'>
                                <span>Administradora</span>
                                <select defaultValue={adm} onChange={(e) => {setAdm(e.target.value)}}>
                                    <option defaultValue=''>selecione</option>
                                    <option>place_holder_01</option>
                                    <option>place_holder_02</option>
                                    <option>place_holder_03</option>
                                    <option>place_holder_04</option>
                                </select>
                            </div>
                            { detalhes ? <button className="btn btn-secondary" onClick={ () => { setDetalhes(false); setTotalLiquido(0.00); setTotalCredito(0.00); setTotalDebito(0.00); setTotalVoucher(0.00) }}>Fechar</button> : <button className='btn btn-secondary' disabled>Fechar</button>}
                        </div>
    

                        <div  className='date-column'>
                            <div className='select-card'>
                                <span>Bandeira</span>
                                    <select value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                        <option defaultValue=''>selecione</option>
                                        {BAN.map((BAN)=>(
                                            <option key={BAN.CODIGO} value = {BAN.DESCRICAO}>{BAN.DESCRICAO}</option>
                                        ))}
                                    </select>
                            </div>
                        </div>   
                    </form>
                </div>
        </>
    )
    
}

export default BuscarClienteData