import React from "react";
import './tabelaAntecipacoes.css'
import TabelaFiltrada from "../../pages/Antecipacoes";

function Tabela({ dados }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-dark">
        <thead>
          <tr className="table-secondary">
            <th scope="col">#</th>
            <th scope="col">Coluna 1</th>
            <th scope="col">Coluna 2</th>
            <th scope="col">Coluna 3</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.id}</th>
              <td>{item.col1}</td>
              <td>{item.col2}</td>
              <td>{item.col3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tabela;
