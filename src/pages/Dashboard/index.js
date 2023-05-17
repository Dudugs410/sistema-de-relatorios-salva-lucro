
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
    
    const { isSignedIn, setIsSignedIn, accessToken, setAccessToken, setUserData } = useContext(AuthContext)

    useEffect(() => {
        console.log('Dashboard')
    },[])
    
    useEffect(() => {
        setIsSignedIn(sessionStorage.getItem('isSignedIn'))
        setAccessToken(Cookies.get('token'))
    },[])
    
    /////TESTE DO GRÁFICO//////
    // Dados de vendas dos últimos 5 dias
    const lastFiveDaysSales = 
    clienteVendas
    .slice(-5)
    .map((vendas) => vendas.vendas.reduce((a, b) => a + b, 0));

  const dados5Dias = {
    labels: [],
    datasets: [
      {
        data: lastFiveDaysSales,
        backgroundColor: clienteVendas.slice(-5).map((vendas) => vendas.cor),
      },
    ],
  };

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
        <div className='content-area'>
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Código</th>
                                <th scope="col">Data de Inserção</th>
                                <th scope="col">info</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='cell-text' data-label="Usuário">usuario</td>
                                <td className='cell-text' data-label="Código">codigo</td>
                                <td className='cell-text' data-label="Data do cadastro">data</td>
                                <td className='cell-text' data-label="Detalhes">#</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='table-data'>
                    <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Código</th>
                                    <th scope="col">Data de Inserção</th>
                                    <th scope="col">info</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='cell-text' data-label="Usuário">usuario</td>
                                    <td className='cell-text' data-label="Código">codigo</td>
                                    <td className='cell-text' data-label="Data do cadastro">data</td>
                                    <td className='cell-text' data-label="Detalhes">#</td>
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