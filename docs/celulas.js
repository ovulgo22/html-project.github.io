const canvas = document.getElementById("bioCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 250;
canvas.height = window.innerHeight - 150;

let celulas = [];
const maxCelulas = 100;

const signos = [
  "♈ Áries", "♉ Touro", "♊ Gêmeos", "♋ Câncer",
  "♌ Leão", "♍ Virgem", "♎ Libra", "♏ Escorpião",
  "♐ Sagitário", "♑ Capricórnio", "♒ Aquário", "♓ Peixes"
];

class Celula {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.raio = 12 + Math.random() * 15;
    this.tipo = tipo;
    this.velX = (Math.random() - 0.5) * 2;
    this.velY = (Math.random() - 0.5) * 2;
    this.vida = 400 + Math.random() * 600;
    this.tempoDivisao = 200 + Math.random() * 400;
    this.signo = signos[Math.floor(Math.random() * signos.length)];
    this.cor = this.definirCor();
  }

  definirCor() {
    switch (this.tipo) {
      case "circulo": return "#21e6c1";
      case "quadrado": return "#e43f5a";
      case "triangulo": return "#3a86ff";
      case "estrela": return "#fddb3a";
      default: return "#ffffff";
    }
  }

  desenhar() {
    ctx.fillStyle = this.cor;
    ctx.beginPath();

    if (this.tipo === "circulo") {
      ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.tipo === "quadrado") {
      ctx.fillRect(this.x - this.raio, this.y - this.raio, this.raio * 2, this.raio * 2);
    } else if (this.tipo === "triangulo") {
      ctx.moveTo(this.x, this.y - this.raio);
      ctx.lineTo(this.x - this.raio, this.y + this.raio);
      ctx.lineTo(this.x + this.raio, this.y + this.raio);
      ctx.closePath();
      ctx.fill();
    } else if (this.tipo === "estrela") {
      let spikes = 5;
      let outer = this.raio;
      let inner = this.raio / 2;
      let rot = Math.PI / 2 * 3;
      let step = Math.PI / spikes;

      ctx.moveTo(this.x, this.y - outer);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(this.x + Math.cos(rot) * outer, this.y + Math.sin(rot) * outer);
        rot += step;
        ctx.lineTo(this.x + Math.cos(rot) * inner, this.y + Math.sin(rot) * inner);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  mover() {
    this.x += this.velX * parseFloat(document.getElementById("velocidade").value);
    this.y += this.velY * parseFloat(document.getElementById("velocidade").value);

    if (this.x < this.raio || this.x > canvas.width - this.raio) this.velX *= -1;
    if (this.y < this.raio || this.y > canvas.height - this.raio) this.velY *= -1;

    this.vida--;
    this.tempoDivisao--;

    if (this.vida <= 0) this.morrer();
    if (this.tempoDivisao <= 0) this.dividir();
  }

  dividir() {
    if (celulas.length < maxCelulas) {
      let nova = new Celula(this.x + 5, this.y + 5, this.tipo);

      // mutação genética
      let chanceMut = parseInt(document.getElementById("mutacao").value);
      if (Math.random() * 100 < chanceMut) {
        nova.tipo = ["circulo", "quadrado", "triangulo", "estrela"][Math.floor(Math.random() * 4)];
        nova.cor = nova.definirCor();
        nova.raio *= 1.2;
      }

      celulas.push(nova);
      this.tempoDivisao = 200 + Math.random() * 400;
    }
  }

  morrer() {
    let index = celulas.indexOf(this);
    if (index > -1) {
      celulas.splice(index, 1);
    }
  }
}
