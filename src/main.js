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
let tiles = [];
let directions = [];
let mario;

function preload() {
  images['background'] = loadImage('../data/background.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  tiles = MapFactory.getInstance().getTiles(1);
  directions = MapFactory.getInstance().getDirections(1);
  imageMode(CENTER);
  angleMode(DEGREES);

  mario = Mario.getInstance();
  mario.setPosition(4, 4, 0, 0);

  for (let j = 0; j < TILE_H_COUNT; j++) {
    for (let i = 0; i < TILE_W_COUNT; i++) {
      const dir = directions[j][i];
      if (tiles[j][i] == 0) continue;

      if (tiles[j][i] == 1) {
        tiles[j][i] = new Block(i, j, dir);
      } else if (tiles[j][i] == 2) {
        tiles[j][i] = new Grass(i, j, dir);
      } else if (tiles[j][i] == 3) {
        tiles[j][i] = new Star(i, j, dir);
      } else if (tiles[j][i] == 4) {
        tiles[j][i] = new StarBlock(i, j, dir);
      } else if (tiles[j][i] == 5) {
        tiles[j][i] = new Fire(i, j, dir);
      } else if (tiles[j][i] == 6) {
        tiles[j][i] = new Thorn(i, j, dir);
      }

      mario.subscribe(tiles[j][i]);
    }
  }

  setInterval(() => {
    checkKeyboardInput();
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
  update();
  drawMap();

  mario.draw();
}

function update() {
  if (keyIsPressed) {
    // mario moves
    return;
  }
}

function mousePressed() {
  console.log(mouseX, mouseY);
}

function checkKeyboardInput() {
  if (keyIsDown(RIGHT_ARROW)) {
    mario.move(1);
  } else if (keyIsDown(LEFT_ARROW)) {
    mario.move(-1);
  } else {
    mario.beStable();
  }
}

// Do not touch these
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
// window.keyPressed = keyPressed;
