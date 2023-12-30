const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let obstacles = [];
let stars = [];
let score = 0;
let starSound = new Audio("message-incoming-132126.mp3");
let level = 1;
const obstacleWidth = 60;
const obstacleHeight = 60;
const starRadius = 10;
const obstacleSpeed = 3;
const starSpeed = 2;

function createObstacle() {
  const x = canvas.width;
  const y = Math.random() * (canvas.height - obstacleHeight);
  obstacles.push({ x, y, width: obstacleWidth, height: obstacleHeight });
}

function createStar() {
  const x = canvas.width;
  const y = Math.random() * canvas.height;
  stars.push({ x, y, radius: starRadius });
}

function drawObstacle(obstacle) {
  ctx.fillStyle = "red";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawStar(star) {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.x -= obstacleSpeed;
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
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  speed: 5,
};

function drawSpaceship() {
  ctx.fillStyle = "white";
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
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
  return (
    spaceship.x < obstacle.x + obstacle.width &&
    spaceship.x + spaceship.width > obstacle.x &&
    spaceship.y < obstacle.y + obstacle.height &&
    spaceship.y + spaceship.height > obstacle.y
  );
}

function isCollidingWithStar(spaceship, star) {
  // Find the closest point to the star on the spaceship
  const closestX = clamp(star.x, spaceship.x, spaceship.x + spaceship.width);
  const closestY = clamp(star.y, spaceship.y, spaceship.y + spaceship.height);

  // Calculate the distance between the star's center and this closest point
  const distanceX = star.x - closestX;
  const distanceY = star.y - closestY;

  // If the distance is less than the star's radius, collision detected
  return (
    distanceX * distanceX + distanceY * distanceY < star.radius * star.radius
  );
}

// Helper function to clamp values
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveObstacles();
  moveStars();
  updateDifficulty();
  // Check for collisions
  obstacles.forEach((obstacle) => {
    if (isCollidingWithObstacle(spaceship, obstacle)) {
      // Handle collision with obstacle
      console.log("Collision with obstacle!");
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

  requestAnimationFrame(update);
}

setInterval(createObstacle, 2000); // Create a new obstacle every 2000 milliseconds
setInterval(createStar, 1000); // Create a new star every 1000 milliseconds

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
}

document.addEventListener("keydown", keyDownHandler);

update();
