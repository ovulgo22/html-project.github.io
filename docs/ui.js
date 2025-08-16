function adicionarCelulaAleatoria() {
  if (celulas.length < maxCelulas) {
    let tipos = ["circulo", "quadrado", "triangulo", "estrela"];
    let tipo = tipos[Math.floor(Math.random() * tipos.length)];
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    celulas.push(new Celula(x, y, tipo));
  }
}

function limparCelulas() {
  celulas = [];
}

function atualizarContador() {
  document.getElementById("contador").textContent = celulas.length;
}
