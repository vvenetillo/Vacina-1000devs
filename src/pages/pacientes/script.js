var cpfElement = document.getElementById("cpf");
var maskOptions = { mask: "000.000.000-00" };
var maskCPF = IMask(cpfElement, maskOptions);
document
  .getElementById("formPaciente")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const cpfElement = document.getElementById("cpf");
    const cpfValue = cpfElement.value.replace(/\D/g, ""); 
    const cpfError = document.getElementById("cpfError");

    if (cpfValue.length !== 11) {
      cpfError.style.display = "block";
      return;
    } else {
      cpfError.style.display = "none";
    }

    const dataNascimentoInput = document.getElementById("data_nascimento").value;
    const dataNascimentoFormatada = new Date(dataNascimentoInput)
      .toISOString()
      .split("T")[0]

    const paciente = {
      nome: document.getElementById("nome").value,
      cpf: cpfValue, 
      sexo: document.getElementById("sexo").value,
      data_nascimento: dataNascimentoFormatada, 
    };
    
    try {
      const response = await fetch(
        "http://localhost:8080/paciente/inserir",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paciente),
          
        }
        
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao cadastrar paciente. Verifique os dados e tente novamente."
        );
      }

      alert("Paciente cadastrado com sucesso!");
      window.location.href = "../listar-pacientes/index.html";
    } catch (error) {
      alert(error.message);
    }
  });