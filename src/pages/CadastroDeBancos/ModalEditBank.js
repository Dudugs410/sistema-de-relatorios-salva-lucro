import { useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import '../../styles/global.scss'
import './cadastroDeBancos.scss'
import Select from 'react-select'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'


const ModalEditBank = ({editableBank}) => {
    const [selectedCli, setSelectedCli] = useState(() => {
        const cookieValue = Cookies.get('selectedClient')
        return cookieValue ? JSON.parse(cookieValue) : { label: 'Selecione', value: 0 }
    })
    const [selectedCode, setSelectedCode] = useState(editableBank?.codigoEstabelecimento || '' )
    const [selectedClientCode, setSelectedClientCode] = useState(editableBank?.codigoCliente || '' )
    const [selectedClientAdminCode, setSelectedClientAdminCode] = useState(editableBank?.codigoClienteAdquirente || '' )
    const [selectedBan, setSelectedBan] = useState(editableBank?.bandeira || { label: 'Selecione', value: 0 })
    const [selectedAdm, setSelectedAdm] = useState(editableBank?.adquirente || { label: 'Selecione', value: 0 })
    const [selectedProduct, setSelectedProduct] = useState(editableBank?.produto || { label: 'Selecione', value: 0 })
    const [selectedSubproduct, setSelectedSubproduct] = useState(editableBank?.subproduto || { label: 'Selecione', value: 0 })
    const [selectedBank, setSelectedBank] = useState(editableBank?.banco || '')
    const [selectedAgency, setSelectedAgency] = useState(editableBank?.agencia || '')
    const [selectedAccount, setSelectedAccount] = useState(editableBank?.conta || '')

    const isObjectFullyPopulated = (obj) => {
        return obj && Object.values(obj).every(value => value !== null && value !== 0 && value !== '' && value.label !== 'Selecione')
    }


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
            CodigoEstabelecimento: selectedCode,
            CodigoClienteAdquirente: selectedClientAdminCode,
            CodigoCliente: selectedClientCode,
            Adquirente: selectedAdm.value,
            Produto: selectedProduct.value,
            Bandeira: selectedBan.value,
            Subproduto: selectedSubproduct.value,
            Banco: selectedBank,
            Agencia: selectedAgency,
            Conta: selectedAccount,
        }

        if (isObjectFullyPopulated(newBankObj)) {
            try {
                toast.dismiss()
                await toast.promise(editBank(newBankObj), {
                    pending: 'Carregando...',
                    error: 'Erro ao adicionar Taxa',
                })
    
                const updatedBanks = await loadBanks()
                setBanksList(updatedBanks)
                resetValues()
            } catch (error) {
                console.error('Error handling submit:', error)
            }
        } else {
            toast.dismiss()
            toast.warning('Todos os Campos devem ser preenchidos')
        }
    }

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
                        <label className='span-picker'>Cliente</label>
                        <Select
                            id="cliSelect"
                            options={cliOptions}
                            value={selectedCli}
                            onChange={(selected) => setSelectedCli(selected)}
                            isDisabled={true}
                        />
                    </div>
                    <div className='group-element-bancos'>
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
                <div className='form-group-bancos'>
                    <div className='group-element-bancos'>
                        <label className='span-picker'>Código do Estabelecimento</label>
                        <Select
                            id="productSelect"
                            options={productOptions}
                            value={selectedProduct}
                            onChange={(selected) => setSelectedProduct(selected)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                    </div>
                    <div className='group-element-bancos'>
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
                </div>
                <div className='form-group-bancos'>
                    <div className='group-element-bancos'>
                        <label className='span-picker'>Produto</label>
                        <Select
                            id="productSelect"
                            options={productOptions}
                            value={selectedProduct}
                            onChange={(selected) => setSelectedProduct(selected)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                    </div>
                    <div className='group-element-bancos'>
                        <label className='span-picker'>Subproduto</label>
                        <Select
                            id="subproductSelect"
                            options={subproductOptions}
                            value={selectedSubproduct}
                            onChange={(selected) => setSelectedSubproduct(selected)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                    </div>
                </div>
                <div className='form-group-bancos'>
                    <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                        <label className='span-picker'>Banco</label>
                        <input
                            style={{height: '100%'}}
                            type="text"
                            id="bankInput"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                        />
                    </div>
                    <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                        <label className='span-picker'>Agência</label>
                        <input
                        style={{height: '100%'}}
                        type="text"
                        id="agencyInput"
                            value={selectedAgency}
                            onChange={(e) => setSelectedAgency(e.target.value)}
                        />
                    </div>
                    <div className='group-element-bancos' style={{display: 'inline-flex', flexDirection: 'column'}}>
                        <label className='span-picker'>Conta</label>
                        <input
                            style={{height: '100%'}}
                            type="text"
                            id="accountInput"
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                        />
                    </div>
                </div>                    <div className='group-element-bancos'>
                    <hr className='hr-global'/>
                    <button className='btn-global btn-bancos' disabled={isLoadingBanks}>Aplicar Modificações</button>
                </div>
            </form>
        </div>
    )
}

export default ModalEditBank