const MAX_ROW = 20;
const MAX_COLUMN = 32;
const TILE_SIZE = 32;
const HP_AMOUNT = 200;
const ENEMY_HP = 60;
const HP_RECOVERY = 25;

const ENEMY_COUNT = 10;
const POTION_COUNT = 10;
const WEAPON_COUNT = 2;

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
    this.enemiesAttackIntervalId = null;
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
    this.hp = ENEMY_HP;
    this.damage = 25;
    this.coords = coords;
  }
}

let player = new Player();
Game.prototype.init = function () {
  generateEmptyMap();
  for (let i = 0; i < pickRandomValue(10, 5); i++) {
    genRoom();
  }

  for (let i = 0; i < pickRandomValue(5, 3); i++) {
    genHorizLine();
  }
  for (let i = 0; i < pickRandomValue(5, 3); i++) {
    genVertLine();
  }
  for (let i = 0; i < ENEMY_COUNT; i++) {
    genObject(ENEMY_CODE);
  }
  for (let i = 0; i < WEAPON_COUNT; i++) {
    genObject(SWORD_CODE);
  }
  for (let i = 0; i < POTION_COUNT; i++) {
    genObject(POTION_CODE);
  }
  genObject(PLAYER_CODE);

  const enemiesInterval = setInterval(randomEnemyMovement, 500);
  game.enemiesIntervalId = enemiesInterval;
  const enemiesAttack = setInterval(enemyAttack, 1000);
  game.enemiesAttackIntervalId = enemiesAttack;

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
  const maxRoomWidth = pickRandomValue(8, 3);
  const maxRoomHeight = pickRandomValue(8, 3);

  if (true) {
    const start_x = pickRandomValue(game.map.length - 1, 0);
    const start_y = pickRandomValue(game.map[0].length - 1, 0);

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
  let randomPosition = pickRandomValue(game.floor.length - 1, 0);
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

function pickRandomValue(max, min) {
  return Math.round(Math.random() * (max - min)) + min;
}
function genVertLine() {
  const start_y = pickRandomValue(game.map[0].length - 1, 0);

  for (let height = 0; height < game.map[0].length; height++) {
    game.map[start_y][height] = FLOOR_CODE;
    setFreeFloor(start_y, height);
  }
}
function genHorizLine() {
  const start_x = pickRandomValue(game.map[0].length - 1, 0);
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

function resetGame() {
  clearInterval(game.enemiesIntervalId);
  clearInterval(game.enemiesAttackIntervalId);
  game = new Game();
  player = new Player();
}

function resetMap() {
  $(".field").empty();
}

function renderMap() {
  resetMap();

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
        } >  </div>
        </div>`
      );
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
        (game.enemies[i].hp / ENEMY_HP) * 100
      }%"></div>`
    );
  }
}

function removeObjFromMap(x, y) {
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
  setTimeout(game.init, 10);
  //game.init();
}

function userWins() {
  alert("USER WIN");
  resetGame();
  setTimeout(game.init, 10);
}

function enemyDefeated(enemy) {
  removeObjFromMap(enemy.coords.x, enemy.coords.y);
  let e_idx = game.enemies.indexOf(enemy);
  game.enemies.splice(e_idx, 1);
  renderMap();
  if (game.enemies.length == 0) {
    userWins();
  }
}

function fightEnemy(enemy, code = -1) {
  if (code == PLAYER_CODE) {
    if (enemy.hp - player.weapon.damage <= 0) {
      enemyDefeated(enemy);
    }
    console.log("attack");
    enemy.hp -= player.weapon.damage;
    console.log(enemy.hp);
  } else if (code == ENEMY_CODE) {
    if (player.hp - enemy.damage <= 0) {
      gameOver();
      return;
    }
    player.hp -= enemy.damage;
  }
  renderHP();
}

function checkNear(x, y) {
  const matching_coords = (enemy) => {
    return enemy.coords.x == x && enemy.coords.y == y;
  };
  let enemy = game.enemies.find(matching_coords);
  return enemy;
}

$(document).on("keyup", function (e) {
  try {
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
      case 32:
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let enemy = checkNear(x + i, y + j);
            console.log(enemy);
            if (enemy) {
              fightEnemy(enemy, PLAYER_CODE);
              break;
            }
          }
        }
        break;
      default:
        return; // exit this handler for other keys
    }
    if (game.map[x][y] != WALL_CODE && game.map[x][y] != ENEMY_CODE) {
      if (game.map[x][y] == POTION_CODE) {
        player.hp = player.hp + HP_RECOVERY;
        if (player.hp > HP_AMOUNT) player.hp = HP_AMOUNT;
      } else if (game.map[x][y] == SWORD_CODE) {
        player.weapon =
          WEAPON[pickRandomValue(Object.keys(WEAPON).length - 1, 0)];
      }
      updatePlayerPosition(oldX, oldY, x, y);
    }
  } catch (e) {
    console.log("Map still not setting up", e);
  }
});

function randomEnemyMovement() {
  const randomEnemy = pickRandomValue(game.enemies.length - 1, 0);
  const enemy = game.enemies[randomEnemy];
  var x = enemy.coords.x;
  var y = enemy.coords.y;
  var oldX = enemy.coords.x;
  var oldY = enemy.coords.y;

  const sign = [-1, 1];
  const randomSign = sign[pickRandomValue(1, 0)];
  const randomDirection = pickRandomValue(1, 0);

  if (randomDirection == 0) {
    let temp = x + randomSign;
    if (temp < game.map.length && temp > 0) x = temp;
  } else {
    let temp = y + randomSign;
    if (temp < game.map[0].length && temp > 0) y = temp;
  }

  if (
    game.map[x][y] != WALL_CODE &&
    game.map[x][y] != POTION_CODE &&
    game.map[x][y] != SWORD_CODE &&
    game.map[x][y] != ENEMY_CODE &&
    game.map[x][y] != PLAYER_CODE
  ) {
    updateEnemyPosition(oldX, oldY, x, y, randomEnemy);
  }
}

function enemyAttack() {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let enemy = checkNear(player.coords.x + i, player.coords.y + j);
      if (enemy) fightEnemy(enemy, ENEMY_CODE);
    }
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
