const MAX_ROW = 10;
const MAX_COLUMN = 16;
const TILE_SIZE = 64;
const HP_AMOUNT = 100;
const HP_RECOVERY = 50;

TILE_TYPE = {
  0: "tileW",
  1: "tileP",
  2: "tileE",
  3: "tileHP",
  4: "tileSW",
  5: "tile",
};

WEAPON_TYPE = {
  sword: 30,
  fist: 20,
};
class Game {
  constructor() {
    this.map = [];
    this.enemies = [];
    this.floor = [];
    this.rooms = [];
  }
}

class Player {
  constructor(coords) {
    this.hp = HP_AMOUNT;
    this.weapon = WEAPON_TYPE.fist;
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
  for (let i = 0; i < 10; i++) {
    genRoom();
  }

  for (let i = 0; i < 1; i++) {
    genVertLine();
  }
  for (let i = 0; i < 3; i++) {
    genHorizLine();
  }
  for (let i = 0; i < 3; i++) {
    genHorizLine();
  }
  for (let i = 0; i < Math.round(Math.random() * 5); i++) {
    genObject(2);
  }
  for (let i = 0; i < Math.round(Math.random() * 8); i++) {
    genObject(4);
  }
  for (let i = 0; i < Math.round(Math.random() * 8); i++) {
    genObject(3);
  }
  genObject(1);
  renderMap();
};
function generateEmptyMap() {
  for (let x = 0; x < MAX_COLUMN; x++) {
    game.map.push([]);
    for (let y = 0; y < MAX_ROW; y++) {
      game.map[x].push(Math.round(0));
    }
  }
}

function genRoom() {
  const maxRoomWidth = MAX_COLUMN / 6;
  const maxRoomHeight = MAX_ROW / 5;

  const minRoomWidth = 2;
  const minRoomHeight = 2;

  if (true) {
    const start_x = Math.round(Math.random() * (game.map.length - 1));
    const start_y = Math.round(Math.random() * (game.map[0].length - 1));

    for (let s_x = 0; s_x < maxRoomWidth; s_x++) {
      for (let s_y = 0; s_y < maxRoomHeight; s_y++) {
        if (
          start_x + s_x < game.map.length - 1 &&
          start_y + s_y < game.map[0].length - 1
        ) {
          //console.log(start_x + s_x, start_y + s_y);
          game.map[start_x + s_x][start_y + s_y] = 5;
          setFreeFloor(start_x + s_x, start_y + s_y);
        }
      }
    }
  }
}

function genObject(tileType) {
  let randomPosition = Math.round(Math.random() * (game.floor.length - 1));
  let objectPosition = game.floor[randomPosition];
  console.log(objectPosition[0], objectPosition[1]);
  game.floor.splice(randomPosition, 1);
  game.map[objectPosition[0]][objectPosition[1]] = tileType;
  if (tileType === 1) {
    player.coords = { x: objectPosition[0], y: objectPosition[1] };
  }
}
function genVertLine() {
  const start_y = Math.round(Math.random() * (game.map[0].length - 1));

  for (let height = 0; height < game.map[0].length; height++) {
    game.map[start_y][height] = 5;
    console.log("start_y", start_y, height);
    setFreeFloor(start_y, height);
  }
}
function genHorizLine() {
  const start_x = Math.round(Math.random() * (game.map[0].length - 1));
  for (let height = 0; height < game.map.length; height++) {
    console.log("start_x", height, start_x);

    game.map[height][start_x] = 5;
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
function renderMap() {
  for (let x = 0; x < MAX_COLUMN; x++) {
    for (let y = 0; y < MAX_ROW; y++) {
      $(".field").append(
        `<div class="tile" style="left: ${x * TILE_SIZE}px; top: ${
          y * TILE_SIZE
        }px; width: ${TILE_SIZE}px; height: ${TILE_SIZE}px" >
        <div class=${
          TILE_TYPE[game.map[x][y]]
        } style=" background-size: ${TILE_SIZE}px ${TILE_SIZE}px; height:100%; width: 100%;" >${x} ${y}</div>
        </div>`
      );
    }
  }
}

function removeObjFromMap(x, y) {
  // make this a floor coordinate
  game.map[x][y] = 5;
}
function updatePlayerPosition(oldX, oldY, newX, newY) {
  console.log(oldX, oldY);
  removeObjFromMap(oldX, oldY);
  game.map[newX][newY] = 1;

  player.coords = {
    x: newX,
    y: newY,
  };
  renderMap();
}
$(document).on("keydown", function (e) {
  var x = player.coords.x;
  var y = player.coords.y;
  var oldX = player.coords.x;
  var oldY = player.coords.y;

  switch (e.which) {
    case 37: // left
      x--;
      break;
    case 38: // up
      y--;
      break;
    case 39: // right
      x++;
      break;
    case 40: // down
      y++;
      break;
    default:
      return; // exit this handler for other keys
  }

  updatePlayerPosition(player.coords.x, player.coords.y, x, y);
});
