import React from "react";
import './filtroAntecipacoes.css'

function Filtro({ value, onChange, options, onFilterChange }) {
  const handleFilterChange = (e) => {
    onChange(e);
    onFilterChange(e.target.value);
  };

  return (
    <select className="filtro" value={value} onChange={handleFilterChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Filtro;

