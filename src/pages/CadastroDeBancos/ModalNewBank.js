import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import '../../styles/global.scss';
import './cadastroDeBancos.scss';
import Select from 'react-select';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useBankForm from './useBankForm';

const ModalNewBank = ({ onClose, cliAdqOptions, setIsSelected, cliOptions, admOptions, banOptions, productOptions, subproductOptions, addBank, loadBanks, setBanksList }) => {
  useEffect(() => {
    console.log('Render Modal New Bank');
  }, []);

  const {
    selectedCli,
    setSelectedCli,
    selectedCliAdm,
    setSelectedCliAdm,
    selectedBan,
    setSelectedBan,
    selectedAdm,
    setSelectedAdm,
    selectedProduct,
    setSelectedProduct,
    selectedSubproduct,
    setSelectedSubproduct,
    selectedBank,
    setSelectedBank,
    selectedAgency,
    setSelectedAgency,
    selectedAccount,
    setSelectedAccount,
    isLoadingBanks,
    handleSubmit,
    resetValues,
  } = useBankForm(addBank, loadBanks, onClose, setBanksList);

  const handleAdmin = (selected) => {
    Cookies.set('admCode', selected.value);
    setSelectedAdm(selected);
    setIsSelected(true);
  };

  useEffect(() => {
    setSelectedCliAdm(cliAdqOptions.length > 0 ? cliAdqOptions[0] : { label: 'Sem Estabelecimentos', value: 0 });
  }, [selectedAdm, cliAdqOptions]);

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
              inputMode="numeric" 
              pattern="[0-9\-]*"
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
              inputMode="numeric" 
              pattern="[0-9\-]*"
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
              inputMode="numeric"
              pattern="[0-9\-]*"
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
  );
};

export default ModalNewBank;
