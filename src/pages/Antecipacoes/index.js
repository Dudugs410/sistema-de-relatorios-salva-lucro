
import React, { useState } from 'react';
import './antecipacoes.css';


const CardComponent = () => {
  const [mostrarConteudo1, setMostrarConteudo1] = useState(true);
  const [mostrarConteudo2, setMostrarConteudo2] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setMostrarConteudo1(true);
              setMostrarConteudo2(false);
            }}
          >
            Solicitar Antecipação
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              setMostrarConteudo1(false);
              setMostrarConteudo2(true);
            }}
          >
            Solicitações Realizadas
          </button>
        </div>
      </div>
      {mostrarConteudo1 && (
        <div className="card-body">
            <div class="dropdown">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown link
                </a>

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
          </div>
     </div>
      )}
      {mostrarConteudo2 && (
        <div className="card-body">
          <p>Este é o conteúdo 2 que aparecerá quando você clicar em "Mostrar Conteúdo 2".</p>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
