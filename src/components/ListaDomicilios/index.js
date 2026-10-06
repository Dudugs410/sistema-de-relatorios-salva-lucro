import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FiPlus } from 'react-icons/fi'
import api from '../../services/api'
import './ListaDomicilios.scss'

const ListaDomicilios = ({ banco, onAddClick }) => {
  const [domicilios, setDomicilios] = useState([])
  const [loading, setLoading] = useState(false)

  const loadDomicilios = async () => {
    if (!banco?.CODIGO) return

    setLoading(true)
    try {
      const response = await api.get('domiciliobancario/banco', {
        params: { codigoBanco: banco.CODIGO },
      })
      setDomicilios(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar domicílios:', error)
      toast.error('Erro ao carregar domicílios')
      setDomicilios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDomicilios()
  }, [banco?.CODIGO])

  useEffect(() => {
    window.addEventListener('domicilio-created', loadDomicilios)
    return () => window.removeEventListener('domicilio-created', loadDomicilios)
  }, [])

  const formatCurrency = (value) => {
    const n = Number(value) || 0
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="lista-domicilios">
      <div className="lista-domicilios-header">
        <h3>Domicílios Bancários</h3>
        <button className="btn btn-add-domicilio" onClick={onAddClick}>
          <FiPlus /> Adicionar Domicílio
        </button>
      </div>

      {loading ? (
        <div className="lista-domicilios-loading">Carregando...</div>
      ) : domicilios.length === 0 ? (
        <div className="lista-domicilios-empty">
          Nenhum domicílio cadastrado para este banco.
        </div>
      ) : (
        <div className="lista-domicilios-table-wrapper">
          <table className="lista-domicilios-table">
            <thead>
              <tr>
                <th>Estabelecimento</th>
                <th>Adquirente</th>
                <th>Bandeira</th>
                <th>Modalidade</th>
                <th>Propagar</th>
              </tr>
            </thead>
            <tbody>
              {domicilios.map((d, i) => (
                <tr key={d.CODIGO || i}>
                  <td>{d.ESTABELECIMENTO || 'N/A'}</td>
                  <td>{d.ADQUIRENTE || 'N/A'}</td>
                  <td>{d.BANDEIRA || 'N/A'}</td>
                  <td>{d.MODALIDADE || 'N/A'}</td>
                  <td>{d.PROPAGAR ? 'Sim' : 'Não'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ListaDomicilios