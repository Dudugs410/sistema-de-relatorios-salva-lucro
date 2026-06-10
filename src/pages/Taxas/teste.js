import { useEffect, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';
import Cookies from 'js-cookie'
import '../../styles/global.scss'
import './taxas.scss'
import Select from 'react-select';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import { parse } from 'date-fns';
import { toast } from 'react-toastify'

const Taxas = () =>{
    const location = useLocation();
    const { 
        loadBanners, 
        loadAdmins,
        loadMods, 
        loadTaxes, 
        addTax, editTax, deleteTax,
        changedOption, 
        isLoadingTaxes
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

    useEffect(()=>{
        localStorage.setItem('currentPath', location.pathname)
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

          if(localStorage.getItem('clientCode' !== ('todos'))){
            const response = await loadTaxes()
            setTaxesList(response)
          }
        }
        inicialize()
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
        setClientCode(localStorage.getItem('clientCode'))
        setTaxesList([])
    },[changedOption])

    useEffect(()=>{
        const loadTax = async () => {
            console.log(taxesList)
            
            if((clientCode === 'todos') || (clientCode === 'TODOS')){
                console.log('clientCode TODOS: ', clientCode)
                setTaxesList([])
            } else {
                console.log('clientCode: ', clientCode)
                const response = await loadTaxes()
                setTaxesList(response)
            }
        }
        loadTax()
    },[clientCode])

    const [editableTax, setEditableTax] = useState()

    const handleEdit = (object) => {
        console.log('handleEdit object: ', object)
        setEditableTax({
          CODIGO: object.CODIGO,
          BANDEIRA: {label: object.BADDESCRICAO, value: object.BADCODIGO},
          ADQUIRENTE: {label: object.ADQUIRENTE.nomeAdquirente, value: object.ADQCODIGO},
          CLICODIGO: object.CLICODIGO,
          MODALIDADE: {label: object.MODDESCRICAO, value: object.MODCODIGO},
          TAXAPERCENTUAL: parseFloat(object.TAXAPERCENTUAL),
        })
        setIsModalEditOpen(true)
    }

    const resetValues = () =>{
        setEditableTax({})
    }

    const handleDelete = async (object) => {
      console.log('deletando objeto: ', object)
      const toBeDeleted = { 
        CODIGO: object.CODIGO,
        BADCODIGO: object.BADCODIGO,
        ADQCODIGO: object.ADQCODIGO,
        CLICODIGO: object.CLICODIGO,
        MODCODIGO: object.MODCODIGO,
        TAXAPERCENTUAL: object.TAXAPERCENTUAL 
      }
      console.log('objeto a ser deletado: ', toBeDeleted)

      try {
        toast.dismiss()
        await toast.promise(deleteTax(toBeDeleted), {
            pending: 'Carregando...',
            success: 'Carregado com Sucesso',
            error: 'Ocorreu um Erro',
        })
        .then(async () => {
          const response = await loadTaxes()
          setTaxesList(response)
      })
        resetValues();
    } catch (error) {
        console.error('Error handling busca:', error);
    }
    }

    const handleCancel = () => {
        resetValues()
        setIsModalEditOpen(false)
    }

    const TaxesTable = () =>{
        return(
          <div className='table-wrapper'>
          <table className="table table-striped table-hover table-bordered table-taxas">
            <thead>
              <tr>
                <th scope="col" style={{ width: '2%', textAlign: 'center' }}>
                  <button className="btn btn-primary btn-global" style={{ width: '100%' }} onClick={()=>{setIsModalOpen(true)}}>
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
                    <th scope="row" style={{ textAlign: 'center' }} onClick={()=>{handleEdit(object)}}>
                      <FiEdit className="icon" />
                    </th>
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


    //Monitorando o objeto da nova taxa a ser adicionada, e Salvando-o nos Cookies

    //Lógica do Modal de Adição de nova taxa, permitindo também fechá-lo
    //ao clicar fora da janela do Modal
    /////////////////////////////////////////////////////////////////////
    
    const closeModal = () => {
        setIsModalOpen(false)
        setIsModalEditOpen(false)
    };

    const ModalNewTax = () => {

        const [selectedCli, setSelectedCli] = useState({label: 'Selecione', value: 0})
        const [selectedBan, setSelectedBan] = useState({label: 'Selecione', value: 0})
        const [selectedAdm, setSelectedAdm] = useState({label: 'Selecione', value: 0})
        const [selectedMod, setSelectedMod] = useState({label: 'Selecione', value: 0})
        const [tax, setTax] = useState('');

        const resetValues = () => {
            setSelectedCli({label: 'Selecione', value: 0})
            setSelectedBan({label: 'Selecione', value: 0})
            setSelectedAdm({label: 'Selecione', value: 0})
            setSelectedMod({label: 'Selecione', value: 0})
            setTax('')
            setIsModalOpen(false)
        }
        
        const isObjectFullyPopulated = (obj) => {
            console.log('verificando objeto: ', obj)
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
          const newTaxObj = {
              ADQCODIGO: selectedAdm.value,
              BADCODIGO: selectedBan.value,
              CLICODIGO: clientCode,
              MODCODIGO: selectedMod.value,
              TAXAPERCENTUAL: parseFloat(tax)
          };
          if (isObjectFullyPopulated(newTaxObj) === true) {
              try {
                toast.dismiss()
                  await toast.promise(addTax(newTaxObj), {
                      pending: 'Carregando...',
                      success: 'Carregado com Sucesso',
                      error: 'Ocorreu um Erro',
                  })
                  .then(async () => {
                    const response = await loadTaxes()
                    setTaxesList(response)
                })
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
                background: 'white',
                color: 'black',
            }),
            menu: (provided, state) => ({
                ...provided,
                background: 'white',
                color: 'black',
            }),
        }

        return(
            <div className='modal-taxas'>
                <div className='title-container-global'>
                  <h3 className='subtitle' style={{margin: '0'}}>Cadastrar Taxa:</h3>
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
                                  let formattedValue = inputValue.replace(/[^\d.]/g, '')
                                  if (formattedValue.length === 3 && !formattedValue.includes('.')) {
                                      formattedValue = formattedValue.slice(0, 2) + '.' + formattedValue.slice(2);
                                  }
                                  if (formattedValue.length > 5) {
                                      formattedValue = formattedValue.slice(0, 4)
                                  }
                                  setTax(formattedValue)
                              }}
                              maxLength={5}
                          />
                      </div>
                    </div>
                    <hr className='hr-global'/>
                    <div className='btn-container-modal-taxas'>
                        <div className='select-component'>
                            <button className='btn-global' disabled={isLoadingTaxes}>Adicionar</button>
                            <button className='btn btn-danger' onClick={closeModal}>Voltar</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    const ModalEditTax = () => {

        console.log('ModalEditTax obj:', editableTax)
        
        const [banner, setBanner] = useState(editableTax.BANDEIRA)
        const [admin, setAdmin] = useState(editableTax.ADQUIRENTE)
        const [modality, setModality] = useState(editableTax.MODALIDADE)
        const [cliCode, setCliCode] = useState(editableTax.CLICODIGO)
        const [taxValue, setTaxValue] = useState(editableTax.TAXAPERCENTUAL)
        const [taxCode, setTaxCode] = useState(editableTax.CODIGO)

        const isObjectFullyPopulated = (obj) => {
            console.log('verificando objeto: ', obj)
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] === undefined || obj[key] === 0 || obj[key] === null || obj[key] === ('selecione' || 'Selecione')) {
                        return false;
                    }
                }
            }
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault()
            const newTaxObj = {
                ADQCODIGO: admin.value,
                BADCODIGO: banner.value,
                CODIGO: taxCode,
                CLICODIGO: cliCode,
                MODCODIGO: modality.value,
                TAXAPERCENTUAL: parseFloat(taxValue)
            };
            if(isObjectFullyPopulated(newTaxObj) === true){
                try {
                    console.log('objeto atualizado: ', newTaxObj)
                    toast.dismiss()
                    await toast.promise(editTax(newTaxObj), {
                      pending: 'Carregando...',
                      success: 'Carregado com Sucesso',
                      error: 'Ocorreu um Erro',
                    })
                    console.log('resetando form...')
                    resetValues()
                  } catch (error) {
                    console.error('Error handling busca:', error)
                  }
            } else {
                alert('Todos os Campos devem ser preenchidos')
            }
        };
    
        const handleBan = (selected) => {
            setBanner(selected)
        }
    
        const handleAdq = (selected) => {
            setAdmin(selected)
        }
    
        const handleMod = (selected) => {
            setModality(selected)
        }

        const customStyles = {
            control: (provided, state) => ({
                ...provided,
                background: 'white',
                color: 'black',
            }),
            menu: (provided, state) => ({
                ...provided,
                background: 'white',
                color: 'black',
            }),
        }

        return(
            <div className='modal-taxas'>
                <div className='title-container-global'>
                  <h3 className='subtitle' style={{margin: '0'}}>Editar Taxa:</h3>
                </div>
                <hr className='hr-global'/>
                <form className='select-container-taxa' onSubmit={handleSubmit}>
                    <div className='form-group-taxas'>
                      <div className='group-element-taxas'>
                      <span className='span-picker'>Bandeira</span>
                            <Select
                                styles={customStyles}
                                value={banner} 
                                onChange={handleBan}
                                placeholder="Selecione"
                                options={banOptions}
                            />
                      </div>
                      <div className='group-element-taxas'>
                      <span className='span-picker'>Adquirente</span>
                            <Select 
                                styles={customStyles}
                                value={admin} 
                                onChange={handleAdq}
                                placeholder="Selecione"
                                options={admOptions}
                            />
                      </div>
                    </div>
                    <div className='form-group-taxas'>
                      <div className='group-element-taxas'>
                      <span className='span-picker'>Modalidade</span>
                            <Select
                                styles={customStyles}
                                value={modality} 
                                onChange={handleMod}
                                placeholder="Selecione"
                                options={modOptions}
                            />
                      </div>
                      <div className='group-element-taxas'>
                        <div className='group-input-taxa'>
                          <span className='span-picker'>Taxa</span>
                          <input
                              type="text"
                              value={taxValue}
                              onChange={(e) => {
                                  const inputValue = e.target.value
                                  let formattedValue = inputValue.replace(/[^\d.]/g, '')
                                  if (formattedValue.length === 3 && !formattedValue.includes('.')) {
                                      formattedValue = formattedValue.slice(0, 2) + '.' + formattedValue.slice(2)
                                  }
                                  if (formattedValue.length > 5) {
                                      formattedValue = formattedValue.slice(0, 4)
                                  }
                                  setTaxValue(formattedValue)
                              }}
                              maxLength={5}
                          />                      
                        </div>
                      </div>

                    </div>
                    <br/>
                    <div className='select-component'>
                        <hr className='hr-global'/>
                        <button className='btn-global' disabled={isLoadingTaxes}>Adicionar</button>
                    </div>
                </form>
            </div>
        )
    }

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null
        
        return (
            <div className="modal-layout" onClick={onClose}>
                <div className='modal-layout-content' onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        )
    }

    const AddTaxModal = () => { 
        return (
            <div>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className='modal-layout-body'>
                        <ModalNewTax />
                    </div>
                </Modal>
            </div>
        );
    };

    const EditTaxModal = () => {
        return (
            <div>
                <Modal isOpen={isModalEditOpen} onClose={closeModal}>
                    <div className='modal-layout-body'>
                        <ModalEditTax/>
                    </div>
                </Modal>
            </div>
        );
    }
    /////////////////////////////////////////////////////////////////////
    return(
      <div className='appPage'>
        <div className='page-background-global'>
          <div className='page-content-global'>
            <div className='page-content-taxas'>
              <div className='title-container-global'>
                <h1 className='title-global'>Taxas</h1>
              </div>
              <hr className='hr-global'/>
              <div className='container-global'>
                  { ((taxesList && taxesList.length > 0) && (clientCode !== ('todos' || undefined))) && 
                  <>    
                      <h3 className='subtitle'>Cliente: {JSON.parse(localStorage.getItem('selectedClient')).label}</h3>
                      <hr className='hr-global'/>
                      <TaxesTable />
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
            <hr className='hr-global'/>
            </div>
          </div>
        </div>
        {isModalOpen && (
            <div className='modal-container'>
                <AddTaxModal />
            </div>
        )}
        
        {isModalEditOpen && (
            <div className='modal-container'>
                <EditTaxModal />
            </div>
        )}
        
      </div>
    )
}

export default Taxas