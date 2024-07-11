import { useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import '../../styles/global.scss'
import './cadastroDeBancos.scss'
import Select from 'react-select'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { sub } from 'date-fns'

const ModalNewBank = ({ onClose, cliAdqOptions, setIsSelected, cliOptions, admOptions, banOptions, productOptions, subproductOptions, addBank, loadBanks, setBanksList }) => {

    useEffect(()=>{
        console.log('Render Modal New Bank')
    },[])

    const [selectedCli, setSelectedCli] = useState(() => {
        const cookieValue = Cookies.get('selectedClient')
        return cookieValue ? JSON.parse(cookieValue) : { label: 'Selecione', value: 0 }
    })

    const [codeBankCli, setCodeBankCli] = useState(0)
    const [selectedClientCode, setSelectedClientCode] = useState(parseInt(Cookies.get('clientCode')))
    const [selectedCliAdm, setSelectedCliAdm] = useState({ label: 'Selecione', value: 0 })
    const [selectedBan, setSelectedBan] = useState({ label: 'Selecione', value: 0 })
    const [selectedAdm, setSelectedAdm] = useState({ label: 'Selecione', value: 0 })
    const [selectedProduct, setSelectedProduct] = useState({ label: 'Selecione', value: 0 })
    const [selectedSubproduct, setSelectedSubproduct] = useState({ label: 'Selecione', value: 0 })
    const [selectedBank, setSelectedBank] = useState('')
    const [selectedAgency, setSelectedAgency] = useState('')
    const [selectedAccount, setSelectedAccount] = useState('')
    const [isLoadingBanks, setIsLoadingBanks] = useState(false)

    const isObjectFullyPopulated = (obj) => {
        return obj && Object.values(obj).every(value => value !== null && value !== '' && value.label !== 'Selecione')
    }

    const resetValues = () => {
        setCodeBankCli(0)
        setSelectedCliAdm({ label: 'Selecione', value: 0 })
        setSelectedBan({ label: 'Selecione', value: 0 })
        setSelectedAdm({ label: 'Selecione', value: 0 })
        setSelectedProduct({ label: 'Selecione', value: 0 })
        setSelectedSubproduct({ label: 'Selecione', value: 0 })
        setSelectedBank('')
        setSelectedAgency('')
        setSelectedAccount('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newBankObj = {
            Codigo: 0,
            CodigoEstabelecimento: selectedCliAdm.label,
            CodigoClienteAdquirente: selectedCliAdm.value,
            CodigoCliente: selectedClientCode,
            Adquirente: selectedAdm.value,
            Produto: selectedProduct.value,
            Bandeira: selectedBan.value,
            Subproduto: selectedSubproduct.value,
            Banco: selectedBank,
            Agencia: selectedAgency,
            Conta: selectedAccount,
        }

        console.log('newBankObject: ', newBankObj)

        if (isObjectFullyPopulated(newBankObj)) {
            console.log('newBankObject: ', newBankObj)
            try {
                toast.dismiss();
                await toast.promise(addBank(newBankObj), {
                    pending: 'Carregando...',
                    error: 'Erro ao adicionar Taxa',
                });

                const updatedBanks = await loadBanks();
                setBanksList(updatedBanks);
                resetValues();
            } catch (error) {
                console.error('Error handling submit:', error)
            }
        } else {
            toast.dismiss();
            toast.warning('Todos os Campos devem ser preenchidos')
        }
    };

    const handleAdmin = (selected) => {
        Cookies.set('admCode', selected.value)
        setSelectedAdm(selected)
        setIsSelected(true)
    };

    return (
        <div className='modal-bancos modal'>
            <div className='header-container-taxa'>
                <div className='title-container-global'>
                    <h3 className='title-global' style={{ margin: '0' }}>Cadastrar Banco</h3>
                </div>
                <button className='btn btn-danger close-modal' onClick={onClose} style={{ marginLeft: '5px' }}><FiX size={25} /></button>
            </div>
            <hr className='hr-global' />
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
                            onChange={handleAdmin}
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
                            isDisabled={cliAdqOptions.length === 0}
                            id="cliAdmSelect"
                            options={cliAdqOptions}
                            value={selectedCliAdm}
                            onChange={(selected) => setSelectedCliAdm(selected)}
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
                            isDisabled={subproductOptions.length === 0}
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
                    <div className='group-element-bancos' style={{ display: 'inline-flex', flexDirection: 'column' }}>
                        <label className='span-picker'>Banco</label>
                        <input
                            style={{ height: '100%' }}
                            type="text"
                            id="bankInput"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                        />
                    </div>
                    <div className='group-element-bancos' style={{ display: 'inline-flex', flexDirection: 'column' }}>
                        <label className='span-picker'>Agência</label>
                        <input
                            style={{ height: '100%' }}
                            type="text"
                            id="agencyInput"
                            value={selectedAgency}
                            onChange={(e) => setSelectedAgency(e.target.value)}
                        />
                    </div>
                    <div className='group-element-bancos' style={{ display: 'inline-flex', flexDirection: 'column' }}>
                        <label className='span-picker'>Conta</label>
                        <input
                            style={{ height: '100%' }}
                            type="text"
                            id="accountInput"
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                        />
                    </div>
                </div>
                <div className='group-element-bancos'>
                    <hr className='hr-global' />
                    <button className='btn-global btn-bancos' disabled={isLoadingBanks}>Cadastrar Banco</button>
                </div>
            </form>
        </div>
    )
}

export default ModalNewBank