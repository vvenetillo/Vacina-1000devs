const API_URL = "http://localhost:8080";

async function carregarVacinas() {
  try {
    let response = await fetch(`${API_URL}/vacinas/consultar`);
    if (!response.ok) throw new Error("Erro ao buscar vacinas");

    let vacinas = await response.json();
    let selectVacina = document.getElementById("vacina");

    vacinas.forEach((vacina) => {
      let option = document.createElement("option");
      option.value = vacina.id;
      option.textContent = vacina.vacina;
      option.dataset.desc = vacina.descricao;
      option.dataset.idade = vacina.limiteAplicacao || "";
      selectVacina.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar vacinas:", error);
    alert("Erro ao carregar vacinas do banco de dados.");
  }
}

document.getElementById("vacina").addEventListener("change", function () {
  let selectedOption = this.options[this.selectedIndex];

  document.getElementById("descricao").value =
    selectedOption.dataset.desc || "";
  document.getElementById("limiteAplicacao").value =
    selectedOption.dataset.idade || "Não há";
});

document
  .getElementById("formVacina")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let vacinaId = document.getElementById("vacina").value;
    let descricao = document.getElementById("descricao").value;
    let idade = document.getElementById("limiteAplicacao").value;
    let categoria = document.getElementById("categoria").value;

    if (!vacinaId) {
      alert("Por favor, selecione uma vacina.");
      return;
    }

    let vacinaData = {
      vacinaId,
      descricao,
      idade: idade || null,
      categoria,
    };

    try {
      let response = await fetch(`${API_URL}/vacinas/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacinaData),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar vacina");

      alert("✅ Vacina cadastrada com sucesso!");
      document.getElementById("formVacina").reset();
    } catch (error) {
      console.error("Erro ao consultar vacina:", error);
      alert("Erro ao cadastrar vacina.");
    }
  });

document.addEventListener("DOMContentLoaded", carregarVacinas);
