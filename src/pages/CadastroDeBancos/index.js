import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import Cookies from 'js-cookie'
import '../../styles/global.scss'
import './cadastroDeBancos.scss'
import Select from 'react-select';
import { FiEdit, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { parse, sub } from 'date-fns';
import { toast } from 'react-toastify'

const CadastroDeBancos = () => {
    const location = useLocation();
    const {
        loadBanners,
        loadAdmins,
        loadProducts,
        loadSubproducts,
        loadBanks,
        addBank,
        editBank,
        deleteBank,
        isLoadingBanks,
        changedOption,
    } = useContext(AuthContext)

    const [bannersList, setBannersList] = useState([])
    const [adminsList, setAdminsList] = useState([])
    const [productList, setProductList] = useState([])
    const [subproductList, setSubproductList] = useState([])
    const [banksList, setBanksList] = useState([])

    const [code, setCode] = useState('')
    const [clientCode, setClientCode] = useState(Cookies.get('clientCode'))
    const [adminClientCode, setAdminClientCode] = useState('todos')
    const [banOptions, setBanOptions] = useState([])
    const [admOptions, setAdmOptions] = useState([])
    const [productOptions, setProductOptions] = useState([])
    const [subproductOptions, setSubproductOptions] = useState([])
    const [bank, setBank] = useState('')
    const [agency, setAgency] = useState('')
    const [account, setAccount] = useState('')

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

            if (subproductList.length === 0) {
                const response = await loadSubproducts()
                setSubproductList(response)
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
                const bannersListOptions = bannersList.map(banner => ({ value: banner.codigoBandeira, label: banner.descricaoBandeira }));
                setBanOptions(bannersListOptions);
            }
        }
    }, [bannersList]);

    useEffect(() => {
        if (adminsList) {
            if (adminsList.length > 0) {
                const adminsListOptions = adminsList.map(admin => ({ value: admin.codigoAdquirente, label: admin.nomeAdquirente }));
                setAdmOptions(adminsListOptions);
            }
        }
    }, [adminsList]);

    useEffect(() => {
        if (productList) {
            if (productList.length > 0) {
                const productListOptions = productList.map(prod => ({ value: prod.value, label: prod.label }));
                setProductOptions(productListOptions);
            }
        }
    }, [productList])

    useEffect(() => {
        if (subproductList) {
            if (subproductList.length > 0) {
                const subproductListOptions = subproductList.map(sub => ({ value: sub.value, label: sub.label }));
                setSubproductOptions(subproductListOptions);
            }
        }
    }, [subproductList])

    useEffect(() => {
        setClientCode(Cookies.get('clientCode'))
        setBanksList([])
    }, [changedOption])

    useEffect(() => {
        const loadbank = async () => {
            console.log('loadBank, clientCode: ', clientCode)
            if ((clientCode === 'todos') || (clientCode === 'TODOS')) {
                setBanksList([])
            } else {
                const response = await loadBanks()
                setBanksList(response)
            }
        }
        loadbank()
    }, [clientCode])

    const [editableBank, setEditableBank] = useState()

    const handleEdit = (object, index) => {
        console.log('object: ', object)
        console.log('index: ', index)
        localStorage.setItem('editIndex', index)
        setEditableBank({
            codigoEstabelecimento: object.codigoEstabelecimento,
            codigoCliente: object.codigoCliente,
            codigoClienteAdquirente: object.codigoClienteAdquirente,
            bandeira: object.bandeira,
            adquirente: object.adquirente,
            produto: object.produto,
            subproduto: object.subproduto,
            banco: object.banco,
            agencia: object.agencia,
            conta: object.conta,
        })
        console.log(Cookies.get('clientCode'))
        setIsModalEditOpen(true)
    }

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
        const toBeDeleted = {
            codigoEstabelecimento: object.codigoEstabelecimento,
            codigoCliente: object.codigoCliente,
            codigoClienteAdquirente: object.codigoClienteAdquirente,
            bandeira: object.bandeira,
            adquirente: object.adquirente,
            produto: object.produto,
            subproduto: object.subproduto,
            banco: object.banco,
            agencia: object.agencia,
            conta: object.conta,
        }

        try {
            await toast.promise(deleteBank(toBeDeleted), {
                pending: 'Carregando...',
                error: 'Ocorreu um Erro',
            })
            //setBanksList(prevTaxesList => prevTaxesList.filter(bank => bank.CODIGO !== object.CODIGO))
            setBanksList(await loadBanks())
            resetValues();
        } catch (error) {
            console.error('Error handling busca:', error);
        }
    }

    const handleCancel = () => {
        resetValues()
        setIsModalEditOpen(false)
    }

    const BanksTable = () => {
        console.log('BanksList: ', banksList)
        return (
            <div className='table-wrapper table-wrapper-taxes'>
                <table className="table table-striped table-hover table-bordered table-bancos">
                    <thead>
                        <tr>
                            <th className='fixed-col' scope="col" style={{ width: '2%', textAlign: 'center' }}>
                                <button className="btn btn-primary btn-global" style={{ width: '100%' }} onClick={() => { setIsModalOpen(true) }}>
                                    <FiPlus size={25} className="icon" />
                                </button>
                            </th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Banco</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Agencia</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Conta</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Adquirente</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Bandeira</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Produto</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Subproduto</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Estab.</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Cli</th>
                            <th scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Cli Adq</th>
                            <th className='fixed-col' scope="col" style={{ width: '2%', textAlign: 'center' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {banksList.length > 0 &&
                            banksList.map((object, index) => (
                                <tr key={index} className="det-tr-global tr-bancos">
                                    <th className='fixed-col' scope="row" style={{ textAlign: 'center' }} onClick={() => { handleEdit(object, index) }}>
                                        <FiEdit className="icon" />
                                    </th>
                                    <td className="det-td-vendas-global" data-label="banco">{object.banco}</td>
                                    <td className="det-td-vendas-global" data-label="agencia">{object.agencia}</td>
                                    <td className="det-td-vendas-global" data-label="conta">{object.conta}</td>
                                    <td className="det-td-vendas-global" data-label="adquirente">{object.adquirente.label}</td>
                                    <td className="det-td-vendas-global" data-label="bandeira">{object.bandeira.label}</td>
                                    <td className="det-td-vendas-global" data-label="produto">{object.produto.label}</td>
                                    <td className="det-td-vendas-global" data-label="subproduto">{object.subproduto.label}</td>
                                    <td className="det-td-vendas-global" data-label="codigoEstabelecimento">{object.codigoEstabelecimento}</td>
                                    <td className="det-td-vendas-global" data-label="codigoCliente">{object.codigoCliente}</td>
                                    <td className="det-td-vendas-global" data-label="codigoClienteAdquirente">{object.codigoClienteAdquirente}</td>
                                    <th className='fixed-col' scope="row" style={{ textAlign: 'center' }} onClick={() => handleDelete(object)}>
                                        <FiTrash className="icon" />
                                    </th>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setIsModalEditOpen(false)
    };

    const isObjectFullyPopulated = (obj) => {
        return obj && Object.values(obj).every(value => value !== null && value !== 0);
    }

    const ModalNewBank = () => {
        const [selectedCode, setSelectedCode] = useState('123456789');
        const [selectedClientCode, setSelectedClientCode] = useState('123456789');
        const [selectedClientAdminCode, setSelectedClientAdminCode] = useState('1');
        const [selectedBan, setSelectedBan] = useState({ label: 'Selecione', value: 0 });
        const [selectedAdm, setSelectedAdm] = useState({ label: 'Selecione', value: 0 });
        const [selectedProduct, setSelectedProduct] = useState({ label: 'Selecione', value: 0 });
        const [selectedSubproduct, setSelectedSubproduct] = useState({ label: 'Selecione', value: 0 });
        const [selectedBank, setSelectedBank] = useState('');
        const [selectedAgency, setSelectedAgency] = useState('');
        const [selectedAccount, setSelectedAccount] = useState('');
    
        const resetValues = () => {
            setSelectedCode('');
            setSelectedClientCode('')
            setSelectedClientAdminCode('')
            setSelectedBan({ label: 'Selecione', value: 0 });
            setSelectedAdm({ label: 'Selecione', value: 0 });
            setSelectedProduct({ label: 'Selecione', value: 0 });
            setSelectedSubproduct({ label: 'Selecione', value: 0 });
            setSelectedBank('');
            setSelectedAgency('');
            setSelectedAccount('');

            setIsModalOpen(false);
            setIsModalEditOpen(false);
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault()
            const newBankObj = {
                codigoEstabelecimento: selectedCode,
                codigoClienteAdquirente: selectedClientAdminCode,
                codigoCliente: selectedClientCode,
                adquirente: selectedAdm,
                produto: selectedProduct,
                bandeira: selectedBan,
                subproduto: selectedSubproduct,
                banco: selectedBank,
                agencia: selectedAgency,
                conta: selectedAccount,
            }
        
            if (isObjectFullyPopulated(newBankObj)) {
                try {
                    await toast.promise(addBank(newBankObj), {
                        pending: 'Carregando...',
                        error: 'Erro ao adicionar Taxa',
                    });
        
                    const updatedBanks = await loadBanks()
                    setBanksList(updatedBanks)
                    resetValues()
                } catch (error) {
                    console.error('Error handling submit:', error)
                }
            } else {
                toast.warning('Todos os Campos devem ser preenchidos')
            }
        };
        
    
        return (
            <div className={`modal-bancos modal ${isModalOpen ? 'modal-open' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
                <div className='header-container-taxa'>
                    <div className='title-container-global'>
                        <h3 className='title-global' style={{margin: '0'}}>Cadastrar Banco</h3>
                    </div>
                    <button className='btn btn-danger close-modal' onClick={closeModal} style={{marginLeft: '5px'}}><FiX size={25}/></button>
                </div>
                <hr className='hr-global'/>
                <form className='select-container-bancos' onSubmit={handleSubmit}>
                    <div className='form-group-bancos'>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Produto</label>
                            <Select
                                id="cliSelect"
                                options={productOptions}
                                value={selectedProduct}
                                onChange={(selected) => setSelectedProduct(selected)}
                            />
                        </div>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Subproduto</label>
                            <Select
                                id="admSelect"
                                options={subproductOptions}
                                value={selectedSubproduct}
                                onChange={(selected) => setSelectedSubproduct(selected)}
                            />
                        </div>
                    </div>
                    <div className='form-group-bancos'>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Adquirente</label>
                            <Select
                                id="admSelect"
                                options={admOptions}
                                value={selectedAdm}
                                onChange={(selected) => setSelectedAdm(selected)}
                            />
                        </div>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Bandeira</label>
                            <Select
                                id="banSelect"
                                options={banOptions}
                                value={selectedBan}
                                onChange={(selected) => setSelectedBan(selected)}
                            />
                        </div>
                    </div>
                    <div className='form-group-bancos'>
                        <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                            <label className='span-picker'>Banco</label>
                            <input
                                style={{height: '100%'}}
                                type="text"
                                id="taxInput"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                            />
                        </div>
                        <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                            <label className='span-picker'>Agência</label>
                            <input
                            style={{height: '100%'}}
                            type="text"
                            id="taxInput"
                                value={selectedAgency}
                                onChange={(e) => setSelectedAgency(e.target.value)}
                            />
                        </div>
                        <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                            <label className='span-picker'>Conta</label>
                            <input
                                style={{height: '100%'}}
                                type="text"
                                id="taxInput"
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='group-element-bancos'>
                        <hr className='hr-global'/>
                        <button className='btn-global btn-bancos' disabled={isLoadingBanks}>Cadastrar Banco</button>
                    </div>
                </form>
            </div>
        );
    };
    

    const ModalEditBank = () => {
        const [selectedCode, setSelectedCode] = useState(editableBank?.codigoEstabelecimento || '' );
        const [selectedClientCode, setSelectedClientCode] = useState(editableBank?.codigoCliente || '' );
        const [selectedClientAdminCode, setSelectedClientAdminCode] = useState(editableBank?.codigoClienteAdquirente || '' );
        const [selectedBan, setSelectedBan] = useState(editableBank?.bandeira || { label: 'Selecione', value: 0 });
        const [selectedAdm, setSelectedAdm] = useState(editableBank?.adquirente || { label: 'Selecione', value: 0 });
        const [selectedProduct, setSelectedProduct] = useState(editableBank?.produto || { label: 'Selecione', value: 0 });
        const [selectedSubproduct, setSelectedSubproduct] = useState(editableBank?.subproduto || { label: 'Selecione', value: 0 });
        const [selectedBank, setSelectedBank] = useState(editableBank?.banco || '');
        const [selectedAgency, setSelectedAgency] = useState(editableBank?.agencia || '');
        const [selectedAccount, setSelectedAccount] = useState(editableBank?.conta || '');
    
        const resetValues = () => {
            setSelectedCode('')
            setSelectedClientCode('')
            setSelectedClientAdminCode('')
            setSelectedBan({ label: 'Selecione', value: 0 })
            setSelectedAdm({ label: 'Selecione', value: 0 })
            setSelectedProduct({ label: 'Selecione', value: 0 })
            setSelectedSubproduct({ label: 'Selecione', value: 0 })
            setSelectedBank('')
            setSelectedAgency('')
            setSelectedAccount('')

            setIsModalOpen(false)
            setIsModalEditOpen(false)
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault()
            const newBankObj = {
                codigoEstabelecimento: selectedCode,
                codigoClienteAdquirente: selectedClientAdminCode,
                codigoCliente: selectedClientCode,
                adquirente: selectedAdm,
                produto: selectedProduct,
                bandeira: selectedBan,
                subproduto: selectedSubproduct,
                banco: selectedBank,
                agencia: selectedAgency,
                conta: selectedAccount,
            }
        
            if (isObjectFullyPopulated(newBankObj)) {
                try {
                    await toast.promise(editBank(newBankObj), {
                        pending: 'Carregando...',
                        error: 'Erro ao adicionar Taxa',
                    });
        
                    const updatedBanks = await loadBanks()
                    setBanksList(updatedBanks)
                    resetValues()
                } catch (error) {
                    console.error('Error handling submit:', error)
                }
            } else {
                toast.warning('Todos os Campos devem ser preenchidos')
            }
        };

        const handleProduct = (selected) => {
            setSelectedProduct(selected)
        }

        const handleSubproduct = (selected) => {
            setSelectedSubproduct(selected)
        }

        const handleAdm = (selected) => {
            setSelectedAdm(selected)
        }

        const handleBan = (selected) => {
            setSelectedBan(selected)
        }
    
        return (
            <div className={`modal-bancos modal ${isModalEditOpen ? 'modal-open' : ''}`} style={{ display: isModalEditOpen ? 'block' : 'none' }}>
                <div className='header-container-taxa'>
                    <div className='title-container-global'>
                        <h3 className='title-global' style={{margin: '0'}}>Editar Banco</h3>
                    </div>
                    <button className='btn btn-danger close-modal' onClick={closeModal} style={{marginLeft: '5px'}}><FiX size={25}/></button>
                </div>
                <hr className='hr-global'/>
                <form className='select-container-bancos' onSubmit={handleSubmit}>
                    <div className='form-group-bancos'>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Produto</label>
                            <Select
                                id="cliSelectEdit"
                                options={productOptions}
                                value={selectedProduct}
                                onChange={handleProduct}
                                placeholder='Selecione'
                            />
                        </div>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Subproduto</label>
                            <Select
                                id="admSelectEdit"
                                options={subproductOptions}
                                value={selectedSubproduct}
                                onChange={handleSubproduct}
                                placeholder='Selecione'
                            />
                        </div>
                    </div>
                    <div className='form-group-bancos'>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Adquirente</label>
                            <Select
                                id="banSelect"
                                options={admOptions}
                                value={selectedAdm}
                                onChange={handleAdm}
                                placeholder='Selecione'
                            />
                        </div>
                        <div className='group-element-bancos'>
                            <label className='span-picker'>Bandeira</label>
                            <Select
                                id="banSelect"
                                options={banOptions}
                                value={selectedBan}
                                onChange={handleBan}
                                placeholder='Selecione'
                            />
                        </div>
                    </div>
                    <div className='form-group-bancos'>
                        <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                            <label className='span-picker'>Banco</label>
                            <input
                                style={{height: '100%'}}
                                type="text"
                                id="taxInput"
                                value={selectedBank}
                                onChange={(selected) => setSelectedBank(selected.target.value)}
                            />
                        </div>
                        <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                            <label className='span-picker'>Agência</label>
                            <input
                            style={{height: '100%'}}
                            type="text"
                            id="taxInput"
                                value={selectedAgency}
                                onChange={(selected) => setSelectedAgency(selected.target.value)}
                            />
                        </div>
                        <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                            <label className='span-picker'>Conta</label>
                            <input
                                style={{height: '100%'}}
                                type="text"
                                id="taxInput"
                                value={selectedAccount}
                                onChange={(selected) => setSelectedAccount(selected.target.value)}
                            />
                        </div>
                    </div>
                    <div className='group-element-bancos'>
                        <hr className='hr-global'/>
                        <button className='btn-global btn-bancos' disabled={isLoadingBanks}>Aplicar Modificações</button>
                    </div>
                </form>
            </div>
        );
    };

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
                    { banksList && banksList.length > 0 ? <BanksTable /> : <></>}
                    <div className='modal-container' style={{ display: (isModalOpen || isModalEditOpen) ? 'block' : 'none' }}>
                        <ModalNewBank />
                        <ModalEditBank />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CadastroDeBancos;
