// Variáveis globais
let cells = [];
let totalEnergy = 0;
let totalMutation = 0;

const cellsContainer = document.getElementById('cells-container');
const totalCellsSpan = document.getElementById('totalCells');
const totalEnergySpan = document.getElementById('totalEnergy');
const totalMutationSpan = document.getElementById('totalMutation');

// Lista de formatos disponíveis
const shapes = ["circle", "square", "triangle", "hexagon"];

// Criar célula
function addCell() {
  let shape = shapes[Math.floor(Math.random() * shapes.length)];
  let cell = {
    id: cells.length,
    energy: Math.floor(Math.random() * 50) + 10,
    mutation: 0,
    shape: shape
  };
  cells.push(cell);
  renderCells();
  updateStats();
}

// Renderizar células
function renderCells() {
  cellsContainer.innerHTML = '';
  cells.forEach(cell => {
    let cellDiv = document.createElement('div');

    if (cell.shape === "triangle" || cell.shape === "hexagon") {
      // Formas especiais
      cellDiv.className = cell.shape;
    } else {
      // Formas simples
      cellDiv.className = `cell ${cell.shape}`;
    }

    cellDiv.title = `Energia: ${cell.energy} | Mutação: ${cell.mutation}`;
    cellDiv.style.filter = `hue-rotate(${cell.mutation * 30}deg)`;
    cellsContainer.appendChild(cellDiv);
  });
}

// Alimentar células
function feedCells() {
  cells.forEach(cell => {
    let food = Math.floor(Math.random() * 20) + 5;
    cell.energy += food;
    totalEnergy += food;
  });
  updateStats();
  renderCells();
}

// Dividir células
function divideCells() {
  let newCells = [];
  cells.forEach(cell => {
    if (cell.energy >= 50) {
      cell.energy = Math.floor(cell.energy / 2);
      let daughter = { ...cell, id: cells.length + newCells.length };
      newCells.push(daughter);
    }
  });
  cells = cells.concat(newCells);
  updateStats();
  renderCells();
}

// Mutação
function mutateCells() {
  cells.forEach(cell => {
    let mutationChance = Math.random();
    if (mutationChance > 0.7) {
      cell.mutation += 1;
      totalMutation += 1;
    }
  });
  updateStats();
  renderCells();
}

// Atualizar estatísticas
function updateStats() {
  totalCellsSpan.textContent = cells.length;
  totalEnergySpan.textContent = totalEnergy;
  totalMutationSpan.textContent = totalMutation;
}

// Inicializar com 3 células
for (let i = 0; i < 3; i++) addCell();
