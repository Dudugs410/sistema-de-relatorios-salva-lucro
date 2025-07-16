import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import Joyride from 'react-joyride'
import '../../styles/global.scss'
import './taxas.scss'
import Select from 'react-select'
import { FiEdit, FiPlus, FiTrash, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi'
import ConfirmDelete from '../../components/Componente_ConfirmDelete'
import LazyLoader from '../../components/Componente_LazyLoader/index.js'
import Overlay from '../../components/Component_Overlay/index.js'
import TabelaCompTaxas from './TabelaCompTaxas.js'

const Taxas = () => {
    const location = useLocation()
    const {
        loadBanners,
        loadAdmins,
        loadMods,
        loadTaxes,
        addTax,
        editTax,
        deleteTax,
        changedOption,
        isLoadingTaxes,
        taxesPageArray,
        setTaxesTableData,
    } = useContext(AuthContext)

    const [bannersList, setBannersList] = useState([])
    const [adminsList, setAdminsList] = useState([])
    const [modsList, setModsList] = useState([])

    const cliOptions = JSON.parse(localStorage.getItem('clientOptions'))

    const [banOptions, setBanOptions] = useState([])
    const [admOptions, setAdmOptions] = useState([])
    const [modOptions, setModOptions] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)

    const [clientCode, setClientCode] = useState(localStorage.getItem('clientCode'))
    const [taxesList, setTaxesList] = useState([])

    const taxasComp = [
        {
            nomeGrupo: 'nomeGrupo',
            nomeCliente : 'nomeCliente',
            periodo: 'periodo',
            cnpj: 'cnpj',
            taxas:[
                {
                    adquirente: 'relenscard',
                    bandeira: 'master',
                    produto: '1',
                    modalidade: '1',
                    taxaMediaPenultimoMes: 1.2,
                    taxaMediaUltimoMes: 1.5,
                    taxaCadastrada: 1.35,
                    comparativo: 1.36
                }
            ]
        },
                {
            nomeGrupo: 'nomeGrupo',
            nomeCliente : 'nomeCliente',
            periodo: 'periodo',
            cnpj: 'cnpj',
            taxas:[
                {
                    adquirente: 'flibcard',
                    bandeira: 'master',
                    produto: '2',
                    modalidade: '1',
                    taxaMediaPenultimoMes: 1,
                    taxaMediaUltimoMes: 0.8,
                    taxaCadastrada: 1.22,
                    comparativo: 1.1
                }
            ]
        },
                {
            nomeGrupo: 'nomeGrupo',
            nomeCliente : 'nomeCliente',
            periodo: 'periodo',
            cnpj: 'cnpj',
            taxas:[
                {
                    adquirente: 'crelenscred',
                    bandeira: 'visa',
                    produto: '3',
                    modalidade: '2',
                    taxaMediaPenultimoMes: 0.5,
                    taxaMediaUltimoMes: 3.1,
                    taxaCadastrada: 2.55,
                    comparativo: 2.36
                }
            ]
        },
                {
            nomeGrupo: 'nomeGrupo',
            nomeCliente : 'nomeCliente',
            periodo: 'periodo',
            cnpj: 'cnpj',
            taxas:[
                {
                    adquirente: 'adquirente',
                    bandeira: 'bandeira',
                    produto: 'produto',
                    modalidade: 'modalidade',
                    taxaMediaPenultimoMes: 1.2,
                    taxaMediaUltimoMes: 1.5,
                    taxaCadastrada: 1.35,
                    comparativo: 1.36
                }
            ]
        },
    ]

    useEffect(() => {
        if (taxasComp && taxasComp.length > 0) {
            const allTaxas = taxasComp.flatMap(item => item.taxas || []);
            setTaxesTableData(allTaxas);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
    }, [])

    const [runTutorial, setRunTutorial] = useState(false)
    const [steps, setSteps] = useState([
    {
        target: '[data-tour="trocar-section"]',
        content: 'Utilize o botão "Trocar" para selecionar um cliente específico, dando assim a opção de cadastrar taxas, ou consultar taxas existentes',
        disableBeacon: true,
        placement: 'bottom'
    },
    ])

    const [stepsNoTaxas] = useState([
    {
        target: '[data-tour="cadastrar-taxa-section"]',
        content: 'Clique aqui para cadastrar taxas para o cliente selecionado.',
        placement: 'bottom'
    },
    ])

    const [stepsTaxas] = useState([
    {
        target: '[data-tour="editar-taxa-section"]',
        content: 'Clique aqui para editar a taxa correspondente.',
        placement: 'top'
    },
    {
        target: '[data-tour="deletar-taxa-section"]',
        content: 'Clique aqui para excluir a taxa correspondente.',
        placement: 'top'
    },
    ])

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)        
        const tutorialCompleted = localStorage.getItem('taxasTutorialCompleted')
        if (!tutorialCompleted) {
            const timer = setTimeout(() => {
                setRunTutorial(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [location, steps])
    
    const handleTutorialEnd = () => {
        setRunTutorial(false)
        localStorage.setItem('taxasTutorialCompleted', 'true')
    }

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

            if (modsList.length === 0) {
                const response = await loadMods()
                setModsList(response)
            }

            if (clientCode !== 'todos') {
                const response = await loadTaxes()
                setTaxesList(response)
            }
        }
        inicialize()
    }, [])

    useEffect(()=>{
    if(taxesPageArray.length > 0){
        exportTaxes(taxesPageArray)
    }
    },[taxesPageArray, localStorage.getItem('currentPath')])

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
        if (modsList) {
            if (modsList.length > 0) {
                const modsListOptions = modsList.map(mod => ({ value: mod.codigoModalidade, label: mod.descricaoModalidade }))
                setModOptions(modsListOptions)
            }
        }
    }, [modsList])

    useEffect(() => {
        setClientCode(localStorage.getItem('clientCode'))
        setTaxesList([])
    }, [changedOption])

    useEffect(() => {
        const loadTax = async () => {
            if ((clientCode === 'todos') || (clientCode === 'TODOS')) {
                setTaxesList([])
            } else {
                const response = await loadTaxes()
                setTaxesList(response)
            }
        }
        loadTax()
    }, [clientCode])

    const [editableTax, setEditableTax] = useState()

    const handleEdit = (object) => {
        setEditableTax({
            CODIGO: object.CODIGO,
            BANDEIRA: { label: object.BADDESCRICAO, value: object.BADCODIGO },
            ADQUIRENTE: { label: object.ADQUIRENTE.nomeAdquirente, value: object.ADQCODIGO },
            CLICODIGO: object.CLICODIGO,
            MODALIDADE: { label: object.MODDESCRICAO, value: object.MODCODIGO },
            TAXAPERCENTUAL: parseFloat(object.TAXAPERCENTUAL),
        })
        setIsModalEditOpen(true)
    }

    const resetValues = () => {
        setEditableTax({})
    }

    const [isOverlayVisible, setOverlayVisible] = useState(false)

    const handleDelete = async (object) => {
        const onConfirm = async() => {
            setOverlayVisible(false)

            const toBeDeleted = {
                CODIGO: object.CODIGO,
                BADCODIGO: object.BADCODIGO,
                ADQCODIGO: object.ADQCODIGO,
                CLICODIGO: object.CLICODIGO,
                MODCODIGO: object.MODCODIGO,
                TAXAPERCENTUAL: object.TAXAPERCENTUAL
            }
    
            try {
                toast.dismiss()
                await toast.promise(deleteTax(toBeDeleted), {
                    pending: 'Carregando...',
                    error: 'Ocorreu um Erro',
                })
                setTaxesList(prevTaxesList => prevTaxesList.filter(tax => tax.CODIGO !== object.CODIGO))
                resetValues()
            } catch (error) {
                console.error('Error handling busca:', error)
            }
            toast.dismiss()
        }

        const onCancel = () => {
            setOverlayVisible(false)
            toast.dismiss()
        }

        setOverlayVisible(true)
        toast(
            <ConfirmDelete onConfirm={onConfirm} onCancel={onCancel} />,
            {
                position: "bottom-center",
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
                draggable: false,
            }
        )
    }

    const handleCancel = () => {
        resetValues()
        setIsModalEditOpen(false)
    }

        //adicionando páginas à tabela:

        const [currentPage, setCurrentPage] = useState(1)
        const [itemsPerPage] = useState(15) // Number of items per page
    
        useEffect(() => {
            setCurrentPage(1) // Reset page to 1 when data changes
        }, [taxesList])
    
        // Change page functions
        const goToPrevPage = () => {
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)) // Decrease page by 1, minimum page is 1
        }
    
        const goToNextPage = () => {
            setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(taxesList.length / itemsPerPage))) // Increase page by 1, maximum page is calculated based on array length
        }
    
        const goToFirstPage = () => {
            setCurrentPage(1) // Go to the first page
        }
    
        const goToLastPage = () => {
            setCurrentPage(Math.ceil(taxesList.length / itemsPerPage)) // Go to the last page
        }
    
        // Calculate indexes for pagination
        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage
        const currentItems = taxesList.slice(indexOfFirstItem, indexOfLastItem)

    const TaxesTable = () => {

        const [filter, setFilter] = useState('')
        const [filteredItems, setFilteredItems] = useState([])
        const [currentPage, setCurrentPage] = useState(1)
        const [itemsPerPage] = useState(15) // Number of items per page
    
        useEffect(() => {
            setFilteredItems(taxesList) // Initialize with all items
        }, [taxesList])
    
        useEffect(() => {
            setCurrentPage(1) // Reset page to 1 when filter changes
            filterItems()
        }, [filter])

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

        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage
        const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

       const filterItems = () => {
            if(filter === ''){
                setFilteredItems(taxesList)
            } else {
                const filtered = taxesList.filter(item =>
                    item.BADDESCRICAO.toLowerCase().includes(filter.toLowerCase()) ||
                    item.ADQUIRENTE.nomeAdquirente.toLowerCase().includes(filter.toLowerCase()) ||
                    item.MODDESCRICAO.toLowerCase().includes(filter.toLowerCase()) ||
                    item.TIPOTAXA.toString().toLowerCase().includes(filter.toLowerCase()) ||
                    item.TAXAPERCENTUAL.toString().toLowerCase().includes(filter.toLowerCase())
                )
                setFilteredItems(filtered)
            }
        }

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
                <div className='dropShadow vendas-view'>
                    <div className='table-wrapper table-wrapper-taxes'>
                        <table className="table table-striped table-hover table-bordered table-bancos det-table-global">
                            <thead>
                                <tr className='det-tr-top-global'>
                                    <th className='det-th-global sticky-col start-col' scope="col" style={{ width: '2%', textAlign: 'center' }}>
                                        <button data-tour="cadastrar-taxa-section" className="btn btn-primary btn-global" style={{ width: '100%' }} onClick={() => { setIsModalOpen(true) }}>
                                            <FiPlus size={25} className="icon" />
                                        </button>
                                    </th>
                                    <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Bandeira</th>
                                    <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Adquirente</th>
                                    <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Modalidade</th>
                                    <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>Tipo Taxa</th>
                                    <th className='det-th-global' scope="col" style={{ textAlign: 'center', minWidth: '150px' }}>% Taxa</th>
                                    <th className='det-th-global sticky-col end-col' scope="col" style={{ width: '2%', textAlign: 'center' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 &&
                                    currentItems.map((object, index) => (
                                        <tr key={index} className="det-tr-global tr-taxas">
                                            <th data-tour="editar-taxa-section" className='sticky-col start-col' scope="row" style={{ textAlign: 'center' }} onClick={() => { handleEdit(object) }}>
                                                <FiEdit style={{ color: "green" }}className="icon" />
                                            </th>
                                            <td className="det-td-vendas-global" data-label="BADDESCRICAO">{object.BADDESCRICAO}</td>
                                            <td className="det-td-vendas-global" data-label="nomeAdquirente">{object.ADQUIRENTE.nomeAdquirente}</td>
                                            <td className="det-td-vendas-global" data-label="MODDESCRICAO">{object.MODDESCRICAO}</td>
                                            <td className="det-td-vendas-global" data-label="TIPOTAXA">{object.TIPOTAXA}</td>
                                            <td className="det-td-vendas-global" data-label="TAXAPERCENTUAL">{object.TAXAPERCENTUAL} %</td>
                                            <th data-tour="deletar-taxa-section" className='sticky-col end-col' scope="row" style={{ textAlign: 'center' }} onClick={() => handleDelete(object)}>
                                                <FiTrash style={{ color: "red" }} className="icon" />
                                            </th>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <hr className='hr-global'/>
                { filteredItems.length > itemsPerPage && (
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
                            disabled={currentPage === Math.ceil(taxesList.length / itemsPerPage)} // Disable if it's the last page
                        >
                            <FiChevronRight/> {/* Right arrow */}
                        </button>
                        <button
                            className='btn btn-primary btn-global btn-skip'
                            onClick={goToLastPage}
                            disabled={currentPage === Math.ceil(taxesList.length / itemsPerPage)} // Disable if already on the last page
                        >
                            <FiSkipForward />
                        </button>
                    </div>
                )}
                { taxesList.length > itemsPerPage ? (<hr className='hr-global'/>) : (<></>) }
            </>
        )
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setIsModalEditOpen(false)
    }

    const isObjectFullyPopulated = (obj) => {
        return obj && Object.values(obj).every(value => value !== null && value !== 0 && value !== '' && value !== 'Selecione')
    }

    const ModalNewTax = () => {
        const [selectedCli, setSelectedCli] = useState(() => {
            const cookieValue = localStorage.getItem('selectedClient')
            return cookieValue ? JSON.parse(cookieValue) : { label: 'Selecione', value: 0 }
        })
        const [selectedBan, setSelectedBan] = useState({ label: 'Selecione', value: 0 })
        const [selectedAdm, setSelectedAdm] = useState({ label: 'Selecione', value: 0 })
        const [selectedMod, setSelectedMod] = useState({ label: 'Selecione', value: 0 })
        const [tax, setTax] = useState('')
    
        const resetValues = () => {
            setSelectedCli({ label: 'Selecione', value: 0 })
            setSelectedBan({ label: 'Selecione', value: 0 })
            setSelectedAdm({ label: 'Selecione', value: 0 })
            setSelectedMod({ label: 'Selecione', value: 0 })
            setTax('')
            setIsModalOpen(false)
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault()
            const newTaxObj = {
                ADQCODIGO: selectedAdm.value,
                BADCODIGO: selectedBan.value,
                CLICODIGO: clientCode,
                MODCODIGO: selectedMod.value,
                TAXAPERCENTUAL: parseFloat(tax),
            }
        
            if (isObjectFullyPopulated(newTaxObj)) {
                try {
                    toast.dismiss()
                    await toast.promise(addTax(newTaxObj), {
                        pending: 'Carregando...',
                        error: 'Erro ao adicionar Taxa',
                    })
                    const updatedTaxes = await loadTaxes()
                    setTaxesList(updatedTaxes)
                    resetValues()
                } catch (error) {
                    console.error('Error handling submit:', error)
                }
            } else {
                toast.dismiss()
                toast.warning('Todos os Campos devem ser preenchidos')
            }
        }

        return (
            <div className={`modal-taxas modal ${isModalOpen ? 'modal-open' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
                <div className='header-sticky' style={{paddingTop: '0'}}>
                    <div className='header-container-taxa'>
                        <div className='title-container-global title-container-banco title-container-contato' style={{ marginTop: '5%' }}>
                            <h3 className='title-global' style={{ margin: '0', height: 'auto' }}>Cadastrar Taxa</h3>
                        </div>
                    </div>
                    <hr className='hr-global'/>
                </div>
                <form className='select-container-taxas' onSubmit={handleSubmit}>
                    <div className='form-group-taxas'>
                        <div className='group-element-taxas'>
                            <label className='span-picker'>Cliente</label>
                            <Select
                                id="cliSelect"
                                options={cliOptions}
                                value={selectedCli}
                                onChange={(selected) => setSelectedCli(selected)}
                                isDisabled={true}
                            />
                        </div>
                        <div className='group-element-taxas'>
                            <label className='span-picker'>Adquirente</label>
                            <Select
                                id="admSelect"
                                options={admOptions}
                                value={selectedAdm}
                                onChange={(selected) => setSelectedAdm(selected)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>
                    </div>
                    <div className='form-group-taxas'>
                        <div className='group-element-taxas'>
                            <label className='span-picker'>Bandeira</label>
                            <Select
                                id="banSelect"
                                options={banOptions}
                                value={selectedBan}
                                onChange={(selected) => setSelectedBan(selected)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>
                        <div className='group-element-taxas'>
                            <label className='span-picker'>Modalidade</label>
                            <Select
                                id="modSelect"
                                options={modOptions}
                                value={selectedMod}
                                onChange={(selected) => setSelectedMod(selected)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>
                    </div>
                    <div className='group-input-taxa'>
                        <label className='span-picker'>Taxa (%)</label>
                        <input
                            style={{height: '100%'}}
                            type="number"
                            id="taxInput"
                            pattern="[0-9\-]*"
                            value={tax}
                            onChange={(e) => {
                                const inputValue = e.target.value
                                let formattedValue = inputValue.replace(/[^\d.]/g, '') // Remove any non-digit characters except period
                                if (formattedValue.length === 3 && !formattedValue.includes('.')) {
                                    // Insert a period after the first two digits
                                    formattedValue = formattedValue.slice(0, 2) + '.' + formattedValue.slice(2)
                                }
                                if (formattedValue.length > 5) {
                                    // Allow only one digit after the period
                                    formattedValue = formattedValue.slice(0, 4)
                                }
                                setTax(formattedValue)
                            }}
                            maxLength={5} // Maximum length including the decimal point
                        />
                    </div>
                    <hr className='hr-global'/>
                    <div className='group-element-taxas'>
                        <div className='btn-container-modal-taxas'>
                            <button className='btn-global btn-taxas' disabled={isLoadingTaxes}>Cadastrar Taxa</button>
                            <button className='btn btn-danger' onClick={closeModal} style={{height: '35.19px', borderRadius: '10px'}}>Voltar</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    

    const ModalEditTax = () => {
        const [selectedBan, setSelectedBan] = useState(editableTax?.BANDEIRA || { label: 'Selecione', value: 0 })
        const [selectedAdm, setSelectedAdm] = useState(editableTax?.ADQUIRENTE || { label: 'Selecione', value: 0 })
        const [selectedMod, setSelectedMod] = useState(editableTax?.MODALIDADE || { label: 'Selecione', value: 0 })
        const [tax, setTax] = useState(editableTax?.TAXAPERCENTUAL || '')
    
        const resetValues = () => {
            setSelectedBan({ label: 'Selecione', value: 0 })
            setSelectedAdm({ label: 'Selecione', value: 0 })
            setSelectedMod({ label: 'Selecione', value: 0 })
            setTax('')
            setIsModalEditOpen(false)
        }
    
        const handleEditTax = async (e) => {
            e.preventDefault()
            if (isObjectFullyPopulated({ selectedBan, selectedAdm, selectedMod, tax })) {
                const updatedTax = {
                    CODIGO: editableTax.CODIGO,
                    BADCODIGO: selectedBan.value,
                    ADQCODIGO: selectedAdm.value,
                    CLICODIGO: editableTax.CLICODIGO,
                    MODCODIGO: selectedMod.value,
                    TAXAPERCENTUAL: parseFloat(tax)
                }
                try {
                    await editTax(updatedTax)
                    const response = await loadTaxes()
                    setTaxesList(response)
                    resetValues()
                } catch (error) {
                    console.error('Erro ao editar taxa:', error)
                }
            } else {
                toast.dismiss()
                toast.error('Preencha todos os campos obrigatórios')
            }
        }
    
        const handleBan = (selected) => {
            setSelectedBan(selected)
        }
    
        const handleAdq = (selected) => {
            setSelectedAdm(selected)
        }
    
        const handleMod = (selected) => {
            setSelectedMod(selected)
        }
    
        return (
            <div className={`modal-taxas modal ${isModalEditOpen ? 'modal-open' : ''}`} style={{ display: isModalEditOpen ? 'block' : 'none' }}>
                <div className='header-sticky' style={{paddingTop: '0'}}>
                    <div className='header-container-taxa'>
                        <div className='title-container-global title-container-banco title-container-contato' style={{ marginTop: '5%' }}>
                            <h3 className='title-global' style={{ margin: '0', height: 'auto' }}>Cadastrar Taxa</h3>
                        </div>
                    </div>
                    <hr className='hr-global'/>
                </div>
                <form className='select-container-taxas' onSubmit={handleEditTax}>
                    <div className='form-group-taxas'>
                        <div className='group-element-taxas'>
                            <label className='span-picker'>Adquirente</label>
                            <Select
                                id="admSelectEdit"
                                options={admOptions}
                                value={selectedAdm}
                                onChange={handleAdq}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>
                        <div className='group-element-taxas'>
                            <label className='span-picker'>Bandeira</label>
                            <Select
                                id="banSelectEdit"
                                options={banOptions}
                                value={selectedBan}
                                onChange={handleBan}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>
                    </div>
                    <div className='form-group-taxas'>
                        <div className='group-element-taxas'>
                            <label className='span-picker'>Modalidade</label>
                            <Select
                                id="modSelectEdit"
                                options={modOptions}
                                value={selectedMod}
                                onChange={handleMod}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                            />
                        </div>
                        <div className='group-input-taxa'>
                            <label className='span-picker'>Taxa (%)</label>
                            <input
                                style={{height: '100%'}}
                                type="number"
                                id="taxInput"
                                pattern="[0-9\-]*"
                                value={tax}
                                onChange={(e) => {
                                const inputValue = e.target.value
                                let formattedValue = inputValue.replace(/[^\d.]/g, '') // Remove any non-digit characters except period
                                if (formattedValue.length === 3 && !formattedValue.includes('.')) {
                                    // Insert a period after the first two digits
                                    formattedValue = formattedValue.slice(0, 2) + '.' + formattedValue.slice(2)
                                }
                                if (formattedValue.length > 5) {
                                    // Allow only one digit after the period
                                    formattedValue = formattedValue.slice(0, 4)
                                }
                                setTax(formattedValue)
                            }}
                            maxLength={5} // Maximum length including the decimal point
                            />
                        </div>
                    </div>
                    <hr className='hr-global'/>
                    <div className='group-element-taxas'>
                        <div className='btn-container-modal-taxas'>
                            <button className='btn-global btn-taxas' disabled={isLoadingTaxes}>Atualizar Taxa</button>
                            <button className='btn btn-danger' onClick={closeModal} style={{height: '35.19px', borderRadius: '10px'}}>Voltar</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    
    return (
        <div className='appPage'>
            <Overlay isVisible={isOverlayVisible}/>
            <div className='page-background-global'>
                <div className='page-content-global'>
                    <div className='page-content-taxas'>
                        <div className='title-container-global'>
                            <h1 className='title-global'>Cadastramento de Taxas</h1>
                        </div>
                        <hr className='hr-global'/>
                        <div className='container-global' style={{margin: '0', flexDirection: 'column', alignItems: 'center'}}>
                            { ((taxesList && taxesList.length > 0) && (clientCode !== ('todos' || undefined))) && 
                            <div>    
                                <h3 className='subtitle' style={{width: '100%', display: 'flex', flexDirection: 'column', alignContent: 'center', textAlign: 'center'}}>Cliente: {JSON.parse(localStorage.getItem('selectedClient')).label}</h3>
                                <hr className='hr-global'/>
                            </div>
                            }
                            { ((taxesList && taxesList.length === 0) && (clientCode !== ('todos' || undefined)) && (isLoadingTaxes === false)) && 
                            <>  
                                <span className='subtitle'>Sem Taxas Cadastradas</span>
                                <br/> 
                                <button data-tour="cadastrar-taxa-section" className='btn btn-primary btn-global' onClick={()=>{setIsModalOpen(true)}}><FiPlus className='icon' />Adicionar</button>
                            </>
                            }
                            {
                                (clientCode === ('todos' || undefined) && (isLoadingTaxes === false)) ?
                                    <span className='subtitle' style={{textAlign: 'center'}}>Clique no botão 'Trocar' na parte superior da página para selecionar um cliente e exibir ou cadastrar suas taxas</span>
                                    : 
                                    <></>
                            }
                        </div>
                    </div>
                        {
                            isLoadingTaxes ? (
                                <LazyLoader />
                            ) : taxesList && taxesList.length > 0 ? (
                                <>
                                    <TaxesTable />
                                    {taxasComp && taxasComp.length > 0 ? (
                                        <TabelaCompTaxas array={taxasComp} />
                                    ) : (
                                        <div>No Data</div>
                                    )}
                                </>
                            ) : null
                        }
                    <div className='modal-container' style={{ display: (isModalOpen || isModalEditOpen) ? 'block' : 'none' }}>
                        <ModalNewTax />
                        <ModalEditTax />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Taxas
