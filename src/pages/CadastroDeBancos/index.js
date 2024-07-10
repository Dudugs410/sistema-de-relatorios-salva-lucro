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
        }
    }, [cliAdqList]);

    useEffect(() => {
        if (subproductList.length > 0) {
            console.log('subproductList: ', subproductList);
            const subproductListOptions = subproductList.map(sub => ({ value: sub.codigoSubProduto, label: sub.Modalidade.descricaoModalidade }))
            setSubproductOptions(subproductListOptions)
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

    const [editableBank, setEditableBank] = useState()

    const handleEdit = (object, index) => {
        localStorage.setItem('editIndex', index)
        setEditableBank({
            codigoEstabelecimento: object.CODIGOESTABELECIMENTO,
            codigoCliente: object.CLICODIGO,
            codigoClienteAdquirente: object.CLDCODIGO,
            bandeira: {label: getBannerName(object.BADCODIGO, bannersList), value: object.BADCODIGO},
            adquirente: {label: getAdminName(object.ADQCODIGO, adminsList), value: object.ADQCODIGO},
            produto: {label: getProductDescription(object.PROCODIGO, productList), value: object.PROCODIGO},
            subproduto: object.SUPCODIGO,
            banco: object.BANCO,
            agencia: object.AGENCIA,
            conta: object.CONTA,
        })
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
            toast.dismiss()
            await toast.promise(deleteBank(toBeDeleted), {
                pending: 'Carregando...',
                error: 'Ocorreu um Erro',
            })
            //setBanksList(prevTaxesList => prevTaxesList.filter(bank => bank.CODIGO !== object.CODIGO))
            setBanksList(await loadBanks())
            resetValues()
        } catch (error) {
            console.error('Error handling busca:', error)
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
        const subproduct = subproductList.find(subproduct => subproduct.codigoModalidade === subprodCodigo)
        return subproduct ? subproduct.descricaoModalidade : 'Desconhecido'
    }

    const BanksTable = () => {
    
    //adicionando páginas à tabela:

    const [filter, setFilter] = useState('')
    const [filteredItems, setFilteredItems] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(15) // Number of items per page

    useEffect(() => {
        setFilteredItems(banksList); // Initialize with all items
    }, [banksList]);

    useEffect(() => {
        setCurrentPage(1); // Reset page to 1 when filter changes
        filterItems();
    }, [filter]);

    // Change page functions
    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)) // Decrease page by 1, minimum page is 1
    }

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(banksList.length / itemsPerPage))) // Increase page by 1, maximum page is calculated based on array length
    }

    const goToFirstPage = () => {
        setCurrentPage(1) // Go to the first page
    }

    const goToLastPage = () => {
        setCurrentPage(Math.ceil(filteredItems.length / itemsPerPage)) // Go to the last page
    }

    // Calculate indexes for pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    
        const filterItems = () => {
            if (filter === '') {
                setFilteredItems(banksList);
            } else {
                const filtered = banksList.filter(item =>
                    item.BANCO.toLowerCase().includes(filter.toLowerCase()) ||
                    item.AGENCIA.toLowerCase().includes(filter.toLowerCase()) ||
                    item.CONTA.toLowerCase().includes(filter.toLowerCase()) ||
                    getAdminName(item.ADQCODIGO, adminsList).toLowerCase().includes(filter.toLowerCase()) ||
                    getBannerName(item.BADCODIGO, bannersList).toLowerCase().includes(filter.toLowerCase()) ||
                    getProductDescription(item.PROCODIGO, productList).toLowerCase().includes(filter.toLowerCase()) ||
                    item.SUPCODIGO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CODIGOESTABELECIMENTO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CLICODIGO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CLDCODIGO.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.CODIGO.toString().toLowerCase().includes(filter.toLowerCase())
                );
                setFilteredItems(filtered);
            }
        };
    
        return (
            <>
                <div>
                    <input
                        type="text"
                        placeholder="Digite para Filtrar..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                </div>
                <div className='table-wrapper table-wrapper-taxes'>
                    <table className="table table-striped table-hover table-bordered table-bancos det-table-global">
                        <thead>
                            <tr className='det-tr-top-global'>
                                <th className='det-th-global' scope="col" style={{ width: '2%', textAlign: 'center' }}>
                                    <button className="btn btn-primary btn-global" style={{ width: '100%' }} onClick={() => { setIsModalOpen(true) }}>
                                        <FiPlus size={25} className="icon" />
                                    </button>
                                </th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Banco</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Agencia</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Conta</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Adquirente</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Bandeira</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Produto</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Subproduto</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Estab.</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Cli</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Cod Cli Adq</th>
                                <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>ID</th>
                                <th className='det-th-global' scope="col" style={{ width: '2%', textAlign: 'center' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 &&
                                currentItems.map((object, index) => (
                                    <tr key={index} className="det-tr-global tr-bancos">
                                        <th scope="row" style={{ textAlign: 'center' }} onClick={() => { handleEdit(object, index) }}>
                                            <FiEdit className="icon" />
                                        </th>
                                        <td className="det-td-vendas-global" data-label="banco">{object.BANCO}</td>
                                        <td className="det-td-vendas-global" data-label="agencia">{object.AGENCIA}</td>
                                        <td className="det-td-vendas-global" data-label="conta">{object.CONTA}</td>
                                        <td className="det-td-vendas-global" data-label="adquirente">{getAdminName(object.ADQCODIGO, adminsList)}</td>
                                        <td className="det-td-vendas-global" data-label="bandeira">{getBannerName(object.BADCODIGO, bannersList)}</td>
                                        <td className="det-td-vendas-global" data-label="produto">{getProductDescription(object.PROCODIGO, productList)}</td>
                                        <td className="det-td-vendas-global" data-label="subproduto">{object.SUPCODIGO}</td>
                                        <td className="det-td-vendas-global" data-label="codigoEstabelecimento">{object.CODIGOESTABELECIMENTO}</td>
                                        <td className="det-td-vendas-global" data-label="codigoCliente">{object.CLICODIGO}</td>
                                        <td className="det-td-vendas-global" data-label="codigoClienteAdquirente">{object.CLDCODIGO}</td>
                                        <td className="det-td-vendas-global" data-label="ID">{object.CODIGO}</td>
                                        <th scope="row" style={{ textAlign: 'center' }} onClick={() => handleDelete(object)}>
                                            <FiTrash className="icon" />
                                        </th>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <hr className='hr-global'/>
                {filteredItems.length > itemsPerPage && (
                    <div className="container-btn-pagina">
                        <button
                            className='btn btn-primary btn-global btn-skip'
                            onClick={goToFirstPage}
                            disabled={currentPage === 1} // Disable if already on the first page
                        >
                            <FiSkipBack />
                        </button>
                        <button
                            className='btn btn-primary btn-global btn-navigate'
                            onClick={goToPrevPage}
                            disabled={currentPage === 1} // Disable if it's the first page
                        >
                            <FiChevronLeft/> {/* Left arrow */}
                        </button>
                        <div className='pagina-atual'>
                            <span className='texto-paginacao'>Página </span>
                            <span className='texto-paginacao'>{currentPage}</span>
                        </div>
                        <button
                            className='btn btn-primary btn-global btn-navigate'
                            onClick={goToNextPage}
                            disabled={currentPage === Math.ceil(banksList.length / itemsPerPage)} // Disable if it's the last page
                        >
                            <FiChevronRight/> {/* Right arrow */}
                        </button>
                        <button
                            className='btn btn-primary btn-global btn-skip'
                            onClick={goToLastPage}
                            disabled={currentPage === Math.ceil(banksList.length / itemsPerPage)} // Disable if already on the last page
                        >
                            <FiSkipForward />
                        </button>
                    </div>
                )}
                { filteredItems.length > itemsPerPage ? (<hr className='hr-global'/>) : (<></>)}
            </>
        )
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
                    { banksList && banksList.length > 0 ? <BanksTable /> : <></>}
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
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CadastroDeBancos
