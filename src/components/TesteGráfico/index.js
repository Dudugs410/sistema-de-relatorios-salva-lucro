import React from "react";
import { Line } from "react-chartjs-2";

function TesteGrafico({ clientes }) {

  // Dados de vendas dos últimos 5 dias
  const dados5Dias = {
    labels: ["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5"],
    datasets: clientes[0].vendas.map((cliente) => ({
      label: cliente.nome,
      data: cliente.vendas.slice(0, 5),
      fill: false,
      borderColor: cliente.cor,
      tension: 0.1,
    })),
  };

  // Dados de vendas do dia atual
  const dadosDiaAtual = {
    labels: clientes.map((cliente) => cliente.nome),
    datasets: [
      {
        label: "Vendas do Dia Atual",
        data: clientes.map((cliente) => cliente.vendas[4]),
        backgroundColor: clientes.map((cliente) => cliente.cor),
      },
    ],
  };

  return (
    <div>
      <Line data={dados5Dias} />
      <Line data={dadosDiaAtual} />
    </div>
  );
}

export default TesteGrafico;