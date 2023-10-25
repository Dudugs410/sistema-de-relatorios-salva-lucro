import Calendar from "react-calendar"
import './recebimentos.scss'
import { useContext, useEffect, useState } from "react"
import DetalhesCredito from "../../components/DetalhesCredito"
import { AuthContext } from "../../contexts/auth"
import TotalModalidadesComp from "../../components/Componente_TotalModalidades"
import TabelaGenericaAdm from "../../components/Componente_TabelaAdm"
import ComponenteBuscarClienteData from '../../components/ComponenteBuscarClienteData'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import Modal from "../../components/Modal"
import DetalhesBanco from "../../components/DetalhesBanco"
import Cookies from "js-cookie"

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
      dateConvertSearch,
      returnCreditosBanco,
      totaisGlobal,
      setTotaisGlobal,
      tableData,
      gerarDados,

    } = useContext(AuthContext)

    const [dataBusca, setDataBusca] = useState(new Date())
    const [buscou, setBuscou] = useState(false)

    const [creditosTemp, setCreditosTemp] = useState([])
    const [arrayAdm, setArrayAdm] = useState([])
    const [arrayBancos, setArrayBancos] = useState([])

    const [detalhes, setDetalhes] = useState(false)
    const [admBusca, setAdmBusca] = useState('')
    const [banBusca, setBanBusca] = useState('')

    const [totalCredito, setTotalCredito] = useState(0)
    const [totalDebito, setTotalDebito] = useState(0)
    const [totalVoucher, setTotalVoucher] = useState(0)
    const [totalTotal, setTotalTotal] = useState(0)

    useEffect(()=>{
      async function inicializar(){
        setCnpj(Cookies.get('cnpj'))
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
      setTotaisGlobal({debito: 0, credito: 0, voucher: 0, liquido: 0})
      arrayBancos.length = 0
    }

    useEffect(()=>{
      if((creditosTemp) && (creditosTemp.length > 0 || null)){
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

        setTotaisGlobal({debito: deb, credito: cred, voucher: vou, liquido: total})
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

      const [arrayRelatorio, setArrayRelatorio] = useState([])
    
    useEffect(()=>{
      if((creditosTemp) && (creditosTemp.length > 0)){
        console.log('creditosTemp: ', creditosTemp)
        setArrayRelatorio(gerarDados(creditosTemp))
        setArrayAdm(separaAdm(creditosTemp))
      }
    },[creditosTemp])

    const [codigoBancos, setCodigoBancos] = useState([])

    useEffect(()=>{
      let listaCodigo = []
      creditosTemp.forEach((credito) =>{
        if(listaCodigo.length === 0){          
          listaCodigo.push(credito.banco)
        }else{
          ///////////////////////////////////////////////////////////////////
          const foundValue = listaCodigo.find(item => item === credito.banco);
          if (foundValue !== undefined) {

          } else {
            listaCodigo.push(credito.banco)
          }
          ///////////////////////////////////////////////////////////////////
        }
      })
      console.log('listaCodigo: ', listaCodigo)
      setCodigoBancos(listaCodigo)
    },[creditosTemp])

    useEffect(() => {
      const fetchData = async () => {
        let promises = codigoBancos.map(async (codigo) => {
          return await returnCreditosBanco(cnpj, dataBusca, dataBusca, codigo.substring(codigo.length - 3));
        });
    
        let tempArray = await Promise.all(promises);
        setArrayBancos(tempArray);
      };
    
      fetchData();
    }, [codigoBancos]);

    useEffect(()=>{
      console.log('arrayBancos: ', arrayBancos)
    },[arrayBancos])

    const [showBanco, setShowBanco] = useState(false)

    async function handleShowBanco(){
      setShowBanco(true)
    }

    return(
        <div className='appPage app-page-recebimentos'>
        { showBanco &&
          <Modal onClose={() => setShowBanco(false)}>
            <div className='modal-adm'>
              <DetalhesBanco array={arrayBancos}/>
            </div>
          </Modal>
        }
          <div className='page-recebimentos-background'>
            <div className='page-content-recebimentos'>
              <div className='recebimentos-title-container'>
                <h1 className='recebimentos-title'>Calendário de Recebimentos</h1>
              </div>
              <hr className='hr-recebimentos'/>
              <TotalModalidadesComp texto1={'Débito'} valor1={totalDebito} texto2={'Crédito'} valor2={totalCredito} texto3={'Voucher'} valor3={totalVoucher} texto4={'Total Líquido'} valor4={totalTotal} />
              <hr className='hr-recebimentos'/>
              { detalhes ? <GerarRelatorio className='export' tableData={tableData} dataAtual={dateConvertSearch(dataBusca)} detalhes={detalhes}/> : <></> }
              <div className='component-container-recebimentos'>
                { detalhes ? <DetalhesCredito array={creditosTemp}/> :  <MyCalendar/> }
                {arrayAdm && detalhes ? <TabelaGenericaAdm Array={arrayAdm}/> : <></>}
                { detalhes ? <hr className='hr-recebimentos' /> : <></> }
                { detalhes ? <button className="btn btn-primary btn-banco-recebimentos" onClick={handleShowBanco}>Valores por Banco</button> : <></> }
                <ComponenteBuscarClienteData detalhes={detalhes} adquirentes={adquirentes} bandeiras={bandeiras} onAdmUpdate={handleAdm} onBanUpdate={handleBan} onBuscaUpdate={handleUpdate}/>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Recebiveis