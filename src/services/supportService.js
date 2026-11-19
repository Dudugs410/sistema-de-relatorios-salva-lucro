import api from './api'

// Valores fixos definidos para chamados abertos pelo cliente dentro do sistema
const CHAMADO_DEFAULTS = {
  SEDcodigo: 1,          // Sede SalvaLucro
  CATCodigo: 2,          // Categoria: TI
  CLAcodigo: 5,          // Classificação: Suporte ao usuário
  STAcodigo: 1,          // Status: Solicitado
  UNCcodigo: 0,          // Não utilizado
  TDEcodigo: 0,          // Preenchido no encerramento
  CHAtitulo: 'Suporte Sistema SalvaLucro',
  CHAbandeiravermelha: false, // Não utilizado
}

const pad = (n) => String(n).padStart(2, '0')

// Data/hora local no formato yyyy-MM-ddTHH:mm:ss (sem fuso)
export const formatLocalDateTime = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

export const createSupportTicket = ({ codigoCliente, codigoAdquirente, descricao, contato }) =>
  api.post('chamado', {
    ...CHAMADO_DEFAULTS,
    CLIcodigo: Number(codigoCliente),
    ADQcodigo: Number(codigoAdquirente),
    CHAdescricao: descricao,
    CHAdataHoraInicio: formatLocalDateTime(),
    CHAcontato: contato,
  })
