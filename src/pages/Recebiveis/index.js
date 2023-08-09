import Calendar from "react-calendar"
import './recebimentos.css'
import { useContext, useEffect, useState } from "react"
import DetalhesCredito from "../../components/DetalhesCredito"
import { AuthContext } from "../../contexts/auth"
import DetalhesData from "../../components/DetalhesData"

const Recebiveis = () =>{

    const { cnpj, returnCreditos, converteData, grupos, clientes, loadGrupos, loadClientes } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState(new Date())
    const [buscou, setBuscou] = useState(false)
    const [detalhes, setDetalhes] = useState(false)

    const [creditosTemp, setCreditosTemp] = useState([])

    useEffect(()=>{
      async function inicializar(){
        /*if(bandeiras.length === 0){
          await loadBandeiras()
        }*/
        
        /*if(adquirentes.length === 0){
          await loadAdquirentes()
        }*/
        
        if(grupos.length === 0){
          await loadGrupos()        
        }
      }
      inicializar()
    },[])

    function handleDateChange(date){
      setDataBusca(date)

    }

    async function handleBuscar(){
      if(cnpj){
        setBuscou(true)
        const temp = await returnCreditos(converteData(dataBusca), converteData(dataBusca), cnpj)
        console.log(temp)
        setCreditosTemp(temp)
      }
      else{
        alert('Selecione um Cliente Válido')
      }
    }

    useEffect(()=>{
      if(creditosTemp.length > 0){
        setDetalhes(true)
      }
    },[creditosTemp])

    function MyCalendar() {
        return (
          <div>
            <Calendar
              onChange={ handleDateChange }
              value={ dataBusca }
              onClick={ console.log(dataBusca) }
            />
          </div>
        )
      }

    return(
        <div className='appPage'>
            <div>
              <h1 className='recebimentos-title'>Calendário de Recebimentos</h1>
            </div>
              { detalhes ? <DetalhesCredito array={creditosTemp}/> :  <MyCalendar/> }
            <div className='btn-div-recebimentos'>
              { detalhes ? <button className='btn btn-danger' onClick={()=>{setDetalhes(false)}}>Voltar</button> : <button className='btn btn-primary' onClick={handleBuscar}>Pesquisar</button> }
            </div>
        </div>
    )
}

export default Recebiveis