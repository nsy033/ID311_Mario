//Assets
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
  TOTAL_STAGES,
  TILE_SIZE,
  HALF_TILE_SIZE,
  TOTAL_LIVES,
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

function drawPipe() {
  for (let j = 0; j < TILE_H_COUNT; j++) {
    for (let i = 0; i < TILE_W_COUNT; i++) {
      if (map[j][i] == 7) tiles[j][i].draw();
    }
  }
}

function draw() {
  clear();

  image(
    images['background'],
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
  drawMap();
  mario.draw();
  drawPipe();

  const gameStatus = gameManager.getStatus();
  [map, tiles] = gameManager.getStageSetup();
  gameManager.drawStageInfo();

  if (gameStatus == STATUS.ready) {
    fill('rgba(0, 0, 0, 0.5)');
    noStroke();
    rect(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);

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
    gameManager.drawEnding(mario.getPosition());
    gameManager.drawStageInfo();
  } else if (gameStatus == STATUS.succeed) {
    gameManager.drawEnding(mario.getPosition());
    gameManager.drawStageInfo();
  } else if (gameStatus == STATUS.allCleared || gameStatus == STATUS.theEnd) {
    const yStartingPoint = gameManager.getGameSummaryStartingPoint();

    fill(0);
    noStroke();
    rect(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);

    const btnImg = gameManager.getButton();
    const btnRatio = btnImg.width / btnImg.height;
    const jitter = { x: random(-1, 1), y: random(-1, 1) };
    image(
      btnImg,
      CANVAS_WIDTH / 2 + jitter.x,
      CANVAS_HEIGHT / 2 + jitter.y - TILE_SIZE * 1.5 + yStartingPoint,
      Math.floor(BTN_HEIGHT * btnRatio),
      BTN_HEIGHT
    );

    fill(255);
    noStroke();

    textAlign(LEFT, TOP);
    text(
      `UPTO STAGE\t ${gameManager.getCurStage()} / ${TOTAL_STAGES}`,
      CANVAS_WIDTH / 3,
      CANVAS_HEIGHT / 2 + HALF_TILE_SIZE + yStartingPoint
    );

    text(
      `TRIAL\t ${
        gameManager.getTrials() - Number(gameStatus == STATUS.theEnd)
      }`,
      CANVAS_WIDTH / 3,
      CANVAS_HEIGHT / 2 + TILE_SIZE * 1.5 + yStartingPoint
    );

    text(
      `LIFE`,
      CANVAS_WIDTH / 3,
      CANVAS_HEIGHT / 2 + TILE_SIZE * 2.5 + yStartingPoint
    );
    const heartOnCnt = Math.min(
      TOTAL_LIVES - gameManager.getTrials() + 1,
      TOTAL_LIVES
    );
    for (let i = 1; i <= TOTAL_LIVES; i++) {
      image(
        i <= heartOnCnt ? gameManager.hearts['on'] : gameManager.hearts['off'],
        CANVAS_WIDTH / 2.5 + TILE_SIZE * i * 0.75,
        CANVAS_HEIGHT / 2 + TILE_SIZE * 2.75 + yStartingPoint,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }
}
function gravityOperates() {
  const gameStatus = gameManager.getStatus();
  if (gameStatus == STATUS.alive) {
    mario.receiveGravity();
  }
}

function mousePressed() {
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
  const gameStatus = gameManager.getStatus();
  if (gameStatus == STATUS.alive) {
    if (mario.getDirection() % 2 == 0) {
      if (keyIsDown(RIGHT_ARROW)) {
        mario.move(1);
      } else if (keyIsDown(LEFT_ARROW)) {
        mario.move(-1);
      }
    } else {
      if (keyIsDown(DOWN_ARROW)) {
        mario.move(1);
      } else if (keyIsDown(UP_ARROW)) {
        mario.move(-1);
      }
    }
  }
}

function keyReleased(e) {
  const gameStatus = gameManager.getStatus();
  if (gameStatus == STATUS.alive) {
    if (e.keyCode == 32 && mario.standOnSth()) {
      sounds['jumpSound'].play();
      const curGravity = mario.getDirection(0);
      mario.setDirection((curGravity + 2) % 4);
    }
  }
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.keyReleased = keyReleased;
