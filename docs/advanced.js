// === Efeitos cósmicos e funcionalidades avançadas ===
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

// Evento Super Cometa
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

    // Clique ativa multiplicador temporário
    comet.addEventListener('click',()=>{
        playSound('superComet');
        message("Super Cometa! Pontos x10 por 10s!");
        let tempMultiplier=10;
        let interval=setInterval(()=>{score+=0; updateHUD();},100);
        setTimeout(()=>clearInterval(interval),10000);
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

// Mini explosão de células
function miniExplosion(){
    playSound('miniExplosion');
    let count=5+Math.floor(Math.random()*5);
    for(let i=0;i<count;i++){
        spawnCell();
    }
    message("Mini explosão! Novas células!");
}

// Mensagem temporária na tela
function message(text){
    let msg=document.createElement('div');
    msg.textContent=text;
    msg.style.position='absolute';
    msg.style.top='10%';
    msg.style.left='50%';
    msg.style.transform='translateX(-50%)';
    msg.style.color='#ffea00';
    msg.style.fontSize='4vw';
    msg.style.fontWeight='bold';
    gameArea.appendChild(msg);
    setTimeout(()=>msg.remove(),2000);
}

// Conquistas avançadas
function checkAdvancedAchievements(){
    if(combo>=10 && !achievements.comboMaster2){achievements.comboMaster2=true; addBadge("Combo Expert!");}
    if(score>=1000 && !achievements.galaxyExplorer){achievements.galaxyExplorer=true; addBadge("Galaxy Explorer!");}
}

// Efeito visual de combo
function comboVisualEffect(){
    if(combo>=5){
        gameArea.style.boxShadow='0 0 20px #00ffea';
        setTimeout(()=>{gameArea.style.boxShadow='0 0 0px #0b0c2a';},300);
    }
}

// Inicialização de efeitos
createStars();
animateStars();

// Eventos aleatórios cósmicos
setInterval(()=>{
    if(Math.random()<0.05) superComet();
    if(Math.random()<0.1) miniExplosion();
    checkAdvancedAchievements();
    comboVisualEffect();
},7000);
