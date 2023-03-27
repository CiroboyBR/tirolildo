
const mapaX_Total = window.innerWidth
const mapaY_Total = window.innerHeight;
const mapaX = mapaX_Total;
const mapaY = (mapaY_Total - (mapaY_Total / 5));
const somTiro = new Audio('audio/somTiro3.mp3');
const somExplosao = new Audio('audio/somExplosao2.mp3');
const somExplosaoJogador = new Audio('audio/explosaoJogador.mp3');
var velDisparosJogador = 7;
var qtdDisparos = 20;
var qtdMonstros = 20;

var pontos = 0;
var inimigosEliminados = 0;
var dtInicio = new Date();
var velMonstros = 0;
var jogoIniciado = false;
var nomeJogadorDigitado = false;
var atiraAutomatico = false;
var nomeJogador = "";
var button;
var statusMovimento = 'P';
var coresMonstros = ["green", "red", "magenta", "blue", "gray", "cyan", "white", "orange"];

// const mapaX = 512
// const mapaY = 512
//classe utilizada para o disparo do jogador
class Disparo {
    constructor(tam, direcao, dano, velocidade, x, y) {
        this.tam = tam;
        this.direcao = direcao;
        this.dano = dano;
        this.velocidade = velocidade;
        this.x = x;
        this.y = y;
    }

    desenha() {
        fill("black");
        rect(this.x, this.y, 4, 8);
    }
}
//Classe utilizada para popular o mapa com personagens
class Personagem {
    constructor(x, y, tam, nome, classe, direcao, velocidade, cor) {
        this.x = x;
        this.y = y;
        this.tam = tam;
        this.classe = classe;
        this.direcao = direcao; //C = cima, B = Baixo, D = dir, E = esq
        this.velocidade = velocidade;
        this.cor = cor;
    }

    desenha() {
        // Desenho do personagen
        fill(this.cor);
        rect(this.x, this.y, 32, 32);
        fill("black");
        square(this.x + 5, this.y + 10, 5);
        fill("black");
        square(this.x + 20, this.y + 10, 5);
        fill("black");
        rect(this.x + 5, this.y + 20, 20, 5);

        if (this.direcao == 'C') {
            fill("black");
            rect(this.x, this.y - 10, 5, 10);
        } else if (this.direcao == 'E') {
            fill("black");
            rect(this.x - 10, this.y, 10, 5);
        } else if (this.direcao == 'D') {
            fill("black");
            rect(this.x + 32, this.y, 10, 5);
        } else if (this.direcao == 'B') {
            fill("black");
            rect(this.x, this.y + 32, 5, 10);
        }
    }
}

//Cria o personagem
var p1 = new Personagem(mapaX / 2, mapaY - 32, 32, "Norris", "Atirador", 'C', 5, "yellow");

//Cria os monstros iniciais
var arrayMonstros = [];
//disparos
var arrayDisparos = [];
// tabela de ranks
var arrayRanking = []

for (let i = 0; i < 20; i++)
    arrayMonstros.push(new Personagem(Math.random() * (mapaX - 32), 0, 32, "Inimigo", "Monstro", 'B', Math.random() * 3 + 3, "green"))

function reinicializaCenario() {
    pontos = 0;
    inimigosEliminados = 0;
    dtInicio = new Date();
    velMonstros = 0;
    botaoReiniciar.position(-200, -200); //DESENHA O BOTAO FORA DA TELA

    p1 = new Personagem(mapaX / 2, mapaY - 32, 32, "Norris", "Atirador", 'C', 5, "yellow");

    while (arrayMonstros.length > 0)
        arrayMonstros.splice(0, 1);

    while (arrayDisparos.length > 0)
        arrayDisparos.splice(0, 1);

    for (let i = 0; i < 20; i++)
        arrayMonstros.push(new Personagem(Math.random() * (mapaX - 32), 0, 32, "Inimigo", "Monstro", 'B', Math.random() * 3 + 3, "green"))
}

