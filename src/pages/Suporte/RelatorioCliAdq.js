import { FiFilePlus } from 'react-icons/fi'


const RelatorioCliAdq = (adqfiltradas, handleAdqChange, adqSelecionada) =>{
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
                            styles={{ maxWidth: '500px'}}
                            options={adqfiltradas}
                            onChange={handleAdqChange}
                            value={adqSelecionada}
                            placeholder="Selecione"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
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

export default RelatorioCliAdq