import startgameButton from '../data/images/startgame-button.png';
import retryButton from '../data/images/retry-button.png';
import continueButton from '../data/images/continue-button.png';
import congratulations from '../data/images/congratulations.png';
import gameover from '../data/images/gameover.png';
import heartOn from '../data/images/heart-on.png';
import heartOff from '../data/images/heart-off.png';

import {
  CANVAS_WIDTH,
  ENDCIRCLE_SIZE,
  ENDCIRCLE_SIZE_STEP,
  ENDCIRCLE_WEIGHT,
  ENDCIRCLE_INTERVAL,
  ENDCIRCLE_TIMEOUT,
  STATUS,
  TILE_W_COUNT,
  TILE_H_COUNT,
  CELL_TYPES,
  TOTAL_STAGES,
  HALF_TILE_SIZE,
  TIMEBUFFER,
  TILE_SIZE,
  CANVAS_HEIGHT,
  TOTAL_LIVES,
} from './Constants';

import { Block, Grass } from '../src/Block';
import { Star, StarBlock } from '../src/Star';
import { Fire, Thorn } from '../src/Obstacle.js';
import { Pipe } from './Pipe';
import { Mario } from '../src/Mario.js';
import { MapFactory } from '../src/Map.js';

class GameManager {
  constructor(sounds) {
    this.buttons = {};
    this.buttons['startgameButton'] = loadImage(startgameButton);
    this.buttons['retryButton'] = loadImage(retryButton);
    this.buttons['continueButton'] = loadImage(continueButton);
    this.buttons['congratulations'] = loadImage(congratulations);
    this.buttons['gameover'] = loadImage(gameover);
    this.buttonImg = this.buttons['startgameButton'];

    this.hearts = {};
    this.hearts['on'] = loadImage(heartOn);
    this.hearts['off'] = loadImage(heartOff);

    this.sounds = sounds;

    this.gameStart = true;
    this.trials = 1;

    this.gameoverCircle = {
      size: CANVAS_WIDTH * 3.5,
      weight: ENDCIRCLE_WEIGHT,
    };

    this.status = STATUS.ready;
    this.curStage = 1;
    this.stageLoaded = false;
    this.map = [];
    this.tiles = [];
  }

  static getInstance(sounds) {
    if (!this._instance) this._instance = new GameManager(sounds);
    return this._instance;
  }

  setupStage() {
    const curStage = this.getCurStage();

    const map = MapFactory.getInstance().getTiles(curStage);
    const directions = MapFactory.getInstance().getDirections(curStage);
    const startPos = MapFactory.getInstance().getStartPositions(curStage);

    const mario = Mario.getInstance();
    mario.setPosition(...startPos);
    mario.unsubscribeAll();
    mario.beStable();

    const tiles = [];
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
          } else if (map[j][i] == CELL_TYPES.pipe) {
            tiles[j][i] = new Pipe(i, j, dir);
          }
          tiles[j][i].subscribe(this);
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

    this.stageLoaded = true;
    this.map = map;
    this.tiles = tiles;

    return [map, tiles];
  }

  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }
  getTrials() {
    return this.trials;
  }

  getCurStage() {
    return this.curStage;
  }
  getStageSetup() {
    if (this.stageLoaded) return [this.map, this.tiles];
    else return this.setupStage();
  }

  getStarted() {
    if (this.getStatus() != STATUS.alive) {
      this.setStatus(STATUS.alive);
      this.sounds['titleTheme'].loop();
    }
  }

  getButton() {
    return this.buttonImg;
  }

  drawStageInfo() {
    textFont('Silkscreen');
    textSize(25);
    textAlign(CENTER, TOP);

    fill(255);
    noStroke();

    text(`LIFE`, TILE_SIZE * 1.2, HALF_TILE_SIZE);
    const heartOnCnt = Math.min(TOTAL_LIVES - this.trials + 1, TOTAL_LIVES);
    for (let i = 1; i <= TOTAL_LIVES; i++) {
      image(
        i <= heartOnCnt ? this.hearts['on'] : this.hearts['off'],
        TILE_SIZE * 1.5 + TILE_SIZE * i * 0.75,
        TILE_SIZE * 0.75,
        TILE_SIZE,
        TILE_SIZE
      );
    }

    text(
      `STAGE\t${this.curStage} / ${TOTAL_STAGES}`,
      CANVAS_WIDTH / 2,
      HALF_TILE_SIZE
    );

    text(
      `TRIALS\t${this.trials}`,
      CANVAS_WIDTH - TILE_SIZE * 2,
      HALF_TILE_SIZE
    );
  }

  getGameSummaryStartingPoint() {
    return this.yStartingPoint;
  }
  setGameSummaryStartingPoint() {
    this.yStartingPoint = CANVAS_HEIGHT / 1.5;

    setInterval(() => {
      if (this.yStartingPoint > 0) this.yStartingPoint--;
    }, 10);
  }

  drawEnding({ x, y }) {
    noFill();
    stroke(0);
    strokeWeight(ENDCIRCLE_WEIGHT);
    ellipseMode(CENTER);
    ellipse(x, y, this.gameoverCircle.size, this.gameoverCircle.size);
  }

  animateEndingMotion(isSuccessful) {
    setTimeout(() => {
      this.gameoverInterval = setInterval(() => {
        this.gameoverCircle.size =
          this.gameoverCircle.size - ENDCIRCLE_SIZE_STEP > ENDCIRCLE_SIZE
            ? this.gameoverCircle.size - ENDCIRCLE_SIZE_STEP
            : ENDCIRCLE_SIZE;
      }, ENDCIRCLE_INTERVAL);
    }, ENDCIRCLE_TIMEOUT);

    const nextStage = isSuccessful
      ? this.curStage == TOTAL_STAGES
        ? -1
        : this.curStage + 1
      : this.curStage;
    setTimeout(() => {
      this.stageLoaded = false;

      clearInterval(this.gameoverInterval);
      this.gameoverCircle = {
        size: CANVAS_WIDTH * 3.5,
        weight: ENDCIRCLE_WEIGHT,
      };

      if (nextStage > 0) {
        this.curStage = nextStage;
        this.setupStage();
        this.setStatus(STATUS.ready);
        if (!isSuccessful) {
          this.trials++;
          if (this.trials > TOTAL_LIVES) {
            this.sounds['theEnd'].play();
            this.buttonImg = this.buttons['gameover'];
            this.setStatus(STATUS.theEnd);
            this.setGameSummaryStartingPoint();
          }
        }
      } else {
        this.sounds['allClear'].play();
        this.buttonImg = this.buttons['congratulations'];
        this.setStatus(STATUS.allCleared);
        this.setGameSummaryStartingPoint();
      }
    }, ENDCIRCLE_TIMEOUT * 2 + TIMEBUFFER);
  }

  update(source, ...args) {
    if (source.includes('gameover') && this.getStatus() != STATUS.gameover) {
      this.setStatus(STATUS.gameover);
      this.buttonImg = this.buttons['retryButton'];

      this.sounds['titleTheme'].stop();
      this.sounds['gameOver'].play();

      this.animateEndingMotion(false);
    } else if (
      source.includes('succeed') &&
      this.getStatus() != STATUS.succeed
    ) {
      this.setStatus(STATUS.succeed);
      this.sounds['titleTheme'].stop();
      this.sounds['courseClear'].play();
      this.buttonImg = this.buttons['continueButton'];

      this.animateEndingMotion(true);
    }
  }
}

export { GameManager };
