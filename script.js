// ==========================================================
// VARIÁVEIS DO JOGO E SELEÇÃO DE ELEMENTOS
// ==========================================================
const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const ground = document.getElementById('ground');
const scoreDisplay = document.getElementById('score');

// Configurações e estado do jogo
const DINO_WIDTH = 80;
const DINO_HEIGHT = 80;
const CACTUS_WIDTH = 30;
const JUMP_DURATION = 500; // Milissegundos (deve ser igual ao CSS)
let isJumping = false;
let isGameOver = false;
let score = 0;
let gameSpeed = 2000; // Duração da animação do obstáculo em ms (2s)

// ==========================================================
// CONTROLE DO DINOSSAURO (PULO)
// ==========================================================

function jump() {
    if (isJumping || isGameOver) return;

    isJumping = true;
    
    // 1. Remove a animação de corrida para exibir o frame de pulo no CSS
    dino.style.animation = 'none'; 
    // 2. Adiciona a classe que move o dino verticalmente
    dino.classList.add('jump-animation');

    // 3. Após o pulo, remove a classe e restaura a corrida
    setTimeout(() => {
        dino.classList.remove('jump-animation');
        // 4. Retoma a animação de corrida (steps(4) é a animação definida no CSS)
        dino.style.animation = 'dinoRun 0.4s steps(4) infinite'; 
        isJumping = false;
    }, JUMP_DURATION);
}

// Event listener para o pulo e reinício do jogo
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        if (isGameOver) {
            resetGame();
        } else {
            jump();
        }
    }
});

// ==========================================================
// LOOP PRINCIPAL DO JOGO (COLISÃO E PONTUAÇÃO)
// ==========================================================

let gameLoop = setInterval(() => {
    if (isGameOver) {
        return; 
    }

    // Pega as posições atuais do dino e do obstáculo
    let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    let dinoLeft = parseInt(window.getComputedStyle(dino).getPropertyValue('left'));

    // LÓGICA DE DETECÇÃO DE COLISÃO
    // Verifica se o obstáculo está no espaço horizontal do dino
    let isHorizontalCollision = (obstacleLeft < (dinoLeft + DINO_WIDTH - 10)) && 
                                (obstacleLeft > (dinoLeft - CACTUS_WIDTH + 10));

    // Verifica se o dino está baixo o suficiente para bater
    // O cacto tem 50px de altura, então o dino bate se estiver abaixo de ~45px
    let isVerticalCollision = dinoBottom < 50; 

    if (isHorizontalCollision && isVerticalCollision) {
        // Colisão detectada!
        gameOver();
    } else {
        updateScore();
    }

}, 10); // Verificação mais rápida (a cada 10ms) para melhor precisão

// ==========================================================
// FUNÇÕES DE CONTROLE DO JOGO
// ==========================================================

function updateScore() {
    score++;
    scoreDisplay.textContent = 'Pontos: ' + Math.floor(score / 10); // Mostra pontuação mais lenta

    // Aumenta a dificuldade a cada 500 pontos reais (5000 no contador)
    if (score > 0 && score % 5000 === 0 && gameSpeed > 800) {
        gameSpeed -= 100; // Torna o jogo 100ms mais rápido
        
        // Aplica a nova velocidade às animações
        obstacle.style.animationDuration = gameSpeed + 'ms';
        ground.style.animationDuration = (gameSpeed / 2) + 'ms'; 
    }
}

function gameOver() {
    isGameOver = true;
    
    // Para todas as animações
    obstacle.style.animation = 'none';
    ground.style.animation = 'none';
    dino.style.animation = 'none'; 
    
    // Exibe o frame de "game over" (O dino morto, 6º frame da 1ª linha: 6 * 80px = 480px)
    dino.style.backgroundPosition = '-480px 0'; 

    alert('GAME OVER! Pontos Finais: ' + Math.floor(score / 10) + '\nPressione Espaço para reiniciar.');
}

function resetGame() {
    isGameOver = false;
    score = 0;
    gameSpeed = 2000;
    scoreDisplay.textContent = 'Pontos: 0';
    
    // Reinicia as animações com a velocidade padrão
    obstacle.style.animation = 'moveObstacle ' + gameSpeed + 'ms linear infinite';
    ground.style.animation = 'moveGround ' + (gameSpeed / 2) + 'ms linear infinite';
    
    // Reinicia a animação de corrida do dino
    dino.style.animation = 'dinoRun 0.4s steps(4) infinite';
    dino.style.backgroundPosition = '0 0'; // Volta ao primeiro frame

    // Garante que o dino não esteja pulando ao reiniciar
    isJumping = false;
}

// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

// Inicia a animação de corrida do dinossauro no carregamento
dino.style.animation = 'dinoRun 0.4s steps(4) infinite';
