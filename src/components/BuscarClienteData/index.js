import { useState, useEffect, useContext } from "react"
import DateRange from "../DateRange"
import Cookies from "js-cookie"

import { AuthContext } from "../../contexts/auth"
import api from "../../services/api"

import './buscar.css'

const BuscarClienteData = () => {
    const [BAN, setBAN] = useState([])
    const [loading, setLoading] = useState(false)

    const [grupo, setGrupo] = useState('')
    const [cliente, setCliente] = useState('')
    const [adm, setAdm] = useState('')
    const [dataInicial, setDataInicial] = useState('')
    const [dataFinal, setDataFinal] = useState('')
    const [banSelecionada, setBanSelecionada] = useState('')
    const [totalVendas, setTotalVendas] = useState([])

    const { loadVendas } = useContext(AuthContext)

    useEffect(() => {
        const loadBandeiras = async () =>{
          const result = await api.get('/bandeira')
          console.log(result)
          setBAN(result.data)
          setLoading(false)
        }
        loadBandeiras()
      }, [])

    function buscar(){
        if(dataFinal < dataInicial){
            alert('a Data Final não pode ser menor que a data inicial. Favor selecionar uma data válida.')
            return
        }
        else if(dataFinal==='' || dataInicial==='')
        {
            alert('favor selecionar um período de datas válido')
            return
        }
        else{
            alert(`executou busca entre os dias ${dataInicial} e ${dataFinal}`);
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
                            <div className="select-card">
                                <span className='date-text'>Data Inicial</span>
                                <input className='date-picker' id="date" type="date" onChange={(e)=>setDataInicial(e.target.value)}></input>
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
                            <div className="select-card">
                                <span  className='date-text'>Data Final</span>
                                <input className='date-picker' id="date" type="date" onChange={(e)=>setDataFinal(e.target.value)}></input>
                            </div>
                            
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
    

                        <div  className='date-column'>
                            <button className="btn btn-primary" onClick={buscar}>Pesquisar</button>
                            <button className="btn btn-primary" onClick={verify}>Verificar</button>
                        </div>   
                    </form>
                </div>
        </>
    )
    
}

export default BuscarClienteData