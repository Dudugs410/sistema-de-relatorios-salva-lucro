
import './dashboard.css'

//////
import Cookies from "js-cookie"
//////
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import LoadingModal from '../../components/LoadingModal'
//////


const Dashboard = () => {
    
    const { setIsSignedIn, setAccessToken } = useContext(AuthContext)
    const { loading, loadPeriodo, cnpj, dateConvertSearch } = useContext(AuthContext)
    
    const [vendasDash, setVendasDash] = useState([])
    
////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setIsSignedIn(sessionStorage.getItem('isSignedIn'))
        setAccessToken(Cookies.get('token'))
    },[setAccessToken, setIsSignedIn])

    useEffect(()=>{
        async function iniciaDashboard(){
            let dataAnterior = new Date()
            dataAnterior.setDate(dataAnterior.getDate() - 5)
            await loadPeriodo(dateConvertSearch(dataAnterior),dateConvertSearch(new Date()), cnpj)
            .then((response) =>{
                setVendasDash(response)
                console.log(vendasDash)
        iniciaDashboard()
    },[])

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

  return(
    <>
        { loading ? <LoadingModal/> : <div className='appPage'>

            <div className='content-area dash'>
                <div className='graph-area'>
                    <div className='graph-data'>
                        
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