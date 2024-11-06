const gameArea = document.getElementById("gameArea");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const scoreDisplay = document.getElementById("score");
const pauseButton = document.getElementById("pauseButton");
const quitButton = document.getElementById("quitButton");
const menuScreen = document.getElementById("menuScreen");
const singlePlayerBtn = document.getElementById("singlePlayerBtn");
const multiPlayerBtn = document.getElementById("multiPlayerBtn");

let isGameOver = false;
let isPaused = false;
let isMultiplayer = false;
let score = 0;
let bullets = [];
let enemies = [];
let enemyInterval;
let gameLoopInterval;

// Player positions
let player1Position = { x: 180, y: 500 };
let player2Position = { x: 220, y: 500 };

// Event listeners for menu selection
singlePlayerBtn.addEventListener("click", startSinglePlayer);
multiPlayerBtn.addEventListener("click", startMultiplayer);

// Button listeners for pause and quit
pauseButton.addEventListener("click", togglePause);
quitButton.addEventListener("click", quitGame);

// Initialize the game in single or multiplayer mode
function startSinglePlayer() {
    isMultiplayer = false;
    menuScreen.style.display = "none";
    gameArea.style.display = "block";
    player2.style.display = "none"; // Hide second player
    startGame();
}

function startMultiplayer() {
    isMultiplayer = true;
    menuScreen.style.display = "none";
    gameArea.style.display = "block";
    player2.style.display = "block"; // Show second player
    startGame();
}

function startGame() {
    score = 0;
    scoreDisplay.innerText = score;
    isGameOver = false;
    isPaused = false;
    bullets = [];
    enemies = [];
    updatePositions();
    gameLoopInterval = setInterval(gameLoop, 20);
    enemyInterval = setInterval(spawnEnemy, 1000);
}

document.addEventListener("keydown", (e) => {
    if (isGameOver || isPaused) return;

    // Player 1 controls (Arrow keys)
    if (e.key === "ArrowLeft") player1Position.x -= 10;
    if (e.key === "ArrowRight") player1Position.x += 10;
    if (e.key === "ArrowUp") player1Position.y -= 10;
    if (e.key === "ArrowDown") player1Position.y += 10;
    if (e.key === " ") shootBullet(player1);

    // Player 2 controls (WASD keys) in multiplayer
    if (isMultiplayer) {
        if (e.key === "a") player2Position.x -= 10;
        if (e.key === "d") player2Position.x += 10;
        if (e.key === "w") player2Position.y -= 10;
        if (e.key === "s") player2Position.y += 10;
        if (e.key === "Enter") shootBullet(player2);
    }
    updatePositions();
});

function updatePositions() {
    player1.style.left = player1Position.x + "px";
    player1.style.top = player1Position.y + "px";

    if (isMultiplayer) {
        player2.style.left = player2Position.x + "px";
        player2.style.top = player2Position.y + "px";
    }
}

// Shooting function for both players
function shootBullet(player) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = player.offsetLeft + 15 + "px";
    bullet.style.top = player.offsetTop + "px";
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

// Spawning enemies at random positions
function spawnEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = Math.random() * (gameArea.offsetWidth - 40) + "px";
    enemy.style.top = "0px";
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

// Game loop
function gameLoop() {
    if (isGameOver || isPaused) return;

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.style.top = bullet.offsetTop - 8 + "px";
        if (bullet.offsetTop < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    // Move enemies
    enemies.forEach((enemy, index) => {
        enemy.style.top = enemy.offsetTop + 4 + "px";
        if (enemy.offsetTop > gameArea.offsetHeight) {
            enemy.remove();
            enemies.splice(index, 1);
            gameOver();
        }

        // Check for collision with bullets
        bullets.forEach((bullet, bIndex) => {
            if (isColliding(bullet, enemy)) {
                bullet.remove();
                bullets.splice(bIndex, 1);
                enemy.remove();
                enemies.splice(index, 1);
                updateScore();
            }
        });

        // Check for collision with player
        if (isColliding(player1, enemy) || (isMultiplayer && isColliding(player2, enemy))) {
            gameOver();
        }
    });
}

// Check for collision between two elements
function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

// Update score
function updateScore() {
    score++;
    scoreDisplay.innerText = score;
}

// Pause and unpause the game
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoopInterval);
        clearInterval(enemyInterval);
    } else {
        gameLoopInterval = setInterval(gameLoop, 20);
        enemyInterval = setInterval(spawnEnemy, 1000);
    }
}

// Quit the game and return to menu
function quitGame() {
    clearInterval(gameLoopInterval);
    clearInterval(enemyInterval);
    resetGame();
}

// Game over function
function gameOver() {
    isGameOver = true;
    alert("Game Over! Final Score: " + score);
    quitGame();
}

// Reset game and return to main menu
function resetGame() {
    player1Position = { x: 180, y: 500 };
    player2Position = { x: 220, y: 500 };
    updatePositions();
    bullets.forEach((bullet) => bullet.remove());
    enemies.forEach((enemy) => enemy.remove());
    bullets = [];
    enemies = [];
    score = 0;
    scoreDisplay.innerText = score;
    gameArea.style.display = "none";
    menuScreen.style.display = "flex";
}
