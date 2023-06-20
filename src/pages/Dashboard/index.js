
import './dashboard.css'

//////
import Cookies from "js-cookie"
//////
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import LoadingModal from '../../components/LoadingModal'
//////
import RePieChart from '../../components/GraficoPie/repiechart'


const Dashboard = () => {
    
    const { setIsSignedIn, setAccessToken } = useContext(AuthContext)
    const { loading, setLoading, vendaAtual, vendaDias, loadVendas, cnpj, vendas, dateConvertSearch } = useContext(AuthContext)
    const [vendasDash, setVendasDash] = useState([])
////////////////////////////////////////////////////////////////////
    
    const totalVendasDias = []
    const totalRecebíveis = []

    useEffect(() => {
        setIsSignedIn(sessionStorage.getItem('isSignedIn'))
        setAccessToken(Cookies.get('token'))
    },[setAccessToken, setIsSignedIn])

    useEffect(()=>{
        async function iniciaDashboard(){
            let dataAnterior = new Date()
            dataAnterior.setDate(dataAnterior.getDate() - 1)
            await loadVendas(dateConvertSearch(dataAnterior), cnpj)
            .then(
                setVendasDash(vendas)
            )
        }
        iniciaDashboard()
        console.log('vendas: ', vendas)
        setVendasDash(vendas)
        console.log('vendasDash: ', vendasDash)
    },[])

    useEffect(()=>{
        console.log('vendasDash: ', vendasDash)
    }, [vendasDash])

    useEffect(()=>{
        console.log('vendas: ', vendas)
    }, [vendas])

    /*async function loadTotalDia(vendaDias){
    console.log('loadTotalDia()')
    console.log(vendaDias)
    console.log('dias: ')
    console.log(dias)
    vendaDias.reduce((total, vendas) =>{
        if(total !== undefined){
        total += vendas.valorLiquido
        valores = total
        } else {
        total = 0
        valores = total
        }
        return total
    },0)
    }*/
    
  

    function handleShowVendas(){
        console.log('vendasDash: ', vendasDash)
        console.log('vendas: ', vendas)
    }

  return(
    <>
        { loading ? <LoadingModal/> : <div className='appPage'>

            <button className='btn btn-danger' onClick={handleShowVendas}>vendasDash</button>

            <div className='content-area dash'>
                <div className='graph-area'>
                    <div className='graph-data'>
                        <RePieChart/>
                    </div>
                    <div className='graph-data'>
                        
                    </div>
                </div>
                <div className='table-area'>
                    <div className='table-data'>
                        <table className="table dash-table">
                            <thead className='dash-thead'>
                                <tr className='dash-tr'>
                                    <th className='dash-th' scope="col">Débito</th>
                                    <th className='dash-th' scope="col">Crédito</th>
                                    <th className='dash-th' scope="col">Voucher</th>
                                </tr>
                            </thead>
                            <tbody className='dash-tbody'>
                                <tr className='dash-tr'>
                                    <td className='cell-text dash-td' data-label="Débito">Débito</td>
                                    <td className='cell-text dash-td' data-label="Crédito">Crédito</td>
                                    <td className='cell-text dash-td' data-label="Voucher">Voucher</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='table-data'>
                        <table className="table dash-table">
                                <thead className='dash-thead'>
                                    <tr className='dash-tr'>
                                        <th className='dash-th' scope="col">Débito</th>
                                        <th className='dash-th' scope="col">Crédito</th>
                                        <th className='dash-th' scope="col">Voucher</th>
                                    </tr>
                                </thead>
                                <tbody className='dash-tbody'>
                                    <tr className='dash-tr'>
                                        <td className='cell-text dash-td' data-label="Débito">Débito</td>
                                        <td className='cell-text dash-td' data-label="Crédito">Crédito</td>
                                        <td className='cell-text dash-td' data-label="Voucher">Voucher</td>
                                    </tr>
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div> }
    </>  
  )  
}

export default Dashboard