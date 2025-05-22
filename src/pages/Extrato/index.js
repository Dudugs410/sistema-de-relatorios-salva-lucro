import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createRoot } from 'react-dom/client' // For React 18+
import Cookies from 'js-cookie'
import PluggyWidget from '../../components/PluggyWidget'
//import pluggyImg from '../../assets/ID - COLORIDA 1 HORIZ 09.23.19.png'
import './extrato.scss'

import pluggyApi from '../../services/pluggy'
import { PluggyContext } from '../../contexts/pluggyContext'
import Tabela from '../../components/Tabela'
import TabelaAccounts from '../../components/TabelaAccounts'
import { Table } from 'react-bootstrap'
import Modal from '../../components/Modal'
import TabelaItem from '../../components/TabelaItem'
import MenuExtrato from '../../components/MenuExtrato'

const Extrato = () => {
    const { 
        setId, setItemId,
        loadAccounts, loadItem, loadTransactions,
        loadLoans, loadIdentity, loadInvestments, 
    } = useContext(PluggyContext)

    const [accounts, setAccounts] = useState(() => {
        // Check cookies on initial render
        const storedAccounts = Cookies.get('accounts');
        return storedAccounts ? JSON.parse(storedAccounts) : [];
      })
    const [responseData, setResponseData] = useState({})
    const [item, setItem] = useState()
    const [transactions, setTransactions] = useState()

    const [clickedRow, setClickedRow] = useState(null)
    const [isClicked, setIsClicked] = useState(false)

    const [selected, setSelected] = useState(false)
    const [displayedMenu, setDisplayedMenu] = useState(null)

    const [data, setData] = useState([])

    const location = useLocation()
    const widgetContainerRef = useRef(null) // Ref to mount the widget

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
    }, [location])

    useEffect(()=>{
        setIsClicked(false)
    },[])

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
            
            // 1. Make the request
            let response = await fetch('https://api.pluggy.ai/connect_token', options)
            
            // 2. Parse the JSON response
            let responseData = await response.json()
            
            console.log('response data -> ', responseData)
            
            // 3. Set the cookie and return the token
            Cookies.set('pluggy_connect_token', responseData.accessToken)
            return responseData.accessToken;

        } catch (error) {
            console.log('error: ', error)
            throw error; // Re-throw for UI handling
        }
    }

    const handleConnectClick = async() => {
        if(!Cookies.get('accessToken')){
            fetchToken()
                .then(()=>{
                    // Clear previous widget if it exists
                    if (widgetContainerRef.current) {
                        widgetContainerRef.current.innerHTML = ''
                    }
        
                    // Create a new container for the widget
                    const container = document.createElement('div')
                    widgetContainerRef.current?.appendChild(container)
        
                    // Manually render PluggyWidget into the container
                    const root = createRoot(container)
                    root.render(<PluggyWidget setId={setId} setResponseData={setResponseData}/>)   
                })
        }

        else{
            if (widgetContainerRef.current) {
                widgetContainerRef.current.innerHTML = ''
            }

            // Create a new container for the widget
            const container = document.createElement('div')
            widgetContainerRef.current?.appendChild(container)

            // Manually render PluggyWidget into the container
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
        const loadItemFunc = async ()=>{
            var resp = loadItem()
            return resp
        }
        setItemId(loadItemFunc)
    }

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

    useEffect(() => {
        console.log('clickedRow useEffect')
        
        if (!clickedRow) return;  // Early return if no clickedRow
    
        const fetchItemData = async () => {
            try {
                Cookies.set('itemID', clickedRow.itemId)
                const itemData = await loadItem(clickedRow.itemId)  // Pass ID directly
                setItem(itemData)
            } catch (error) {
                console.error('Failed to load item:', error)
                // Consider setting an error state here
            }
        }
        fetchItemData()
    }, [clickedRow])

    const ModalExtrato = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
    
        useEffect(() => {
            if (!clickedRow) return;
    
            const fetchItemData = async () => {
                setIsLoading(true);
                setError(null);
                
                try {
                    const itemTransactions = await loadTransactions(clickedRow.id);
                    setTransactions(itemTransactions);
                } catch (err) {
                    console.error('Failed to load transactions:', err);
                    setError('Failed to load transactions');
                } finally {
                    setIsLoading(false);
                }
            };
    
            fetchItemData();
        }, [clickedRow]);

        return (
            <div className='modal-extrato-background' onClick={() => setIsClicked(false)}>
                <div className='modal-extrato-container'>
                    {isLoading ? (
                        <div className="loading-indicator">Loading...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : item ? (
                        <TabelaItem data={item} />
                    ) : null}
                </div>
            </div>
        );
    };
    
    useEffect(()=>{
        console.log('isClicked: ', isClicked)
    },[isClicked])

    return (
        <div className='appPage'>
            <div className='page-background-global'>
                <div className='page-content-global page-content-financeiro'>
                    {
                        isClicked && (
                            <ModalExtrato />
                        )
                    }
                    <div className='title-container-global'>
                        <h1 className='title-global'>Extrato Bancário</h1>
                    </div>
                    <hr className='hr-global' />
                    <div className='pluggy-container'>
                        <button 
                            className='btn btn-primary btn-global' 
                            onClick={handleConnectClick}
                        >
                        Conectar
                        </button>
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
                                    {data && <Tabela data={data}/>}
                                </div>
                            </div>
                    }
                    <div ref={widgetContainerRef}></div>
                </div>
            </div>
        </div>
    )
}

export default Extrato