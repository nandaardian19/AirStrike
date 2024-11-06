const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const pauseButton = document.getElementById("pauseButton");
const quitButton = document.getElementById("quitButton");

let playerPositionX = 180;
let playerPositionY = 500;
let bullets = [];
let enemies = [];
let score = 0;
let isGameOver = false;
let isPaused = false;

// Variables for smooth movement
let keysPressed = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
let moveSpeed = 3;

pauseButton.addEventListener("click", togglePause);
quitButton.addEventListener("click", quitGame);

document.addEventListener("keydown", (e) => {
    if (isGameOver || isPaused) return;
    if (e.key in keysPressed) {
        keysPressed[e.key] = true;
    }
    if (e.key === " ") {
        shootBullet();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key in keysPressed) {
        keysPressed[e.key] = false;
    }
});

function togglePause() {
    isPaused = !isPaused;
    pauseButton.innerText = isPaused ? "Resume" : "Pause";
    if (!isPaused) {
        gameLoop();
    }
}

function quitGame() {
    isGameOver = true;
    alert("Game Quit! Your final score: " + score);
    resetGame();
}

function resetGame() {
    bullets.forEach(bullet => bullet.remove());
    enemies.forEach(enemy => enemy.remove());
    bullets = [];
    enemies = [];
    score = 0;
    scoreDisplay.innerText = score;
    playerPositionX = 180;
    playerPositionY = 500;
    updatePlayerPosition();
    isGameOver = false;
    isPaused = false;
    pauseButton.innerText = "Pause";
}

function updatePlayerPosition() {
    player.style.left = playerPositionX + "px";
    player.style.top = playerPositionY + "px";
}

function shootBullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = playerPositionX + 17 + "px";
    bullet.style.bottom = (600 - playerPositionY - 40) + "px";
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

function createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = Math.floor(Math.random() * 360) + "px";
    enemy.style.top = "0px";
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        let enemyTop = parseInt(enemy.style.top);
        if (enemyTop >= 560) {
            gameArea.removeChild(enemy);
            enemies.splice(index, 1);
        } else {
            enemy.style.top = enemyTop + 2 + "px";
        }

        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        if (
            playerRect.left < enemyRect.left + enemyRect.width &&
            playerRect.left + playerRect.width > enemyRect.left &&
            playerRect.top < enemyRect.top + enemyRect.height &&
            playerRect.top + playerRect.height > enemyRect.top
        ) {
            gameOver();
        }
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        let bulletBottom = parseInt(bullet.style.bottom);
        if (bulletBottom >= 600) {
            gameArea.removeChild(bullet);
            bullets.splice(index, 1);
        } else {
            bullet.style.bottom = bulletBottom + 5 + "px";
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();

            if (
                bulletRect.left < enemyRect.left + enemyRect.width &&
                bulletRect.left + bulletRect.width > enemyRect.left &&
                bulletRect.top < enemyRect.top + enemyRect.height &&
                bulletRect.top + bulletRect.height > enemyRect.top
            ) {
                gameArea.removeChild(bullet);
                gameArea.removeChild(enemy);
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                scoreDisplay.innerText = score;
            }
        });
    });
}

function movePlayer() {
    if (keysPressed.ArrowLeft && playerPositionX > 0) {
        playerPositionX -= moveSpeed;
    }
    if (keysPressed.ArrowRight && playerPositionX < 360) {
        playerPositionX += moveSpeed;
    }
    if (keysPressed.ArrowUp && playerPositionY > 0) {
        playerPositionY -= moveSpeed;
    }
    if (keysPressed.ArrowDown && playerPositionY < 560) {
        playerPositionY += moveSpeed;
    }
    updatePlayerPosition();
}

function gameOver() {
    isGameOver = true;
    alert("Game Over! Your Score: " + score);
    resetGame();
}

function gameLoop() {
    if (!isGameOver && !isPaused) {
        movePlayer();
        moveBullets();
        moveEnemies();
        checkCollisions();
        if (Math.random() < 0.02) {
            createEnemy();
        }
        requestAnimationFrame(gameLoop);
    }
}

updatePlayerPosition();
gameLoop();
