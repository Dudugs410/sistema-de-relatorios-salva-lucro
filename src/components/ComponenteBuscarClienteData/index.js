import { useState, useEffect, useContext } from "react"
import { vendasStatic } from "../../contexts/static";
import '../Componente_BuscarClienteRecebimentos/buscarCreditos.scss'
import { CreditosContext } from "../../pages/Recebiveis";
import { AuthContext } from "../../contexts/auth";



const ComponenteBuscarClienteData = () => {

    const { detalhes, setDetalhes, dataBusca, cnpjBusca, creditosTemp, setCreditosTemp } = useContext(CreditosContext)
    const { returnCreditos, converteData, alerta } = useContext(AuthContext) 

    useEffect(()=>{
        setCreditosTemp([])
    },[])

    async function handleBusca(e){
        console.log('handleBusca()')
        e.preventDefault()
        console.log(converteData(dataBusca), cnpjBusca)
        const response = await returnCreditos(converteData(dataBusca), converteData(dataBusca), cnpjBusca)
        setCreditosTemp(response)
        setDetalhes(true)
    }

    function handleVoltar(e){
        console.log('handleVoltar()')
        e.preventDefault()
        setDetalhes(false)
    }

    useEffect(()=>{
        console.log('CREDITOS TEMP: ',creditosTemp)
        if(((detalhes === true) && creditosTemp.length === 0)){

            setDetalhes(false)
        }

    },[creditosTemp])

    return(
        <>
            <div className='search-bar'>
                <form className='date-container'>     
                    <div className='submit-container select-align'>
                        { detalhes ? <button className="btn btn-secondary btn-submit" onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className="btn btn-primary btn-submit" onClick={handleBusca}>Pesquisar</button>}
                    </div>      
                </form>
            </div>
        </>
    )
}

export default ComponenteBuscarClienteData