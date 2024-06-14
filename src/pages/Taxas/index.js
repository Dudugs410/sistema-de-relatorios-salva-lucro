import { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import Cookies from 'js-cookie';
import '../../styles/global.scss';
import './taxas.scss';
import Select from 'react-select';
import { FiEdit, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

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
    isLoadingTaxes,
  } = useContext(AuthContext);

  const [bannersList, setBannersList] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [modsList, setModsList] = useState([]);
  const cliOptions = JSON.parse(Cookies.get('clientOptions'));
  const [banOptions, setBanOptions] = useState([]);
  const [admOptions, setAdmOptions] = useState([]);
  const [modOptions, setModOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [clientCode, setClientCode] = useState(Cookies.get('clientCode'));
  const [taxesList, setTaxesList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(JSON.parse(Cookies.get('selectedClient')));
  const [editableTax, setEditableTax] = useState(null);
  const [deletableTax, setDeletableTax] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('currentPath', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const initialize = async () => {
      if (bannersList.length === 0) {
        const response = await loadBanners();
        setBannersList(response);
      }

      if (adminsList.length === 0) {
        const response = await loadAdmins();
        setAdminsList(response);
      }

      if (modsList.length === 0) {
        const response = await loadMods();
        setModsList(response);
      }

      if (clientCode !== 'todos') {
        const response = await loadTaxes();
        setTaxesList(response);
      }
    };
    initialize();
  }, [bannersList, adminsList, modsList, clientCode, loadBanners, loadAdmins, loadMods, loadTaxes]);

  useEffect(() => {
    if (bannersList.length > 0) {
      const bannersListOptions = bannersList.map((banner) => ({
        value: banner.codigoBandeira,
        label: banner.descricaoBandeira,
      }));
      setBanOptions(bannersListOptions);
    }
  }, [bannersList]);

  useEffect(() => {
    if (adminsList.length > 0) {
      const adminsListOptions = adminsList.map((admin) => ({
        value: admin.codigoAdquirente,
        label: admin.nomeAdquirente,
      }));
      setAdmOptions(adminsListOptions);
    }
  }, [adminsList]);

  useEffect(() => {
    if (modsList.length > 0) {
      const modsListOptions = modsList.map((mod) => ({
        value: mod.codigoModalidade,
        label: mod.descricaoModalidade,
      }));
      setModOptions(modsListOptions);
    }
  }, [modsList]);

  useEffect(() => {
    setClientCode(Cookies.get('clientCode'));
    setSelectedClient(JSON.parse(Cookies.get('selectedClient')));
  }, [changedOption]);

  useEffect(() => {
    const loadTax = async () => {
      if (clientCode === 'todos') {
        setTaxesList([]);
      } else {
        const response = await loadTaxes();
        setTaxesList(response);
      }
    };
    loadTax();
  }, [clientCode, loadTaxes]);

  const handleEdit = (object) => {
    setEditableTax({
      CODIGO: object.CODIGO,
      BADCODIGO: object.BADCODIGO,
      ADQCODIGO: object.ADQUIRENTE.codigoAdquirente,
      CLICODIGO: selectedClient.codigoCliente,
      MODCODIGO: object.MODCODIGO,
      TAXAPERCENTUAL: parseFloat(object.TAXAPERCENTUAL),
    });
    setIsModalEditOpen(true);
  };

  const handleDelete = async (object) => {
    setDeletableTax({
        CODIGO: object.CODIGO,
        BADCODIGO: object.BADCODIGO,
        ADQCODIGO: object.ADQUIRENTE.codigoAdquirente,
        CLICODIGO: selectedClient.codigoCliente,
        MODCODIGO: object.MODCODIGO,
        TAXAPERCENTUAL: parseFloat(object.TAXAPERCENTUAL),
      });
    try {
      await deleteTax(deletableTax);
      setTaxesList(taxesList.filter((t) => t.CODIGO !== tax.CODIGO));
      toast.success('Taxa deletada com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar a taxa');
    }
  };

  const resetValues = () => {
    setEditableTax(null);
    setIsModalOpen(false);
    setIsModalEditOpen(false);
  };

  const handleCancel = () => {
    resetValues();
  };

  const handleModalSubmit = async (newTaxObj, isEdit) => {
    try {
      if (isEdit) {
        await editTax(newTaxObj);
      } else {
        await addTax(newTaxObj);
      }
      setIsModalOpen(false);
      setIsModalEditOpen(false);
      const response = await loadTaxes();
      setTaxesList(response);
      toast.success('Taxa salva com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar a taxa');
    }
  };

  const TaxesTable = () => (
    <table className="table table-striped table-hover table-bordered table-taxas">
      <thead>
        <tr>
          <th scope="col" style={{ width: '2%' }}><button className="btn btn-primary btn-global" style={{ width: '10%' }} onClick={() => {setIsModalOpen(true);}}><FiPlus className="icon" /></button></th>
          <th scope="col" style={{ textAlign: 'center' }}>Bandeira</th>
          <th scope="col" style={{ textAlign: 'center' }}>Adquirente</th>
          <th scope="col" style={{ textAlign: 'center' }}>Modalidade</th>
          <th scope="col" style={{ textAlign: 'center' }}>Tipo Taxa</th>
          <th scope="col" style={{ textAlign: 'center' }}>% Taxa</th>
          <th scope="col" style={{ width: '2%' }}></th>
        </tr>
      </thead>
      <tbody>
        {taxesList.length > 0 &&
          taxesList.map((object, index) => (
            <tr key={index} className="det-tr-global tr-taxas">
              <th scope="row" onClick={() => handleEdit(object)}>
                <FiEdit className="icon" />
              </th>
              <td className="det-td-vendas-global" data-label="BADDESCRICAO">{object.BADDESCRICAO}</td>
              <td className="det-td-vendas-global" data-label="nomeAdquirente">{object.ADQUIRENTE.nomeAdquirente}</td>
              <td className="det-td-vendas-global" data-label="MODDESCRICAO">{object.MODDESCRICAO}</td>
              <td className="det-td-vendas-global" data-label="TIPOTAXA">{object.TIPOTAXA}</td>
              <td className="det-td-vendas-global" data-label="TAXAPERCENTUAL">{object.TAXAPERCENTUAL} %</td>
              <th scope="row" onClick={() => handleDelete(object)}>
                <FiTrash className="icon" />
              </th>
            </tr>
          ))}
      </tbody>
    </table>
  );

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="modal-layout" onClick={onClose}>
        <div className="modal-layout-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  };

  const TaxModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [selectedBan, setSelectedBan] = useState(initialData?.BADCODIGO || { label: 'Selecione', value: 0 });
    const [selectedAdm, setSelectedAdm] = useState(initialData?.ADQCODIGO || { label: 'Selecione', value: 0 });
    const [selectedMod, setSelectedMod] = useState(initialData?.MODCODIGO || { label: 'Selecione', value: 0 });
    const [selectedType, setSelectedType] = useState(initialData?.TIPOTAXA || { label: 'Selecione', value: 0 });
    const [tax, setTax] = useState(initialData?.TAXAPERCENTUAL || '');

    useEffect(() => {
      if (initialData) {
        setSelectedBan({ label: initialData.BADDESCRICAO, value: initialData.BADCODIGO });
        setSelectedAdm({ label: initialData.ADQUIRENTE.nomeAdquirente, value: initialData.ADQUIRENTE.codigoAdquirente });
        setSelectedMod({ label: initialData.MODDESCRICAO, value: initialData.MODCODIGO });
        setSelectedType({ label: initialData.TIPOTAXA, value: initialData.TIPOTAXA });
        setTax(initialData.TAXAPERCENTUAL);
      }
    }, [initialData]);

    const handleSubmit = () => {
      const newTaxObj = {
        CODIGO: initialData?.CODIGO,
        CLICODIGO: Cookies.get('clientCode'),
        BADCODIGO: selectedBan.value,
        ADQCODIGO: selectedAdm.value,
        MODCODIGO: selectedMod.value,
        TIPOTAXA: selectedType.value,
        TAXAPERCENTUAL: parseFloat(tax),
      };
      onSubmit(newTaxObj, !!initialData);
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <form className="form-modal-taxes">
          <div className="modal-header">
            <FiX size={25} className="close-icon" onClick={onClose} />
          </div>
          <label className="label-input">Bandeira:</label>
          <Select
            options={banOptions}
            value={selectedBan}
            onChange={setSelectedBan}
            className="select-component"
          />
          <label className="label-input">Adquirente:</label>
          <Select
            options={admOptions}
            value={selectedAdm}
            onChange={setSelectedAdm}
            className="select-component"
          />
          <label className="label-input">Modalidade:</label>
          <Select
            options={modOptions}
            value={selectedMod}
            onChange={setSelectedMod}
            className="select-component"
          />
          <label className="label-input">Tipo Taxa:</label>
          <Select
            options={[
              { label: 'Crédito', value: 'C' },
              { label: 'Débito', value: 'D' },
            ]}
            value={selectedType}
            onChange={setSelectedType}
            className="select-component"
          />
          <label className="label-input">% Taxa:</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            className="input-component"
          />
          <button
            type="button"
            className="btn btn-success btn-global"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </form>
      </Modal>
    );
  };

  return (
    <div className="container-taxas">
      {clientCode !== 'todos' ? (
        <>
          {isLoadingTaxes ? (
            <p>Carregando...</p>
          ) : (
            <div className="table-responsive">
              <TaxesTable />
            </div>
          )}
        </>
      ) : (
        <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
          Não é possível mostrar os dados para todos os clientes
        </h2>
      )}
      <TaxModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onSubmit={handleModalSubmit}
        initialData={null}
      />
      <TaxModal
        isOpen={isModalEditOpen}
        onClose={handleCancel}
        onSubmit={handleModalSubmit}
        initialData={editableTax}
      />
    </div>
  );
};

export default Taxas;