//Função setup da P5 para criar o canvas
//Função obrigatória da lib P5
function setup() {
    createCanvas(mapaX, mapaY);
    frameRate(60); // Define a taxa de quadros como 60 FPS
    pixelDensity(1)

    input = createInput();
    input.position(mapaX / 2, mapaY / 2);
    input.size(200, 30);
    input.style('font-size', '16px');
    button = createButton('INICIAR');
    button.position(mapaX / 2, mapaY / 2 + 80);
    button.size(200, 50);
    button.mousePressed(iniciaJogo);
    botaoReiniciar = createButton('REINICIAR');
    botaoReiniciar.size(200, 50);
    botaoReiniciar.hide();

    botaoAtirar = createButton('ATIRAR');
    botaoAtirar.position(mapaX / 1.5, mapaY_Total / 1.2);
    botaoAtirar.size(mapaX / 3, mapaY_Total / 7);
    botaoAtirar.mousePressed(ativaTiroAutomatico);
    botaoAtirar.touchStarted(ativaTiroAutomatico);
    botaoAtirar.mouseReleased(desativaTiroAutomatico);
    botaoAtirar.touchEnded(desativaTiroAutomatico);

    botaoMoveEsquerda = createButton('<<<');
    botaoMoveEsquerda.position(mapaX - mapaX + 10, mapaY_Total / 1.2);
    botaoMoveEsquerda.size(mapaX / 3, mapaY_Total / 7);
    botaoMoveEsquerda.mousePressed(toqueBotaoEsquerdaPressiona);
    botaoMoveEsquerda.mouseReleased(toqueBotaoEsquerdaSolta);
    botaoMoveEsquerda.touchStarted(toqueBotaoEsquerdaPressiona);
    botaoMoveEsquerda.touchEnded(toqueBotaoEsquerdaSolta);

    botaoMoveDireita = createButton('>>>');
    botaoMoveDireita.position(10 + mapaX / 3, mapaY_Total / 1.2);
    botaoMoveDireita.size(mapaX / 3, mapaY_Total / 7);
    botaoMoveDireita.mousePressed(toqueBotaoDireitaPressiona);
    botaoMoveDireita.mouseReleased(toqueBotaoDireitaSolta);
    botaoMoveDireita.touchStarted(toqueBotaoDireitaPressiona);
    botaoMoveDireita.touchEnded(toqueBotaoDireitaSolta);

}

function iniciaJogo() {
    reinicializaCenario();

    p1.direcao = 'B';
    //console.log('Nome do Jogador: ' + nomeJogador);

    if (nomeJogador != "") {
        nomeJogadorDigitado = true;
        input.remove();
        button.remove();
        jogoIniciado = true;
    }
}

//Função obrigatória da lib P5
//Desenha os objetos. Mas na real essa func é um loop
function draw() {

    if (jogoIniciado == false) {
        if (nomeJogadorDigitado == false) {
            getNomeJogador();


            //se pressionar ENTER
            if (keyIsDown(13)) {
                iniciaJogo()
            }
        }
        else {
            background(210)
            textSize(32)
            text("Jogador: " + nomeJogador, mapaX / 8, mapaY / 8 + 20);
            text("Pontos: " + parseInt(pontos), mapaX / 8, mapaY / 8 + 50);
            text("Vitimas: " + inimigosEliminados, mapaX / 8, mapaY / 8 + 80);

            textSize(20)
            text("RANKING" , mapaX / 1.5, mapaY / 8 -25);
            text("NOME" , mapaX / 2, mapaY / 8 );
            text("PONTOS" , mapaX / 1.3, mapaY / 8 );
            
            //imprime o ranking
            for(let i = 0; i < arrayRanking.length; i++){
                text(arrayRanking[i].nome, mapaX / 2, mapaY / 8 + ((i+1)*25));
                text(parseInt(arrayRanking[i].pontos), mapaX / 1.3, mapaY / 8 + ((i+1)*25));
            }


            botaoReiniciar.show();
            botaoReiniciar.position(mapaX / 8, mapaY / 5 + 110);
            botaoReiniciar.mousePressed(iniciaJogo);
        }
    }
    else {
        botaoReiniciar.hide();
        jogo();

    }

}

function desenhaMonstros(arrayMonstros) {
    for (let i = 0; i < arrayMonstros.length; i++) {
        arrayMonstros[i].desenha();
    }
}

function movimentaMonstros(arrayMonstros) {
    for (let i = 0; i < arrayMonstros.length; i++) {
        arrayMonstros[i].y += arrayMonstros[i].velocidade;
    }

}

