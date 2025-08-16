function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let celula of celulas) {
    celula.mover();
    celula.desenhar();
  }

  atualizarContador();
  requestAnimationFrame(animar);
}

animar();
