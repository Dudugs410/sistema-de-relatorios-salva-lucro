
import './totais.css'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { VendasContext } from '../../pages/Vendas'
import { FiDollarSign } from 'react-icons/fi'

const TotalModalidades = () =>{

    const { vendas, setLoading, loadVendas } = useContext(AuthContext)
    const { setShowAdmin, totalDebito, totalCredito, totalVoucher, totalLiquido, setTotalDebito, setTotalCredito, setTotalVoucher, setTotalLiquido } = useContext(VendasContext)

    const [adquirentes, setAdquirentes] = useState([])
    const [encontrou, setEncontrou] = useState(false)

    async function loadTotalAdquirentes(vendasTemp){
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
    }
  
  async function handleAdmin(){
    if(adquirentes.length === 0){
        await loadTotalAdquirentes(vendas)
    }
    setShowAdmin(true)
  }
    
    return(
        <>
            <div className='content-container'>
                <div className='total-container'>
                    <div className='text-container'>
                        <div className='card-title'>
                            <h1 className='title'>Débito</h1>
                        </div>
                        <p className='text'>TOTAL: R$ <span className='green'>{totalDebito.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container'>
                    <div className='text-container'>
                        <h1 className='title'>Crédito</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{totalCredito.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container'> 
                    <div className='text-container'>
                        <h1 className='title'>Voucher</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{totalVoucher.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='total-container'> 
                    <div className='text-container'>
                        <h1 className='title'>Total Líquido</h1>
                        <p className='text'>TOTAL: R$ <span className='green'>{totalLiquido.toFixed(2)}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TotalModalidades
    