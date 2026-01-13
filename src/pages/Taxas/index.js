import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import '../../styles/global.scss'
import './taxas.scss'
import Select from 'react-select'
import { FiEdit, FiPlus, FiTrash, FiX, FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward, FiPercent, FiCreditCard, FiFlag, FiDollarSign } from 'react-icons/fi'
import { toast } from 'react-toastify'
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
        exportTaxes
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

    const taxasComp = []

    useEffect(() => {
        if (taxasComp && taxasComp.length > 0) {
            const allTaxas = taxasComp.flatMap(item => item.taxas || [])
            setTaxesTableData(allTaxas)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
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
                const bannersListOptions = bannersList.map(banner => ({ 
                    value: banner.codigoBandeira, 
                    label: banner.descricaoBandeira,
                    iconType: 'flag'
                }))
                setBanOptions(bannersListOptions)
            }
        }
    }, [bannersList])

    useEffect(() => {
        if (adminsList) {
            if (adminsList.length > 0) {
                const adminsListOptions = adminsList.map(admin => ({ 
                    value: admin.codigoAdquirente, 
                    label: admin.nomeAdquirente,
                    iconType: 'creditCard'
                }))
                setAdmOptions(adminsListOptions)
            }
        }
    }, [adminsList])

    useEffect(() => {
        if (modsList) {
            if (modsList.length > 0) {
                const modsListOptions = modsList.map(mod => ({ 
                    value: mod.codigoModalidade, 
                    label: mod.descricaoModalidade,
                    iconType: 'dollar'
                }))
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
            BANDEIRA: { 
                label: object.BADDESCRICAO, 
                value: object.BADCODIGO,
                iconType: 'flag'
            },
            ADQUIRENTE: { 
                label: object.ADQUIRENTE.nomeAdquirente, 
                value: object.ADQCODIGO,
                iconType: 'creditCard'
            },
            CLICODIGO: object.CLICODIGO,
            MODALIDADE: { 
                label: object.MODDESCRICAO, 
                value: object.MODCODIGO,
                iconType: 'dollar'
            },
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

    // Helper function to get icon component based on type
    const getIconComponent = (iconType) => {
        switch(iconType) {
            case 'flag':
                return <FiFlag size={16} />;
            case 'creditCard':
                return <FiCreditCard size={16} />;
            case 'dollar':
                return <FiDollarSign size={16} />;
            case 'percent':
                return <FiPercent size={16} />;
            default:
                return null;
        }
    }

    const formatOptionLabel = ({ label, iconType }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getIconComponent(iconType)}
            <span>{label}</span>
        </div>
    )

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(15)
    const [filter, setFilter] = useState('')
    const [filteredItems, setFilteredItems] = useState([])

    useEffect(() => {
        setFilteredItems(taxesList)
    }, [taxesList])

    useEffect(() => {
        setCurrentPage(1)
        if (filter === '') {
            setFilteredItems(taxesList)
        } else {
            const filtered = taxesList.filter(item =>
                item.BADDESCRICAO.toLowerCase().includes(filter.toLowerCase()) ||
                (item.ADQUIRENTE?.nomeAdquirente || '').toLowerCase().includes(filter.toLowerCase()) ||
                item.MODDESCRICAO.toLowerCase().includes(filter.toLowerCase()) ||
                (item.TIPOTAXA?.toString() || '').toLowerCase().includes(filter.toLowerCase()) ||
                (item.TAXAPERCENTUAL?.toString() || '').toLowerCase().includes(filter.toLowerCase())
            )
            setFilteredItems(filtered)
        }
    }, [filter, taxesList])

    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    }

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredItems.length / itemsPerPage)))
    }

    const goToFirstPage = () => {
        setCurrentPage(1)
    }

    const goToLastPage = () => {
        setCurrentPage(Math.ceil(filteredItems.length / itemsPerPage))
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

    // Modal Components
    const ModalNewTax = () => {
        const [selectedCli, setSelectedCli] = useState(() => {
            const cookieValue = localStorage.getItem('selectedClient')
            return cookieValue ? JSON.parse(cookieValue) : null
        })
        const [selectedBan, setSelectedBan] = useState(null)
        const [selectedAdm, setSelectedAdm] = useState(null)
        const [selectedMod, setSelectedMod] = useState(null)
        const [tax, setTax] = useState('')
        const [isSubmitting, setIsSubmitting] = useState(false)

        const resetForm = () => {
            setSelectedBan(null)
            setSelectedAdm(null)
            setSelectedMod(null)
            setTax('')
        }

        const closeModal = () => {
            resetForm()
            setIsModalOpen(false)
        }

        const handleSubmit = async (e) => {
            e.preventDefault()
            
            if (!selectedCli || !selectedBan || !selectedAdm || !selectedMod || !tax) {
                toast.warning('Preencha todos os campos obrigatórios')
                return
            }

            setIsSubmitting(true)
            
            const newTaxObj = {
                ADQCODIGO: selectedAdm.value,
                BADCODIGO: selectedBan.value,
                CLICODIGO: clientCode,
                MODCODIGO: selectedMod.value,
                TAXAPERCENTUAL: parseFloat(tax),
            }
        
            try {
                toast.dismiss()
                await toast.promise(addTax(newTaxObj), {
                    pending: 'Salvando taxa...',
                    success: 'Taxa cadastrada com sucesso!',
                    error: 'Erro ao cadastrar taxa'
                })
                const updatedTaxes = await loadTaxes()
                setTaxesList(updatedTaxes)
                resetForm()
                setIsModalOpen(false)
            } catch (error) {
                console.error('Error handling submit:', error)
                toast.error('Erro ao cadastrar taxa')
            } finally {
                setIsSubmitting(false)
            }
        }

        if (!isModalOpen) return null

        return (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-container-taxas" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-header-content">
                            <FiPercent className="modal-title-icon" />
                            <h2 className="modal-title">Cadastrar Nova Taxa</h2>
                        </div>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <FiX size={24} />
                        </button>
                    </div>

                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="modal-fields">
                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiCreditCard className="modal-label-icon" />
                                    Cliente/Filial
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={cliOptions ? cliOptions.map(opt => ({
                                        ...opt,
                                        iconType: 'creditCard'
                                    })) : []}
                                    value={selectedCli ? {
                                        ...selectedCli,
                                        iconType: 'creditCard'
                                    } : null}
                                    formatOptionLabel={formatOptionLabel}
                                    isDisabled={true}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiCreditCard className="modal-label-icon" />
                                    Adquirente
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={admOptions}
                                    value={selectedAdm}
                                    onChange={setSelectedAdm}
                                    formatOptionLabel={formatOptionLabel}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Selecione o adquirente..."
                                    noOptionsMessage={() => "Nenhum adquirente disponível"}
                                    isSearchable
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiFlag className="modal-label-icon" />
                                    Bandeira
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={banOptions}
                                    value={selectedBan}
                                    onChange={setSelectedBan}
                                    formatOptionLabel={formatOptionLabel}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Selecione a bandeira..."
                                    noOptionsMessage={() => "Nenhuma bandeira disponível"}
                                    isSearchable
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiDollarSign className="modal-label-icon" />
                                    Modalidade
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={modOptions}
                                    value={selectedMod}
                                    onChange={setSelectedMod}
                                    formatOptionLabel={formatOptionLabel}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Selecione a modalidade..."
                                    noOptionsMessage={() => "Nenhuma modalidade disponível"}
                                    isSearchable
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiPercent className="modal-label-icon" />
                                    Taxa (%)
                                </label>
                                <div className="tax-input-container">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={tax}
                                        onChange={(e) => {
                                            let value = e.target.value
                                            if (value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
                                                toast.warning('A taxa deve estar entre 0% e 100%')
                                                return
                                            }
                                            setTax(value)
                                        }}
                                        placeholder="0.00"
                                        className="tax-input"
                                    />
                                    <span className="tax-suffix">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-btn modal-btn-secondary"
                                onClick={closeModal}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="modal-btn modal-btn-primary"
                                disabled={isSubmitting || !selectedBan || !selectedAdm || !selectedMod || !tax}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="modal-spinner" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <FiPlus className="me-2" />
                                        Cadastrar Taxa
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    const ModalEditTax = () => {
        const [selectedBan, setSelectedBan] = useState(editableTax?.BANDEIRA || null)
        const [selectedAdm, setSelectedAdm] = useState(editableTax?.ADQUIRENTE || null)
        const [selectedMod, setSelectedMod] = useState(editableTax?.MODALIDADE || null)
        const [tax, setTax] = useState(editableTax?.TAXAPERCENTUAL?.toString() || '')
        const [isSubmitting, setIsSubmitting] = useState(false)

        const closeModal = () => {
            setIsModalEditOpen(false)
        }

        const handleEditTax = async (e) => {
            e.preventDefault()
            
            if (!selectedBan || !selectedAdm || !selectedMod || !tax) {
                toast.warning('Preencha todos os campos obrigatórios')
                return
            }

            setIsSubmitting(true)
            
            const updatedTax = {
                CODIGO: editableTax.CODIGO,
                BADCODIGO: selectedBan.value,
                ADQCODIGO: selectedAdm.value,
                CLICODIGO: editableTax.CLICODIGO,
                MODCODIGO: selectedMod.value,
                TAXAPERCENTUAL: parseFloat(tax)
            }
            
            try {
                await toast.promise(editTax(updatedTax), {
                    pending: 'Atualizando taxa...',
                    success: 'Taxa atualizada com sucesso!',
                    error: 'Erro ao atualizar taxa'
                })
                const response = await loadTaxes()
                setTaxesList(response)
                closeModal()
            } catch (error) {
                console.error('Erro ao editar taxa:', error)
                toast.error('Erro ao atualizar taxa')
            } finally {
                setIsSubmitting(false)
            }
        }

        if (!isModalEditOpen) return null

        return (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-container-taxas" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-header-content">
                            <FiEdit className="modal-title-icon" />
                            <h2 className="modal-title">Editar Taxa</h2>
                        </div>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <FiX size={24} />
                        </button>
                    </div>

                    <form className="modal-form" onSubmit={handleEditTax}>
                        <div className="modal-fields">
                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiCreditCard className="modal-label-icon" />
                                    Cliente/Filial
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={cliOptions ? cliOptions.map(opt => ({
                                        ...opt,
                                        iconType: 'creditCard'
                                    })) : []}
                                    value={editableTax?.CLICODIGO ? {
                                        ...(cliOptions?.find(opt => opt.value === editableTax.CLICODIGO) || {}),
                                        iconType: 'creditCard'
                                    } : null}
                                    formatOptionLabel={formatOptionLabel}
                                    isDisabled={true}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiCreditCard className="modal-label-icon" />
                                    Adquirente
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={admOptions}
                                    value={selectedAdm}
                                    onChange={setSelectedAdm}
                                    formatOptionLabel={formatOptionLabel}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Selecione o adquirente..."
                                    noOptionsMessage={() => "Nenhum adquirente disponível"}
                                    isSearchable
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiFlag className="modal-label-icon" />
                                    Bandeira
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={banOptions}
                                    value={selectedBan}
                                    onChange={setSelectedBan}
                                    formatOptionLabel={formatOptionLabel}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Selecione a bandeira..."
                                    noOptionsMessage={() => "Nenhuma bandeira disponível"}
                                    isSearchable
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiDollarSign className="modal-label-icon" />
                                    Modalidade
                                </label>
                                <Select
                                    styles={customStyles}
                                    options={modOptions}
                                    value={selectedMod}
                                    onChange={setSelectedMod}
                                    formatOptionLabel={formatOptionLabel}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Selecione a modalidade..."
                                    noOptionsMessage={() => "Nenhuma modalidade disponível"}
                                    isSearchable
                                />
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">
                                    <FiPercent className="modal-label-icon" />
                                    Taxa (%)
                                </label>
                                <div className="tax-input-container">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={tax}
                                        onChange={(e) => {
                                            let value = e.target.value
                                            if (value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
                                                toast.warning('A taxa deve estar entre 0% e 100%')
                                                return
                                            }
                                            setTax(value)
                                        }}
                                        placeholder="0.00"
                                        className="tax-input"
                                    />
                                    <span className="tax-suffix">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-btn modal-btn-secondary"
                                onClick={closeModal}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="modal-btn modal-btn-primary"
                                disabled={isSubmitting || !selectedBan || !selectedAdm || !selectedMod || !tax}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="modal-spinner" />
                                        Atualizando...
                                    </>
                                ) : (
                                    <>
                                        <FiEdit className="me-2" />
                                        Atualizar Taxa
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className='appPage'>
            <Overlay isVisible={isOverlayVisible}/>
            <ModalNewTax />
            <ModalEditTax />
            
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
                    
                    {isLoadingTaxes ? (
                        <LazyLoader />
                    ) : taxesList && taxesList.length > 0 ? (
                        <>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Filtrar por bandeira, adquirente, modalidade ou taxa..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="filter-input"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            
                            <div className='dropShadow vendas-view' style={{ overflow: 'hidden' }}>
                                <div className='table-wrapper table-wrapper-taxes'>
                                    <table className="table table-striped table-hover table-bordered table-bancos det-table-global table-taxas">
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
                                                        <th data-tour="editar-taxa-section" className='sticky-col start-col' scope="row" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => { handleEdit(object) }}>
                                                            <FiEdit style={{ color: "green" }} className="icon" />
                                                        </th>
                                                        <td className="det-td-vendas-global">{object.BADDESCRICAO}</td>
                                                        <td className="det-td-vendas-global">{object.ADQUIRENTE?.nomeAdquirente || 'N/A'}</td>
                                                        <td className="det-td-vendas-global">{object.MODDESCRICAO}</td>
                                                        <td className="det-td-vendas-global">{object.TIPOTAXA || 'N/A'}</td>
                                                        <td className="det-td-vendas-global">{object.TAXAPERCENTUAL} %</td>
                                                        <th data-tour="deletar-taxa-section" className='sticky-col end-col' scope="row" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleDelete(object)}>
                                                            <FiTrash style={{ color: "red" }} className="icon" />
                                                        </th>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            {filteredItems.length > itemsPerPage && (
                                <>
                                    <hr className='hr-global'/>
                                    <div className="container-btn-pagina">
                                        <button
                                            className='btn btn-primary btn-global btn-skip'
                                            onClick={goToFirstPage}
                                            disabled={currentPage === 1}
                                        >
                                            <FiSkipBack />
                                        </button>
                                        <button
                                            className='btn btn-primary btn-global btn-navigate'
                                            onClick={goToPrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            <FiChevronLeft/>
                                        </button>
                                        <div className='pagina-atual'>
                                            <span className='texto-paginacao'>Página </span>
                                            <span className='texto-paginacao'>{currentPage} de {Math.ceil(filteredItems.length / itemsPerPage)}</span>
                                        </div>
                                        <button
                                            className='btn btn-primary btn-global btn-navigate'
                                            onClick={goToNextPage}
                                            disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                                        >
                                            <FiChevronRight/>
                                        </button>
                                        <button
                                            className='btn btn-primary btn-global btn-skip'
                                            onClick={goToLastPage}
                                            disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                                        >
                                            <FiSkipForward />
                                        </button>
                                    </div>
                                    <hr className='hr-global'/>
                                </>
                            )}
                            
                            {taxasComp && taxasComp.length > 0 ? (
                                <TabelaCompTaxas array={taxasComp} />
                            ) : (
                                <div style={{width: '100%'}}>
                                    <div className='subtitle-global text-global'>Sem dados de comparativo de taxas a serem exibidos ( <b style={{'color': 'orange'}}>Funcionalidade em Desenvolvimento</b> )</div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Taxas