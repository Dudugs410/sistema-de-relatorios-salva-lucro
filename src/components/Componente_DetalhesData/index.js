/* eslint-disable default-case */
import './detalhesData.css'

import { useEffect, useState } from 'react'

import DetalhesAdquirentes from '../DetalhesAdquirentes'

const DetalhesData = ({arrayVendas, arrayAdq }) =>{

    const [totalDebito, setTotalDebito] = useState(0)
    const [totalCredito, setTotalCredito] = useState(0)
    const [totalVoucher, setTotalVoucher] = useState(0)
    const [totalLiquido, setTotalLiquido] = useState(0)

    const [detalhes, setDetalhes] = useState(false)
    const [showAdmin, setShowAdmin] = useState(false)

    useEffect(()=>{
        function init(){
            loadTotalDia(arrayVendas)
        }
        init()
    },[])

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
    }

    const [adqTemp, setAdqTemp] = useState([])
    const [encontrou, setEncontrou] = useState(false)

    async function loadTotalAdquirentes(vendasTemp){
        vendasTemp.forEach(element => {
            if(adqTemp.length === 0){
                let novoObjeto = { 
                    nomeAdquirente: element.adquirente.nomeAdquirente, 
                    total: element.valorLiquido,
                    id: 0
                }
                adqTemp.push(novoObjeto)
            }else{
                setEncontrou(false)
                let novoObjeto = { 
                    nomeAdquirente: element.adquirente.nomeAdquirente, 
                    total: element.valorLiquido,
                    id: 0
                }
                console.log('tamanho do vetor de adquirentes: ', adqTemp.length)
                
                if(!(adqTemp.find(objeto => objeto.nomeAdquirente === element.adquirente.nomeAdquirente))){
                    novoObjeto.id = (adqTemp.length)
                    adqTemp.push(novoObjeto)
                }
                else{
                    for(let i=0; i < adqTemp.length; i++){
                        if(adqTemp[i].nomeAdquirente === element.adquirente.nomeAdquirente){
                            adqTemp[i].total += element.valorLiquido
                        }
                    }
                }
            }
        });
        console.log('vetor de adquirentes: ', adqTemp)
    }

  function zerarValores(){
    if(arrayVendas){
      setTotalLiquido(0.00)
      setTotalCredito(0.00)
      setTotalDebito(0.00)
      setTotalVoucher(0.00)
    }
    adqTemp.length = 0
  }
  
  async function handleAdmin(){
    if(adqTemp.length === 0){
        await loadTotalAdquirentes(arrayVendas)
    }
    setShowAdmin(true)
  }
    
    return(
        <>
            {showAdmin ? <DetalhesAdquirentes adquirentes={adqTemp}/> :
            <div className='card-vendas'>
                <h1 className='title'>Vendas no total</h1>
                <hr/>
                <span>Formas de pagamento: </span>
                
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