let score = 0, level = 1, record = 0, prestige = 0, combo = 0;
let gameArea = document.getElementById('gameArea');
let scoreBoard = document.getElementById('scoreBoard');
let comboFill = document.getElementById('comboFill');
let badgesDiv = document.getElementById('badges');
let researchesDiv = document.getElementById('researches');

let achievements = {};
let researches = [
    {name:'Pesquisa Básica', cost:50, bought:false, multiplier:1.2},
    {name:'Pesquisa Avançada', cost:150, bought:false, multiplier:1.5},
    {name:'Pesquisa Genética', cost:300, bought:false, multiplier:2}
];

let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function updateHUD(){
    scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;
    comboFill.style.width=Math.min(combo*20,100)+'%';
}

function addBadge(name){
    let badge=document.createElement('span');
    badge.classList.add('badge'); badge.textContent=name;
    badgesDiv.appendChild(badge);
}

function spawnCell(){
    let cell = document.createElement('div');
    cell.classList.add('cell');
    let types=['normal','fast','resistant','legendary'];
    let type = types[Math.floor(Math.random()*types.length)];
    cell.classList.add(type);

    let size = gameArea.clientWidth*0.1 + Math.random()*20;
    cell.style.width=size+'px'; cell.style.height=size+'px';
    cell.style.left=Math.random()*(gameArea.clientWidth-size)+'px';
    cell.style.top=Math.random()*(gameArea.clientHeight-size)+'px';

    // Define datasets
    cell.dataset.type = type;
    cell.dataset.speed = 1;
    cell.dataset.multiplier = 1;

    // Clique funcional
    cell.addEventListener('click',()=>{
        let t = cell.dataset.type;
        playSound(t==='normal'?'clickNormal':
                  t==='fast'?'clickFast':
                  t==='resistant'?'clickResistant':'clickLegendary');
        let mult = parseFloat(cell.dataset.multiplier);
        let gain = Math.floor(10*mult);
        score += gain; combo++; updateHUD();
        checkAchievements();
        checkLevelUp();
        cell.remove();
        spawnCell();
    });

    gameArea.appendChild(cell);
}

function checkAchievements(){
    if(combo>=5 && !achievements.comboMaster){achievements.comboMaster=true; addBadge("Combo Master!");}
    if(score>=500 && !achievements.spaceExplorer){achievements.spaceExplorer=true; addBadge("Space Explorer!");}
}

function checkLevelUp(){
    if(score>=level*100){
        level++;
        addBadge("Nível "+level);
        updateHUD();
    }
}

function buyResearch(index){
    let r=researches[index];
    if(score>=r.cost && !r.bought){
        score-=r.cost;
        r.bought=true;
        addBadge("Pesquisa: "+r.name);
        updateHUD();
    }
}

function doPrestige(){
    if(score>=1000){
        prestige++; score=0; level=1; combo=0;
        addBadge("Prestígio "+prestige);
        updateHUD();
    }
}

function saveLeaderboard(){
    leaderboard.push({score:score,prestige:prestige,date:new Date().toLocaleDateString()});
    leaderboard.sort((a,b)=>b.score-a.score);
    leaderboard=leaderboard.slice(0,10);
    localStorage.setItem('leaderboard',JSON.stringify(leaderboard));
}

function showLeaderboard(){
    let content=document.getElementById('leaderboardContent');
    content.innerHTML='';
    leaderboard.forEach((entry,i)=>{
        let div=document.createElement('div');
        div.textContent=`${i+1}. Pontos: ${entry.score} | Prestígio: ${entry.prestige} | ${entry.date}`;
        content.appendChild(div);
    });
}

// Botões
document.getElementById('startBtn').addEventListener('click',()=>spawnCell());
document.getElementById('upgradeBtn').addEventListener('click',()=>buyResearch(0));
document.getElementById('prestigeBtn').addEventListener('click',()=>doPrestige());
document.getElementById('creditsBtn').addEventListener('click',()=>document.getElementById('creditsModal').style.display='flex');
document.getElementById('leaderboardBtn').addEventListener('click',()=>{showLeaderboard();document.getElementById('leaderboardModal').style.display='flex';});
document.getElementById('closeModal').addEventListener('click',()=>document.getElementById('creditsModal').style.display='none');
document.getElementById('closeLeaderboard').addEventListener('click',()=>document.getElementById('leaderboardModal').style.display='none');

updateHUD();
