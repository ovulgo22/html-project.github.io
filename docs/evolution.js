// === Sistema de Evolução e IA das células ===
const evolutionTree=[
    {name:'Célula Básica', speed:1, multiplier:1},
    {name:'Célula Rápida', speed:1.5, multiplier:1.2},
    {name:'Célula Resistente', speed:0.8, multiplier:1.5},
    {name:'Célula Lendária', speed:1, multiplier:2.5}
];

function evolveCell(cell){
    let index=evolutionTree.findIndex(e=>e.name===cell.dataset.type);
    if(index<evolutionTree.length-1){
        let next=evolutionTree[index+1];
        cell.dataset.type=next.name;
        cell.style.background=`radial-gradient(circle, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #0b0c2a 100%)`;
        cell.dataset.speed=next.speed;
        cell.dataset.multiplier=next.multiplier;
    }
}

// IA básica: células autônomas
function autonomousCells(){
    document.querySelectorAll('.cell').forEach(cell=>{
        if(Math.random()<0.01){ // chance de ação
            let x=parseFloat(cell.style.left);
            let y=parseFloat(cell.style.top);
            x+=Math.random()*20-10;
            y+=Math.random()*20-10;
            x=Math.max(0,Math.min(gameArea.clientWidth-20,x));
            y=Math.max(0,Math.min(gameArea.clientHeight-20,y));
            cell.style.left=x+'px';
            cell.style.top=y+'px';
        }
    });
    requestAnimationFrame(autonomousCells);
}
autonomousCells();