function verificaLimiteMonstros(arrayMonstros) {
    for (let i = 0; i < arrayMonstros.length; i++) {
        if (arrayMonstros[i].y > mapaY - arrayMonstros[i].tam || arrayMonstros[i].x > mapaX - arrayMonstros[i].tam || arrayMonstros[i].y < 0 || arrayMonstros[i].x < 0) {
            arrayMonstros.splice(i, 1);
            //console.log(arrayMonstros);
        }


    }
}

function criaMonstros(arrayMonstros) {
    if (arrayMonstros.length < qtdMonstros) {
        
        arrayMonstros.push(new Personagem(Math.random() * (mapaX - 32), 0, 32, "Inimigo", "Monstro", 'B', Math.random() * velMonstros + 3, coresMonstros[parseInt(Math.random() * coresMonstros.length)]))
    }
}


function movimentaPersonagem(p) {

    // Cima
    if (keyIsDown(87)) {
        p.y = p.y - 5

        if (p.y < 0)
            p.y = 0;
    }//baixo
    else if (keyIsDown(83)) {
        p.y = p.y + 5;

        if (p.y > (mapaY - p.tam))
            p.y = mapaY - p.tam;
    }//direita
    else if (keyIsDown(68)) {
        p.x = p.x + 5;

        if (p.x > (mapaX - p.tam))
            p.x = mapaX - p.tam;
    }//esquerda
    else if (keyIsDown(65)) {
        p.x = p.x - 5;

        if (p.x < 0)
            p.x = 0;
    } else if (statusMovimento == 'C') {
        p.y = p.y - 5

        if (p.y < 0)
            p.y = 0;
    }//baixo
    else if (statusMovimento == 'B') {
        p.y = p.y + 5;

        if (p.y > (mapaY - p.tam))
            p.y = mapaY - p.tam;
    }//direita
    else if (statusMovimento == 'D') {
        p.x = p.x + 5;

        if (p.x > (mapaX - p.tam))
            p.x = mapaX - p.tam;
    }//esquerda
    else if (statusMovimento == 'E') {
        p.x = p.x - 5;

        if (p.x < 0)
            p.x = 0;
    }


    //altera diredireção
    if (keyIsDown(LEFT_ARROW))
        p1.direcao = 'E';
    else if (keyIsDown(RIGHT_ARROW))
        p1.direcao = 'D';
    else if (keyIsDown(UP_ARROW))
        p1.direcao = 'C';
    else if (keyIsDown(DOWN_ARROW))
        p1.direcao = 'B';

    //atira
    if (keyIsDown(32) || atiraAutomatico == true) {
        if (arrayDisparos.length < qtdDisparos) {
            if (arrayDisparos.length == 0 || (arrayDisparos.length > 0 && arrayDisparos[arrayDisparos.length - 1].y + 10 < p.y)) {
                dispara(p);
            }
        } else {
            paraSom(somTiro);
        }
    } else {
        paraSom(somTiro);
    }

}

function paraSom(som) {
    som.pause();
    som.currentTime = 0;
}

function tocaSom(som) {
    som.play();
}

function dispara(jogador) {
    tocaSom(somTiro);
    arrayDisparos.push(new Disparo(5, jogador.direcao, 10, 5, jogador.x, jogador.y));
}

function desenhaDisparos(arrayDisparos) {
    for (let i = 0; i < arrayDisparos.length; i++) {
        arrayDisparos[i].desenha();
        //console.log(arrayDisparos);

    }
}

function movimentaDisparos(arrayDisparos) {
    for (let i = 0; i < arrayDisparos.length; i++) {
        arrayDisparos[i].y -= velDisparosJogador;
        //console.log(arrayDisparos);

    }
}

function verificaLimiteDisparos(arrayDisparos) {
    for (let i = 0; i < arrayDisparos.length; i++) {
        if (arrayDisparos[i].y > mapaY || arrayDisparos[i].x > mapaX || arrayDisparos[i].y < 0 || arrayDisparos[i].x < 0) {
            arrayDisparos.splice(i, 1);
            //console.log(arrayMonstros);
        }
    }
}

