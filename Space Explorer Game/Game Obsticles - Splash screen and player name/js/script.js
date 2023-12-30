const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");

let playerName = "";
let gameStarted = false;
let obstacles = [];
let stars = [];
let score = 0;
let starSound = new Audio("sounds/incoming.mp3");
let obsticleSound = new Audio("sounds/hit-sound-effects.mp3");
let level = 1;
let lives = 5;
let isInvincible = false;
const invincibilityDuration = 3000; // 3 seconds of invincibility
let invincibilityTimer = 0;

const obstacleWidth = 60;
const obstacleHeight = 60;
const starRadius = 10;
let obstacleSpeed = 3;
let starSpeed = 2;
let projectiles = [];
let shootingDirection = "right";

const alienImage = new Image();
alienImage.src = "images/alien.png"; // Path to your alien image
const asteroidImage = new Image();
asteroidImage.src = "images/asteroid.png"; // Path to your asteroid image

let starImageLoaded = false;
const starImage = new Image();
starImage.onload = () => {
  starImageLoaded = true;
};
starImage.src = "images/star.png"; // Path to your star image

let projectileImageLoaded = false;
const projectileImage = new Image();
projectileImage.onload = () => {
  projectileImageLoaded = true;
};
projectileImage.src = "images/projectile.png"; // Replace with the path to your image

function shoot() {
  const projectileSpeed = 7;
  let dx = 0;
  let dy = 0;

  switch (shootingDirection) {
    case "up":
      dy = -projectileSpeed;
      break;
    case "down":
      dy = projectileSpeed;
      break;
    case "left":
      dx = -projectileSpeed;
      break;
    case "right":
      dx = projectileSpeed;
      break;
  }

  const projectile = {
    x: spaceship.x + spaceship.width / 2,
    y: spaceship.y + spaceship.height / 2,
    width: 20, // Width of the image
    height: 40, // Height of the image
    dx: dx,
    dy: dy,
  };
  projectiles.push(projectile);
}
function moveProjectiles() {
  projectiles.forEach((projectile) => {
    projectile.x += projectile.dx;
    projectile.y += projectile.dy;
  });

  // Remove projectiles that go off screen
  projectiles = projectiles.filter(
    (projectile) =>
      projectile.x > 0 &&
      projectile.x < canvas.width &&
      projectile.y > 0 &&
      projectile.y < canvas.height
  );
}

function drawProjectiles() {
  projectiles.forEach((projectile) => {
    if (projectileImageLoaded) {
      ctx.drawImage(
        projectileImage,
        projectile.x,
        projectile.y,
        projectile.width,
        projectile.height
      );
    }
  });
}

function checkProjectileCollisions() {
  let projectilesToRemove = new Set();
  let obstaclesToRemove = new Set();

  projectiles.forEach((projectile, pIndex) => {
    obstacles.forEach((obstacle, oIndex) => {
      if (isColliding(projectile, obstacle)) {
        projectilesToRemove.add(pIndex);
        obstaclesToRemove.add(oIndex);
      }
    });
  });

  // Remove collided projectiles and obstacles
  projectiles = projectiles.filter(
    (_, index) => !projectilesToRemove.has(index)
  );
  obstacles = obstacles.filter((_, index) => {
    if (obstaclesToRemove.has(index)) {
      obstacles.splice(index, _); // Remove obstacle element from DOM
      return false;
    }
    return true;
  });
}

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
function createObstacle() {
  const x = canvas.width;
  const y = Math.random() * (canvas.height - obstacleHeight);
  const type = Math.random() < 0.5 ? "alien" : "asteroid"; // Randomly choose type
  obstacles.push({
    x,
    y,
    width: obstacleWidth,
    height: obstacleHeight,
    type,
  });
}

function createStar() {
  const x = canvas.width;
  const y = Math.random() * canvas.height;
  stars.push({ x, y, radius: starRadius });
}

function drawObstacle(obstacle) {
  if (obstacle.type === "alien") {
    ctx.drawImage(
      alienImage,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  } else {
    // Assume it's an asteroid
    ctx.drawImage(
      asteroidImage,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  }
}

function drawStar(star) {
  if (starImageLoaded) {
    const drawX = star.x - star.radius; // Adjust position to center the image
    const drawY = star.y - star.radius;
    ctx.drawImage(starImage, drawX, drawY, star.radius * 2, star.radius * 2);
  }
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    if (obstacle.type === "alien") {
      // Example: Move the alien in a zigzag pattern
      obstacle.x -= obstacleSpeed;
      obstacle.y += Math.sin(obstacle.x / 50) * 5; // Adjust for desired movement
    } else {
      // Assume it's an asteroid
      obstacle.x -= obstacleSpeed;
      // Optional: Add rotation or other effects for asteroids
    }
  });

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
}
function moveStars() {
  stars.forEach((star) => {
    star.x -= starSpeed;
  });
  stars = stars.filter((star) => star.x + star.radius > 0);
}

let spaceship = {
  x: canvas.width / 2 - 20, // Center the spaceship by subtracting half its width
  y: canvas.height / 2 - 20, // Center the spaceship by subtracting half its height
  width: 50,
  height: 50,
  speed: 5,
};

let spaceshipImageLoaded = false;
const spaceshipImage = new Image();
spaceshipImage.onload = () => {
  spaceshipImageLoaded = true;
  // Start the game or enable the start button
};
spaceshipImage.src = "images/rocket.png";

const spaceshipElement = document.getElementById("spaceship");

