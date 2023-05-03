import '../css/style.css';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TILE_W_COUNT,
  TILE_H_COUNT,
} from './Constants.js';
import { Map } from './maps.js';

import { Block, Grass } from '../src/Block';
import { Star, StarBlock } from '../src/Star';
import { Fire, Thorn } from '../src/Obstacle.js';

const images = {};
let tiles = [];
let directions = [];

function preload() {
  images['background'] = loadImage('../data/background.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  tiles = Map.getInstance().getTiles(1);
  directions = Map.getInstance().getDirections(1);
  imageMode(CENTER);
  angleMode(DEGREES);

  for (let j = 0; j < TILE_H_COUNT; j++) {
    for (let i = 0; i < TILE_W_COUNT; i++) {
      const dir = directions[j][i];
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
      } else continue;
    }
  }
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

// Do not touch these
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
// window.keyPressed = keyPressed;
