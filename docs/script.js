const canvas = document.getElementById("bioCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let celulas = [];
const maxCelulas = 100;

const signos = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
];

class Celula {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.raio = 12 + Math.random() * 12;
    this.tipo = tipo;
    this.velX = (Math.random() - 0.5) * 2;
    this.velY = (Math.random() - 0.5) * 2;
    this.cor = this.definirCor();
    this.vida = 600 + Math.random() * 600;
    this.tempoDivisao = 200 + Math.random() * 500;
    this.signo = signos[Math.floor(Math.random() * signos.length)];
    this.energia = 100;
    this.infectada = Math.random() < 0.05; // 5% já nascem infectadas
  }

  definirCor() {
    const cores = ["#21e6c1", "#e43f5a", "#fddb3a", "#3a86ff", "#9d4edd", "#ff7b00"];
    return cores[Math.floor(Math.random() * cores.length)];
  }

  desenhar() {
    ctx.fillStyle = this.infectada ? "#ff0000" : this.cor;
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
    this.energia--;

    if (this.vida <= 0 || this.energia <= 0) {
      this.morrer();
    }

    this.tempoDivisao--;
    if (this.tempoDivisao <= 0) {
      this.dividir();
    }

    // Mutação genética aleatória
    if (Math.random() < 0.001) {
      this.mutar();
    }
  }

  dividir() {
    if (celulas.length < maxCelulas) {
      celulas.push(new Celula(this.x + 5, this.y + 5, this.tipo));
    }
    this.tempoDivisao = 200 + Math.random() * 500;
  }

  morrer() {
    let index = celulas.indexOf(this);
    if (index > -1) celulas.splice(index, 1);
  }

  mutar() {
    const formas = ["circulo", "quadrado", "triangulo", "estrela"];
    this.tipo = formas[Math.floor(Math.random() * formas.length)];
    this.cor = this.definirCor();
    this.raio = 8 + Math.random() * 20;
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

      // Infecção viral
      if (dist < a.raio + b.raio && (a.infectada || b.infectada)) {
        if (Math.random() < 0.05) {
          a.infectada = true;
          b.infectada = true;
        }
      }

      // Fusão cósmica (mesmo signo)
      if (dist < a.raio + b.raio && a.signo === b.signo) {
        a.raio += b.raio * 0.2;
        b.morrer();
      }

      // Fagocitose agressiva (Áries e Escorpião comem células menores)
      if ((a.signo === "Áries" || a.signo === "Escorpião") && dist < a.raio && a.raio > b.raio * 1.3) {
        a.raio += b.raio * 0.3;
        b.morrer();
      }
      if ((b.signo === "Áries" || b.signo === "Escorpião") && dist < b.raio && b.raio > a.raio * 1.3) {
        b.raio += a.raio * 0.3;
        a.morrer();
      }
    }
  }
}

// ---------- Funções globais ----------
function adicionarCelula(tipo) {
  if (celulas.length < maxCelulas) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    celulas.push(new Celula(x, y, tipo));
  }
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
