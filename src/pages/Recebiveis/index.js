import Calendar from "react-calendar"
import './recebimentos.css'
import { useContext, useEffect, useState } from "react"
import DetalhesCredito from "../../components/DetalhesCredito"
import { AuthContext } from "../../contexts/auth"
import TotalModalidadesComp from "../../components/Componente_TotalModalidades"
import TabelaGenericaAdm from "../../components/Componente_TabelaAdm"
import ComponenteBuscarClienteData from '../../components/ComponenteBuscarClienteData'
import GerarRelatorio from "../../components/GerarRelatorio"
import ModalBanco from "../../components/ModalBanco"
import DetalhesBanco from "../../components/DetalhesBanco"

const Recebiveis = () =>{

    const { 
      cnpj,
      setCnpj, 
      returnCreditos, 
      converteData, 
      grupos,
      loadGrupos, 
      bandeiras, 
      loadBandeiras,
      adquirentes,
      loadAdquirentes,
      dateConvert,
      dateConvertSearch,
      returnCreditosBanco,
    } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState(new Date())
    const [buscou, setBuscou] = useState(false)

    const [creditosTemp, setCreditosTemp] = useState([])
    const [bancosTemp, setBancosTemp] = useState([])
    const [arrayAdm, setArrayAdm] = useState([])

    const [detalhes, setDetalhes] = useState(false)
    const [admBusca, setAdmBusca] = useState('')
    const [banBusca, setBanBusca] = useState('')

    const [totalCredito, setTotalCredito] = useState(0)
    const [totalDebito, setTotalDebito] = useState(0)
    const [totalVoucher, setTotalVoucher] = useState(0)
    const [totalTotal, setTotalTotal] = useState(0)

    useEffect(()=>{
      async function inicializar(){
        setCnpj(sessionStorage.getItem('cnpj'))
        if(bandeiras.length === 0){
          await loadBandeiras()
        }
        
        if(adquirentes.length === 0){
          await loadAdquirentes()
        }
        
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
        let temp = await returnCreditos(converteData(dataBusca), converteData(dataBusca), cnpj)
        let tempAux = []
        if(admBusca && banBusca){
          temp.forEach((elemento) => {
            if(elemento.adquirente.nomeAdquirente === admBusca && elemento.bandeira.descricaoBandeira === banBusca){
              tempAux.push(elemento)
            }
          })
        }
        else if(admBusca && !banBusca){
          temp.forEach((elemento) => {
            if(elemento.adquirente.nomeBandeira === admBusca){
              tempAux.push(elemento)
           }
          })
        }
        else if(!admBusca && banBusca){
          temp.forEach((elemento) => {
           if(elemento.bandeira.descricaoBandeira === banBusca){
             tempAux.push(elemento)
            }
          })
        }
        temp = tempAux
        console.log('temp: ', temp)
        
        setCreditosTemp(temp)
      }
    }

    useEffect(()=>{
      if(buscou && cnpj){
        async function init(){
          setBuscou(true)
          const temp = await returnCreditos(converteData(dataBusca), converteData(dataBusca), cnpj)
          setCreditosTemp(temp)
          console.log('temp:', temp)
        }
        init()
      } 
      else if(!buscou){
        handleVoltar()
      }
    },[buscou])

    function handleVoltar(){
      setTotalCredito(0)
      setTotalDebito(0)
      setTotalVoucher(0)
      setTotalTotal(0)
      setArrayAdm([])
      setBuscou(false)
      setDetalhes(false)
      setAdmBusca(null)
      setBanBusca(null)
      bancosTemp.length = 0
    }

    useEffect(()=>{
      if(creditosTemp.length > 0){
        let cred = 0.00
        let deb = 0.00
        let vou = 0.00
        let total = 0.00
        console.log('creditosTemp: ', creditosTemp)

        creditosTemp.forEach((element) => {
            total += element.valorLiquido
            // eslint-disable-next-line default-case
            switch (element.produto.descricaoProduto){
              case 'Crédito':
                cred += element.valorLiquido
                break;
              
              case 'Débito':
                deb += element.valorLiquido
                break;

              case 'Voucher':
                vou += element.valorLiquido
                break;
            }
        })
        console.log('cred: ', cred)
        console.log('deb: ', deb)
        console.log('vou: ', vou)
        console.log('total: ', total)

        setTotalCredito(cred)
        setTotalDebito(deb)
        setTotalVoucher(vou)
        setTotalTotal(total)

        const temp = separaAdm(creditosTemp)
        console.log(temp)
        setArrayAdm(temp)

        setDetalhes(true)
      }
    },[creditosTemp])

  function separaAdm(array){
    console.log('array: ', array)
    if(array.length > 0){
      let temp = []
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
      return temp
    }
  }

  function handleDetalhes(childData){
    setDetalhes(detalhes)
    console.log(detalhes)

  }

  function handleAdm(childData){
    setAdmBusca(childData)
    console.log(admBusca)
  }

  function handleBan(childData){
    setBanBusca(childData)
    console.log(banBusca)
  }

  function handleUpdate(childData){
    setBuscou(childData)
    console.log(buscou)
  }

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

      const [tableData, setTableData] = useState([])
      const [arrayRelatorio, setArrayRelatorio] = useState([])

      function gerarDados(array){
        tableData.length = 0
        console.log('vendas ao gerar Dados: ', array)
        if (array.length > 0) {
          array.map((venda) => {
            tableData.push({
              adquirente: venda.adquirente.nomeAdquirente,
              bandeira: venda.bandeira.descricaoBandeira,
              produto: venda.produto.descricaoProduto,
              nsu: venda.nsu,
              cnpj: venda.cnpj,
              codigoVenda: venda.codigoVenda,
              codigoAutorizacao: venda.codigoAutorizacao,
              numeroPV: venda.numeroPV,
              valorBruto: 'R$' + venda.valorBruto.toFixed(2).replaceAll('.', ','),
              valorLiquido: 'R$' + venda.valorLiquido.toFixed(2).replaceAll('.', ','),
              taxa: 'R$' + venda.taxa.toFixed(2).replaceAll('.', ','),
              dataVenda: dateConvert(venda.dataVenda),
              horaVenda: venda.horaVenda,
              dataCredito: dateConvert(venda.dataCredito),
              parcelas: venda.quantidadeParcelas,
            })
            console.log('tableData: ', tableData)
            return tableData
          })
        }
        console.log('arrayRelatorio: ', arrayRelatorio)
      }
    
    useEffect(()=>{
      if(creditosTemp.length > 0){
        console.log(creditosTemp)
        setArrayRelatorio(gerarDados(creditosTemp))
        setArrayAdm(separaAdm(creditosTemp))
      }
    },[creditosTemp])

    useEffect(()=>{
      let temp = []
        creditosTemp.forEach((element)=>{
          if(temp.length === 0){
            let novoObj = {
                codigoBanco: element.banco,
                id: 0,
                creditos: []
            }
            temp.push(novoObj)
        }else{
            let novoObj = {
                codigoBanco: element.banco,
                id: 0,
                creditos: []
            }

            if(!(temp.find((objeto) => objeto.banco === creditosTemp.banco && objeto !== ( undefined || [] )))){
                novoObj.id = (temp.length)
                temp.push(novoObj)
            }
        }

        temp.forEach((element) => {
          let credTemp = []
          credTemp.length = 0
          creditosTemp.forEach((credito) => {
            if(credito.banco === element.codigoBanco){
                credTemp.push(credito)
            }
            element.creditos = credTemp
          })
        })
      })
      setBancosTemp(temp)
    },[creditosTemp])

    useEffect(()=>{
      console.log('bancosTemp: ',bancosTemp)

    },[bancosTemp])

    const [showBanco, setShowBanco] = useState(false)

    async function handleShowBanco(){
      setBancosTemp(await returnCreditosBanco(cnpj, converteData(dataBusca), converteData(dataBusca), '341'))
      setShowBanco(true)
    }

    return(
        <div className='appPage'>
        { showBanco && 
          <ModalBanco onClose={() => setShowBanco(false)}>
            <div className='modal-adm'>
              <DetalhesBanco array={bancosTemp}/>
            </div>
          </ModalBanco>}
          <div className='page-content'>
          <div className='recebimentos-title-container'>
            <h1 className='recebimentos-title'>Calendário de Recebimentos</h1>
          </div>
            <TotalModalidadesComp texto1={'Débito'} valor1={totalDebito} texto2={'Crédito'} valor2={totalCredito} texto3={'Voucher'} valor3={totalVoucher} texto4={'Total Líquido'} valor4={totalTotal} />
            { detalhes ? <DetalhesCredito array={creditosTemp}/> :  <MyCalendar/> }
            <div className='btn-div-recebimentos'>
              <ComponenteBuscarClienteData detalhes={detalhes} adquirentes={adquirentes} bandeiras={bandeiras} onAdmUpdate={handleAdm} onBanUpdate={handleBan} onBuscaUpdate={handleUpdate}/>
            </div>
            <div className='btn-banco-container'>
              <button className="btn btn-primary" onClick={handleShowBanco}>Valores por Banco</button>
            </div>
            { detalhes ? <hr/> : <></> }
            { detalhes ? <GerarRelatorio className='export' tableData={tableData} dataAtual={dateConvertSearch(dataBusca)} detalhes={detalhes}/> : <></> }
            { detalhes ? <hr/> : <></> }
            {arrayAdm && detalhes ? <TabelaGenericaAdm Array={arrayAdm}/> : <></>}
            { detalhes ? <hr/> : <></> }
          </div>
        </div>
    )
}

export default Recebiveis