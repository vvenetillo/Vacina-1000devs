const API_URL = "http://localhost:8080";

// Função para carregar os dados
async function carregarDados() {
  try {
    // Requisições para os badges
    const [pacientesRes, vacinasRes, imunizacoesRes] = await Promise.all([
      fetch(`${API_URL}/paciente/consultar`),
      fetch(`${API_URL}/vacinas/consultar`),
      fetch(`${API_URL}/imunizacao/consultar`),
    ]);

    // Verifique se as respostas são válidas
    if (!pacientesRes.ok || !vacinasRes.ok || !imunizacoesRes.ok) {
      throw new Error(`Erro na requisição: ${pacientesRes.status} ${vacinasRes.status} ${imunizacoesRes.status}`);
    }

    // Processar a resposta de pacientes
    let pacientes = [];
    if (pacientesRes.status !== 204) { // 204 = No Content
      pacientes = await pacientesRes.json();
    }

    // Processar a resposta de vacinas
    let vacinas = [];
    if (vacinasRes.status !== 204) { // 204 = No Content
      vacinas = await vacinasRes.json();
    }

    // Processar a resposta de imunizações
    let imunizacoes = [];
    if (imunizacoesRes.status !== 204) { // 204 = No Content
      imunizacoes = await imunizacoesRes.json();
    }

    // Atualizar a interface do usuário
    document.getElementById("contagemPacientes").textContent = pacientes.length || 0;
    document.getElementById("contagemVacinas").textContent = vacinas.length || 0;
    document.getElementById("contagemImunizacoes").textContent = imunizacoes.length || 0;

    // Requisição para a análise temporal
    const imunizacoesFormatadasRes = await fetch(`${API_URL}/imunizacao/consultar/formatada`);

    // Verifica se a resposta é válida
    if (!imunizacoesFormatadasRes.ok) {
      throw new Error(`Erro na requisição: ${imunizacoesFormatadasRes.status}`);
    }

    // Processa a resposta de imunizações formatadas
    let imunizacoesFormatadas = [];
    if (imunizacoesFormatadasRes.status !== 204) { // 204 = No Content
      imunizacoesFormatadas = await imunizacoesFormatadasRes.json();
    }

    // Gera o gráfico de análise temporal
    gerarGraficoImunizacoes(imunizacoesFormatadas);
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    alert("Erro ao carregar os dados do dashboard.");
  }
}

// Função para formatar a data no formato YYYY-MM-DD
function formatarDataParaGrafico(dataAplicacao) {
  if (!dataAplicacao || typeof dataAplicacao !== 'object') {
    return null; // Retorna null se a data for inválida
  }

  const dia = String(dataAplicacao.dayOfMonth).padStart(2, '0'); // Garante 2 dígitos
  const mes = String(dataAplicacao.monthValue).padStart(2, '0'); // Mês já é um número (1-12)
  const ano = dataAplicacao.year;

  return `${ano}-${mes}-${dia}`; // Retorna a data no formato YYYY-MM-DD
}

// Função para gerar o gráfico de imunizações
function gerarGraficoImunizacoes(imunizacoes) {
  // Agrupa imunizações por data
  const dadosPorData = imunizacoes.reduce((acc, imunizacao) => {
    const data = formatarDataParaGrafico(imunizacao.dataAplicacao); // Formata a data
    if (!data) {
      return acc; // Ignora imunizações com data inválida
    }

    if (!acc[data]) {
      acc[data] = 0;
    }
    acc[data]++;
    return acc;
  }, {});

  // Prepara dados para o gráfico
  const labels = Object.keys(dadosPorData).sort(); // Ordena as datas
  const dados = labels.map((data) => dadosPorData[data]);

  // Configuração do gráfico
  const ctx = document.getElementById("graficoImunizacoes").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Imunizações por dia",
          data: dados,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "Evolução das Imunizações",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Data",
          },
        },
        y: {
          title: {
            display: true,
            text: "Número de Imunizações",
          },
          beginAtZero: true,
          max: 10
        },
      },
    },
  });
}

// Carrega os dados quando a página for carregada
document.addEventListener("DOMContentLoaded", carregarDados);
