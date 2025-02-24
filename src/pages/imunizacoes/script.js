document.addEventListener("DOMContentLoaded", function () {
  carregarPacientes();
  carregarVacinas();

  // Event listener para enviar o formulário de imunização
  document
    .getElementById("form-imunizacao")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      registrarImunizacao();
    });

  // Atualiza vacinas quando paciente mudar
  document
    .getElementById("id_paciente")
    .addEventListener("change", carregarVacinas);

  // Atualiza doses quando vacina mudar
  document
    .getElementById("id_vacina")
    .addEventListener("change", carregarDosesPorVacina);
});

// Função para carregar os pacientes
function carregarPacientes() {
  fetch("http://localhost:8080/paciente/consultar")
    .then((response) => response.json())
    .then((pacientes) => {
      const selectPaciente = document.getElementById("id_paciente");
      pacientes.forEach((paciente) => {
        const option = document.createElement("option");
        option.value = paciente.id;
        option.textContent = paciente.nome;
        selectPaciente.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Erro ao carregar pacientes:", error)
    );
}

// Função para carregar as vacinas
function carregarVacinas() {
  fetch("http://localhost:8080/vacinas/consultar")
    .then((response) => response.json())
    .then((vacinas) => {
      const selectVacina = document.getElementById("id_vacina");
      selectVacina.innerHTML = ""; // Limpa vacinas anteriores

      vacinas.forEach((vacina) => {
        const option = document.createElement("option");
        option.value = vacina.id;
        option.textContent = vacina.vacina;
        selectVacina.appendChild(option);
      });

      // Carregar doses quando vacinas são carregadas
      carregarDosesPorVacina();
    })
    .catch((error) => console.error("Erro ao carregar vacinas:", error));
}

// Função para carregar as doses com base na vacina selecionada
function carregarDosesPorVacina() {
  const vacinaId = document.getElementById("id_vacina").value;
  if (!vacinaId) return; // Se não houver vacina selecionada, não faça nada

  fetch(`http://localhost:8080/dose/consultar/vacina/${vacinaId}`)
    .then((response) => response.json())
    .then((doses) => {
      const selectDose = document.getElementById("id_dose");
      selectDose.innerHTML = ""; // Limpa doses anteriores

      doses.forEach((dose) => {
        const option = document.createElement("option");
        option.value = dose.id;
        option.textContent = dose.dose;
        selectDose.appendChild(option);
      });
    })
    .catch((error) => console.error("Erro ao carregar doses:", error));
}

// Função para registrar uma nova imunização
function registrarImunizacao() {
  const id_paciente = document.getElementById("id_paciente").value;
  const id_vacina = document.getElementById("id_vacina").value;
  const id_dose = document.getElementById("id_dose").value;
  const data_aplicacao = document.getElementById("data_aplicacao").value;
  const fabricante = document.getElementById("fabricante").value;
  const lote = document.getElementById("lote").value;
  const local_aplicacao =
    document.getElementById("local_aplicacao").value;
  const profissional_aplicador = document.getElementById(
    "profissional_aplicador"
  ).value;

  const imunizacao = {
    id_paciente: parseInt(id_paciente),
    id_vacina: parseInt(id_vacina),
    id_dose: parseInt(id_dose),
    data_aplicacao: formatarData(data_aplicacao),
    fabricante,
    lote,
    local_aplicacao,
    profissional_aplicador,
  };

  fetch("http://localhost:8080/imunizacao/inserir", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imunizacao),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      // Aguarda 1 segundo antes de redirecionar
      setTimeout(() => {
        window.location.href = "index2.html";
      }, 1000);
    })
    .catch((error) =>
      console.error("Erro ao cadastrar imunização:", error)
    );
}
document.addEventListener("DOMContentLoaded", () => {
  const localAplicacaoInput = document.getElementById("local_aplicacao");
  const suggestionsContainer = document.createElement("div");
  suggestionsContainer.setAttribute("id", "suggestions");
  suggestionsContainer.style.position = "absolute";
  suggestionsContainer.style.backgroundColor = "white";
  suggestionsContainer.style.border = "1px solid #ccc";
  suggestionsContainer.style.zIndex = "1000";
  localAplicacaoInput.parentNode.appendChild(suggestionsContainer);

  let distritos = [];

  // Buscar dados da API do IBGE
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/distritos")
    .then(response => response.json())
    .then(data => {
      distritos = data.map(distrito => ({
        nome: distrito.nome,
        estado: distrito.municipio.microrregiao.mesorregiao.UF.sigla
      }));
    })
    .catch(error => console.error("Erro ao buscar distritos:", error));

  localAplicacaoInput.addEventListener("input", () => {
    const query = localAplicacaoInput.value.toLowerCase();
    suggestionsContainer.innerHTML = "";
    const rect = localAplicacaoInput.getBoundingClientRect();
    suggestionsContainer.style.left = `${rect.left}px`;
    suggestionsContainer.style.top = `${rect.bottom}px`;
    suggestionsContainer.style.width = `${rect.width}px`;

    if (query.length < 2) return;

    const filtrados = distritos.filter(distrito =>
      distrito.nome.toLowerCase().includes(query)
    );

    filtrados.forEach(distrito => {
      const suggestionItem = document.createElement("div");
      suggestionItem.textContent = `${distrito.nome} - ${distrito.estado}`;
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.style.padding = "5px";
      suggestionItem.style.cursor = "pointer";
      suggestionItem.addEventListener("click", () => {
        localAplicacaoInput.value = `${distrito.nome} - ${distrito.estado}`;
        suggestionsContainer.innerHTML = "";
      });
      suggestionsContainer.appendChild(suggestionItem);
    });
  });
});

function formatarData(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    console.error("Formato de data inválido:", data);
    return data; 
  }
  
  const [year, month, day] = data.split("-");
  const date = new Date(Date.UTC(year, month - 1, day)); 
  
  const formattedYear = date.getUTCFullYear();
  const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const formattedDay = String(date.getUTCDate()).padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}