import { useCallback, useContext, useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import { DOMICILIO_COLUMNS, formatDomicilioCell } from '../../util/domicilio'
import './ListaDomicilios.scss'

const ListaDomicilios = ({ banco, onAddClick, refreshKey = 0 }) => {
  const { loadDomicilios } = useContext(AuthContext)
  const [domicilios, setDomicilios] = useState([])
  const [loading, setLoading] = useState(false)

  const codigoBanco = banco?.CODIGO

  const refresh = useCallback(async () => {
    if (!codigoBanco) return
    setLoading(true)
    setDomicilios(await loadDomicilios(codigoBanco))
    setLoading(false)
  }, [codigoBanco, loadDomicilios])

  useEffect(() => {
    refresh()
  }, [refresh, refreshKey])

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
        <div className="lista-domicilios-empty">Nenhum domicílio cadastrado para este banco.</div>
      ) : (
        <div className="lista-domicilios-table-wrapper">
          <table className="lista-domicilios-table">
            <thead>
              <tr>
                {DOMICILIO_COLUMNS.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domicilios.map((domicilio, index) => (
                <tr key={domicilio.CODIGO || index}>
                  {DOMICILIO_COLUMNS.map((column) => (
                    <td key={column.key}>{formatDomicilioCell(domicilio, column)}</td>
                  ))}
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
