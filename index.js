const MAX_ROW = 20;
const MAX_COLUMN = 32;
const TILE_SIZE = 32;
const HP_AMOUNT = 100;
const HP_RECOVERY = 25;

const WALL_CODE = 0;
const PLAYER_CODE = 1;
const ENEMY_CODE = 2;
const POTION_CODE = 3;
const SWORD_CODE = 4;
const FLOOR_CODE = 5;
TILE_TYPE = {
  0: "tileW",
  1: "tileP",
  2: "tileE",
  3: "tileHP",
  4: "tileSW",
  5: "tile",
};

WEAPON = {
  0: { name: "Sword", damage: 30 },
  1: { name: "Stick of Truth", damage: 15 },
  2: { name: "Excalibur", damage: 60 },
};
class Game {
  constructor() {
    this.map = [];
    this.enemies = [];
    this.enemiesIntervalId = null;
    this.floor = [];
    this.rooms = [];
  }
}

class Player {
  constructor(coords) {
    this.hp = HP_AMOUNT;
    this.weapon = { name: "Fist", damage: "20" };
    this.coords = coords;
  }
}
class Enemy {
  constructor(coords) {
    this.hp = 60;
    this.damage = 25;
    this.coords = coords;
  }
}

let player = new Player();
Game.prototype.init = function () {
  generateEmptyMap();
  for (let i = 0; i < Math.round(Math.random() * 5) + 5; i++) {
    genRoom();
  }

  for (let i = 0; i < Math.round(Math.random() * 2) + 3; i++) {
    genHorizLine();
  }
  for (let i = 0; i < Math.round(Math.random() * 2) + 3; i++) {
    genVertLine();
  }
  for (let i = 0; i < 10; i++) {
    genObject(ENEMY_CODE);
  }
  for (let i = 0; i < 2; i++) {
    genObject(SWORD_CODE);
  }
  for (let i = 0; i < 10; i++) {
    genObject(POTION_CODE);
  }
  genObject(PLAYER_CODE);

  //const enemiesInterval = setInterval(randomEnemyMovement, 1000);
  //game.enemiesIntervalId = enemiesInterval;

  renderMap();
};
function generateEmptyMap() {
  for (let x = 0; x < MAX_COLUMN; x++) {
    game.map.push([]);
    for (let y = 0; y < MAX_ROW; y++) {
      game.map[x].push(Math.round(WALL_CODE));
    }
  }
}

function genRoom() {
  const maxRoomWidth = Math.round(Math.random() * 5) + 3;
  const maxRoomHeight = Math.round(Math.random() * 5) + 3;

  if (true) {
    const start_x = Math.round(Math.random() * (game.map.length - 1));
    const start_y = Math.round(Math.random() * (game.map[0].length - 1));

    for (let s_x = 0; s_x < maxRoomWidth; s_x++) {
      for (let s_y = 0; s_y < maxRoomHeight; s_y++) {
        if (
          start_x + s_x < game.map.length - 1 &&
          start_y + s_y < game.map[0].length - 1
        ) {
          game.map[start_x + s_x][start_y + s_y] = FLOOR_CODE;
          setFreeFloor(start_x + s_x, start_y + s_y);
        }
      }
    }
  }
}

function genObject(tileType) {
  let randomPosition = Math.round(Math.random() * (game.floor.length - 1));
  let objectPosition = game.floor[randomPosition];
  game.floor.splice(randomPosition, 1);
  game.map[objectPosition[0]][objectPosition[1]] = tileType;
  if (tileType === PLAYER_CODE) {
    player.coords = { x: objectPosition[0], y: objectPosition[1] };
  }

  if (tileType === ENEMY_CODE) {
    game.enemies.push(
      new Enemy({ x: objectPosition[0], y: objectPosition[1] })
    );
  }
}
function genVertLine() {
  const start_y = Math.round(Math.random() * (game.map[0].length - 1));

  for (let height = 0; height < game.map[0].length; height++) {
    game.map[start_y][height] = FLOOR_CODE;
    setFreeFloor(start_y, height);
  }
}
function genHorizLine() {
  const start_x = Math.round(Math.random() * (game.map[0].length - 1));
  for (let height = 0; height < game.map.length; height++) {
    game.map[height][start_x] = FLOOR_CODE;
    setFreeFloor(height, start_x);
  }
}
Array.prototype.includesNested = function (arr) {
  return Boolean(
    this.find((element) => element[0] == arr[0] && element[1] == arr[1])
  );
};
function setFreeFloor(x, y) {
  if (!game.floor.includesNested([x, y])) {
    game.floor.push([x, y]);
  }
}

function resetMap() {
  $(".field").empty();
}

function resetGame() {
  game = new Game();
  player = new Player();
}
function renderMap() {
  resetMap();

  let tempEnemyIndex = 0;
  for (let x = 0; x < MAX_COLUMN; x++) {
    for (let y = 0; y < MAX_ROW; y++) {
      $(".field").append(
        `<div class="tile" style="left: ${x * TILE_SIZE}px; top: ${
          y * TILE_SIZE
        }px; width: ${TILE_SIZE}px; height: ${TILE_SIZE}px" >
        <div class=${
          TILE_TYPE[game.map[x][y]]
        } style=" background-size: ${TILE_SIZE}px ${TILE_SIZE}px; height:100%; width: 100%;" ${
          game.map[x][y] == ENEMY_CODE
            ? "id=enemy_" +
              game.enemies.indexOf(
                game.enemies.find((enemy) => {
                  return enemy.coords.x == x && enemy.coords.y == y;
                })
              )
            : ""
        } ></div>
        </div>`
      );
      if (game.map[x][y] == ENEMY_CODE) tempEnemyIndex++;
    }
  }
  renderInventory();
  renderHP();
}

