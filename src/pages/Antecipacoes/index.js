
import React, { useEffect, useState } from "react";
import './antecipacoes.css';
import Calendar from "react-calendar"

  export default function TabelaFiltrada() {
    const [filtro1, setFiltro1] = useState("all");
    const [filtro2, setFiltro2] = useState("all");
    const [filtro3, setFiltro3] = useState("all");
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [dataBusca, setDataBusca] = useState(new Date())
    const [buscou, setBuscou] = useState(false)
  
    const dados = [
      { id: 1, col1: "One", col2: "A", col3: "X" },
      { id: 2, col1: "Two", col2: "B", col3: "Y" },
      { id: 3, col1: "Three", col2: "C", col3: "Z" },
    ];

    function handleDateChange(date){
      setDataBusca(date)

    }
  
    useEffect(() => {
      const dadosFiltrados = dados.filter((item) => {
        const filtro1Pass = filtro1 === "all" || item.col1 === filtro1;
        const filtro2Pass = filtro2 === "all" || item.col2 === filtro2;
        const filtro3Pass = filtro3 === "all" || item.col3 === filtro3;
        return filtro1Pass && filtro2Pass && filtro3Pass;
      });
  
      setDadosFiltrados(dadosFiltrados);
    }, [filtro1, filtro2, filtro3]);
  return (

  <div className="page-antecipacoes">
    <div className="card">
      <div className="card-header">
            <h1 className="title-anteipacoes"> Antecipações </h1> 
        </div>

    <div className="card-body">
      <div className="filtro">
        <select
          className="form-select"
          aria-label="Filtro 2"
          value={filtro2}
          onChange={(e) => setFiltro2(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <select
          className="form-select"
          aria-label="Filtro 3"
          value={filtro3}
          onChange={(e) => setFiltro3(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="X">X</option>
          <option value="Y">Y</option>
          <option value="Z">Z</option>
        </select>

        <div className='submit-container'>
            <button className="btn btn-primary btn-submit">Pesquisar</button>
          </div>      
      </div>

    <div className="table-responsive">
      <table className="table table-bordered table-dark">
        <thead>
          <tr class="table-secundary">
            <th scope="col">#</th>
            <th scope="col">Coluna 1</th>
            <th scope="col">Coluna 2</th>
            <th scope="col">Coluna 3</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((item) => (
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
      <Calendar
         onChange={ handleDateChange }
         value={ dataBusca }
         onClick={ console.log(dataBusca) }
        />
      </div>    
    </div>
  </div>

  );
};




