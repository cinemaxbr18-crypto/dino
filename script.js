// Seleciona os elementos do DOM
const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const ground = document.getElementById('ground'); // Adicionado o chão

// Variáveis de estado do jogo
let isJumping = false;
let isGameOver = false;
let score = 0;
let gameSpeed = 2000; // Duração da animação (em ms)

// Event listener para o pulo (detecta a tecla "Espaço")
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !isJumping && !isGameOver) {
        jump();
    } 
    else if (event.code === 'Space' && isGameOver) {
        resetGame();
    }
});

// Função de Pulo
function jump() {
    isJumping = true;
    dino.classList.remove('dinoRun'); // Remove a animação de corrida para usar o frame de pulo
    dino.classList.add('jump-animation');

    setTimeout(() => {
        dino.classList.remove('jump-animation');
        dino.classList.add('dinoRun'); // Retorna a animação de corrida
        isJumping = false;
    }, 500); // Duração do pulo
}

// Loop principal do jogo (Game Loop)
let gameLoop = setInterval(() => {
    if (isGameOver) {
        return; 
    }

    // Pega as posições atuais
    let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

    // Lógica de Detecção de Colisão
    // Ajustada para as novas dimensões e a imagem do cacto
    if (obstacleLeft < 90 && obstacleLeft > 30 && dinoBottom < 50) { // Ajuste esses números se a colisão não estiver boa
        // Colisão detectada!
        isGameOver = true;
        
        // Para todas as animações
        obstacle.style.animation = 'none';
        ground.style.animation = 'none';
        dino.style.animation = 'none'; // Para o dino no último frame
        
        // Exibe o frame de "game over" do dino (se você tiver um)
        // Por exemplo, na sua sprite sheet, o frame do dinossauro "morto" parece ser o último da primeira linha ou um na terceira.
        // Se for o último da primeira linha (frame 6, 5*60px = 300px), você pode usar:
        dino.style.backgroundPosition = '-300px 0'; // Ajuste este valor!

        alert('Game Over! Pontos: ' + score + '\nPressione Espaço para reiniciar.');
    } else {
        updateScore();
    }

}, 20); // O loop verifica a cada 20ms

// Função para atualizar a pontuação
function updateScore() {
    score++;
    scoreDisplay.textContent = 'Pontos: ' + score;

    // Aumenta a dificuldade
    if (score > 0 && score % 500 === 0 && gameSpeed > 800) {
        gameSpeed -= 100;
        
        obstacle.style.animationDuration = gameSpeed + 'ms';
        ground.style.animationDuration = (gameSpeed / 2) + 'ms'; 
    }
}

// Função para reiniciar o jogo
function resetGame() {
    isGameOver = false;
    score = 0;
    gameSpeed = 2000;
    scoreDisplay.textContent = 'Pontos: 0';
    
    // Reinicia as animações
    obstacle.style.animation = 'moveObstacle ' + gameSpeed + 'ms linear infinite';
    ground.style.animation = 'moveGround ' + (gameSpeed / 2) + 'ms linear infinite';
    
    // Reinicia a animação de corrida do dino e o background-position
    dino.style.animation = 'dinoRun 0.6s steps(4) infinite';
    dino.style.backgroundPosition = '0 0'; // Volta ao primeiro frame
}

// Inicia a animação de corrida do dinossauro no carregamento
dino.style.animation = 'dinoRun 0.6s steps(4) infinite';