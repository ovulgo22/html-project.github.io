// === Sons Avançados e Imersivos ===
const sounds = {
    clickNormal: new Audio('https://freesound.org/data/previews/522/522640_945474-lq.mp3'),
    clickFast: new Audio('https://freesound.org/data/previews/522/522641_945474-lq.mp3'),
    clickResistant: new Audio('https://freesound.org/data/previews/522/522642_945474-lq.mp3'),
    clickLegendary: new Audio('https://freesound.org/data/previews/522/522643_945474-lq.mp3'),
    meteorite: new Audio('https://freesound.org/data/previews/320/320654_512123-lq.mp3'),
    comet: new Audio('https://freesound.org/data/previews/320/320655_512123-lq.mp3'),
    superComet: new Audio('https://freesound.org/data/previews/522/522644_945474-lq.mp3'),
    miniExplosion: new Audio('https://freesound.org/data/previews/522/522645_945474-lq.mp3'),
    ambient: new Audio('https://freesound.org/data/previews/341/341695_62405-lq.mp3')
};

// Configurações de volume e loop
sounds.ambient.loop = true;
sounds.ambient.volume = 0.3;
sounds.ambient.play();

// Função para tocar sons
function playSound(type){
    if(sounds[type]){
        sounds[type].currentTime = 0;
        sounds[type].volume = (type==='superComet' || type==='miniExplosion') ? 1 : 0.5;
        sounds[type].play();
    }
}

// Sons ao clicar nas células
document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('cell')){
        let cls = e.target.classList.contains('normal')?'clickNormal':
                  e.target.classList.contains('fast')?'clickFast':
                  e.target.classList.contains('resistant')?'clickResistant':'clickLegendary';
        playSound(cls);
    }
});

// Sons ao clicar em partículas (meteoritos e cometas)
document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('particle')){
        playSound('meteorite');
    }
});

// Funções específicas para eventos especiais
function playSuperCometSound(){ playSound('superComet'); }
function playMiniExplosionSound(){ playSound('miniExplosion'); }
