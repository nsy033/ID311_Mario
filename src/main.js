import '../css/style.css';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TILE_W_COUNT,
  TILE_H_COUNT,
  TIME_INTERVAL,
} from './Constants.js';
import { MapFactory } from './Map.js';

import { Block, Grass } from '../src/Block';
import { Star, StarBlock } from '../src/Star';
import { Fire, Thorn } from '../src/Obstacle.js';
import { Mario } from '../src/Mario.js';

const images = {};
let map = [];
let tiles = [];
let directions = [];
let mario;

function preload() {
  images['background'] = loadImage('../data/background.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  map = MapFactory.getInstance().getTiles(1);
  directions = MapFactory.getInstance().getDirections(1);
  imageMode(CENTER);
  angleMode(DEGREES);

  mario = Mario.getInstance();
  mario.setPosition(4, 4, 2, 1);

  for (let j = 0; j < TILE_H_COUNT; j++) {
    tiles.push(new Array(TILE_W_COUNT));
    for (let i = 0; i < TILE_W_COUNT; i++) {
      const dir = directions[j][i];
      if (map[j][i] == 0) continue;

      if (map[j][i] == 1) {
        tiles[j][i] = new Block(i, j, dir);
      } else if (map[j][i] == 2) {
        tiles[j][i] = new Grass(i, j, dir);
      } else if (map[j][i] == 3) {
        tiles[j][i] = new Star(i, j, dir);
      } else if (map[j][i] == 4) {
        tiles[j][i] = new StarBlock(i, j, dir);
      } else if (map[j][i] == 5) {
        tiles[j][i] = new Fire(i, j, dir);
      } else if (map[j][i] == 6) {
        tiles[j][i] = new Thorn(i, j, dir);
      }

      mario.subscribe(tiles[j][i]);
      tiles[j][i].subscribe(mario);
    }
  }

  setInterval(() => {
    checkKeyboardInput();
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
  clear();

  image(images['background'], CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  drawMap();

  mario.draw();
}

function mousePressed() {
  //   console.log(mouseX, mouseY);
}

function checkKeyboardInput() {
  if (keyIsDown(RIGHT_ARROW)) {
    mario.move(1);
  } else if (keyIsDown(LEFT_ARROW)) {
    mario.move(-1);
  }
}

function keyReleased(e) {
  mario.beStable();
  if (e.keyCode == 32 && mario.standOnSth()) {
    const curGravity = mario.getDirection(0);
    mario.setDirection((curGravity + 2) % 4);
  }
}

function gravityOperates() {
  mario.forceGravity();
}

// Do not touch these
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.keyReleased = keyReleased;
