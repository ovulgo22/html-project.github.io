const gameArea=document.getElementById('gameArea');
const scoreBoard=document.getElementById('scoreBoard');
const message=document.getElementById('message');
const badgesDiv=document.getElementById('badges');
const missionsDiv=document.getElementById('missions');
const researchesDiv=document.getElementById('researches');
const comboBar=document.getElementById('comboBar');
const startBtn=document.getElementById('startBtn');
const upgradeBtn=document.getElementById('upgradeBtn');
const creditsBtn=document.getElementById('creditsBtn');
const creditsModal=document.getElementById('creditsModal');
const closeModal=document.getElementById('closeModal');
const clickSound=document.getElementById('clickSound');
const ambientSound=document.getElementById('ambientSound');

let score=0,level=1,record=localStorage.getItem('spaceBioRecord')||0,prestige=localStorage.getItem('spaceBioPrestige')||0;
let gameInterval,cellSpeed=2000,maxCells=5;
let achievements={first10:false,first50:false,first100:false,firstPrestige:false};
let combo=0,comboTimeout;
let researches=[{name:"Upgrade Pontos",cost:50,multiplier:1.2},{name:"Spawn Rápido",cost:100,speed:0.8},{name:"Chance Lendária",cost:200,legendary:1.5}];
let missions=[{text:"Estude 10 células",goal:10,done:false},{text:"Estude 50 células",goal:50,done:false}];

const cellTypes=[{type:'normal',points:1},{type:'fast',points:2},{type:'resistant',points:3},{type:'legendary',points:10}];

function randomCellType(){
    let r=Math.random();
    if(r<0.6)return cellTypes[0];
    else if(r<0.85)return cellTypes[1];
    else if(r<0.97)return cellTypes[2];
    else return cellTypes[3];
}

function createCell(){
    let cellData=randomCellType();
    let cell=document.createElement('div');
    cell.classList.add('cell',cellData.type);cell.textContent='C';
    let maxX=gameArea.clientWidth-80; let maxY=gameArea.clientHeight-80;
    let posX=Math.random()*maxX; let posY=Math.random()*maxY;
    cell.style.left=posX+'px'; cell.style.top=posY+'px';

    cell.addEventListener('click',()=>{
        let multiplier=1;
        researches.forEach(r=>{if(r.bought && r.multiplier) multiplier*=r.multiplier;});
        let points=(cellData.points+prestige)*multiplier;
        score+=Math.floor(points);
        if(score>record){record=score; localStorage.setItem('spaceBioRecord',record);}
        scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;
        message.textContent=`Você estudou uma célula ${cellData.type}!`;
        clickSound.currentTime=0; clickSound.play();
        createParticles(posX+40,posY+40,cellData.type);
        cell.remove(); checkLevelUp(); checkAchievements(); checkPrestige(); checkMissions(); updateCombo();
    });

    gameArea.appendChild(cell);
    setTimeout(()=>{if(cell.parentNode){cell.remove(); message.textContent=`Uma célula ${cellData.type} escapou!`; }}, cellData.type==='fast'?3000:5000);
}

function createParticles(x,y,type){for(let i=0;i<8;i++){let p=document.createElement('div');p.classList.add('particle');p.style.width='5px';p.style.height='5px';
p.style.backgroundColor=type==='fast'?'#00ffea':type==='resistant'?'#ff00ff':type==='legendary'?'#ffff00':'#3380ff';
p.style.left=x+'px';p.style.top=y+'px';gameArea.appendChild(p);
let angle=Math.random()*2*Math.PI;let dist=Math.random()*40;let dx=Math.cos(angle)*dist;let dy=Math.sin(angle)*dist;
p.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${dx}px,${dy}px)`,opacity:0}],{duration:500,easing:'ease-out'});
setTimeout(()=>p.remove(),500);}}

function checkLevelUp(){let newLevel=Math.floor(score/50)+1;if(newLevel>level){level=newLevel;cellSpeed=Math.max(300,cellSpeed-150);maxCells++;message.textContent=`Você atingiu o nível ${level}!`;restartGameInterval();}}

function checkAchievements(){if(score>=10&&!achievements.first10){achievements.first10=true;addBadge("Primeiros 10 pontos!");}if(score>=50&&!achievements.first50){achievements.first50=true;addBadge("50 pontos alcançados!");}if(score>=100&&!achievements.first100){achievements.first100=true;addBadge("100 pontos! Mestre Espacial!");}}

function checkPrestige(){if(score>=1000&&!achievements.firstPrestige){achievements.firstPrestige=true;prestige++;localStorage.setItem('spaceBioPrestige',prestige);score=0;level=1;cellSpeed=2000;maxCells=5;achievements={first10:false,first50:false,first100:false,firstPrestige:true};gameArea.innerHTML='';badgesDiv.innerHTML='';missionsDiv.innerHTML='';researchesDiv.innerHTML='';message.textContent="Prestígio conquistado! Bônus permanentes recebidos!";scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;}}

function addBadge(text){let b=document.createElement('span');b.classList.add('badge');b.textContent=text;badgesDiv.appendChild(b);}

function checkMissions(){missions.forEach(m=>{if(score>=m.goal&&!m.done){m.done=true;missionsDiv.innerHTML+=`✅ ${m.text}<br>`;}});}

function updateCombo(){combo++;clearTimeout(comboTimeout);comboTimeout=setTimeout(()=>{combo=0; updateComboBar();},2000);updateComboBar();}
function updateComboBar(){let fill=document.getElementById('comboFill');if(!fill){fill=document.createElement('div');fill.id='comboFill';comboBar.appendChild(fill);}fill.style.width=Math.min(100,combo*20)+'%';}

function upgrade(){cellSpeed=Math.max(300,cellSpeed-300);message.textContent="As células estão se multiplicando mais rápido!";restartGameInterval();}

function buyResearch(i){let r=researches[i];if(score>=r.cost && !r.bought){score-=r.cost;r.bought=true;message.textContent=`Pesquisa ${r.name} adquirida!`;renderResearches();}}

function renderResearches(){researchesDiv.innerHTML='';researches.forEach((r,i)=>{let btn=document.createElement('span');btn.classList.add('research');btn.textContent=r.bought?`${r.name} ✅`:`${r.name} (${r.cost})`;btn.onclick=()=>buyResearch(i);researchesDiv.appendChild(btn);});}

function startGame(){clearInterval(gameInterval);score=0;level=1;cellSpeed=2000;maxCells=5;achievements={first10:false,first50:false,first100:false,firstPrestige:prestige>0};gameArea.innerHTML='';badgesDiv.innerHTML='';missionsDiv.innerHTML='';researchesDiv.innerHTML='';renderResearches();scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;message.textContent="O estudo espacial começou!";ambientSound.play();restartGameInterval();}

function restartGameInterval(){clearInterval(gameInterval);gameInterval=setInterval(()=>{let cellsInGame=gameArea.querySelectorAll('.cell').length;if(cellsInGame<maxCells) createCell();},cellSpeed);}

// Créditos modal
creditsBtn.addEventListener('click',()=>{creditsModal.style.display='flex';});
closeModal.addEventListener('click',()=>{creditsModal.style.display='none';});
window.addEventListener('click',(e)=>{if(e.target==creditsModal) creditsModal.style.display='none';});

startBtn.addEventListener('click',startGame);
upgradeBtn.addEventListener('click',upgrade);
renderResearches();
