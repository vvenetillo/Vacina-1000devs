document.addEventListener("DOMContentLoaded", async function () {
  const lista = document.getElementById("pacientes");

  try {
    const response = await fetch("http://localhost:8080/paciente/consultar");
    if (!response.ok) throw new Error("Erro ao carregar pacientes");

    const pacientes = await response.json();

    lista.innerHTML = ""; // Limpa lista antes de renderizar

    pacientes.forEach((paciente) => {
      const item = document.createElement("li");
      item.className =
        "list-group-item d-flex justify-content-between align-items-center";
      item.innerHTML = `
                        <strong>Nome:</strong> ${paciente.nome} <br>
                        <strong>CPF:</strong> ${paciente.cpf} <br>
                        <strong>Sexo:</strong> ${paciente.sexo} <br>
                        <strong>Data de Nascimento:</strong> ${paciente.dataNascimento}
                        <div>
                            <button class="btn btn-danger btn-sm" onclick="excluirPaciente(${paciente.id})">Excluir</button>
                        </div>
                    `;
      lista.appendChild(item);
    });
  } catch (error) {
    alert(error.message);
  }
});

async function excluirPaciente(id) {
  console.log("Tentando excluir o paciente com ID:", id); // Debug

  if (!confirm("Tem certeza que deseja excluir este paciente?")) return;

  try {
    const response = await fetch(
      `http://localhost:8080/paciente/excluir/${id}`,
      {
        method: "DELETE",
      }
    );

    console.log("Resposta do servidor:", response);

    if (!response.ok) throw new Error("Erro ao excluir paciente");

    alert("Paciente excluído com sucesso!");
    location.reload();
  } catch (error) {
    alert(error.message);
  }
}
