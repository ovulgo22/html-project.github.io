const gameArea=document.getElementById('gameArea');
const scoreBoard=document.getElementById('scoreBoard');
const missionsDiv=document.getElementById('missions');
const badgesDiv=document.getElementById('badges');
const researchesDiv=document.getElementById('researches');
const comboBar=document.getElementById('comboBar');
const startBtn=document.getElementById('startBtn');
const upgradeBtn=document.getElementById('upgradeBtn');
const prestigeBtn=document.getElementById('prestigeBtn');
const creditsBtn=document.getElementById('creditsBtn');
const leaderboardBtn=document.getElementById('leaderboardBtn');
const creditsModal=document.getElementById('creditsModal');
const closeModal=document.getElementById('closeModal');
const leaderboardModal=document.getElementById('leaderboardModal');
const closeLeaderboard=document.getElementById('closeLeaderboard');
const leaderboardContent=document.getElementById('leaderboardContent');
const clickSound=document.getElementById('clickSound');
const ambientSound=document.getElementById('ambientSound');

let score=0,level=1,record=localStorage.getItem('spaceBioRecord')||0,prestige=localStorage.getItem('spaceBioPrestige')||0;
let gameInterval,cellSpeed=2000,maxCells=5;
let achievements={first10:false,first50:false,first100:false,firstPrestige:false};
let combo=0,comboTimeout;
let researches=[{name:"Upgrade Pontos",cost:50,multiplier:1.2,bought:false},{name:"Spawn Rápido",cost:100,speed:0.8,bought:false},{name:"Chance Lendária",cost:200,legendary:1.5,bought:false}];
let missions=[{text:"Estude 10 células",goal:10,done:false},{text:"Estude 50 células",goal:50,done:false}];
const cellTypes=[{type:'normal',points:1},{type:'fast',points:2},{type:'resistant',points:3},{type:'legendary',points:10}];

function randomCellType(){let r=Math.random();if(r<0.6)return cellTypes[0];else if(r<0.85)return cellTypes[1];else if(r<0.97)return cellTypes[2];else return cellTypes[3];}

function createCell(){
    let cellData=randomCellType();
    let cell=document.createElement('div');
    cell.classList.add('cell',cellData.type);cell.textContent='C';
    let maxX=gameArea.clientWidth-80; let maxY=gameArea.clientHeight-80;
    let posX=Math.random()*maxX; let posY=Math.random()*maxY;
    cell.style.left=posX+'px'; cell.style.top=posY+'px';
    cell.addEventListener('click',()=>{
        let multiplier=1; researches.forEach(r=>{if(r.bought && r.multiplier) multiplier*=r.multiplier;});
        let points=(cellData.points+prestige)*multiplier;
        score+=Math.floor(points);
        if(score>record){record=score; localStorage.setItem('spaceBioRecord',record);}
        scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;
        clickSound.currentTime=0; clickSound.play();
        createParticles(posX+40,posY+40,cellData.type);
        cell.remove(); checkLevelUp(); checkAchievements(); checkPrestige(); checkMissions(); updateCombo(); updateButtons();
    });
    gameArea.appendChild(cell);
    setTimeout(()=>{if(cell.parentNode){cell.remove();}}, cellData.type==='fast'?3000:5000);
}

