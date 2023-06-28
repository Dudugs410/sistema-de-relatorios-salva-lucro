/* eslint-disable default-case */
import './detalhesData.css'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'

import DetalhesAdministradoras from '../DetalhesAdministradoras/detalhesAdministradoras'
import { VendasContext } from '../../pages/Vendas'

const DetalhesData = ({ close }) =>{

    const { vendas, setLoading, loadVendas } = useContext(AuthContext)
    const { dataBusca, cnpjBusca, setDetalhes, detalhes, setShowAdmin, showAdmin, totalDebito, totalCredito, totalVoucher, totalLiquido, setTotalDebito, setTotalCredito, setTotalVoucher, setTotalLiquido } = useContext(VendasContext)

    useEffect(()=>{
        if(!detalhes){
            zerarValores()
        }
        else{
            async function carregarDetalhesData(){
                await loadVendas(dataBusca, cnpjBusca)
                loadTotalDia(vendas)
            }
            carregarDetalhesData()
            console.log(vendas)
        }
    }, [detalhes])

    function loadTotalDia(vendasTemp){

        const valores = vendasTemp.reduce((total, vendas) =>{
            total.total += vendas.valorLiquido
            switch(vendas.produto.descricaoProduto){
            case 'Crédito':
                total.Credito += vendas.valorLiquido
                break
            case 'Débito':
                total.Debito += vendas.valorLiquido
                break
            case 'Voucher':
                total.Voucher += vendas.valorLiquido
                break
            }
    
            return total
            },{Credito: 0, Debito:0, Voucher: 0, total:0})
    
            console.log('Valores Crédito: ' + valores.Credito)
            console.log('Valores Débito: ' + valores.Debito)
            console.log('Valores Voucher: ' + valores.Voucher)
            console.log('Total: ' + valores.total)
    
            setTotalCredito(valores.Credito)
            setTotalDebito(valores.Debito)
            setTotalVoucher(valores.Voucher)
            setTotalLiquido(valores.total)
    
            setLoading(false)
    }


    const [adquirentes, setAdquirentes] = useState([])
    const [encontrou, setEncontrou] = useState(false)

    async function loadTotalAdministradoras(vendasTemp){
        setLoading(true)
        vendasTemp.forEach(element => {
            console.log(element)
            console.log('length: ', adquirentes.length)
            if(adquirentes.length === 0){
                let novoObjeto = { 
                    nomeAdquirente: element.adquirente.nomeAdquirente, 
                    total: element.valorLiquido,
                    id: 0
                }
                adquirentes.push(novoObjeto)
            }else{
                setEncontrou(false)
                let novoObjeto = { 
                    nomeAdquirente: element.adquirente.nomeAdquirente, 
                    total: element.valorLiquido,
                    id: 0
                }
                console.log('tamanho do vetor de adquirentes: ', adquirentes.length)
                
                if(!(adquirentes.find(objeto => objeto.nomeAdquirente === element.adquirente.nomeAdquirente))){
                    novoObjeto.id = (adquirentes.length)
                    adquirentes.push(novoObjeto)
                }
                else{
                    for(let i=0; i < adquirentes.length; i++){
                        if(adquirentes[i].nomeAdquirente === element.adquirente.nomeAdquirente){
                            adquirentes[i].total += element.valorLiquido
                        }
                    }
                }
            }
        });
        console.log('vetor de adquirentes: ', adquirentes)
        setLoading(false)
        /*adquirentes.push({
            nomeAdquirente: venda.adquirente.nomeAdquirente,
            valorLiquido: venda.valorLiquido,
        })*/
    }

  function zerarValores(){
    if(vendas){
      setDetalhes(false)
      setTotalLiquido(0.00)
      setTotalCredito(0.00)
      setTotalDebito(0.00)
      setTotalVoucher(0.00)
    }
    adquirentes.length = 0
    
  }
  
  async function handleAdmin(){
    await loadTotalAdministradoras(vendas)
    setShowAdmin(true)
  }
    
    return(
        <>
            {showAdmin ? <DetalhesAdministradoras adquirentes={adquirentes}/> :
            <div className='card-vendas'>
                <h1 className='title'>Vendas no total</h1>
                <hr/>
                <span>Formas de pagamento: </span>
                <br/><br/><br/>
                <div className='btn-div'>
                    <div className='valores-div'>
                        <span>Débito à vista: </span> <span>R$ {`${totalDebito.toFixed(2).toString().replace('.',',')}`}</span>
                    </div>
                    <div className='valores-div'>
                        <span>Crédito à vista: </span> <span>R$ {`${totalCredito.toFixed(2).toString().replace('.',',')}`}</span>
                    </div>
                    <div className='valores-div'>
                        <span>Voucher: </span> <span>R$ {`${totalVoucher.toFixed(2).toString().replace('.',',')}`}</span>
                    </div>
                    <hr/>
                    <div className='valores-div'>
                        <span>Total Líquido: </span> <span>R$ {`${totalLiquido.toFixed(2).toString().replace('.',',')}`}</span>
                    </div>
                    <div className='button-container'>
                        { detalhes ? <button type='button' className='botao-card btn btn-primary btn-adm' onClick={ handleAdmin }>Valores por Administradora</button> : <></>}
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default DetalhesData