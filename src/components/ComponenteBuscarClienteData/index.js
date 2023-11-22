import { useState, useEffect, useContext } from "react"
import { vendasStatic } from "../../contexts/static";
import '../Componente_BuscarClienteRecebimentos/buscarCreditos.scss'
import { CreditosContext } from "../../pages/Recebiveis";
import { AuthContext } from "../../contexts/auth";



const ComponenteBuscarClienteData = () => {

    const { detalhes, setDetalhes, dataBusca, cnpjBusca, creditosTemp, setCreditosTemp } = useContext(CreditosContext)
    const { returnCreditos, converteData, isDarkTheme } = useContext(AuthContext) 

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
        if((detalhes === true) && (creditosTemp.length === 0)){
            alert('não foram encontrados dados para a data selecionada')
            setDetalhes(false)
        }

    },[creditosTemp])

    return(
        <>
            <div className='search-bar'>
                <form className='date-container'>     
                    <div className='submit-container select-align'>
                        { detalhes ? <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className={`btn btn-primary btn-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={handleBusca}>Pesquisar</button>}
                    </div>      
                </form>
            </div>
        </>
    )
}

export default ComponenteBuscarClienteData