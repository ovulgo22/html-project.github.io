// === Advanced Cosmic Effects ===
const advancedParticles = [];
const maxStars = 100;

// Cria estrelas de fundo animadas
function createStars(){
    for(let i=0;i<maxStars;i++){
        let star=document.createElement('div');
        star.classList.add('particle');
        star.style.width='2px'; star.style.height='2px';
        star.style.backgroundColor='#ffffff';
        star.style.opacity=Math.random();
        star.style.left=Math.random()*gameArea.clientWidth+'px';
        star.style.top=Math.random()*gameArea.clientHeight+'px';
        gameArea.appendChild(star);
        advancedParticles.push({el:star,speed:0.1+Math.random()*0.3});
    }
}

// Atualiza posição das estrelas
function animateStars(){
    advancedParticles.forEach(star=>{
        let y=parseFloat(star.el.style.top);
        y+=star.speed;
        if(y>gameArea.clientHeight) y=0;
        star.el.style.top=y+'px';
    });
    requestAnimationFrame(animateStars);
}

// Evento especial: Super Cometa
function superComet(){
    let comet=document.createElement('div');
    comet.classList.add('particle');
    comet.style.width='40px'; comet.style.height='40px'; comet.style.borderRadius='50%';
    comet.style.backgroundColor='#ffdd00';
    comet.style.left=Math.random()*gameArea.clientWidth+'px';
    comet.style.top='-50px';
    gameArea.appendChild(comet);
    let speed=3+Math.random()*2;
    let angle=Math.random()*0.5-0.25;

    // Ao clicar, multiplica pontos por 10 por 10 segundos
    comet.addEventListener('click',()=>{
        message("Super Cometa! Pontos x10 por 10s!");
        let oldMultiplier = researches.reduce((m,r)=>r.bought&&r.multiplier?m*r.multiplier:m,1);
        let tempMultiplier = oldMultiplier*10;
        scoreBoard.style.color='#ffdd00';
        setTimeout(()=>{scoreBoard.style.color='#fff';},10000);

        // Aplica multiplicador temporário
        const tempInterval = setInterval(()=>{score+=0;scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;},100);
        setTimeout(()=>clearInterval(tempInterval),10000);
        comet.remove();
    });

    function move(){
        let y=parseFloat(comet.style.top);
        let x=parseFloat(comet.style.left);
        if(y>gameArea.clientHeight){comet.remove();return;}
        comet.style.top=(y+speed*5)+'px';
        comet.style.left=(x+angle*5)+'px';
        requestAnimationFrame(move);
    }
    move();
}

// Evento aleatório de mini explosão
function miniExplosion(){
    let count=5+Math.floor(Math.random()*5);
    for(let i=0;i<count;i++){
        createCell();
    }
    message("Mini explosão! Novas células!");
}

// Conquistas dinâmicas
function checkAdvancedAchievements(){
    if(combo>=5 && !achievements.comboMaster){achievements.comboMaster=true; addBadge("Combo Master!");}
    if(score>=500 && !achievements.spaceExplorer){achievements.spaceExplorer=true; addBadge("Space Explorer!");}
}

// Efeito de combo visual
function comboVisualEffect(){
    if(combo>=5){
        gameArea.style.boxShadow='0 0 20px #00ffea';
        setTimeout(()=>{gameArea.style.boxShadow='0 0 0px #0b0c2a';},300);
    }
}

// === Inicialização ===
createStars();
animateStars();

// Eventos aleatórios
setInterval(()=>{
    if(Math.random()<0.05) superComet();
    if(Math.random()<0.1) miniExplosion();
    checkAdvancedAchievements();
    comboVisualEffect();
},7000);