function createParticles(x,y,type){for(let i=0;i<8;i++){let p=document.createElement('div');p.classList.add('particle');p.style.width='5px';p.style.height='5px';
p.style.backgroundColor=type==='fast'?'#00ffea':type==='resistant'?'#ff00ff':type==='legendary'?'#ffff00':'#3380ff';
p.style.left=x+'px';p.style.top=y+'px';gameArea.appendChild(p);
let angle=Math.random()*2*Math.PI;let dist=Math.random()*40;let dx=Math.cos(angle)*dist;let dy=Math.sin(angle)*dist;
p.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${dx}px,${dy}px)`,opacity:0}],{duration:500,easing:'ease-out'});
setTimeout(()=>p.remove(),500);}}

function checkLevelUp(){let newLevel=Math.floor(score/50)+1;if(newLevel>level){level=newLevel;cellSpeed=Math.max(300,cellSpeed-150);maxCells++;restartGameInterval();}}
function checkAchievements(){if(score>=10&&!achievements.first10){achievements.first10=true;addBadge("Primeiros 10 pontos!");}if(score>=50&&!achievements.first50){achievements.first50=true;addBadge("50 pontos alcançados!");}if(score>=100&&!achievements.first100){achievements.first100=true;addBadge("100 pontos! Mestre Espacial!");}}
function checkPrestige(){if(score>=1000&&!achievements.firstPrestige){achievements.firstPrestige=true;prestige++;localStorage.setItem('spaceBioPrestige',prestige);score=0;level=1;cellSpeed=2000;maxCells=5;achievements={first10:false,first50:false,first100:false,firstPrestige:true};gameArea.innerHTML='';badgesDiv.innerHTML='';missionsDiv.innerHTML='';researchesDiv.innerHTML='';message("Prestígio conquistado!");updateButtons();}}
function addBadge(text){let b=document.createElement('span');b.classList.add('badge');b.textContent=text;badgesDiv.appendChild(b);}
function checkMissions(){missions.forEach(m=>{if(score>=m.goal&&!m.done){m.done=true;missionsDiv.innerHTML+=`✅ ${m.text}<br>`;}});}
function updateCombo(){combo++;clearTimeout(comboTimeout);comboTimeout=setTimeout(()=>{combo=0; updateComboBar();},2000);updateComboBar();}
function updateComboBar(){let fill=document.getElementById('comboFill');fill.style.width=Math.min(100,combo*20)+'%';}
function upgrade(){if(score>=50){score-=50;cellSpeed=Math.max(300,cellSpeed-300);restartGameInterval();}}
function buyResearch(i){let r=researches[i];if(score>=r.cost && !r.bought){score-=r.cost;r.bought=true;renderResearches();}}
function renderResearches(){researchesDiv.innerHTML='';researches.forEach((r,i)=>{let btn=document.createElement('span');btn.classList.add('research');btn.textContent=r.bought?`${r.name} ✅`:`${r.name} (${r.cost})`;btn.onclick=()=>buyResearch(i);researchesDiv.appendChild(btn);});}
function startGame(){clearInterval(gameInterval);score=0;level=1;cellSpeed=2000;maxCells=5;achievements={first10:false,first50:false,first100:false,firstPrestige:prestige>0};gameArea.innerHTML='';badgesDiv.innerHTML='';missionsDiv.innerHTML='';renderResearches();scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;ambientSound.play();restartGameInterval();updateButtons();}
function restartGameInterval(){clearInterval(gameInterval);gameInterval=setInterval(()=>{let cellsInGame=gameArea.querySelectorAll('.cell').length;if(cellsInGame<maxCells) createCell();},cellSpeed);}
function updateButtons(){upgradeBtn.disabled=score<50;prestigeBtn.disabled=score<1000;}
function message(txt){alert(txt);} // simples modal

// Leaderboard
leaderboardBtn.addEventListener('click',()=>{
    leaderboardModal.style.display='flex';
    let data=JSON.parse(localStorage.getItem('spaceBioLeaderboard')||'[]');
    data.push({score,level,prestige});
    data.sort((a,b)=>b.score-a.score);
    localStorage.setItem('spaceBioLeaderboard',JSON.stringify(data.slice(0,10)));
    leaderboardContent.innerHTML=data.slice(0,10).map((p,i)=>`#${i+1} Pontos: ${p.score} | Nível: ${p.level} | Prestígio: ${p.prestige}`).join('<br>');
});
closeLeaderboard.addEventListener('click',()=>{leaderboardModal.style.display='none';});
creditsBtn.addEventListener('click',()=>{creditsModal.style.display='flex';});
closeModal.addEventListener('click',()=>{creditsModal.style.display='none';});
window.addEventListener('click',(e)=>{if(e.target==creditsModal) creditsModal.style.display='none';if(e.target==leaderboardModal) leaderboardModal.style.display='none';});
startBtn.addEventListener('click',startGame);
upgradeBtn.addEventListener('click',upgrade);
renderResearches();
updateButtons();

// 🚀 Meteoritos e Cometas
function createCosmicEvent(){
    let type=Math.random()<0.7?'meteorite':'comet';
    let event=document.createElement('div');
    event.classList.add('particle');
    let size=type==='meteorite'?20:30;
    event.style.width=size+'px'; event.style.height=size+'px'; event.style.borderRadius='50%';
    event.style.backgroundColor=type==='meteorite'?'#ff4500':'#00ffff';
    let startX=Math.random()*gameArea.clientWidth;
    event.style.left=startX+'px'; event.style.top='-40px';
    gameArea.appendChild(event);
    let speed=type==='meteorite'?2+Math.random()*3:1+Math.random()*2;
    let angle=Math.random()*0.5-0.25;
    function move(){let y=parseFloat(event.style.top); let x=parseFloat(event.style.left);
        if(y>gameArea.clientHeight){event.remove(); return;}
        event.style.top=(y+speed*5)+'px'; event.style.left=(x+angle*5)+'px'; requestAnimationFrame(move);
    }
    move();
    event.addEventListener('click',()=>{
        if(type==='comet'){score+=50; message("Cometa clicado! +50 pontos");}
        else{let cells=gameArea.querySelectorAll('.cell'); if(cells.length>0) cells[Math.floor(Math.random()*cells.length)].remove();}
        event.remove();
        scoreBoard.textContent=`Pontuação: ${score} | Nível: ${level} | Recorde: ${record} | Prestígio: ${prestige}`;
    });
}
setInterval(()=>{if(Math.random()<0.3) createCosmicEvent();},5000);
