const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
context.scale(20, 20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = '#f6d365';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (
        m[y][x] &&
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  player.matrix = matrix;
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (matrix[0].length / 2 | 0);
}

function playerRotate() {
  const m = player.matrix;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [m[x][y], m[y][x]] = [m[y][x], m[x][y]];
    }
  }
  m.forEach(row => row.reverse());
  if (collide(arena, player)) {
    for (let i = 0; i < 3; ++i) {
      m.forEach(row => row.reverse());
    }
  }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') playerMove(-1);
  else if (event.key === 'ArrowRight') playerMove(1);
  else if (event.key === 'ArrowDown') playerDrop();
  else if (event.key === 'ArrowUp') playerRotate();
});

const arena = createMatrix(12, 20);
const player = {
  pos: { x: 0, y: 0 },
  matrix: matrix,
};

playerReset();
update();
