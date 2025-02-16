// Array armazenar as vacinas e suas doses
let vacinas = [];

// Função adicionar a vacina ao array
function registrarDose(nomeVacina, doseAplicada, dataAplicacao) {
    vacinas.push({ nomeVacina, doseAplicada, dataAplicacao });
}

// Função exibir vacinas registradas na página
function exibirVacinas() {
    const lista = document.getElementById('vacinaLista');
    lista.innerHTML = '';

    vacinas.forEach((vacina, index) => {
        const vacinaItem = document.createElement('div');
        vacinaItem.classList.add('vacina-item');
        vacinaItem.innerHTML = `
            <strong>Vacina:</strong> ${vacina.nomeVacina} <br>
            <strong>Dose:</strong> ${vacina.doseAplicada} <br>
            <strong>Data de aplicação:</strong> ${vacina.dataAplicacao} <br><br>
        `;
        lista.appendChild(vacinaItem);
    });
}

    document.getElementById('vacinaForm').addEventListener('submit', function(event) {
    event.preventDefault();


    const nomeVacina = document.getElementById('nomeVacina').value;
    const doseAplicada = document.getElementById('doseAplicada').value;
    const dataAplicacao = document.getElementById('dataAplicacao').value;


    registrarDose(nomeVacina, doseAplicada, dataAplicacao);

  
    document.getElementById('vacinaForm').reset();

   
    exibirVacinas();
});
