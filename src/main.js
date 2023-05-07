import '../css/style.css';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TILE_W_COUNT,
  TILE_H_COUNT,
  TIME_INTERVAL,
  CELL_TYPES,
  STATUS,
} from './Constants.js';
import { MapFactory } from './Map.js';

import { Block, Grass } from '../src/Block';
import { Star, StarBlock } from '../src/Star';
import { Fire, Thorn } from '../src/Obstacle.js';
import { Mario } from '../src/Mario.js';
import { GameManager } from './GameManager.js';

const images = {};
let gameManager;
let map = [];
let tiles = [];
let directions = [];
let mario;

function preload() {
  images['background'] = loadImage('../data/background.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  gameManager = GameManager.getInstance();

  map = MapFactory.getInstance().getTiles(1);
  directions = MapFactory.getInstance().getDirections(1);
  imageMode(CENTER);
  angleMode(DEGREES);

  mario = Mario.getInstance();
  mario.setPosition(4, 4, 2, 1);

  const fires = [];

  for (let j = 0; j < TILE_H_COUNT; j++) {
    tiles.push(new Array(TILE_W_COUNT));
    for (let i = 0; i < TILE_W_COUNT; i++) {
      const dir = directions[j][i];
      if (map[j][i] == CELL_TYPES.empty) continue;

      if (map[j][i] == CELL_TYPES.block) {
        tiles[j][i] = new Block(i, j, dir);
      } else if (map[j][i] == CELL_TYPES.grass) {
        tiles[j][i] = new Grass(i, j, dir);
      } else {
        if (map[j][i] == CELL_TYPES.star) {
          tiles[j][i] = new Star(i, j, dir);
        } else if (map[j][i] == CELL_TYPES.starblock) {
          tiles[j][i] = new StarBlock(i, j, dir);
        } else if (map[j][i] == CELL_TYPES.fire) {
          tiles[j][i] = new Fire(i, j, dir);
          fires.push(tiles[j][i]);
        } else if (map[j][i] == CELL_TYPES.thorn) {
          tiles[j][i] = new Thorn(i, j, dir);
        }
        tiles[j][i].subscribe(gameManager);
      }

      mario.subscribe(tiles[j][i]);
      tiles[j][i].subscribe(mario);
    }
  }

  for (let j = 0; j < TILE_H_COUNT; j++) {
    for (let i = 0; i < TILE_W_COUNT; i++) {
      if (typeof tiles[j][i] != 'object') continue;

      for (const fire of fires) {
        if (fire == tiles[j][i]) continue;
        tiles[j][i].subscribe(fire);
        fire.subscribe(tiles[j][i]);
      }
    }
  }

  setInterval(() => {
    keyPressed();
    gravityOperates();
  }, TIME_INTERVAL);
}

function drawMap() {
  for (let j = 0; j < TILE_H_COUNT; j++) {
    for (let i = 0; i < TILE_W_COUNT; i++) {
      if (typeof tiles[j][i] != 'object') continue;

      tiles[j][i].draw();
    }
  }
}

function draw() {
  const gameStatus = gameManager.getStatus();
  clear();

  if (gameStatus == STATUS.alive) {
    image(images['background'], CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    drawMap();
    mario.draw();
  } else if (gameStatus == STATUS.gameover) {
    image(images['background'], CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    drawMap();
    mario.draw();
  } else {
    image(images['background'], CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    drawMap();
    mario.draw();
  }
}

function keyPressed() {
  const gameStatus = gameManager.getStatus();
  if (gameStatus == STATUS.alive) {
    if (keyIsDown(RIGHT_ARROW)) {
      mario.move(1);
    } else if (keyIsDown(LEFT_ARROW)) {
      mario.move(-1);
    }
  }
}

function keyReleased(e) {
  const gameStatus = gameManager.getStatus();
  if (gameStatus == STATUS.alive) {
    mario.beStable();
    if (e.keyCode == 32 && mario.standOnSth()) {
      const curGravity = mario.getDirection(0);
      mario.setDirection((curGravity + 2) % 4);
    }
  }
}

function gravityOperates() {
  const gameStatus = gameManager.getStatus();
  if (gameStatus == STATUS.alive) {
    mario.recieveGravity();
  }
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyReleased = keyReleased;