function resetInventory() {
  $(".inventory").empty();
}

function renderInventory() {
  resetInventory();
  $(".inventory").append(
    `Weapon: ${player.weapon.name}  Damage: ${player.weapon.damage}`
  );
}
function resetHP() {
  $(".tileP").empty();
  for (let i = 0; i < game.enemies.length; i++) $(`#enemy_${i}`).empty();
}
function renderHP() {
  resetHP();

  $(`.tileP`).append(
    `<div class="health" style="width: ${
      (player.hp / HP_AMOUNT) * 100
    }%"></div>`
  );

  for (let i = 0; i < game.enemies.length; i++) {
    $(`#enemy_${i}`).append(
      `<div class="health" style="width: ${
        (game.enemies[i].hp / HP_AMOUNT) * 100
      }%"></div>`
    );
  }
}
function removeObjFromMap(x, y) {
  // make this a floor coordinate
  game.map[x][y] = FLOOR_CODE;
}
function updatePlayerPosition(oldX, oldY, newX, newY) {
  removeObjFromMap(oldX, oldY);
  game.map[newX][newY] = PLAYER_CODE;

  player.coords = {
    x: newX,
    y: newY,
  };
  renderMap();
}

function gameOver() {
  alert("GAME OVER");
  resetGame();
  game.init();
}

function userWins() {
  alert("USER WIN");
  resetGame();
  game.init();
}

function enemyDefeated(enemy) {
  // remove enemy from  2D array
  removeObjFromMap(enemy.coords.x, enemy.coords.y);

  // remove enemy from enemies array
  let e_idx = game.enemies.indexOf(enemy);

  // remove enemy from array
  game.enemies.splice(e_idx, 1);

  // if no enemies, user wins
  if (game.enemies.length == 0) {
    userWins();
  }
}

function fightEnemy(enemy) {
  if (player.hp - enemy.damage <= 0) {
    gameOver();
    return;
  }
  if (enemy.hp - player.weapon.damage <= 0) {
    enemyDefeated(enemy);
    renderMap();
  } else {
    enemy.hp -= player.weapon.damage;
  }
  player.hp -= enemy.damage;
  renderHP();
}
$(document).on("keydown", function (e) {
  var x = player.coords.x;
  var y = player.coords.y;
  var oldX = player.coords.x;
  var oldY = player.coords.y;

  switch (e.which) {
    case 37: // left
      if (x > 0) x--;
      break;
    case 38: // up
      if (y > 0) y--;
      break;
    case 39: // right
      if (x < game.map.length - 1) x++;
      break;
    case 40: // down
      if (y < game.map[0].length - 1) y++;
      break;
    default:
      return; // exit this handler for other keys
  }
  if (game.map[x][y] == ENEMY_CODE) {
    const matching_coords = (enemy) => {
      return enemy.coords.x == x && enemy.coords.y == y;
    };
    let enemy = game.enemies.find(matching_coords);
    fightEnemy(enemy);
  } else if (game.map[x][y] != WALL_CODE) {
    if (game.map[x][y] == POTION_CODE) {
      player.hp = player.hp + HP_RECOVERY;
      if (player.hp > HP_AMOUNT) player.hp = HP_AMOUNT;
    } else if (game.map[x][y] == SWORD_CODE) {
      player.weapon = WEAPON[pickRandom()];
      console.log(pickRandom());
    }
    updatePlayerPosition(oldX, oldY, x, y);
  }
});

function pickRandom() {
  return Math.round(Math.random() * (Object.keys(WEAPON).length - 1));
}
function randomEnemyMovement() {
  const randomEnemy = Math.round(Math.random() * (game.enemies.length - 1));
  const enemy = game.enemies[randomEnemy];
  var x = enemy.coords.x;
  var y = enemy.coords.y;
  var oldX = enemy.coords.x;
  var oldY = enemy.coords.y;

  const sign = [-1, 1];
  const randomSign = sign[Math.round(Math.random())];
  const randomDirection = Math.round(Math.random());

  if (randomDirection == 0) {
    let temp = x + randomSign;
    if (temp < game.map.length && temp > 0) x = temp;
  } else {
    let temp = y + randomSign;
    if (temp < game.map[0].length && temp > 0) y = temp;
  }

  if (game.map[x][y] == PLAYER_CODE) {
    fightEnemy(enemy);
  } else if (
    game.map[x][y] != WALL_CODE &&
    game.map[x][y] != POTION_CODE &&
    game.map[x][y] != SWORD_CODE &&
    game.map[x][y] != ENEMY_CODE
  ) {
    updateEnemyPosition(oldX, oldY, x, y, randomEnemy);
  }
}

function updateEnemyPosition(oldX, oldY, newX, newY, enemyIndex) {
  removeObjFromMap(oldX, oldY);
  game.map[newX][newY] = ENEMY_CODE;

  game.enemies[enemyIndex].coords = {
    x: newX,
    y: newY,
  };
  renderMap();
}
