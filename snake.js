const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const size = 20;

let snake, dx, dy, food, score;
let game, running = false;

// Récupérer le highscore depuis le navigateur
let highscore = localStorage.getItem("snakeHighscore") || 0;
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("highscore").innerText = "Highscore: " + highscore;
});

// Adapter le canvas à l’écran
function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth / size) * size;
    canvas.height = Math.floor((window.innerHeight - 0) / size) * size; // plein écran
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Fonction plein écran (emulateur / mobile)
function goFullScreen() {
    if (canvas.requestFullscreen) canvas.requestFullscreen().catch(()=>{});
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
}

// Boutons tactiles (croix)
function setDirection(dir) {
    if (dir == "up" && dy == 0) { dx = 0; dy = -size; }
    if (dir == "down" && dy == 0) { dx = 0; dy = size; }
    if (dir == "left" && dx == 0) { dx = -size; dy = 0; }
    if (dir == "right" && dx == 0) { dx = size; dy = 0; }
}

// Clavier
document.addEventListener("keydown", e => {
    if (e.key == "ArrowUp" && dy == 0) dx = 0, dy = -size;
    if (e.key == "ArrowDown" && dy == 0) dx = 0, dy = size;
    if (e.key == "ArrowLeft" && dx == 0) dx = -size, dy = 0;
    if (e.key == "ArrowRight" && dx == 0) dx = size, dy = 0;
});

function startGame() {
    if (running) return;

    // Plein écran automatique
    goFullScreen();

    snake = [
        { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) },
        { x: Math.floor(canvas.width / 2) - size, y: Math.floor(canvas.height / 2) },
        { x: Math.floor(canvas.width / 2) - 2 * size, y: Math.floor(canvas.height / 2) }
    ];

    dx = size; dy = 0;
    score = 0;
    document.getElementById("score").innerText = score;
    food = randomFood();

    let speed = parseInt(document.getElementById("level").value);
    game = setInterval(drawGame, speed);
    running = true;
}

function restartGame() {
    clearInterval(game);
    running = false;
    startGame();
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / size)) * size,
        y: Math.floor(Math.random() * (canvas.height / size)) * size
    };
}

function drawSnake() {
    snake.forEach((part, i) => {
        ctx.beginPath();
        ctx.fillStyle = i == 0 ? "#00ff99" : "#00cc66";
        ctx.arc(part.x + size / 2, part.y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        if (i == 0) drawEyes(part);
    });
}

function drawEyes(head) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(head.x + 6, head.y + 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(head.x + size - 6, head.y + 6, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + size / 2, food.y + size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Collision avec murs ou soi-même
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
        snake.some(p => p.x === head.x && p.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Collision avec nourriture
    if (Math.abs(head.x - food.x) < size && Math.abs(head.y - food.y) < size) {
        score++;
        document.getElementById("score").innerText = score;
        food = randomFood();

        // Mettre à jour highscore
        if (score > highscore) {
            highscore = score;
            document.getElementById("highscore").innerText = "Highscore: " + highscore;
            localStorage.setItem("snakeHighscore", highscore);
        }
    } else {
        snake.pop();
    }
}

function gameOver() {
    clearInterval(game);
    running = false;
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 4, canvas.height / 2);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
}