import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import '../../styles/global.scss'
//import './Bancos.scss'
import '../Taxas/taxas.scss'
import Select from 'react-select'
import { FiEdit, FiPlus, FiTrash, FiX } from 'react-icons/fi'
import { parse } from 'date-fns'
import { toast } from 'react-toastify'

const CadastroDeBancos = () =>{
    const location = useLocation()
    const { 
        loadBanners, 
        loadAdmins,
        loadMods,
        loadBanks, 
        addBank, 
        changedOption, 
        isLoadingBanks
    } = useContext(AuthContext)

    const [bannersList, setBannersList] = useState([])
    const [adminsList, setAdminsList] = useState([])
    const [modsList, setModsList] = useState([])

    const cliOptions = JSON.parse(Cookies.get('clientOptions'))
    
    const [banOptions, setBanOptions] = useState([])
    const [admOptions, setAdmOptions] = useState([])
    const [modOptions, setModOptions] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)

    // Codigo do Cliente, Proveniente do SeletorCliente
    const [clientCode, setClientCode] = useState(Cookies.get('clientCode'))
    // Array de Objetos a Serem Mostrados na Tabela
    const [banksList, setbanksList] = useState([])

    useEffect(()=>{
        sessionStorage.setItem('currentPath', location.pathname)
    },[])

    useEffect(()=>{
        async function inicialize(){
          if(bannersList.length === 0){
            const response = await loadBanners()
            setBannersList(response)
          }
          
          if(adminsList.length === 0){
            const response = await loadAdmins()
            setAdminsList(response)
          }

          if(modsList.length === 0){
            const response = await loadMods()
            setModsList(response)
          }

          if(Cookies.get('clientCode' !== ('todos'))){
            const response = await loadBanks()
            //setbanksList(response)
          }
        }
        inicialize()
        let temp1 = {client: 1, bank: 'Rélens'}
        let temp2 = {client: 2, bank: 'Crélens'}
        let temp3 = {client: 3, bank: 'Ispiper'}
        let temp4 = {client: 4, bank: 'Piper'}
        
        setbanksList([temp1, temp2, temp3, temp4])
      },[])

    useEffect(() => {
        if(bannersList){
            if (bannersList.length > 0) {
                const bannersListOptions = bannersList.map(banner => ({ value: banner.codigoBandeira, label: banner.descricaoBandeira }));
                setBanOptions(bannersListOptions);
            }
        }
    }, [bannersList]);

    useEffect(() => {
        if(adminsList){
            console.log('adminsList', adminsList)
            if (adminsList.length > 0) {
                const adminsListOptions = adminsList.map(admin => ({ value: admin.codigoAdquirente, label: admin.nomeAdquirente }));
                setAdmOptions(adminsListOptions);
            }
        }
    }, [adminsList]);

    useEffect(() => {
        if(modsList){
            if (modsList.length > 0) {
                const modsListOptions = modsList.map(mod => ({ value: mod.codigoModalidade, label: mod.descricaoModalidade }));
                setModOptions(modsListOptions);
            }
        }
    }, [modsList]);

    useEffect(()=>{
        setClientCode(Cookies.get('clientCode'))
        //setbanksList([])
    },[changedOption])

    useEffect(()=>{
        //loadBanks()

    },[clientCode])

    const [editableBank, setEditableBank] = useState()

    const handleEdit = (object) => {
        //setEditableBank(object)
        setIsModalEditOpen(true)
    }

    const resetValues = () =>{
        /*setEditableBank({})
        seteditableBank({})*/
    }

    const handleCancel = () => {
        resetValues()
        setIsModalEditOpen(false)
    }

    useEffect(()=>{
        console.log('banksList', banksList)
    },[banksList])

    const BanksTable = () =>{
        return(
            <table className="table table-striped table-hover table-bordered table-taxas">
            <thead>
                <tr>
                    <th scope="col" style={{width: '2%'}}><button className='btn btn-primary btn-global' style={{width: '100%'}} onClick={()=>{setIsModalOpen(true)}}><FiPlus className='icon' /></button></th>
                    <th scope="col" style={{'text-align': 'center'}}>Cliente</th>
                    <th scope="col" style={{'text-align': 'center'}}>Banco</th>
                    <th scope="col" style={{width: '2%'}}></th>
                </tr>
            </thead>
            <tbody>
            {banksList.length > 0 && banksList.map((object, index)=>{
                    return(
                        <tr key={index} className='det-tr-global tr-taxas'>
                        <th scope='row' onClick={()=>{handleEdit(object)}}><FiEdit className='icon' /></th>
                            <td className='det-td-vendas-global'data-label="BADDESCRICAO">{object.client}</td>
                            <td className='det-td-vendas-global'data-label="nomeAdquirente">{object.bank}</td>
                            <th scope='row' onClick={()=>{handleEdit(object)}}><FiTrash className='icon' /></th>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        )
    }


    //Monitorando o objeto da nova taxa a ser adicionada, e Salvando-o nos Cookies

    //Lógica do Modal de Adição de nova taxa, permitindo também fechá-lo
    //ao clicar fora da janela do Modal
    /////////////////////////////////////////////////////////////////////
    
    const closeModal = () => {
        setIsModalOpen(false)
        setIsModalEditOpen(false)
    };

    const BtnClose = () => {
        return(
            <button className="btn btn-danger" onClick={closeModal}>
                <FiX />
            </button>
        )
    }

    const ModalNewBank = () => {

        const [selectedCli, setSelectedCli] = useState({label: 'Selecione', value: 0})
        const [selectedBan, setSelectedBan] = useState({label: 'Selecione', value: 0})
        const [selectedAdm, setSelectedAdm] = useState({label: 'Selecione', value: 0})
        const [selectedMod, setSelectedMod] = useState({label: 'Selecione', value: 0})
        const [bank, setBank] = useState('');

        const resetValues = () => {
            setSelectedCli({label: 'Selecione', value: 0})
            setSelectedBan({label: 'Selecione', value: 0})
            setSelectedAdm({label: 'Selecione', value: 0})
            setSelectedMod({label: 'Selecione', value: 0})
            setBank('')
            setIsModalOpen(false)
        }
        
        const isObjectFullyPopulated = (obj) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] === undefined || obj[key] === 0 || obj[key] === null || obj[key] === ('selecione' || 'Selecione') || tax === '') {
                        return false;
                    }
                }
            }
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            /*const newTaxObj = {
                ADQCODIGO: selectedAdm.value,
                BADCODIGO: selectedBan.value,
                CLICODIGO: clientCode,
                MODCODIGO: selectedMod.value,
                TAXAPERCENTUAL: parseFloat(tax)
            };
            if(isObjectFullyPopulated(newTaxObj) === true){
                try {
                    await toast.promise(addBank(newTaxObj), {
                      pending: 'Carregando...',
                      success: 'Carregado com Sucesso',
                      error: 'Ocorreu um Erro',
                    })
                    resetValues()
                  } catch (error) {
                    console.error('Error handling busca:', error);
                  }
            } else {
                alert('Todos os Campos devem ser preenchidos')
            }*/
        };

        const handleCli = (selected) => {
            setSelectedCli(selected)
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

        const customStyles = {
            control: (provided, state) => ({
                ...provided,
                background: 'white', // Background color of the control
                color: 'black', // Text color of the control
                // You can add more styles here as needed
            }),
            menu: (provided, state) => ({
                ...provided,
                background: 'white', // Background color of the dropdown menu
                color: 'black', // Text color of the dropdown menu
                // You can add more styles here as needed
            }),
            // Add more styles for other components as needed
        };

        return(
            <div className='modal-taxas'>
                <div className='modal-taxas-content'>
                <div className='container-title-close'>
                    <h3 className='subtitle'>Adicionar Banco:</h3>
                    <BtnClose/>
                </div>
                <hr className='hr-global'/>
                    <form className='form-taxas' onSubmit={handleSubmit}>
                        <div className='select-container'>
                        <div className='select-component'>
                                <span className='span-picker'>Cliente</span>
                                <Select
                                    styles={customStyles}
                                    value={selectedCli} 
                                    onChange={handleCli}
                                    placeholder="Selecione"
                                    options={cliOptions}
                                />
                            </div>
                            <br/>
                            <div className='select-component'>
                                <span className='span-picker'>Bandeira</span>
                                <Select
                                    styles={customStyles}
                                    value={selectedBan} 
                                    onChange={handleBan}
                                    placeholder="Selecione"
                                    options={banOptions}
                                />
                            </div>
                            <br/>
                            <div className='select-component'>
                                <span className='span-picker'>Adquirente</span>
                                <Select 
                                    styles={customStyles}
                                    value={selectedAdm} 
                                    onChange={handleAdq}
                                    placeholder="Selecione"
                                    options={admOptions}
                                />
                            </div>
                            <br/>
                            <div className='select-component'>
                                <span className='span-picker'>Modalidade</span>
                                <Select
                                    styles={customStyles}
                                    value={selectedMod} 
                                    onChange={handleMod}
                                    placeholder="Selecione"
                                    options={modOptions}
                                />
                            </div>
                            <br/>
                            <div className='select-component'>
                                <span className='span-picker'>Banco</span>
                                <input
                                    type="text"
                                    value={bank}
                                    onChange={(e) => {
                                        setBank(e.target.value);
                                    }}
                                />
                            </div>
                            <div className='select-component'>
                                <hr className='hr-global'/>
                                <button className='btn-global' disabled={isLoadingBanks}>Adicionar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    const ModalEditBank = () => {
        const [banner, setBanner] = useState({label: editableBank.ban, value: null})
        const [admin, setAdmin] = useState({label: editableBank.adm, value: null})
        const [bankName, setBankName] = useState(editableBank.bankName)

        const isObjectFullyPopulated = (obj) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] === undefined || obj[key] === 0 || obj[key] === null || obj[key] === ('selecione' || 'Selecione') || bank === '') {
                        return false;
                    }
                }
            }
            return true;
        };

        const customStyles = {
            control: (provided, state) => ({
                ...provided,
                background: 'white', // Background color of the control
                color: 'black', // Text color of the control
                // You can add more styles here as needed
            }),
            menu: (provided, state) => ({
                ...provided,
                background: 'white', // Background color of the dropdown menu
                color: 'black', // Text color of the dropdown menu
                // You can add more styles here as needed
            }),
            // Add more styles for other components as needed
        };

        return(
            <div className='modal-taxas'>
                <div className='modal-taxas-content'>
                <div className='container-title-close'>
                    <h3 className='subtitle'>Editar Banco:</h3>
                    <BtnClose/>
                </div>
                    <hr className='hr-global'/>
                    <form className='form-taxas' onSubmit={()=>{console.log('onSubmit')}}>
                        
                    </form>
                </div>
            </div>
        )
    }

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        
        return (
            <div className="modal-layout" onClick={onClose}>
                <div className='modal-layout-content' onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        );
    };

    const AddBankModal = () => { 
        return (
            <div>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className='modal-layout-body'>
                        <ModalNewBank />
                    </div>
                </Modal>
            </div>
        );
    };

    const EditBankModal = () => {
        return (
            <div>
                <Modal isOpen={isModalEditOpen} onClose={closeModal}>
                    <div className='modal-layout-body'>
                        <ModalEditBank />
                    </div>
                </Modal>
            </div>
        );
    }
    /////////////////////////////////////////////////////////////////////


    return(
      <div className='appPage'>
        <div className='page-background-global'>
          <div className='page-content-global page-content-exportacao'>
            <div className='title-container-global'>
              <h1 className='title-global'>Cadastramento de Bancos</h1>
            </div>
            <hr className='hr-global'/>
            <div className='container-global' style={{alignItems: 'center'}}>
                { ((banksList && banksList.length > 0) && (clientCode !== ('todos' || undefined))) && 
                <>    
                    <h3 className='subtitle'>Cliente: CrélensCred{/*JSON.parse(Cookies.get('clientName'))*/}</h3>
                    <hr className='hr-global'/>
                    <BanksTable />
                </>
                }
                { ((banksList && banksList.length === 0) && (clientCode !== ('todos' || undefined))) && 
                <>  
                    <span>Sem Taxas Cadastradas</span>
                    <br/> 
                    <button className='btn btn-primary btn-global' onClick={()=>{setIsModalOpen(true)}}><FiPlus className='icon' />Adicionar Taxa</button>
                </>
                }
                {
                    clientCode === ('todos' || undefined) ?
                        <span>PlaceHolder</span>
                        :
                        <></>
                }
            </div>
            <hr className='hr-global'/>
          </div>
        </div>
        {isModalOpen && (
            <div className='modal-container'>
                <AddBankModal />
            </div>
        )}
        
        {isModalEditOpen && (
            <div className='modal-container'>
                <EditBankModal />
            </div>
        )}
      </div>
    )
}

export default CadastroDeBancos;