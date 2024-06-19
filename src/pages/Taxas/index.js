import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import Cookies from 'js-cookie'
import '../../styles/global.scss'
import './taxas.scss'
import Select from 'react-select';
import { FiEdit, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { parse } from 'date-fns';
import { toast } from 'react-toastify'

const Taxas = () => {
    const location = useLocation();
    const {
        loadBanners,
        loadAdmins,
        loadMods,
        loadTaxes,
        addTax,
        editTax,
        deleteTax,
        changedOption,
        isLoadingTaxes
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

    const [clientCode, setClientCode] = useState(Cookies.get('clientCode'))
    const [taxesList, setTaxesList] = useState([])

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

            if (modsList.length === 0) {
                const response = await loadMods()
                setModsList(response)
            }

            if (Cookies.get('clientCode' !== ('todos'))) {
                const response = await loadTaxes()
                setTaxesList(response)
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
        if (modsList) {
            if (modsList.length > 0) {
                const modsListOptions = modsList.map(mod => ({ value: mod.codigoModalidade, label: mod.descricaoModalidade }));
                setModOptions(modsListOptions);
            }
        }
    }, [modsList]);

    useEffect(() => {
        setClientCode(Cookies.get('clientCode'))
        setTaxesList([])
    }, [changedOption])

    useEffect(() => {
        const loadTax = async () => {
            console.log('loadTax, clientCode: ', clientCode)
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

    const handleDelete = async (object) => {
        const toBeDeleted = {
            CODIGO: object.CODIGO,
            BADCODIGO: object.BADCODIGO,
            ADQCODIGO: object.ADQCODIGO,
            CLICODIGO: object.CLICODIGO,
            MODCODIGO: object.MODCODIGO,
            TAXAPERCENTUAL: object.TAXAPERCENTUAL
        }

        try {
            await toast.promise(deleteTax(toBeDeleted), {
                pending: 'Carregando...',
                success: 'Carregado com Sucesso',
                error: 'Ocorreu um Erro',
            })
            setTaxesList(prevTaxesList => prevTaxesList.filter(tax => tax.CODIGO !== object.CODIGO))
            resetValues();
        } catch (error) {
            console.error('Error handling busca:', error);
        }
    }

    const handleCancel = () => {
        resetValues()
        setIsModalEditOpen(false)
    }

    const TaxesTable = () => {
        console.log('taxArray: ', taxesList)
        return (
            <div className='table-wrapper'>
                <table className="table table-striped table-hover table-bordered table-taxas">
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: '2%', textAlign: 'center' }}>
                                <button className="btn btn-primary btn-global" style={{ width: '100%' }} onClick={() => { setIsModalOpen(true) }}>
                                    <FiPlus size={25} className="icon" />
                                </button>
                            </th>
                            <th scope="col" style={{ textAlign: 'center' }}>Bandeira</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Adquirente</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Modalidade</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Tipo Taxa</th>
                            <th scope="col" style={{ textAlign: 'center' }}>% Taxa</th>
                            <th scope="col" style={{ width: '2%', textAlign: 'center' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxesList.length > 0 &&
                            taxesList.map((object, index) => (
                                <tr key={index} className="det-tr-global tr-taxas">
                                    <th scope="row" style={{ textAlign: 'center' }} onClick={() => { handleEdit(object) }}>
                                        <FiEdit className="icon" />
                                    </th>
                                    {console.log(object)}
                                    <td className="det-td-vendas-global" data-label="BADDESCRICAO">{object.BADDESCRICAO}</td>
                                    <td className="det-td-vendas-global" data-label="nomeAdquirente">{object.ADQUIRENTE.nomeAdquirente}</td>
                                    <td className="det-td-vendas-global" data-label="MODDESCRICAO">{object.MODDESCRICAO}</td>
                                    <td className="det-td-vendas-global" data-label="TIPOTAXA">{object.TIPOTAXA}</td>
                                    <td className="det-td-vendas-global" data-label="TAXAPERCENTUAL">{object.TAXAPERCENTUAL} %</td>
                                    <th scope="row" style={{ textAlign: 'center' }} onClick={() => handleDelete(object)}>
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

    const [taxesTemp, setTaxesTemp] = useState([])

    useEffect(()=>{
        console.log('taxesTemp: ', taxesTemp)
        if(taxesTemp.length > 0){
            setTaxesList(prevTaxesList => [taxesTemp])
        }
    },[taxesTemp])

    const isObjectFullyPopulated = (obj) => {
        return obj && Object.values(obj).every(value => value !== null && value !== 0);
    }

    const ModalNewTax = () => {
        const [selectedCli, setSelectedCli] = useState({ label: 'Selecione', value: 0 })
        const [selectedBan, setSelectedBan] = useState({ label: 'Selecione', value: 0 })
        const [selectedAdm, setSelectedAdm] = useState({ label: 'Selecione', value: 0 })
        const [selectedMod, setSelectedMod] = useState({ label: 'Selecione', value: 0 })
        const [tax, setTax] = useState('');

        const resetValues = () => {
            setSelectedCli({ label: 'Selecione', value: 0 })
            setSelectedBan({ label: 'Selecione', value: 0 })
            setSelectedAdm({ label: 'Selecione', value: 0 })
            setSelectedMod({ label: 'Selecione', value: 0 })
            setTax('')
            setIsModalOpen(false)
        }

        const handleSubmit = async (e) => {
            e.preventDefault();
            const newTaxObj = {
                ADQCODIGO: selectedAdm.value,
                BADCODIGO: selectedBan.value,
                CLICODIGO: clientCode,
                MODCODIGO: selectedMod.value,
                TAXAPERCENTUAL: parseFloat(tax)
            };
            if (isObjectFullyPopulated(newTaxObj) === true) {
                try {
                    await toast.promise(addTax(newTaxObj), {
                        pending: 'Carregando...',
                        success: 'Carregado com Sucesso',
                        error: 'Ocorreu um Erro',
                    })
                    .then(async () => {
                      const response = await loadTaxes()
                      setTaxesList(response)
                    })
                    //setTaxesTemp(prevTaxesList => [...prevTaxesList, newTax]);
                    resetValues();
                } catch (error) {
                    console.error('Error handling busca:', error);
                }
            } else {
                alert('Todos os Campos devem ser preenchidos')
            }
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

        return (
            <div className={`modal-taxas modal ${isModalOpen ? 'modal-open' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
                <div className='header-container-taxa'>
                    <div className='title-container-global'>
                        <h3 className='subtitle' style={{margin: '0'}}>Cadastrar Taxa:</h3>
                    </div>
                    <button className='btn btn-danger close-modal' onClick={closeModal} style={{marginLeft: '5px'}}><FiX size={25}/></button>
                </div>
                <hr className='hr-global'/>
                <form className='select-container-taxa' onSubmit={handleSubmit}>
                    <div className='form-group-taxas'>
                      <div className='group-element-taxas'>
                        <span className='span-picker'>Cliente</span>
                        <Select
                            styles={customStyles}
                            value={selectedCli} 
                            onChange={handleCli}
                            placeholder="Selecione"
                            options={cliOptions}
                        />
                      </div>
                      <div className='group-element-taxas'>
                        <span className='span-picker'>Modalidade</span>
                        <Select
                            styles={customStyles}
                            value={selectedMod} 
                            onChange={handleMod}
                            placeholder="Selecione"
                            options={modOptions}
                        />
                      </div>
                    </div>
                    <div className='form-group-taxas'>
                      <div className='group-element-taxas'>
                        <span className='span-picker'>Bandeira</span>
                        <Select
                            styles={customStyles}
                            value={selectedBan} 
                            onChange={handleBan}
                            placeholder="Selecione"
                            options={banOptions}
                        />
                      </div>
                      <div className='group-element-taxas'>
                        <span className='span-picker'>Adquirente</span>
                        <Select 
                            styles={customStyles}
                            value={selectedAdm} 
                            onChange={handleAdq}
                            placeholder="Selecione"
                            options={admOptions}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className='form-group-taxas'>
                      <div className='group-input-taxa'>
                          <span className='span-picker'>Taxa</span>
                          <input
                              type="text"
                              value={tax}
                              onChange={(e) => {
                                  const inputValue = e.target.value;
                                  let formattedValue = inputValue.replace(/[^\d.]/g, ''); // Remove any non-digit characters except period
                                  if (formattedValue.length === 3 && !formattedValue.includes('.')) {
                                      // Insert a period after the first two digits
                                      formattedValue = formattedValue.slice(0, 2) + '.' + formattedValue.slice(2);
                                  }
                                  if (formattedValue.length > 5) {
                                      // Allow only one digit after the period
                                      formattedValue = formattedValue.slice(0, 4);
                                  }
                                  setTax(formattedValue);
                              }}
                              maxLength={5} // Maximum length including the decimal point
                          />
                      </div>
                    </div>
                    <div className='select-component'>
                        <hr className='hr-global'/>
                        <button className='btn-global' disabled={isLoadingTaxes}>Adicionar</button>
                    </div>
                </form>
            </div>
        )
    }

    const ModalEditTax = () => {
        const [selectedBan, setSelectedBan] = useState(editableTax?.BANDEIRA || { label: 'Selecione', value: 0 });
        const [selectedAdm, setSelectedAdm] = useState(editableTax?.ADQUIRENTE || { label: 'Selecione', value: 0 });
        const [selectedMod, setSelectedMod] = useState(editableTax?.MODALIDADE || { label: 'Selecione', value: 0 });
        const [tax, setTax] = useState(editableTax?.TAXAPERCENTUAL || '');

        const resetValues = () => {
            setSelectedBan({ label: 'Selecione', value: 0 });
            setSelectedAdm({ label: 'Selecione', value: 0 });
            setSelectedMod({ label: 'Selecione', value: 0 });
            setTax('');
            setIsModalEditOpen(false);
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
                    TAXAPERCENTUAL: parseFloat(tax.replace(',', '.'))
                };

                try {
                    console.log('updatedTax: ',updatedTax)
                    await editTax(updatedTax)
                    resetValues();
                } catch (error) {
                    console.error('Erro ao editar taxa:', error);
                }
            } else {
                toast.error('Preencha todos os campos obrigatórios');
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
                <div className='header-container-taxa'>
                    <div className='title-container-global'>
                        <h3 className='subtitle' style={{margin: '0'}}>Editar Taxa:</h3>
                    </div>
                    <button className='btn btn-danger close-modal' onClick={closeModal} style={{marginLeft: '5px'}}><FiX size={25}/></button>
                </div>
                <hr className='hr-global'/>
                <form className='select-container-taxas' onSubmit={handleEditTax}>
                    <div className='form-group-taxas'>
                        <div className='group-element-taxas'>
                            <label className='span-picker' htmlFor="admSelectEdit">Adquirente</label>
                            <Select
                                id="admSelectEdit"
                                options={admOptions}
                                value={selectedAdm}
                                onChange={()=>{handleAdq}}
                            />
                        </div>
                        <div className='group-element-taxas'>
                            <label className='span-picker' htmlFor="banSelectEdit">Bandeira</label>
                            <Select
                                id="banSelectEdit"
                                options={banOptions}
                                value={selectedBan}
                                onChange={()=>{handleBan}}
                            />
                        </div>
                    </div>
                    <div className='form-group-taxas'>
                        <div className='group-element-taxas'>
                            <label className='span-picker' htmlFor="modSelectEdit">Modalidade</label>
                            <Select
                                id="modSelectEdit"
                                options={modOptions}
                                value={selectedMod}
                                onChange={()=>{handleMod}}
                            />
                        </div>
                        <div className='group-input-taxa'>
                            <label className='span-picker' htmlFor="taxInput">Taxa (%)</label>
                            <input
                                style={{height: '100%'}}
                                type="text"
                                id="taxInput"
                                value={tax}
                                onChange={(e) => {
                                const inputValue = e.target.value;
                                let formattedValue = inputValue.replace(/[^\d.]/g, ''); // Remove any non-digit characters except period
                                if (formattedValue.length === 3 && !formattedValue.includes('.')) {
                                    // Insert a period after the first two digits
                                    formattedValue = formattedValue.slice(0, 2) + '.' + formattedValue.slice(2);
                                }
                                if (formattedValue.length > 5) {
                                    // Allow only one digit after the period
                                    formattedValue = formattedValue.slice(0, 4);
                                }
                                setTax(formattedValue);
                            }}
                            maxLength={5} // Maximum length including the decimal point
                            />
                        </div>
                    </div>
                    <div className='group-element-taxas'>
                        <hr className='hr-global'/>
                        <button className='btn-global' disabled={isLoadingTaxes}>Atualizar Taxa</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className='appPage'>
            <div className='page-background-global'>
                <div className='page-content-global'>
                    <div className='page-content-taxas'>
                        <div className='title-container-global'>
                            <h1 className='title-global'>Taxas</h1>
                        </div>
                        <hr className='hr-global'/>
                        <div className='container-global' style={{margin: '0', flexDirection: 'column'}}>
                            { ((taxesList && taxesList.length > 0) && (clientCode !== ('todos' || undefined))) && 
                            <>    
                                <h3 className='subtitle'>Cliente: {JSON.parse(Cookies.get('selectedClient')).label}</h3>
                                <hr className='hr-global'/>
                            </>
                            }
                            { ((taxesList && taxesList.length === 0) && (clientCode !== ('todos' || undefined))) && 
                            <>  
                                <span>Sem Taxas Cadastradas</span>
                                <br/> 
                                <button className='btn btn-primary btn-global' onClick={()=>{setIsModalOpen(true)}}><FiPlus className='icon' />Adicionar Taxa</button>
                            </>
                            }
                            {
                                clientCode === ('todos' || undefined) ?
                                    <span>Selecione um cliente para exibir as taxas cadastradas</span>
                                    : 
                                    <></>
                            }
                        </div>
                    </div>
                    { taxesList.length > 0 && isObjectFullyPopulated(taxesList[taxesList.length - 1]) ? <TaxesTable /> : <></>}
                    <div className='modal-container' style={{ display: (isModalOpen || isModalEditOpen) ? 'block' : 'none' }}>
                        <ModalNewTax />
                        <ModalEditTax />
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Taxas;
