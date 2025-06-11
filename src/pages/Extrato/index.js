import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createRoot } from 'react-dom/client' // For React 18+
import Cookies from 'js-cookie'
import PluggyWidget from '../../components/PluggyWidget'
import './extrato.scss'

import { PluggyContext } from '../../contexts/pluggyContext'
import Tabela from '../../components/Tabela'
import TabelaItem from '../../components/TabelaItem'
import MenuExtrato from '../../components/MenuExtrato'

const Extrato = () => {
    const { 
        setId, itemId, setItemId,
        loadAccounts, loadItem, loadTransactions,
        loadLoans, loadIdentity, loadInvestments, 
    } = useContext(PluggyContext)

    const [accounts, setAccounts] = useState(() => {
        const storedAccounts = Cookies.get('accounts');
        return storedAccounts ? JSON.parse(storedAccounts) : [];
      })
    const [selectedAccount, setSelectedAccount] = useState(null)

    const [responseData, setResponseData] = useState(() => {
        const storedData = localStorage.getItem('pluggyResponseData');
        return storedData ? JSON.parse(storedData) : {}
    })
    const [item, setItem] = useState()
    const [transactions, setTransactions] = useState()

    const [clickedRow, setClickedRow] = useState(null)
    const [isClicked, setIsClicked] = useState(false)

    const [selected, setSelected] = useState(false)
    const [displayedMenu, setDisplayedMenu] = useState(null)

    const [data, setData] = useState([])

    const location = useLocation()
    const widgetContainerRef = useRef(null)

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
    }, [location])

    useEffect(()=>{
        setIsClicked(false)
    },[])

    useEffect(()=>{
        if((!responseData || Object.keys(responseData).length === 0)){
            setId(localStorage.getItem('pluggyID'))
        }

    },[responseData])

    const fetchToken = async () => {
        let userId = localStorage.getItem('userID')
        let apikey = Cookies.get('pluggy_api_key')
        try {
            const options = {
                method: 'POST',
                headers: {
                    accept: 'application/json', 
                    'content-type': 'application/json',
                    'X-API-KEY': apikey,
                },
                body: JSON.stringify({
                    options: {
                        clientUserId: userId,
                        //avoidDuplicates: true
                    }
                })
            }
            
            let response = await fetch('https://api.pluggy.ai/connect_token', options)
            let responseData = await response.json()
            
            console.log('response data -> ', responseData)
            
            Cookies.set('pluggy_connect_token', responseData.accessToken)
            return responseData.accessToken;

        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    }

    const handleConnectClick = async() => {
        if(!Cookies.get('accessToken')){
            fetchToken()
                .then(()=>{
                    if (widgetContainerRef.current) {
                        widgetContainerRef.current.innerHTML = ''
                    }

                    const container = document.createElement('div')
                    widgetContainerRef.current?.appendChild(container)
        
                    const root = createRoot(container)
                    root.render(<PluggyWidget setId={setId} setResponseData={setResponseData}/>)   
                })
        }

        else{
            if (widgetContainerRef.current) {
                widgetContainerRef.current.innerHTML = ''
            }

            const container = document.createElement('div')
            widgetContainerRef.current?.appendChild(container)

            const root = createRoot(container)
            root.render(<PluggyWidget setId={setId} setResponseData={setResponseData}/>)
        }
    }

    useEffect(() => {
        if(accounts){
            Cookies.set('accounts', JSON.stringify(accounts))
        }
    }, [accounts])

    const handleRowClicked = (row) => {
        console.log('clicked row: ', row)
        setClickedRow(row)
        setIsClicked(true)
        setItemId(row.itemId)
        Cookies.set('accountID', row.id)

    }

    useEffect(()=>{
        
    },[itemId])

    const fetchAccounts = async () => {
        let dataTemp = await loadAccounts()
        setData(dataTemp)
    }

    const fetchIdentity = async () => {
        let dataTemp = await loadIdentity()
        setData(dataTemp)
    }

    const fetchLoans = async () => {
        let dataTemp = await loadLoans()
        setData(dataTemp)
    }

    const fetchInvestments = async () => {
        let dataTemp = await loadInvestments()
        setData(dataTemp)
    }

    const handleSelectedProduct = (product) =>{
        switch (product) {
            case 'ACCOUNTS':
                setData(null)
                fetchAccounts()
                setDisplayedMenu('Contas')
            break;
            
            case 'IDENTITY':
                setData(null)
                fetchIdentity()
                setDisplayedMenu('Identidade')
            break;
    
            case 'LOANS':
                setData(null)
                fetchLoans()
                setDisplayedMenu('Empréstimos')
            break;
    
            case 'INVESTMENTS':
                setData(null)
                fetchInvestments()
                setDisplayedMenu('Investimentos')
            break;
        
            default:
            break;
        }
        setSelected(true)
    }

    useEffect(()=>{
        if(item){
            console.log('item', item)
        }
    },[item])

    useEffect(()=>{
        console.log("responseData: ", responseData)
    },[responseData])

    return (
        <div className='appPage'>
            <div className='page-background-global'>
                <div className='page-content-global page-content-financeiro'>
                    <div className='title-container-global'>
                        <h1 className='title-global'>Extrato Bancário</h1>
                    </div>
                    <hr className='hr-global' />
                    <div className='pluggy-container'> 
                        {(!responseData || Object.keys(responseData).length === 0) && (
                        <button 
                            className='btn btn-primary btn-global' 
                            onClick={handleConnectClick}
                        >
                            Conectar
                        </button>
                        )}
                    </div>
                    {
                        (responseData !== (undefined && {} && [])) && <MenuExtrato connectorData={responseData.connector} handleProduct={handleSelectedProduct}/>
                    }
                    {
                        selected && 
                            <div className='tabela-extrato-container'> 
                                <div>
                                    { displayedMenu }
                                </div> 
                                <div >
                                    {data && <Tabela data={data} clickRow={handleRowClicked}/>}
                                </div>
                                {
                                <div >
                                    {selectedAccount && <Tabela data={selectedAccount}/>}
                                </div>
                                }
                            </div>
                    }
                    <div ref={widgetContainerRef}></div>
                </div>
            </div>
        </div>
    )
}

export default Extrato