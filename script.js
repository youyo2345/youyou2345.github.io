const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let petals = 6; // Start with 6 petals
let rotationAngle = 0; // Initial rotation angle of petals
let rotationSpeed = 0.05; // Speed of petal rotation
let player = { x: canvas.width / 2, y: canvas.height / 2, radius: 30 };
let monsters = [];
let keys = {};

// Utility: Generate random numbers
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Draw player (flower) and petals
function drawPlayer() {
  // Draw center of the flower
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff69b4";
  ctx.fill();

  // Draw petals rotating around the flower
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 * i) / petals + rotationAngle;
    const x = player.x + Math.cos(angle) * 60;
    const y = player.y + Math.sin(angle) * 60;

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#ff69b4";
    ctx.stroke();
  }
}

// Draw monsters
function drawMonsters() {
  monsters.forEach((monster) => {
    ctx.beginPath();
    ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  });
}

// Move player (flower)
function movePlayer() {
  if (keys.w && player.y > player.radius) player.y -= 5;
  if (keys.s && player.y < canvas.height - player.radius) player.y += 5;
  if (keys.a && player.x > player.radius) player.x -= 5;
  if (keys.d && player.x < canvas.width - player.radius) player.x += 5;
}

// Update the rotation of petals (automatic rotation)
function rotatePetals() {
  rotationAngle += rotationSpeed; // Automatically rotate the petals
}

// Update monsters
function updateMonsters() {
  monsters.forEach((monster, index) => {
    const angle = Math.atan2(player.y - monster.y, player.x - monster.x);
    monster.x += Math.cos(angle) * monster.speed;
    monster.y += Math.sin(angle) * monster.speed;

    // Check collision with petals
    for (let i = 0; i < petals; i++) {
      const petalAngle = (Math.PI * 2 * i) / petals + rotationAngle;
      const petalX = player.x + Math.cos(petalAngle) * 60;
      const petalY = player.y + Math.sin(petalAngle) * 60;

      const dist = Math.hypot(monster.x - petalX, monster.y - petalY);
      if (dist < monster.radius + 15) {
        // Remove monster and increase score
        monsters.splice(index, 1);
        score += 10;
        petals++;
        document.getElementById("score").innerText = score;
        return;
      }
    }

    // Check collision with player (for game over)
    const distToPlayer = Math.hypot(player.x - monster.x, player.y - monster.y);
    if (distToPlayer < player.radius + monster.radius) {
      alert("Game Over! Your score: " + score);
      document.location.reload();
    }
  });
}

// Spawn new monster
function spawnMonster() {
  const radius = random(20, 40);
  const x = Math.random() > 0.5 ? 0 - radius : canvas.width + radius;
  const y = random(0, canvas.height);
  const speed = random(1, 3);
  monsters.push({ x, y, radius, speed });
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  rotatePetals();
  updateMonsters();

  drawPlayer();
  drawMonsters();

  requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Start game
setInterval(spawnMonster, 2000);
gameLoop();
