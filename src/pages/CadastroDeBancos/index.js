import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FiX, FiPlus } from 'react-icons/fi';
import Cookies from 'js-cookie';

const CadastroDeBancos = ({ cliOptions, banOptions, admOptions, modOptions, addBank, editBank }) => {
    const [banksList, setBanksList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [editableBank, setEditableBank] = useState(null);

    const isObjectFullyPopulated = (obj) => {
        return Object.values(obj).every(value => {
            if (typeof value === 'object' && value !== null) {
                return value.value !== 0;
            }
            return value !== '' && value !== null && value !== undefined;
        });
    };

    const BanksTable = () => {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Bandeira</th>
                        <th>Adquirente</th>
                        <th>Produto</th>
                        <th>Subproduto</th>
                        <th>Banco</th>
                        <th>Agência</th>
                        <th>Conta</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {banksList.length > 0 ? (
                        banksList.map((bank, index) => (
                            <tr key={index}>
                                <td>{bank.CodigoCliente}</td>
                                <td>{bank.Bandeira.label}</td>
                                <td>{bank.Adquirente}</td>
                                <td>{bank.Produto.label}</td>
                                <td>{bank.Subproduto.label}</td>
                                <td>{bank.Banco}</td>
                                <td>{bank.Agencia}</td>
                                <td>{bank.Conta}</td>
                                <td>
                                    <button onClick={() => openEditModal(bank)}>Editar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    const openEditModal = (bank) => {
        setEditableBank(bank);
        setIsModalEditOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsModalEditOpen(false);
    };

    const ModalNewBank = () => {
        const [selectedCli, setSelectedCli] = useState({ label: 'Selecione', value: 0 });
        const [selectedBan, setSelectedBan] = useState({ label: 'Selecione', value: 0 });
        const [selectedAdm, setSelectedAdm] = useState({ label: 'Selecione', value: 0 });
        const [selectedProd, setSelectedProd] = useState({ label: 'Selecione', value: 0 });
        const [selectedSubProd, setSelectedSubProd] = useState({ label: 'Selecione', value: 0 });
        const [bank, setBank] = useState('');
        const [agencia, setAgencia] = useState('');
        const [conta, setConta] = useState('');

        const resetValues = () => {
            setSelectedCli({ label: 'Selecione', value: 0 });
            setSelectedBan({ label: 'Selecione', value: 0 });
            setSelectedAdm({ label: 'Selecione', value: 0 });
            setSelectedProd({ label: 'Selecione', value: 0 });
            setSelectedSubProd({ label: 'Selecione', value: 0 });
            setBank('');
            setAgencia('');
            setConta('');
            setIsModalOpen(false);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const bankObject = {
                CodigoEstabecimento: 'someCode', // this should be dynamically set or fetched
                CodigoClienteAdquirente: selectedAdm.value,
                CodigoCliente: selectedCli.value,
                Adquirente: selectedAdm.value,
                Produto: selectedProd,
                Bandeira: selectedBan,
                Subproduto: selectedSubProd,
                Banco: bank,
                Agencia: agencia,
                Conta: conta,
            };

            if (isObjectFullyPopulated(bankObject)) {
                try {
                    await toast.promise(addBank(bankObject), {
                        pending: 'Carregando...',
                        error: 'Ocorreu um Erro',
                    });

                    setBanksList((prevBanksList) => [...prevBanksList, bankObject]);

                    resetValues();
                } catch (error) {
                    console.error('Error handling submit:', error);
                }
            } else {
                toast.error('Preencha todos os campos obrigatórios!');
            }
        };

        return (
            <div className={`modal-container ${isModalOpen ? 'modal-container-visible' : ''}`}>
                <div className="modal-content modal-content-banks">
                    <div className="modal-header">
                        <h4>Adicionar Banco</h4>
                        <button className="close-button" onClick={closeModal}>
                            <FiX />
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Cliente</label>
                                    <Select options={cliOptions} value={selectedCli} onChange={setSelectedCli} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Bandeira</label>
                                    <Select options={banOptions} value={selectedBan} onChange={setSelectedBan} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Adquirente</label>
                                    <Select options={admOptions} value={selectedAdm} onChange={setSelectedAdm} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Produto</label>
                                    <Select options={modOptions} value={selectedProd} onChange={setSelectedProd} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Subproduto</label>
                                    <Select options={modOptions} value={selectedSubProd} onChange={setSelectedSubProd} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Banco</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={bank}
                                        onChange={(e) => setBank(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Agência</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={agencia}
                                        onChange={(e) => setAgencia(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Conta</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={conta}
                                        onChange={(e) => setConta(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-primary btn-global">Salvar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    const ModalEditBank = () => {
        const [selectedCli, setSelectedCli] = useState({ label: 'Selecione', value: 0 });
        const [selectedBan, setSelectedBan] = useState({ label: 'Selecione', value: 0 });
        const [selectedAdm, setSelectedAdm] = useState({ label: 'Selecione', value: 0 });
        const [selectedProd, setSelectedProd] = useState({ label: 'Selecione', value: 0 });
        const [selectedSubProd, setSelectedSubProd] = useState({ label: 'Selecione', value: 0 });
        const [bank, setBank] = useState('');
        const [agencia, setAgencia] = useState('');
        const [conta, setConta] = useState('');

        useEffect(() => {
            if (editableBank) {
                setSelectedCli({ label: 'Selecione', value: editableBank.CodigoCliente });
                setSelectedBan(editableBank.Bandeira);
                setSelectedAdm(editableBank.Adquirente);
                setSelectedProd(editableBank.Produto);
                setSelectedSubProd(editableBank.Subproduto);
                setBank(editableBank.Banco);
                setAgencia(editableBank.Agencia);
                setConta(editableBank.Conta);
            }
        }, [editableBank]);

        const resetValues = () => {
            setSelectedCli({ label: 'Selecione', value: 0 });
            setSelectedBan({ label: 'Selecione', value: 0 });
            setSelectedAdm({ label: 'Selecione', value: 0 });
            setSelectedProd({ label: 'Selecione', value: 0 });
            setSelectedSubProd({ label: 'Selecione', value: 0 });
            setBank('');
            setAgencia('');
            setConta('');
            setIsModalEditOpen(false);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const updatedBankObject = {
                ...editableBank,
                CodigoClienteAdquirente: selectedAdm.value,
                CodigoCliente: selectedCli.value,
                Adquirente: selectedAdm.value,
                Produto: selectedProd,
                Bandeira: selectedBan,
                Subproduto: selectedSubProd,
                Banco: bank,
                Agencia: agencia,
                Conta: conta,
            };

            if (isObjectFullyPopulated(updatedBankObject)) {
                try {
                    await toast.promise(editBank(updatedBankObject), {
                        pending: 'Carregando...',
                        error: 'Ocorreu um Erro',
                    });

                    setBanksList((prevBanksList) =>
                        prevBanksList.map((b) => (b.CodigoEstabecimento === editableBank.CodigoEstabecimento ? updatedBankObject : b))
                    );

                    resetValues();
                } catch (error) {
                    console.error('Error handling submit:', error);
                }
            } else {
                toast.error('Preencha todos os campos obrigatórios!');
            }
        };

        return (
            <div className={`modal-container ${isModalEditOpen ? 'modal-container-visible' : ''}`}>
                <div className="modal-content modal-content-banks">
                    <div className="modal-header">
                        <h4>Editar Banco</h4>
                        <button className="close-button" onClick={closeModal}>
                            <FiX />
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Cliente</label>
                                    <Select options={cliOptions} value={selectedCli} onChange={setSelectedCli} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Bandeira</label>
                                    <Select options={banOptions} value={selectedBan} onChange={setSelectedBan} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Adquirente</label>
                                    <Select options={admOptions} value={selectedAdm} onChange={setSelectedAdm} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Produto</label>
                                    <Select options={modOptions} value={selectedProd} onChange={setSelectedProd} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Subproduto</label>
                                    <Select options={modOptions} value={selectedSubProd} onChange={setSelectedSubProd} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Banco</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={bank}
                                        onChange={(e) => setBank(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Agência</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={agencia}
                                        onChange={(e) => setAgencia(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Conta</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={conta}
                                        onChange={(e) => setConta(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-primary btn-global">Salvar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    return(
        <div className='appPage'>
          <div className='page-background-global'>
            <div className='page-content-global page-content-exportacao'>
              <div className='title-container-global'>
                <h1 className='title-global'>Cadastramento de Bancos</h1>
              </div>
              <hr className='hr-global'/>
              <div className='container-global' style={{alignItems: 'center'}}>
                  { (banksList && banksList.length > 0) && 
                  <>    
                      <h3 className='subtitle'>Cliente: {JSON.parse(Cookies.get('selectedClient')).label}</h3>
                      <hr className='hr-global'/>
                      <BanksTable />
                  </>
                  }
                  { (banksList && banksList.length === 0) && 
                  <>  
                      <span>Sem Bancos Cadastrados</span>
                      <br/> 
                      <button className='btn btn-primary btn-global' onClick={()=>{setIsModalOpen(true)}}><FiPlus className='icon' />Cadastrar Banco</button>
                  </>
                  }
                  {
                      Cookies.get('selectedClient') === ('todos' || undefined) ?
                          <span>{'Selecione um Cliente (não pode ser "TODOS")'}</span>
                          :
                          <></>
                  }
              </div>
              <hr className='hr-global'/>
            </div>
          </div>
          {isModalOpen && (
              <div className='modal-container'>
                  <ModalNewBank />
              </div>
          )}
          
          {isModalEditOpen && (
              <div className='modal-container'>
                  <ModalEditBank />
              </div>
          )}
        </div>
      )
};

export default CadastroDeBancos;