function drawSpaceship() {
  spaceshipElement.style.left = spaceship.x + 205 + "px";
  spaceshipElement.style.top = spaceship.y + 135 + "px";
  if (isInvincible && Math.floor(Date.now() / 100) % 2) {
    spaceshipElement.classList.add("invincible");
  } else {
    spaceshipElement.classList.remove("invincible");
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 30);
}
function updateDifficulty() {
  if (score > 50 && level == 1) {
    // Level 2
    level++;
    obstacleSpeed = 4;
    starSpeed = 3;
  }
  if (score > 100 && level == 2) {
    // Level 3
    level++;
    obstacleSpeed = 5;
    starSpeed = 4;
  }
  if (score > 200 && level == 3) {
    // Level 4
    level++;
    obstacleSpeed = 6;
    starSpeed = 5;
  }
  // ... More levels ...
}
function drawLevel() {
  ctx.fillText("Level: " + level, canvas.width - 100, 30);
}

function isCollidingWithObstacle(spaceship, obstacle) {
  // Continue using rectangular collision if it suffices
  return (
    spaceship.x < obstacle.x + obstacle.width &&
    spaceship.x + spaceship.width > obstacle.x &&
    spaceship.y < obstacle.y + obstacle.height &&
    spaceship.y + spaceship.height > obstacle.y
  );
}

function isCollidingWithStar(spaceship, star) {
  // Assuming the star image is a square with side length equal to 2 * star.radius
  const starSize = star.radius * 2;

  return (
    spaceship.x < star.x + starSize &&
    spaceship.x + spaceship.width > star.x &&
    spaceship.y < star.y + starSize &&
    spaceship.y + spaceship.height > star.y
  );
}

// Helper function to clamp values
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: " + lives, 10, 60);
}

function checkCollisions() {
  obstacles.forEach((obstacle) => {
    if (isCollidingWithObstacle(spaceship, obstacle) && !isInvincible) {
      lives -= 1;
      isInvincible = true;
      invincibilityTimer = Date.now();
      console.log("Hit an obstacle! Lives left: " + lives);
    }
    drawObstacle(obstacle);
  });

  if (isInvincible && Date.now() - invincibilityTimer > invincibilityDuration) {
    isInvincible = false;
  }
}

function update() {
  if (!gameStarted) {
    return; // Do not update the game if it hasn't started
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveObstacles();
  moveStars();
  // Check collisions and update game state
  checkCollisions();
  if (isInvincible && Date.now() - invincibilityTimer > invincibilityDuration) {
    isInvincible = false;
  }
  // Check for collisions
  obstacles.forEach((obstacle) => {
    if (isCollidingWithObstacle(spaceship, obstacle) && !isInvincible) {
      lives -= 1; // Lose a life
      obsticleSound.play(); // Play the sound
      console.log("Hit an obstacle! Lives left: " + lives);
      isInvincible = true;
      invincibilityTimer = Date.now();
      // Consider resetting the position of the spaceship or obstacle
      if (lives <= 0) {
        // Display game over message
        ctx.fillText("Game Over!", canvas.width / 2 - 50, canvas.height / 2);
        return; // Stop the game loop
      }
    }
    drawObstacle(obstacle);
  });

  stars.forEach((star, index) => {
    if (isCollidingWithStar(spaceship, star)) {
      score += 10; // Increase score by 10 for each star
      starSound.play(); // Play the sound
      console.log("Star collected! Score: " + score);
      stars.splice(index, 1); // Remove the star
    } else {
      drawStar(star);
    }
  });

  drawSpaceship();
  drawLevel();
  drawScore();
  drawLives();
  updateDifficulty();
  moveProjectiles();
  checkProjectileCollisions();

  drawProjectiles();
  requestAnimationFrame(update);
}
document.addEventListener("DOMContentLoaded", function () {
  startButton.addEventListener("click", function () {
    playerName = playerNameInput.value;
    startScreen.style.display = "none";
    gameStarted = true;
    update(); // Start the game loop
  });
});
setInterval(createObstacle, 2000); // Create a new obstacle every 2000 milliseconds
setInterval(createStar, 1000); // Create a new star every 1000 milliseconds
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Player: " + playerName, 10, 90); // Display player name
}

function keyDownHandler(e) {
  if (
    (e.key == "Right" || e.key == "ArrowRight") &&
    spaceship.x < canvas.width - spaceship.width
  ) {
    spaceship.x += spaceship.speed;
  } else if ((e.key == "Left" || e.key == "ArrowLeft") && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  } else if ((e.key == "Up" || e.key == "ArrowUp") && spaceship.y > 0) {
    spaceship.y -= spaceship.speed;
  } else if (
    (e.key == "Down" || e.key == "ArrowDown") &&
    spaceship.y < canvas.height - spaceship.height
  ) {
    spaceship.y += spaceship.speed;
  }

  // Adjust shooting direction
  if (e.key === "ArrowUp") {
    shootingDirection = "up";
  } else if (e.key === "ArrowDown") {
    shootingDirection = "down";
  } else if (e.key === "ArrowLeft") {
    shootingDirection = "left";
  } else if (e.key === "ArrowRight") {
    shootingDirection = "right";
  }

  // Shoot when spacebar is pressed
  if (e.code === "Space") {
    shoot();
  }
}

document.addEventListener("keydown", keyDownHandler);

update();

function checkHighScore(currentScore) {
  // Implement logic to check and save high score
}
function checkHighScore(currentScore) {
  const highScore = localStorage.getItem("highScore") || 0;
  if (currentScore > highScore) {
    localStorage.setItem("highScore", currentScore);
    localStorage.setItem("highScorePlayer", playerName);
    // Show high score message or update UI
  }
}

function displayHighScores() {
  const highScoresList = document.getElementById("highScoresList");
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScoresList.innerHTML = highScores
    .map((score) => `<li>${score.name} - ${score.score}</li>`)
    .join("");
}

// Call this function when the game loads or when returning to the start screen
displayHighScores();
