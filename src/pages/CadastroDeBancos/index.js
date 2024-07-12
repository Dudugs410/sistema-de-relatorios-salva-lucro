import { useEffect, useCallback, useContext, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import '../../styles/global.scss'
import './cadastroDeBancos.scss'
import Select from 'react-select'
import { FiEdit, FiPlus, FiTrash, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'

import BanksTable from './BanksTable'
import ModalNewBank from './ModalNewBank'
import ModalEditBank from './ModalEditBank'


const CadastroDeBancos = () => {
    useEffect(()=>{
        console.log('Render Cadastro de Bancos')
    },[])

    const location = useLocation()
    const {
        loadBanners,
        loadAdmins,
        loadProducts,
        loadSubproducts,
        loadMods,
        loadCliAdq,
        loadBanks,
        addBank,
        editBank,
        deleteBank,
        isLoadingBanks,
        changedOption,
    } = useContext(AuthContext)

    const cliOptions = JSON.parse(Cookies.get('clientOptions'))

    const [bannersList, setBannersList] = useState([])
    const [adminsList, setAdminsList] = useState([])
    const [productList, setProductList] = useState([])
    const [subproductList, setSubproductList] = useState([])
    const [modList, setModList] = useState([])
    const [cliAdqList, setCliAdqList] = useState([])
    const [banksList, setBanksList] = useState([])

    const [clientCode, setClientCode] = useState(Cookies.get('clientCode'))
    const [banOptions, setBanOptions] = useState([])
    const [admOptions, setAdmOptions] = useState([])
    const [productOptions, setProductOptions] = useState([])
    const [subproductOptions, setSubproductOptions] = useState([])
    const [modOptions, setModOptions] = useState([])
    const [cliAdqOptions, setCliAdqOptions] = useState([])

    const [isSelected, setIsSelected] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)

    useEffect(() => {
        sessionStorage.setItem('currentPath', location.pathname)
    }, [])

    useEffect(() => {
        async function inicialize() {
            if (bannersList.length === 0) {
                const response = await loadBanners()
                setBannersList(response)
            }

            if (adminsList.length === 0) {
                const response = await loadAdmins()
                setAdminsList(response)
            }

            if (productList.length === 0) {
                const response = await loadProducts()
                setProductList(response)
            }

            if (modList.length === 0) {
                const response = await loadMods()
                setModList(response)
            }

            if (clientCode !== 'todos') {
                const response = await loadBanks()
                setBanksList(response)
            }
        }
        inicialize()
    }, [])

    useEffect(() => {
        if (bannersList) {
            if (bannersList.length > 0) {
                const bannersListOptions = bannersList.map(banner => ({ value: banner.codigoBandeira, label: banner.descricaoBandeira }))
                setBanOptions(bannersListOptions)
            }
        }
    }, [bannersList])

    useEffect(() => {
        if (adminsList) {
            if (adminsList.length > 0) {
                const adminsListOptions = adminsList.map(admin => ({ value: admin.codigoAdquirente, label: admin.nomeAdquirente }))
                setAdmOptions(adminsListOptions)
            }
        }
    }, [adminsList])

    useEffect(() => {
        if (productList) {
            if (productList.length > 0) {
                const productListOptions = productList.map(prod => ({ value: prod.codigoProduto, label: prod.descricaoProduto }))
                setProductOptions(productListOptions)
            }
        }
    }, [productList])

    useEffect(() => {
        if (modList) {
            if (modList.length > 0) {
                const modListOptions = modList.map(mod => ({ value: mod.codigoModalidade, label: mod.descricaoModalidade }))
                setModOptions(modListOptions)
            }
        }
    }, [modList])

    useEffect(() => {
        setClientCode(Cookies.get('clientCode'))
        setBanksList([])
    }, [changedOption])

    useEffect(() => {
        const loadbank = async () => {
            if ((clientCode === 'todos') || (clientCode === 'TODOS')) {
                setBanksList([])
            } else {
                const response = await loadBanks()
                setBanksList(response)
            }
        }
        loadbank()
    }, [clientCode])

    // Update cliAdqOptions when cliAdqList changes
    useEffect(() => {
        if (cliAdqList.length > 0) {
            console.log('cliAdqList: ', cliAdqList);
            const cliAdqListOptions = cliAdqList.map(sub => ({ value: sub.codigoClienteAdquirente, label: sub.codigoEstabelecimento }));
            setCliAdqOptions(cliAdqListOptions);
        } else {
            setCliAdqOptions([]);
        }
    }, [cliAdqList]);

    useEffect(() => {
        if (subproductList.length > 0) {
            console.log('subproductList: ', subproductList);
            const subproductListOptions = subproductList.map(sub => ({ value: sub.codigoSubProduto, label: sub.Modalidade.descricaoModalidade }))
            setSubproductOptions(subproductListOptions)
        } else {
            setSubproductOptions([])
        }
    }, [subproductList])

    // Fetch cliAdqList when isSelected changes
    useEffect(() => {
        const fetchCliAdqList = async () => {
            if (isSelected) {
                const clientCode = Cookies.get('clientCode');
                const admCode = Cookies.get('admCode');
                
                if (clientCode !== '0' && admCode !== '0') {
                    try {
                        const response = await loadCliAdq();
                        setCliAdqList(response);
                    } catch (error) {
                        console.error('Error fetching cliAdqList:', error);
                    } finally {
                        setIsSelected(false);
                    }
                } else {
                    setIsSelected(false);
                }
            }
        };

        const fetchSubProductList = async () => {
            if (isSelected) {
                const admCode = Cookies.get('admCode')
                if (admCode !== '0') {
                    try {
                        const response = await loadSubproducts()
                        setSubproductList(response)
                    } catch (error) {
                        console.error('Error fetching subproductList:', error)
                    } finally {
                        setIsSelected(false)
                    }
                } else {
                    setIsSelected(false)
                }
            }
        };

        fetchCliAdqList()
        fetchSubProductList()
    }, [isSelected])

    const fetchSUPname = async (SUPCODIGO) => {
        try {
            const subProducts = await loadSubproducts();
            const subProductName = getSubproductDescription(SUPCODIGO, subProducts);
            console.log('subProductName: ', subProductName);
            return subProductName;
        } catch (error) {
            console.error('Error fetching subproductList:', error);
        }
    };

    const handleAdd = () =>{
        setCliAdqOptions([])
        Cookies.set('admCode', 0)
        setIsModalOpen(true)
    }
    
    const [editableBank, setEditableBank] = useState();
    
    const handleEdit = async (object, index) => {
        //setIsSelected(true);
        console.log('objeto a ser editado: ', object)
        Cookies.set('admCode', object.ADQCODIGO)

        localStorage.setItem('editIndex', index)
        const SUPlabel = await fetchSUPname(object.SUPCODIGO) // Wait for SUPlabel to be defined
        const response = await loadSubproducts()
        setSubproductList(response)

        const resp = await loadCliAdq()
        setCliAdqList(resp)
    
        setEditableBank({
            cliAdq: { label: object.CODIGOESTABELECIMENTO, value: object.CLDCODIGO },
            codigoCliente: object.CLICODIGO,
            bandeira: { label: getBannerName(object.BADCODIGO, bannersList), value: object.BADCODIGO },
            adquirente: { label: getAdminName(object.ADQCODIGO, adminsList), value: object.ADQCODIGO },
            produto: { label: getProductDescription(object.PROCODIGO, productList), value: object.PROCODIGO },
            subproduto: { label: SUPlabel, value: object.SUPCODIGO },
            banco: object.BANCO,
            agencia: object.AGENCIA,
            conta: object.CONTA,
            codigoBancoCliente: object.CODIGO,
            codigoEstabelecimento: object.CODIGOESTABELECIMENTO,
        });
        setIsModalEditOpen(true);
    };

    const resetValues = () => {
        setEditableBank({            
            codigoEstabelecimento: '',
            codigoCliente: '',
            codigoClienteAdquirente: '',
            bandeira: { label: 'Selecione', value: 0 },
            administradora: { label: 'Selecione', value: 0 },
            produto: { label: 'Selecione', value: 0 },
            subproduto: { label: 'Selecione', value: 0 },
            banco: '',
            agencia: '',
            conta: '',})
        setIsModalEditOpen(false)
    }

    const handleDelete = async (object) => {
        console.log('objeto a ser deletado: ', object)
        
        const toBeDeleted = {
            CodigoEstabelecimento: object.CODIGOESTABELECIMENTO,
            CodigoCliente: object.CLICODIGO,
            CodigoClienteAdquirente: object.CLDCODIGO,
            Bandeira: object.BADCODIGO,
            Adquirente: object.ADQCODIGO,
            Produto: object.PROCODIGO,
            Subproduto: object.SUPCODIGO,
            Banco: object.BANCO,
            Agencia: object.AGENCIA,
            Conta: object.CONTA,
            CodigoBancoCliente: object.CODIGO,
        }
    
        try {
            toast.dismiss()
            await toast.promise(deleteBank(toBeDeleted), {
                pending: 'Carregando...',
                error: 'Ocorreu um Erro',
            })
            // Optimistically update state
            setBanksList(prevBanksList => prevBanksList.filter(bank => bank.CODIGO !== object.CODIGO))
            handleCancel()
        } catch (error) {
            console.error('Error handling delete:', error)
        }
    }

    const handleCancel = () => {
        resetValues()
        setIsModalEditOpen(false)
    }

    const getAdminName = (adqCodigo, adminsList) => {
        const admin = adminsList.find(admin => admin.codigoAdquirente === adqCodigo)
        return admin ? admin.nomeAdquirente : 'Desconhecido'
    }

    const getBannerName = (banCodigo, bannersList) => {
        const banner = bannersList.find(banner => banner.codigoBandeira === banCodigo)
        return banner ? banner.descricaoBandeira : 'Desconhecido'
    }

    const getProductDescription = (prodCodigo, productList) => {
        const product = productList.find(product => product.codigoProduto === prodCodigo)
        return product ? product.descricaoProduto : 'Desconhecido'
    }

    const getSubproductDescription = (subprodCodigo, subproductList) => {
        console.log('subprodCodigo: ', subprodCodigo, 'subprodList: ', subproductList)
        const subproduct = subproductList.find(subproduct => subproduct.codigoSubProduto === subprodCodigo)
        return subproduct ? subproduct.Modalidade.descricaoModalidade : 'Desconhecido'
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setIsModalEditOpen(false)
    }

    return (
        <div className='appPage'>
            <div className='page-background-global'>
                <div className='page-content-global'>
                    <div className='page-content-bancos'>
                        <div className='title-container-global'>
                            <h1 className='title-global'>Cadastramento de Bancos</h1>
                        </div>
                        <hr className='hr-global'/>
                      <div className='container-global' style={{margin: '0', flexDirection: 'column', alignItems: 'center'}}>
                            { ((banksList && banksList.length > 0) && (clientCode !== ('todos' || undefined))) && 
                                <div>    
                                    <h3 className='subtitle' style={{width: '100%', display: 'flex', flexDirection: 'column', alignContent: 'center', textAlign: 'center'}}>Cliente: {JSON.parse(Cookies.get('selectedClient')).label}</h3>
                                    <hr className='hr-global'/>
                                </div>
                            }
                            { ((banksList && banksList.length === 0) && (clientCode !== ('todos' || undefined))) && 
                                <>
                                    <span className='subtitle'>Sem Bancos Cadastrados</span>
                                    <br/>
                                    <button className='btn btn-primary btn-global' onClick={()=>{setIsModalOpen(true)}}><FiPlus className='icon' />Adicionar Banco</button>
                                </>
                            }
                            {
                                clientCode === ('todos' || undefined) ?
                                    <span className='subtitle'>Selecione um cliente para exibir seus bancos cadastrados</span>
                                    : 
                                    <></>
                            }
                        </div> 
                    </div>
                    { banksList && banksList.length > 0 ? <BanksTable banksList={banksList} adminsList={adminsList} bannersList={bannersList} productList={productList} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete}/> : <></>}
                    <div className='modal-container' style={{ display: (isModalOpen || isModalEditOpen) ? 'block' : 'none' }}>
                        {isModalOpen && (
                            <ModalNewBank
                                onClose={closeModal}
                                setIsSelected={setIsSelected}
                                cliAdqOptions={cliAdqOptions}
                                cliOptions={cliOptions}
                                admOptions={admOptions}
                                banOptions={banOptions}
                                productOptions={productOptions}
                                subproductOptions={subproductOptions}
                                addBank={addBank}
                                loadBanks={loadBanks}
                                setBanksList={setBanksList}
                            />
                        )}
                        {isModalEditOpen && (
                            <ModalEditBank 
                                editableBank={editableBank}
                                onClose={closeModal}
                                setIsSelected={setIsSelected}
                                cliAdqOptions={cliAdqOptions}
                                cliOptions={cliOptions}
                                admOptions={admOptions}
                                banOptions={banOptions}
                                productOptions={productOptions}
                                subproductOptions={subproductOptions}
                                editBank={editBank}
                                loadBanks={loadBanks}
                                setBanksList={setBanksList}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CadastroDeBancos
