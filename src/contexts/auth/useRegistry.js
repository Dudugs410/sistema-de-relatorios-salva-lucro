import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  getSelectedClientCode,
  fetchTaxes,
  createTax,
  updateTax,
  removeTax,
  fetchBanks,
  fetchBanksByCNPJ,
  fetchBanksByCodigo,
  fetchBankList,
  fetchDomiciliosByBanco,
  createDomicilio,
  fetchEstablishments,
  createBank,
  updateBank,
  removeBank,
  fetchClientAcquirers,
  fetchProducts,
  fetchSubproducts,
  fetchBanners,
  fetchAcquirers,
  fetchModalities,
  fetchSysmo,
} from '../../services/registryService'
import { isUnauthorized } from './isUnauthorized'
import { getApiErrorMessage } from '../../services/apiErrors'

const withLoading = (setLoading) => async (action) => {
  setLoading(true)
  try {
    return await action()
  } finally {
    setLoading(false)
  }
}

export const useRegistry = ({ onUnauthorized }) => {
  const [isLoadingTaxes, setIsLoadingTaxes] = useState(false)
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [taxesTableData, setTaxesTableData] = useState([])
  const [taxesPageArray, setTaxesPageArray] = useState([])
  const [btnDisabledSysmo, setBtnDisabledSysmo] = useState(false)

  const handleError = (error, label, message) => {
    console.error(label, error)
    if (message) toast.error(message)
    if (isUnauthorized(error)) onUnauthorized()
  }

  const withTaxesLoading = withLoading(setIsLoadingTaxes)

  const lookups = useMemo(() => {
    const fetchLookup = (request, { logoutOn401 = true } = {}) => async () => {
      try {
        return await request()
      } catch (error) {
        console.log(error)
        if (logoutOn401 && isUnauthorized(error)) onUnauthorized()
      }
    }
    const lookupList = (request, label) => async (...args) => {
      try {
        return await request(...args)
      } catch (error) {
        console.error(label, error)
        if (isUnauthorized(error)) onUnauthorized()
        return []
      }
    }

    return {
      loadDomicilios: async (codigoBanco) =>
        codigoBanco ? lookupList(fetchDomiciliosByBanco, 'Erro ao carregar domicílios:')(codigoBanco) : [],
      loadEstabelecimentos: async (codigoAdquirente, codigoCliente) =>
        codigoAdquirente && codigoCliente
          ? lookupList(fetchEstablishments, 'Erro ao carregar estabelecimentos:')(codigoCliente, codigoAdquirente)
          : [],
      addDomicilio: async (domicilio) => {
        try {
          const response = await createDomicilio(domicilio)
          toast.success(response.data?.mensagem || 'Domicílio adicionado com sucesso!')
          return { success: true, data: response.data }
        } catch (error) {
          console.error('Erro ao criar domicílio:', error.response?.status, error.response?.data ?? error)
          toast.error(getApiErrorMessage(error, 'Erro ao adicionar domicílio'))
          if (isUnauthorized(error)) onUnauthorized()
          return { success: false }
        }
      },
      loadCliAdq: fetchLookup(fetchClientAcquirers, { logoutOn401: false }),
      loadBanners: fetchLookup(fetchBanners, { logoutOn401: false }),
      loadAdmins: fetchLookup(fetchAcquirers),
      loadMods: fetchLookup(fetchModalities),
      loadProducts: fetchLookup(fetchProducts),
      loadSubproducts: fetchLookup(fetchSubproducts),
      loadBankSelectOptions: async () => {
        try {
          return (await fetchBankList())
            .filter((item) => item.CODIGO !== undefined && item.CODIGO !== null && item.NOME)
            .map((item) => ({ value: String(item.CODIGO), label: String(item.NOME) }))
            .sort((a, b) => a.label.localeCompare(b.label))
        } catch (error) {
          console.error('Error fetching bank list for registration:', error)
          if (isUnauthorized(error)) onUnauthorized()
          return []
        }
      },
    }
  }, [onUnauthorized])

  const loadTaxes = () => withTaxesLoading(async () => {
    try {
      const clientCode = getSelectedClientCode()
      return clientCode ? await fetchTaxes(clientCode) : []
    } catch (error) {
      handleError(error, 'Error fetching taxas:')
      return isUnauthorized(error) ? undefined : []
    }
  })

  const addTax = (tax) => withTaxesLoading(async () => {
    try {
      if (!getSelectedClientCode()) return
      await createTax(tax)
      toast.success('Taxa cadastrada com sucesso')
    } catch (error) {
      handleError(error, 'Error adding tax:', 'Erro ao cadastrar taxa')
    }
  })

  const editTax = (tax) => withTaxesLoading(async () => {
    try {
      const response = await updateTax(tax)
      if (response.ok) toast.success('Taxa alterada com sucesso!')
      else toast.error('Erro ao alterar taxa!')
    } catch (error) {
      handleError(error, 'Error updating tax:', 'Erro ao alterar taxa!')
    }
  })

  const deleteTax = (tax) => withTaxesLoading(async () => {
    try {
      await removeTax(tax)
      toast.success('Taxa deletada com sucesso!')
    } catch (error) {
      handleError(error, 'Error deleting tax:', 'Erro ao deletar taxa!')
    }
  })

  const banks = useMemo(() => {
    const withBanksLoading = withLoading(setIsLoadingBanks)

    const bankFailure = (error, label, fallbackMessage) => {
      console.error(label, error)
      toast.dismiss()
      toast.error(error.response?.data?.mensagem || fallbackMessage)
      if (isUnauthorized(error)) onUnauthorized()
      return { success: false }
    }

    const bankLookup = (request, label) => async (...args) => {
      try {
        return await request(...args)
      } catch (error) {
        console.error(label, error)
        if (isUnauthorized(error)) onUnauthorized()
        return []
      }
    }

    const loadBanks = (clientCode = getSelectedClientCode()) => withBanksLoading(() => {
      return clientCode ? bankLookup(fetchBanks, 'Error fetching banco by client:')(clientCode) : []
    })

    const loadBanksByCNPJ = async (cnpj) =>
      cnpj ? bankLookup(fetchBanksByCNPJ, 'Error fetching banco by CNPJ:')(cnpj) : []

    const loadBanksByCodigo = async (codigoBanco) =>
      codigoBanco ? bankLookup(fetchBanksByCodigo, 'Error fetching banco by codigo:')(codigoBanco) : []

    const addBank = (bank) => withBanksLoading(async () => {
      try {
        const response = await createBank(bank)
        toast.dismiss()
        if (response.data?.success || response.status === 200 || response.status === 201) {
          toast.success(response.data?.mensagem || 'Banco adicionado com sucesso!')
          return { success: true, data: response.data }
        }
        toast.error(response.data?.mensagem || 'Erro ao adicionar Banco!')
        return { success: false }
      } catch (error) {
        return bankFailure(error, 'Erro ao adicionar banco:', 'Erro ao adicionar banco!')
      }
    })

    const editBank = (bank) => withBanksLoading(async () => {
      if (!bank.CODIGO) {
        toast.dismiss()
        toast.error('Código do banco não informado para edição.')
        return { success: false }
      }
      try {
        const response = await updateBank(bank)
        toast.dismiss()
        if (response.status === 200 || response.status === 204) {
          toast.success(response.data?.mensagem || 'Banco alterado com sucesso!')
          return { success: true, data: response.data }
        }
        toast.error(response.data?.mensagem || 'Erro ao alterar Banco!')
        return { success: false }
      } catch (error) {
        return bankFailure(error, 'Erro ao Alterar Banco:', 'Erro ao alterar banco!')
      }
    })

    const deleteBank = (bank) => withBanksLoading(async () => {
      if (!bank.CODIGO) {
        toast.dismiss()
        toast.error('Código do banco não informado para exclusão.')
        return { success: false }
      }
      try {
        const response = await removeBank(bank)
        toast.dismiss()
        toast.success(response.data?.mensagem || 'Banco deletado com sucesso!')
        return { success: true, data: response.data }
      } catch (error) {
        return bankFailure(error, 'Erro ao deletar banco:', 'Erro ao deletar banco!')
      }
    })

    return { loadBanks, loadBanksByCNPJ, loadBanksByCodigo, addBank, editBank, deleteBank }
  }, [onUnauthorized])

  const loadSysmo = async (obj) => {
    setBtnDisabledSysmo(true)
    try {
      return await fetchSysmo(obj)
    } catch (error) {
      setBtnDisabledSysmo(false)
      console.log(error)
      if (isUnauthorized(error)) onUnauthorized()
    }
  }

  return {
    loadTaxes,
    isLoadingTaxes,
    setIsLoadingTaxes,
    addTax,
    editTax,
    deleteTax,
    taxesTableData,
    setTaxesTableData,
    exportTaxes: () => {},
    taxesPageArray,
    setTaxesPageArray,

    ...banks,
    isLoadingBanks,
    setIsLoadingBanks,

    loadSysmo,
    btnDisabledSysmo,
    setBtnDisabledSysmo,

    ...lookups,
  }
}
