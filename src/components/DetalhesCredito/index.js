import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import { recebimentosStatic } from "../../contexts/static"

import './detalhesCredito.css'

const DetalhesCredito = ({array}) =>{

    const { vendas, dateConvert, setVendas, setCnpj, teste, tableData, setTableData, gerarDados, totaisGlobal, setTotaisGlobal } = useContext(AuthContext)

    const [vendasArray, setVendasArray] = useState([])

    const [vendasTeste, setVendasTeste] = useState([])
    const [vendasExibicao, setVendasExibicao] = useState([])

    const [bandeirasExistentes, setBandeirasExistentes] = useState([])
    const [adquirentesExistentes, setAdquirentesExistentes] = useState([])

    const [todasBandeiras, setTodasBandeiras] = useState('')
    const [todasAdquirentes, setTodasAdquirentes] = useState('')

    const [banSelecionada, setBanSelecionada] = useState('')
    const [adqSelecionada, setAdqSelecionada] = useState('')

    useEffect(()=>{
        if(array.length > 0){
            console.log(array)
            setVendasArray(array)
        }
    },[])

    useEffect(()=>{
        async function init(){
            console.log(vendasArray)
            setVendasTeste(vendasArray)
        }
        init()
    },[vendasArray])

    useEffect(()=>{
        console.log('vendasTeste RECEBIMENTOS: ', vendasTeste)

    },[vendasTeste])

    function carregaTotais(array){
        console.log('array: ', array)
        if(array.length > 0){
          let temp = []
          let totalCreditoTemp = 0
          let totalDebitoTemp = 0
          let totalVoucherTemp = 0
          let totalLiquidoTemp = 0
    
          array.forEach((venda)=>{
            if(temp.length === 0){
              let novoObj = {
                  nomeAdquirente: venda.adquirente.nomeAdquirente,
                  total: venda.valorLiquido,
                  id: 0,
                  vendas: []
              }
              temp.push(novoObj)
            }else{
              let novoObj = {
                  nomeAdquirente: venda.adquirente.nomeAdquirente,
                  total: venda.valorLiquido,
                  id: 0,
                  vendas: []
              }
    
              if(!(temp.find((objeto) => objeto.nomeAdquirente === venda.adquirente.nomeAdquirente && objeto !== ( undefined || [] )))){
                  novoObj.id = (temp.length)
                  temp.push(novoObj)
              }
    
              else{
                  for(let i = 0; i < temp.length; i++){
                      if(temp[i].nomeAdquirente === venda.adquirente.nomeAdquirente){
                          temp[i].total += venda.valorLiquido
                      }
                  }
              }
            }
            // eslint-disable-next-line default-case
            switch(venda.produto.descricaoProduto){
              case 'Crédito':
                totalCreditoTemp += venda.valorLiquido
                break;
    
              case 'Débito':
                totalDebitoTemp += venda.valorLiquido
                break;
    
              case 'Voucher':
                totalVoucherTemp += venda.valorLiquido
                break;
            }
            totalLiquidoTemp += venda.valorLiquido
          })
            temp.forEach((adq) => {
                let vendasTemp = []
                vendasTemp.length = 0
                array.forEach((vendasDia) => {
                    if(vendasDia.length > 0){
                        vendasDia.forEach((venda) => {
                            if(venda.adquirente.nomeAdquirente === adq.nomeAdquirente){
                                vendasTemp.push(venda)
                            }
                            adq.vendas = vendasTemp
                        })
                    }
                })
            })
            
            console.log('TEPM: ', temp)
            
            let totalTemp = {debito: totalDebitoTemp, credito: totalCreditoTemp, voucher: totalVoucherTemp, liquido: totalLiquidoTemp}
    
            console.log('totalTemp:', totalTemp)
            setTotaisGlobal(totalTemp)
        }
      }

    useEffect(()=>{
        if(vendasExibicao.length > 0){
            gerarDados(vendasExibicao)
            carregaTotais(vendasExibicao)
            
        }
    },[vendasExibicao])

    useEffect(()=>{
        console.log('totaisGlobal: ', totaisGlobal)

    },[totaisGlobal])

    useEffect(()=>{
        console.log('dados a serem exportados: ', tableData)

    },[tableData])

    useEffect(()=>{
        console.log('vendasTeste: ', vendasTeste)

        setVendasExibicao(vendasTeste)

        const bandeirasTemp = []
        const uniqueStringsSet = new Set()
        
        vendasTeste.forEach(item => {
          if (!uniqueStringsSet.has(item.bandeira.descricaoBandeira)) {
            uniqueStringsSet.add(item.bandeira.descricaoBandeira)
            bandeirasTemp.push(item.bandeira.descricaoBandeira)
          }
        })

        const adquirentesTemp = []
        const otherUniqueStringsSet = new Set()
        
        vendasTeste.forEach(item => {
          if (!otherUniqueStringsSet.has(item.adquirente.nomeAdquirente)) {
            otherUniqueStringsSet.add(item.adquirente.nomeAdquirente)
            adquirentesTemp.push(item.adquirente.nomeAdquirente)
          }
        })
        console.log('bandeirasTemp: ', bandeirasTemp)
        console.log('adquirentesTemp: ',adquirentesTemp)

        setBandeirasExistentes(bandeirasTemp)
        setTodasBandeiras(bandeirasTemp)

        setAdquirentesExistentes(adquirentesTemp)
        setTodasAdquirentes(adquirentesTemp)

    },[vendasTeste])

    // função que altera lista de adquirentes de acordo com a bandeira/adq selecionada, para que o usuário só tenha opções existentes
    function atualizaADQ(){
        const adquirentesTemp = []
        const otherUniqueStringsSet = new Set()

        if(banSelecionada !== ''){
            vendasTeste.forEach(item => {
                if ((!otherUniqueStringsSet.has(item.adquirente.nomeAdquirente)) && (item.bandeira.descricaoBandeira === banSelecionada)) {
                  otherUniqueStringsSet.add(item.adquirente.nomeAdquirente)
                  adquirentesTemp.push(item.adquirente.nomeAdquirente)
                }
              })
              setAdquirentesExistentes(adquirentesTemp)
        } else {
            setAdquirentesExistentes(todasAdquirentes)
        }
    }

    function atualizaBAN(){
        const bandeirasTemp = []
        const otherUniqueStringsSet = new Set()

        if(adqSelecionada !== ''){
            vendasTeste.forEach(item => {
                if ((!otherUniqueStringsSet.has(item.bandeira.descricaoBandeira)) && (item.adquirente.nomeAdquirente === adqSelecionada)) {
                  otherUniqueStringsSet.add(item.bandeira.descricaoBandeira)
                  bandeirasTemp.push(item.bandeira.descricaoBandeira)
                }
              })
              setBandeirasExistentes(bandeirasTemp)
        } else {
            setBandeirasExistentes(todasBandeiras)
        }
    }

    useEffect(()=>{
        console.log('mudou a bandeira selecionada')
        if(adquirentesExistentes.length > 0 && bandeirasExistentes.length > 0){
            console.log('**** adquirentes e bandeiras > 0 ****')
            atualizaADQ()
        }

        if(banSelecionada === '' && adqSelecionada === ''){
            setVendasExibicao(vendasTeste)
        } 
        else if(banSelecionada !== '' && adqSelecionada === ''){
            let arrayFiltrado = vendasTeste.filter(venda => venda.bandeira.descricaoBandeira === banSelecionada)
            setVendasExibicao(arrayFiltrado)
        } 
        else if(banSelecionada !== '' && adqSelecionada !== ''){   
            let arrayFiltrado = vendasTeste.filter(venda => (venda.bandeira.descricaoBandeira === banSelecionada) && (venda.adquirente.nomeAdquirente === adqSelecionada))
            if(arrayFiltrado.length > 0){
                setVendasExibicao(arrayFiltrado)
            } else if(arrayFiltrado.length === 0){
                setVendasExibicao(vendasTeste)
            }
        } else {
            let arrayFiltrado = vendasTeste.filter(venda => venda.adquirente.nomeAdquirente === adqSelecionada)
            setVendasExibicao(arrayFiltrado)
        }

    },[banSelecionada])

    useEffect(()=>{
        console.log('mudou a adquirente selecionada')
        if(adquirentesExistentes.length > 0 && bandeirasExistentes.length > 0){
            atualizaBAN()
        }
        if(adqSelecionada === '' && banSelecionada === ''){
            setVendasExibicao(vendasTeste)
        }
        else if(adqSelecionada !== '' && banSelecionada === ''){
            let arrayFiltrado = vendasTeste.filter(venda => venda.adquirente.nomeAdquirente === adqSelecionada)
            setVendasExibicao(arrayFiltrado)
        } else if (adqSelecionada !== '' && banSelecionada !== '') {
            let arrayFiltrado = vendasTeste.filter(venda => (venda.bandeira.descricaoBandeira === banSelecionada) && (venda.adquirente.nomeAdquirente === adqSelecionada))
            if(arrayFiltrado.length > 0){
                setVendasExibicao(arrayFiltrado)
            } else if(arrayFiltrado.length === 0) {
                setVendasExibicao(vendasTeste)
            }
        } else {
            let arrayFiltrado = vendasTeste.filter(venda => venda.bandeira.descricaoBandeira === banSelecionada)
            setVendasExibicao(arrayFiltrado)
        }

    },[adqSelecionada])

    useEffect(()=>{
        console.log('bandeiras existentes na consulta: ', bandeirasExistentes)
    },[bandeirasExistentes])

    useEffect(()=>{
        console.log('adquirentes existentes na consulta: ', adquirentesExistentes)
    },[adquirentesExistentes])

    return(
        <>
            <div className='date-container'>
                <div className='date-column'>
                    <div className='select-card select-align'>
                        <span>Adquirente</span>
                        <select id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}}>
                            <option value='' selected>Todas</option>
                            {adquirentesExistentes.map((ADQ)=>(
                                <option key={ADQ} value={ADQ}>{ADQ}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='date-column'>
                    <div className='select-card select-align'>
                        <span>Bandeira</span>
                        <select id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}}>
                            <option value='' selected>Todas</option>
                            {bandeirasExistentes.map((BAN)=>(
                                <option key={BAN} value={BAN}>{BAN}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className='dropShadow vendas-view'>
                <div className='table-wrapper'>
                    <table className="table table-striped det-table">
                            <thead>
                                <tr className='det-tr-top' >
                                    <th className='det-th'scope="col">Adquirente</th>
                                    <th className='det-th'scope="col">Bandeira</th>
                                    <th className='det-th'scope="col">Valor Bruto</th>
                                    <th className='det-th'scope="col">Valor Líquido</th>
                                    <th className='det-th'scope="col">Valor Desconto</th>
                                    <th className='det-th'scope="col">Produto</th>
                                    <th className='det-th'scope="col">Data da Venda</th>
                                    <th className='det-th'scope="col">Hora da Venda</th>
                                    <th className='det-th'scope="col">Data do Crédito</th>
                                    <th className='det-th'scope="col">NSU</th>
                                    <th className='det-th'scope="col">Código da Autorização</th>
                                    <th className='det-th'scope="col">Número PV</th>
                                </tr>
                            </thead>
                        <tbody>
                            {vendasExibicao.length > 0 && vendasExibicao.map((venda, index)=>{
                            return(
                                <tr key={index} className='det-tr' >
                                    <td className='det-td-vendas'data-label="Adquirente">{venda.adquirente.nomeAdquirente}</td>
                                    <td className='det-td-vendas'data-label="Bandeira">{venda.bandeira.descricaoBandeira}</td>
                                    <td className='det-td-vendas'data-label="Valor Bruto">R$<span className='green'>{`${venda.valorBruto.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Valor Líquido">R$<span className='green'>{`${venda.valorLiquido.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Valor Desconto">R$ <span className='red'>{`${venda.valorDesconto.toFixed(2)}`.toString().replace('.',',')}</span></td>
                                    <td className='det-td-vendas'data-label="Produto">{venda.produto.descricaoProduto}</td>
                                    <td className='det-td-vendas'data-label="Data da Venda">{dateConvert(venda.dataVenda)}</td>
                                    <td className='det-td-vendas'data-label="Hora da Venda">{ venda.horaVenda?.replaceAll('-', ':')}</td>
                                    <td className='det-td-vendas'data-label="Data do Crédito">{dateConvert(venda.dataCredito)}</td>
                                    <td className='det-td-vendas'data-label="NSU">{venda.nsu}</td>
                                    <td className='det-td-vendas'data-label="Código da Autorização">{venda.codigoAutorizacao}</td>
                                    <td className='det-td-vendas'data-label="Numero PV">{venda.numeroPV}</td>
                                </tr>
                            )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default DetalhesCredito