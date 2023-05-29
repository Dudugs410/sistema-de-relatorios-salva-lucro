
import './dashboard.css'
//////
import Cookies from "js-cookie"
//////
import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/auth"
//////
import { clienteVendas } from "../../resources/teste"
//////
import GraficoTorta from "../../components/Grafico"

const Dashboard = () => {
    
    const { isSignedIn, setIsSignedIn, accessToken, setAccessToken } = useContext(AuthContext)
    const { vendas, loadVendas } = useContext(AuthContext)

    useEffect(() => {
        console.log('Dashboard')
        console.log(vendas)
    },[])
    
    useEffect(() => {
        setIsSignedIn(sessionStorage.getItem('isSignedIn'))
        setAccessToken(Cookies.get('token'))
    },[setAccessToken, setIsSignedIn])
    
    /////TESTE DO GRÁFICO//////
    // Dados de vendas dos últimos 5 dias
    const lastFiveDaysSales = 
    clienteVendas
    .slice(-5)
    .map((vendas) => vendas.vendas.reduce((a, b) => a + b, 0))

  const dados5Dias = {
    labels: [],
    datasets: [
      {
        data: lastFiveDaysSales,
        backgroundColor: clienteVendas.slice(-5).map((vendas) => vendas.cor),
      },
    ],
  }

  // Dados de vendas do dia atual
  const dadosDiaAtual = {
    labels: clienteVendas[0].vendas.map((clienteVendas) => clienteVendas.dia),
    datasets: [
      {
        label: "Vendas do Dia Atual",
        data: clienteVendas[0].vendas,
        backgroundColor: clienteVendas.map((clienteVendas) => clienteVendas.cor),
      },
    ],
  }
  //////////////////////////////////////////////////////////////////////////////////////

  return(
    <div className='appPage'>
        <div className='content-area dash'>
            <div className='graph-area'>
                <div className='graph-data'>
                    <GraficoTorta data={dadosDiaAtual} />
                </div>
                <div className='graph-data'>
                    <GraficoTorta data={dados5Dias} />
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
    </div>
  )  
}

export default Dashboard