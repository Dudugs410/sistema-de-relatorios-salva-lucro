export const USER_LOOKUP_ERROR_MESSAGE = 'Não foi possível consultar o usuário. Tente novamente mais tarde.'
export const NO_MENU_PERMISSIONS_MESSAGE = 'Usuário ainda não possui permissões de acesso cadastradas, consulte o administrador'

const MESSAGE_FIELDS = ['mensagem', 'message', 'Message', 'Mensagem', 'erro', 'error']

export const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data.trim()
  if (data && typeof data === 'object') {
    const field = MESSAGE_FIELDS.find((key) => typeof data[key] === 'string' && data[key].trim())
    if (field) return data[field].trim()
  }
  return fallback
}
