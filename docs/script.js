const canvas = document.getElementById("bioCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let celulas = [];

class Celula {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.raio = 15 + Math.random() * 15;
    this.tipo = tipo;
    this.velX = (Math.random() - 0.5) * 2;
    this.velY = (Math.random() - 0.5) * 2;
    this.cor = this.definirCor();
    this.vida = 500 + Math.random() * 800; // vida útil
    this.tempoDivisao = 200 + Math.random() * 500; // quando se divide
  }

  definirCor() {
    switch (this.tipo) {
      case "circulo": return "#21e6c1";
      case "quadrado": return "#e43f5a";
      case "estrela": return "#fddb3a";
      case "triangulo": return "#3a86ff";
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
      let outerRadius = this.raio;
      let innerRadius = this.raio / 2;
      let rot = Math.PI / 2 * 3;
      let step = Math.PI / spikes;

      ctx.moveTo(this.x, this.y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(this.x + Math.cos(rot) * outerRadius, this.y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(this.x + Math.cos(rot) * innerRadius, this.y + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  mover() {
    this.x += this.velX;
    this.y += this.velY;

    if (this.x < this.raio || this.x > canvas.width - this.raio) this.velX *= -1;
    if (this.y < this.raio || this.y > canvas.height - this.raio) this.velY *= -1;

    this.vida--;

    if (this.vida <= 0) {
      this.morrer();
    }

    this.tempoDivisao--;
    if (this.tempoDivisao <= 0) {
      this.dividir();
    }
  }

  dividir() {
    if (this.raio > 10) {
      celulas.push(new Celula(this.x + 5, this.y + 5, this.tipo));
      this.tempoDivisao = 200 + Math.random() * 500;
    }
  }

  morrer() {
    let index = celulas.indexOf(this);
    if (index > -1) {
      celulas.splice(index, 1);
    }
  }
}

// ---------- Interações biológicas ----------
function interacoes() {
  for (let i = 0; i < celulas.length; i++) {
    for (let j = i + 1; j < celulas.length; j++) {
      let a = celulas[i];
      let b = celulas[j];

      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      // Fagocitose
      if (dist < a.raio && a.raio > b.raio * 1.3) {
        a.raio += b.raio * 0.2; // cresce ao comer
        b.morrer();
      }
      if (dist < b.raio && b.raio > a.raio * 1.3) {
        b.raio += a.raio * 0.2;
        a.morrer();
      }

      // Fusão (mesma cor)
      if (dist < a.raio + b.raio && a.cor === b.cor) {
        a.raio += b.raio * 0.3;
        b.morrer();
      }
    }
  }
}

function adicionarCelula(tipo) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  celulas.push(new Celula(x, y, tipo));
}

function limparCelulas() {
  celulas = [];
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let celula of celulas) {
    celula.mover();
    celula.desenhar();
  }

  interacoes();
  requestAnimationFrame(animar);
}

animar();
