import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from "react-icons/fi";

import './detalhesCredito.scss'
import '../../styles/global.scss'

const TabelaVendasCreditos = ({array}) =>{

    const { vendas, creditos, dateConvert, setVendas, setCnpj, cnpjBusca, setCnpjBusca, tableData, setTableData, gerarDados, totaisGlobal, setTotaisGlobal, isDarkTheme } = useContext(AuthContext)

    const [vendasArray, setVendasArray] = useState([])

    const [vendasTeste, setVendasTeste] = useState([])
    const [vendasExibicao, setVendasExibicao] = useState([])

    const [bandeirasExistentes, setBandeirasExistentes] = useState([])
    const [adquirentesExistentes, setAdquirentesExistentes] = useState([])

    const [todasBandeiras, setTodasBandeiras] = useState('')
    const [todasAdquirentes, setTodasAdquirentes] = useState('')

    const [banSelecionada, setBanSelecionada] = useState('')
    const [adqSelecionada, setAdqSelecionada] = useState('')


    //adicionando páginas à tabela:

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // Number of items per page

    useEffect(() => {
        setCurrentPage(1); // Reset page to 1 when data changes
    }, [array]);

    // Change page functions
    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrease page by 1, minimum page is 1
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(vendasExibicao.length / itemsPerPage))); // Increase page by 1, maximum page is calculated based on array length
    };

    const goToFirstPage = () => {
        setCurrentPage(1); // Go to the first page
      };
    
      const goToLastPage = () => {
        setCurrentPage(Math.ceil(vendasExibicao.length / itemsPerPage)); // Go to the last page
      };
  
    // Calculate indexes for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = vendasExibicao.slice(indexOfFirstItem, indexOfLastItem);
  
    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // // // // // // // // // // // // // // // // // // // // // // // // // // //


    useEffect(()=>{
        if(array.length > 0){
            console.log('array recebido como parâmetro: ', array)
            console.log('Array vendas: ', vendas)
            console.log('Array créditos: ', creditos)
            setVendasArray(array)
        }
    },[])

    useEffect(()=>{
        async function init(){
            setVendasTeste(vendasArray)
        }
        init()
    },[vendasArray])

    useEffect(()=>{
        setVendasArray(array)

    },[array])

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
            setCurrentPage(1)
            
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

    const [style, setStyle] = useState({});

    useEffect(() => {
        // Retrieve the value from sessionStorage
        const pagina = sessionStorage.getItem('currentPath')
    
        if (pagina === '/dashboard') {
          setStyle({ display: 'none' })
        } else {
          setStyle({ display: 'block' })
        }
      }, [])

    return(
        <>
            <div className='date-container'>
                <div className='date-column'>
                    <div className='select-card select-align'>
                        <span className={`span-str ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} style={style}>Adquirente</span>
                        <select className={`${isDarkTheme ? 'dark-theme' : 'light-theme'}`} id='adquirente' value={adqSelecionada} onChange={(e) => {setAdqSelecionada(e.target.value)}} style={style}>
                            <option value='' selected>Todas</option>
                            {adquirentesExistentes.map((ADQ)=>(
                                <option key={ADQ} value={ADQ}>{ADQ}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='date-column'>
                    <div className='select-card select-align'>
                        <span className={`span-str ${isDarkTheme ? 'dark-theme' : 'light-theme'}`} style={style}>Bandeira</span>
                        <select className={`${isDarkTheme ? 'dark-theme' : 'light-theme'}`} id='bandeira' value={banSelecionada} onChange={(e) => {setBanSelecionada(e.target.value)}} style={style}>
                            <option value='' selected>Todas</option>
                            {bandeirasExistentes.map((BAN)=>(
                                <option key={BAN} value={BAN}>{BAN}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className='dropShadow vendas-view'>
                <div className={`table-wrapper ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                    <table className={`table table-striped det-table-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                            <thead>
                                <tr className={`det-tr-top-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
                                    <th className='det-th-global'scope="col">Adquirente</th>
                                    <th className='det-th-global'scope="col">Bandeira</th>
                                    <th className='det-th-global'scope="col">Valor Bruto</th>
                                    <th className='det-th-global'scope="col">Valor Líquido</th>
                                    <th className='det-th-global'scope="col">Taxa</th>
                                    <th className='det-th-global'scope="col">Valor Desconto</th>
                                    <th className='det-th-global'scope="col">Produto</th>
                                    <th className='det-th-global'scope="col">Data da Venda</th>
                                    <th className='det-th-global'scope="col">Hora da Venda</th>
                                    <th className='det-th-global'scope="col">Data do Crédito</th>
                                    <th className='det-th-global'scope="col">NSU</th>
                                    <th className='det-th-global'scope="col">Código da Autorização</th>
                                    <th className='det-th-global'scope="col">Número PV</th>
                                </tr>
                            </thead>
                        <tbody>
                            {vendasExibicao.length > 0 && currentItems.map((venda, index)=>{
                            return(
                                <tr key={index} className={`det-tr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}  >
                                    <td className='det-td-vendas-global'data-label="Adquirente">{venda.adquirente.nomeAdquirente}</td>
                                    <td className='det-td-vendas-global'data-label="Bandeira">{venda.bandeira.descricaoBandeira}</td>
                                    <td className='det-td-vendas-global'data-label="Valor Bruto"><span className={`green-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>{Number(venda.valorBruto).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
                                    <td className='det-td-vendas-global'data-label="Valor Líquido"><span className={`green-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>{Number(venda.valorLiquido).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
                                    <td className='det-td-vendas-global'data-label="Taxa"><span className='red-global'>{Number(venda.taxa)}%</span></td>
                                    <td className='det-td-vendas-global'data-label="Valor Desconto"><span className='red-global'>{Number(venda.valorDesconto).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span></td>
                                    <td className='det-td-vendas-global'data-label="Produto">{venda.produto.descricaoProduto}</td>
                                    <td className='det-td-vendas-global'data-label="Data da Venda">{dateConvert(venda.dataVenda)}</td>
                                    <td className='det-td-vendas-global'data-label="Hora da Venda">{ venda.horaVenda?.replaceAll('-', ':')}</td>
                                    <td className='det-td-vendas-global'data-label="Data do Crédito">{dateConvert(venda.dataCredito)}</td>
                                    <td className='det-td-vendas-global'data-label="NSU">{venda.nsu}</td>
                                    <td className='det-td-vendas-global'data-label="Código da Autorização">{venda.codigoAutorizacao}</td>
                                    <td className='det-td-vendas-global'data-label="Numero PV">{venda.numeroPV}</td>
                                </tr>
                            )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {vendasExibicao.length > itemsPerPage && (
                <div className="container-btn-pagina">
                    <button
                        className={`btn btn-primary btn-global btn-skip ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
                        onClick={goToFirstPage}
                        disabled={currentPage === 1} // Disable if already on the first page
                    >
                        <FiSkipBack />
                    </button>
                    <button
                        className={`btn btn-primary btn-global btn-navigate ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
                        onClick={goToPrevPage}
                        disabled={currentPage === 1} // Disable if it's the first page
                    >
                       <FiChevronLeft/> {/* Left arrow */}
                    </button>
                    <div className={`pagina-atual ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                        <span className={`texto-paginacao ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>Página </span>
                        <span className={`texto-paginacao ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>{currentPage}</span>
                    </div>
                    <button
                        className={`btn btn-primary btn-global btn-navigate ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
                        onClick={goToNextPage}
                        disabled={currentPage === Math.ceil(vendasExibicao.length / itemsPerPage)} // Disable if it's the last page
                    >
                        <FiChevronRight/> {/* Right arrow */}
                    </button>
                    <button
                        className={`btn btn-primary btn-global btn-skip ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
                        onClick={goToLastPage}
                        disabled={currentPage === Math.ceil(vendasExibicao.length / itemsPerPage)} // Disable if already on the last page
                    >
                        <FiSkipForward />
                    </button>
                </div>
            )}
        </>
    )
}

export default TabelaVendasCreditos