function verificaColisao(arrayDisparos, arrayMonstros) {
    for (let id = 0; id < arrayDisparos.length; id++) {
        for (let im = 0; im < arrayMonstros.length; im++) {
            if ((arrayDisparos[id].x > arrayMonstros[im].x) && (arrayDisparos[id].x < arrayMonstros[im].x + arrayMonstros[im].tam) && (arrayDisparos[id].y < arrayMonstros[im].y + arrayMonstros[im].tam)) {

                paraSom(somExplosao);
                tocaSom(somExplosao);

                //deleta disparo e monstro jogando ambos para fora da area de desenho
                arrayMonstros[im].x = mapaX + 100
                arrayDisparos[id].x = -100;
                pontos += arrayMonstros[im].velocidade;
                inimigosEliminados += 1;
               // console.log((new Date()).getTime() - dtInicio.getTime());
            }

        }
    }
}

function verificaColisaoJogador(jogador, arrayMonstros) {
    for (let im = 0; im < arrayMonstros.length; im++) {
        if ((jogador.x + jogador.tam > arrayMonstros[im].x) && (jogador.x < arrayMonstros[im].x + arrayMonstros[im].tam) && (jogador.y < arrayMonstros[im].y + arrayMonstros[im].tam) && (jogador.y + jogador.tam > arrayMonstros[im].y)) {

            paraSom(somExplosaoJogador);
            tocaSom(somExplosaoJogador);

            console.log('Duração: ' + ((new Date()).getTime() - dtInicio.getTime()) / 100);
            jogoIniciado = false; //para o jogo
            registraRank();
            getListaRank();

        }
    }

}

function elevaNivel() {
    qtdMonstros = parseInt(20 + (pontos / 100));
    velMonstros = parseInt(1 + qtdMonstros / 10)
}

function jogo() {
    background(220);

    movimentaPersonagem(p1);

    //if (keyIsDown(LEFT_ARROW)){

    movimentaMonstros(arrayMonstros);
    movimentaDisparos(arrayDisparos);
    //}

    verificaLimiteMonstros(arrayMonstros);
    verificaLimiteDisparos(arrayDisparos);
    verificaColisao(arrayDisparos, arrayMonstros);
    verificaColisaoJogador(p1, arrayMonstros);

    desenhaMonstros(arrayMonstros);
    desenhaDisparos(arrayDisparos);

    criaMonstros(arrayMonstros);

    elevaNivel();

    textSize(32)
    text("PONTOS: " + parseInt(pontos), 40, 40);
    text("MONSTROS: " + qtdMonstros, 40, 80);
    p1.desenha();
}

function mouseClicked() {
    // if (jogoIniciado == false && nomeJogadorDigitado == true) {
    //     reinicializaCenario();
    //     jogoIniciado = true;
    // }



}

function mousePressed() {
    //atiraAutomatico = true;
}
function mouseReleased() {
    //atiraAutomatico = false;
}

function ativaTiroAutomatico() {
    atiraAutomatico = true;
}

function desativaTiroAutomatico() {
    atiraAutomatico = false;
}

function getNomeJogador() {
    textSize(32);
    text("Digite seu nome", mapaX / 2, (mapaY / 2) - 30);
    nomeJogador = input.value();
    button
}

function toqueBotaoEsquerdaPressiona() {
    statusMovimento = 'E';
}

function toqueBotaoEsquerdaSolta() {
    statusMovimento = 'P';
}

function toqueBotaoDireitaPressiona() {
    statusMovimento = 'D';
}

function toqueBotaoDireitaSolta() {
    statusMovimento = 'P';
}

function registraRank() {
    $.ajax({
        url: "backend/registraRank.php", //Endereço da requicição
        type: "POST", //tipo da requisição
        data: { //os dados da requisição
            'nome': nomeJogador,
            'pontos': parseInt(pontos)
        },
        dataType: "html" // o formato dos dados da requisição. pode ser TEXT, HTML, XML, JSON, JSONP e SCRIPT
    }).done(function (msg) {
        //console.log(msg);
    })
}

//recebe e atualiza a lista do ranking

function getListaRank() {
    while (arrayRanking.length > 0)
        arrayRanking.splice(0, 1);

    $.ajax({
        url: "backend/getRanking.php", //Endereço da requicição
        type: "POST", //tipo da requisição
        data: {}, //os dados da requisição
        dataType: "json" // o formato dos dados da requisição. pode ser HTML. XML, JSON e JSONP
    }).done(function (msg) {

        for (let i = 0; i < msg.length; i++) {
            arrayRanking.push({ 'rank': msg[i].rank, 'nome': msg[i].nome, 'pontos': msg[i].pontos });

        }
        // console.log(msg);
        // console.log(arrayRanking);
    });

}

