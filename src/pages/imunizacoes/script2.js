document.addEventListener("DOMContentLoaded", function () {
  carregarImunizacoes();
});

function carregarImunizacoes() {
  fetch("http://localhost:8080/imunizacao/consultar/formatada")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((imunizacoes) => {
      const tabelaBody = document.querySelector(
        "#tabela-imunizacoes tbody"
      );
      tabelaBody.innerHTML = ""; // Limpa a tabela antes de renderizar

      if (imunizacoes.length === 0) {
        // Se não houver imunizações, exibe uma mensagem
        const row = document.createElement("tr");
        row.innerHTML = `
                      <td colspan="8" style="text-align: center;">Nenhuma imunização encontrada.</td>
                  `;
        tabelaBody.appendChild(row);
      } else {
        // Preenche a tabela com os dados das imunizações
        imunizacoes.forEach((imunizacao) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                          <td>${imunizacao.nomePaciente || " "}</td>
                          <td>${imunizacao.nomeVacina || " "}</td>
                          <td>${imunizacao.dose || " "}</td>
                          <td>${
                            formatarData(imunizacao.dataAplicacao) || " "
                          }</td> <!-- Formata a data -->
                          <td>${imunizacao.fabricante || " "}</td>
                          <td>${imunizacao.lote || " "}</td>
                          <td>${imunizacao.localAplicacao || ""}</td>
                          <td>${
                            imunizacao.profissionalAplicador || " "
                          }</td>
                      `;
          tabelaBody.appendChild(row);
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar imunizações:", error);
      alert(
        "Erro ao carregar as imunizações. Verifique o console para mais detalhes."
      );
    });
}

function formatarData(data) {
  // Verifica se o objeto data é válido
  if (!data || typeof data !== 'object') {
      return ""; 
  }

  // Verifica se o objeto data é uma instância de Date
  if (data instanceof Date) {
      // Extrai dia, mês e ano no formato UTC
      const dia = String(data.getUTCDate()).padStart(2, '0'); // Dia no formato UTC
      const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês no formato UTC (janeiro é 0)
      const ano = data.getUTCFullYear(); // Ano no formato UTC
      return `${dia}/${mes}/${ano}`;
  }

  // Se não for um objeto Date, assume que é um objeto com dayOfMonth, monthValue e year
  const dia = String(data.dayOfMonth).padStart(2, '0'); 
  const mes = String(data.monthValue).padStart(2, '0'); 
  const ano = data.year;
  return `${dia}/${mes}/${ano}`;
}

// Exemplos de uso:

// 1. Usando um objeto Date no formato UTC
const dataUTC = new Date('2024-05-12T00:00:00Z'); // Data no formato UTC
console.log(formatarData(dataUTC)); // Saída: "12/05/2024"

// 2. Usando um objeto Date no fuso horário local (pode variar dependendo do fuso horário)
const dataLocal = new Date('2024-05-12'); // Data no fuso horário local
console.log(formatarData(dataLocal)); // Saída: "12/05/2024" (agora funciona corretamente)

// 3. Usando um objeto personalizado
const dataObjeto = {
  dayOfMonth: 12,
  monthValue: 5,
  year: 2024
};
console.log(formatarData(dataObjeto)); // Saída: "12/05/2024"
