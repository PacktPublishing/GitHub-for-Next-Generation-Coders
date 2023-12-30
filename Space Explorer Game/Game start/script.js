const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  requestAnimationFrame(update);
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    spaceship.x += spaceship.speed;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    spaceship.x -= spaceship.speed;
  }
}

document.addEventListener("keydown", keyDownHandler);

update();
