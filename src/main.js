import background from '../data/images/background.png';
import titleTheme from '../data/sounds/TitleTheme.mp3';
import itsMeMario from '../data/sounds/ItsMeMario.mp3';
import gameStart from '../data/sounds/GameStart.mp3';
import gameOver from '../data/sounds/death-sound-effect.mp3';
import courseClear from '../data/sounds/CourseClear.mp3';
import allClear from '../data/sounds/stage-clear-sound-effect.mp3';
import theEnd from '../data/sounds/gameover.mp3';
import jumpSound from '../data/sounds/jump-sound-effect.mp3';
import coinSound from '../data/sounds/coin-sound-effect.mp3';

import '../css/style.css';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BTN_HEIGHT,
  TILE_W_COUNT,
  TILE_H_COUNT,
  TIME_INTERVAL,
  STATUS,
} from './Constants.js';
import { Mario } from '../src/Mario.js';
import { GameManager } from './GameManager.js';

const images = {};
const sounds = {};
let gameManager;
let map = [];
let tiles = [];
let mario;

function preload() {
  images['background'] = loadImage(background);

  sounds['titleTheme'] = loadSound(titleTheme);
  sounds['itsMeMario'] = loadSound(itsMeMario);
  sounds['gameStart'] = loadSound(gameStart);
  sounds['gameOver'] = loadSound(gameOver);
  sounds['courseClear'] = loadSound(courseClear);
  sounds['allClear'] = loadSound(allClear);
  sounds['theEnd'] = loadSound(theEnd);
  sounds['jumpSound'] = loadSound(jumpSound);
  sounds['coinSound'] = loadSound(coinSound);
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  imageMode(CENTER);
  rectMode(CENTER);
  angleMode(DEGREES);

  mario = Mario.getInstance();
  gameManager = GameManager.getInstance(sounds);
  [map, tiles] = gameManager.getStageSetup();

  setInterval(() => {
    // receive keyboard input and force the gravity, repeatedly
    keyPressed();
    if (gameManager.getStatus() == STATUS.alive) mario.receiveGravity();
  }, TIME_INTERVAL);
}

function drawMap() {
  // draw the environmental objects
  for (let j = 0; j < TILE_H_COUNT; j++) {
    for (let i = 0; i < TILE_W_COUNT; i++) {
      if (typeof tiles[j][i] != 'object') continue;
      tiles[j][i].draw();
    }
  }
}

function drawPipe() {
  // draw pipe again, since its z-index has to be at the top
  for (let j = 0; j < TILE_H_COUNT; j++) {
    for (let i = 0; i < TILE_W_COUNT; i++) {
      if (map[j][i] == 7) tiles[j][i].draw();
    }
  }
}

function draw() {
  clear();

  // draw background image
  image(
    images['background'],
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  // draw basic objects in map
  [map, tiles] = gameManager.getStageSetup();
  drawMap();
  mario.draw();
  drawPipe();

  // draw current game status info
  const gameStatus = gameManager.getStatus();
  gameManager.drawStageInfo();

  if (gameStatus == STATUS.ready) {
    // if it is before starting the game
    // draw translucent rectangle showing map behind
    fill('rgba(0, 0, 0, 0.5)');
    noStroke();
    rect(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);

    // draw button to actually start the game
    const btnImg = gameManager.getButton();
    const btnRatio = btnImg.width / btnImg.height;
    image(
      btnImg,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      Math.floor(BTN_HEIGHT * btnRatio),
      BTN_HEIGHT
    );
  } else if (gameStatus == STATUS.gameover) {
    // if the stage is failed
    gameManager.drawEnding(mario.getPosition());
    gameManager.drawStageInfo();
  } else if (gameStatus == STATUS.succeed) {
    // if the stage is cleared
    gameManager.drawEnding(mario.getPosition());
    gameManager.drawStageInfo();
  } else if (gameStatus == STATUS.allCleared || gameStatus == STATUS.theEnd) {
    // if all the stages are cleared or all the lives are consumed
    gameManager.drawEndingCredits();
  }
}

function mousePressed() {
  // recognize mouse clicking event as button clicking
  const btnImg = gameManager.getButton();
  const btnRatio = btnImg.width / btnImg.height;
  const BTN_WIDTH = Math.floor(BTN_HEIGHT * btnRatio);
  if (
    gameManager?.getStatus() == STATUS.ready &&
    CANVAS_WIDTH / 2 - BTN_WIDTH / 2 <= mouseX &&
    mouseX <= CANVAS_WIDTH / 2 + BTN_WIDTH / 2 &&
    CANVAS_HEIGHT / 2 - BTN_HEIGHT / 2 <= mouseY &&
    mouseY <= CANVAS_HEIGHT / 2 + BTN_HEIGHT / 2
  ) {
    // if the clicking position was correctly inside of button area
    if (gameManager.gameStart) {
      sounds['itsMeMario'].play();
      gameManager.gameStart = false;
      setTimeout(() => gameManager.getStarted(), 2000);
    } else {
      sounds['coinSound'].play();
      setTimeout(() => gameManager.getStarted(), 500);
    }
  }
}

function keyPressed() {
  // recognize key pressing event as moving with direction keys
  const gameStatus = gameManager.getStatus();
  const marioIsInPipe = mario.getInPipe();
  if (gameStatus == STATUS.alive && !marioIsInPipe) {
    if (mario.getDirection() % 2 == 0) {
      if (keyIsDown(RIGHT_ARROW)) mario.move(1);
      else if (keyIsDown(LEFT_ARROW)) mario.move(-1);
    } else {
      if (keyIsDown(DOWN_ARROW)) mario.move(1);
      else if (keyIsDown(UP_ARROW)) mario.move(-1);
    }
  }
}

function keyReleased(e) {
  // recognize key releasing event only for spacebar ...
  const gameStatus = gameManager.getStatus();
  if (e.keyCode == 32) {
    if (gameStatus == STATUS.alive && mario.standOnSth()) {
      // i. as Mario changing his gravitational direction
      sounds['jumpSound'].play();
      const curGravity = mario.getDirection(0);
      mario.setDirection((curGravity + 2) % 4);
    } else if (gameStatus == STATUS.ready) {
      // ii. as starting each stage from the ready state (the same as clicking the button)
      if (gameManager.gameStart) {
        sounds['itsMeMario'].play();
        gameManager.gameStart = false;
        setTimeout(() => gameManager.getStarted(), 2000);
      } else {
        sounds['coinSound'].play();
        setTimeout(() => gameManager.getStarted(), 500);
      }
    }
  }
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
