import { useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

function useBankForm(addBank, loadBanks, onClose, setBanksList) {
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
    return obj && Object.values(obj).every(value => value !== null && value !== '' && value.label !== 'Selecione' && value !== 'Sem Estabelecimentos')
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
  }

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
      Banco: selectedBank.toString(),
      Agencia: selectedAgency.toString(),
      Conta: selectedAccount.toString(),
    }

    if (isObjectFullyPopulated(newBankObj)) {
      try {
        toast.dismiss();
        await toast.promise(addBank(newBankObj), {
          success: 'Cadastrado com sucesso!',
          pending: 'Carregando...',
        });

        const updatedBanks = await loadBanks();
        setBanksList(updatedBanks);
        resetValues();
        onClose();
      } catch (error) {
        console.error('Error handling submit:', error);
        toast.error('Erro ao cadastrar banco!');
      }
    } else {
      toast.warning('Todos os Campos devem ser preenchidos');
    }
  };

  return {
    selectedCli,
    setSelectedCli,
    codeBankCli,
    setCodeBankCli,
    selectedClientCode,
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
    setIsLoadingBanks,
    handleSubmit,
    resetValues,
  };
}

export default useBankForm;
