import md5 from 'md5'
import api from './api'
import { getBrazilianISOTime } from '../util/formatters'

const API_BASE_URL = 'https://app.salvalucro.com.br/api/v1'

const PLUGGY_CLIENT_ID = '7cee8f27-cbfa-4a19-b14d-306f9656787a'
const PLUGGY_CLIENT_SECRET = '01e4edaf-639a-40ae-945a-4a04ab652bad'

export const requestToken = async (login, password) => {
  const response = await api.post('token', { client_id: login, client_secret: md5(password) })
  return response.data
}

export const refreshTokens = async (refreshToken) => {
  const response = await api.post('token/refresh/', { refresh_token: refreshToken })
  return response.data
}

export const fetchUser = async (userId) => {
  const response = await api.get('usuario', { params: { codigo: userId } })
  return response.data
}

export const putUser = async (userObj) => {
  const body = {
    CODIGO: userObj.CODIGO,
    GRUCODIGO: userObj.GRUCODIGO,
    SEDCODIGO: userObj.SEDCODIGO,
    NOME: userObj.NOME,
    EMAIL: userObj.EMAIL,
    LOGIN: userObj.LOGIN,
    SENHA: userObj.SENHA,
    NECESSITATROCASENHA: userObj.NECESSITATROCASENHA ?? false,
    CONTABLOQUEADA: userObj.CONTABLOQUEADA ?? false,
    TEMA: userObj.TEMA ?? 'false',
    USUARIOINSERCAO: userObj.USUARIOINSERCAO,
    DATAINSERCAO: userObj.DATAINSERCAO,
    USUARIOMODIFICACAO: userObj.USUARIOMODIFICACAO ?? userObj.CODIGO,
    DATAMODIFICACAO: new Date().toISOString(),
    ATIVO: userObj.ATIVO ?? true,
    PREFERENCIAS: userObj.PREFERENCIAS ?? null,
  }

  return fetch(`${API_BASE_URL}/usuario`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(body),
  })
}

export const logAccess = (userId, login) =>
  api.post('/LogAcesso', {
    USUCODIGO: userId,
    USULOGIN: login.toUpperCase(),
    ACESSOPERMITIDO: 'S',
    APLICACAO: 'ReactApp',
    DATAHORA: getBrazilianISOTime(),
  })

export const authenticatePluggy = async (userId) => {
  const response = await fetch('https://api.pluggy.ai/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: PLUGGY_CLIENT_ID,
      clientSecret: PLUGGY_CLIENT_SECRET,
      itemOptions: { clientUserId: userId },
    }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

export const fetchMenuOptions = async (userId) => {
  const response = await api.get('Menu', { params: { codigo: userId } })
  return response.data
}

export const fetchGroups = async () => {
  const response = await api.get('/grupo')
  return response.data
}
