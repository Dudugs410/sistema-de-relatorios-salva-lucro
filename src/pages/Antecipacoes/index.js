import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./antecipacoes.css";
import Filtro from "../../components/FiltroAntecipacoes/filtroAntecipacoes";
import Tabela from "../../components/TabelaAntecipacoes/tabelaAntecipacoes";

export default function TabelaFiltrada() {
  const [filtro1, setFiltro1] = useState("all");
  const [filtro2, setFiltro2] = useState("all");
  const [filtro3, setFiltro3] = useState("all");
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [dataBusca, setDataBusca] = useState(null);
  const [buscou, setBuscou] = useState(false);
  const [erroBusca, setErroBusca] = useState(false);

  const dados = [
              { col1:"One", col2: "A", col3: "X", data: new Date("2023-10-01") },
              { col1: "Two", col2: "B", col3: "Y", data: new Date("2023-10-02") },
              { col1: "Three", col2: "C", col3: "Z", data: new Date("2023-10-03") },
              { col1: "Four", col2: "A", col3: "X", data: new Date("2023-10-01") },
              { col1: "Five", col2: "B", col3: "Y", data: new Date("2023-10-01") },
              { col1: "Six", col2: "C", col3: "Z", data: new Date("2023-10-01") },
              { col1: "Seven", col2: "A", col3: "X", data: new Date("2023-10-01") },
              { col1: "Eight", col2: "B", col3: "Y", data: new Date("2023-10-01") },
              { col1: "Nine", col2: "C", col3: "Z", data: new Date("2023-10-01") },
              { col1: "Ten", col2: "A", col3: "X", data: new Date("2023-10-01") },
              { col1: "Eleven", col2: "B", col3: "Y", data: new Date("2023-10-01") },
              { col1: "Twelve", col2: "C", col3: "Z", data: new Date("2023-10-01") },
              { col1: "Thirteen", col2: "A", col3: "X", data: new Date("2023-10-02") },
              { col1: "Fourteen", col2: "B", col3: "Y", data: new Date("2023-10-02") },
              { col1: "Fifteen", col2: "C", col3: "Z", data: new Date("2023-10-02") },
              { col1: "Sixteen", col2: "A", col3: "X", data: new Date("2023-10-02") },
              { col1: "Seventeen", col2: "B", col3: "Y", data: new Date("2023-10-02") },
              { col1: "Eighteen", col2: "C", col3: "Z", data: new Date("2023-10-02") },
              { col1: "Nineteen", col2: "A", col3: "X", data: new Date("2023-10-02") },
              { col1: "Twenty", col2: "B", col3: "Y", data: new Date("2023-10-02") },
              { col1: "Twenty-One", col2: "C", col3: "Z", data: new Date("2023-10-02") },
              { col1: "Twenty-Two", col2: "A", col3: "X", data: new Date("2023-10-03") },
              { col1: "Twenty-Three", col2: "B", col3: "Y", data: new Date("2023-10-03") },
              { col1: "Twenty-Four", col2: "C", col3: "Z", data: new Date("2023-10-03") },
              { col1: "Twenty-Five", col2: "A", col3: "X", data: new Date("2023-10-03") },
              { col1: "Twenty-Six", col2: "B", col3: "Y", data: new Date("2023-10-03") },
              { col1: "Twenty-Seven", col2: "C", col3: "Z", data: new Date("2023-10-03") },
              { col1: "Twenty-Eight", col2: "A", col3: "X", data: new Date("2023-10-03") },
              { col1: "Twenty-Nine", col2: "B", col3: "Y", data: new Date("2023-10-03") },
              { col1: "Thirty", col2: "C", col3: "Z", data: new Date("2023-10-03") },
            ];

  useEffect(() => {
    setDadosOriginais(dados);
  }, [dados]);

  function handleDateChange(date) {
    setDataBusca(date);
    setBuscou(false);
    setErroBusca(false);
  }

  function handleCalendarClick(date) {
    setDataBusca(date);
    setBuscou(true);
    setErroBusca(false);
  }

  useEffect(() => {
    const dadosFiltrados = dadosOriginais.filter((item) => {
      const filtro1Pass = filtro1 === "all" || item.col1 === filtro1;
      const filtro2Pass = filtro2 === "all" || item.col2 === filtro2;
      const filtro3Pass = filtro3 === "all" || item.col3 === filtro3;
      return filtro1Pass && filtro2Pass && filtro3Pass;
    });

    setDadosFiltrados(dadosFiltrados);
  }, [filtro1, filtro2, filtro3, dadosOriginais]);

  const handleFilterChange = (filtro) => {
    const dadosFiltrados = dadosOriginais.filter((item) => {
      const filtro1Pass = filtro1 === "all" || item.col1 === filtro1;
      const filtro2Pass = filtro2 === "all" || item.col2 === filtro2;
      const filtro3Pass = filtro3 === "all" || item.col3 === filtro3;
      return filtro1Pass && filtro2Pass && filtro3Pass;
    });

    setDadosFiltrados(dadosFiltrados);
  };

  return (
    <div className="page-antecipacoes">
      <div className="card">
        <div className="card-header">
          <h1 className="title-anteipacoes"> Antecipações </h1>
        </div>

      <div className="card-main">
        <Calendar
          onChange={handleDateChange}
          value={dataBusca}
          onClickDay={handleCalendarClick}
        />
      </div>

        <div className="filtro">
          <Filtro
            value={filtro1}
            onChange={(e) => setFiltro1(e.target.value)}
            options={["all", "One", "Two", "Three"]} 
            onFilterChange={handleFilterChange}
          />
          <Filtro
            value={filtro2}
            onChange={(e) => setFiltro2(e.target.value)}
            options={["all", "A", "B", "C"]} 
            onFilterChange={handleFilterChange}
          />
          <Filtro
            value={filtro3}
            onChange={(e) => setFiltro3(e.target.value)}
            options={["all", "X", "Y", "Z"]} 
            onFilterChange={handleFilterChange}
          />

          <div className="submit-container">
            <button
              className="btn btn-primary btn-submit"
              onClick={() => setBuscou(true)}
            >
              Pesquisar
            </button>
          </div>
        </div>

        {erroBusca && <p>Nenhum registro encontrado para a data selecionada.</p>}

        {buscou && !erroBusca && dadosFiltrados.length > 0 ? (
          <Tabela dados={dadosFiltrados} />
        ) : null}
      </div>
    </div>
  );
}






