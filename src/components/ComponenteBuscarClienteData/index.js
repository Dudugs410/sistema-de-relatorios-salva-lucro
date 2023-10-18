import { useState, useEffect, useContext } from "react"
import { vendasStatic } from "../../contexts/static";
import '../Componente_BuscarClienteRecebimentos/buscarCreditos.scss'



const ComponenteBuscarClienteData = ({detalhes, adquirentes, bandeiras, onAdmUpdate, onBanUpdate, onBuscaUpdate}) => {
    const [banSelecionada, setBanSelecionada] = useState('')
    const [adqSelecionada, setAdqSelecionada] = useState('')

    function handleBusca(e){
        console.log('handleBusca()')
        e.preventDefault()
        onBuscaUpdate(true)
    }

    function handleVoltar(e){
        console.log('handleVoltar()')
        e.preventDefault()
        onBuscaUpdate(false)
    }

    useEffect(()=>{
        onAdmUpdate(adqSelecionada)
    },[adqSelecionada])

    useEffect(()=>{
        onBanUpdate(banSelecionada)
    },[banSelecionada])

    return(
        <>
            <div className='search-bar'>
                <form className='date-container'>
                    <div className='date-column'>
                        <div className='select-card select-align'>
                            <span>Adquirente</span>
                            { detalhes ? 
                                <select disabled className='select-disabled' id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {adquirentes.map((ADQ)=>(
                                        <option key={ADQ.codigoAdquirente} value = {ADQ.codigoAdquirente}>{ADQ.nomeAdquirente}</option>
                                    ))}
                                </select>
                            : 
                                <select  id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {adquirentes.map((ADQ)=>(
                                        <option key={ADQ.codigoAdquirente} value = {ADQ.codigoAdquirente}>{ADQ.nomeAdquirente}</option>
                                    ))}
                                </select>
                            }
                        </div>
                    </div>
                    <div  className='date-column'>
                        <div className='select-card select-align'>
                            <span>Bandeira</span>
                            { detalhes ? 
                                <select disabled className='select-disabled' id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {bandeiras.map((BAN)=>(
                                        <option key={BAN.codigoBandeira} value = {BAN.codigoBandeira}>{BAN.descricaoBandeira}</option>
                                    ))}
                                </select>  
                            :
                                <select id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                                    <option value='' selected>Todas</option>
                                    {bandeiras.map((BAN)=>(
                                        <option key={BAN.codigoBandeira} value = {BAN.codigoBandeira}>{BAN.descricaoBandeira}</option>
                                    ))}
                                </select>
                                 }
                        </div>
                    </div>        
                    <div className='submit-container select-align'>
                        { detalhes ? <button className="btn btn-secondary btn-submit" onClick={ (e) => { handleVoltar(e) }}>Voltar</button> : <button className="btn btn-primary btn-submit" onClick={handleBusca}>Pesquisar</button>}
                    </div>      
                </form>
            </div>
        </>
    )
}

export default ComponenteBuscarClienteData