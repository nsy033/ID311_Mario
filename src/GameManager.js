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
  BTN_HEIGHT,
} from './Constants';
import { Block, Grass } from '../src/Block';
import { Star, StarBlock } from '../src/Star';
import { Fire, Thorn } from '../src/Obstacle.js';
import { Pipe } from './Pipe';
import { Mario } from '../src/Mario.js';
import { MapFactory } from '../src/Map.js';

class GameManager {
  // GameManager who controls overall game progress
  // ; drawing buttons, playing sounds, managing states, ...

  constructor(sounds) {
    this.sounds = sounds;

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

    this.gameStart = true; // to check whether this is the very beginning of this game
    this.trials = 1; // how many trials the player have done

    this.gameoverCircle = {
      size: CANVAS_WIDTH * 3.5,
      weight: ENDCIRCLE_WEIGHT,
    };

    this.status = STATUS.ready; // game status
    this.curStage = 1; // current stage
    this.stageLoaded = false; // check whether the map is already been loaded
    this.map = []; // already loaded map from MapFactory
    this.tiles = []; // already loaded tiles from MapFactory
  }

  static getInstance(sounds) {
    // Singleton pattern
    if (!this._instance) this._instance = new GameManager(sounds);
    return this._instance;
  }

  setupStage() {
    // set up the current stage in the first time
    const curStage = this.curStage;
    const { map, directions, startPos } =
      MapFactory.getInstance().createMap(curStage);

    // initialize mario's state
    const mario = Mario.getInstance();
    mario.setPosition(...startPos);
    mario.unsubscribeAll();
    mario.beStable();

    // create each corresponding object in each tile
    const tiles = [];
    const fires = [];

    /*
      Subject-Observer pattern
      (ii. and iii., iv. and v. for messaging with each other)
      i. gameManager(this) observes each environmental object
      ii. each environmental object observes Mario
      iii. Mario observes each environmental object
    */
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

    /*
      Subject-Observer pattern
      iv. each environmental object observes fire
      v. fire observes each environmental object
    */
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

    // store this stage's cache
    this.stageLoaded = true;
    this.map = map;
    this.tiles = tiles;

    return [map, tiles];
  }

  getStatus() {
    // return current game status; gameover, ready, succeed, ...
    return this.status;
  }
  getStageSetup() {
    // if the stage is already loaded before, just return the cached map and tiles
    // else setup the stage newly, and return the results
    if (this.stageLoaded) return [this.map, this.tiles];
    else return this.setupStage();
  }
  getStarted() {
    if (this.getStatus() != STATUS.alive) {
      // update the game status as alive and play the titleTheme sound
      this.status = STATUS.alive;
      this.sounds['titleTheme'].loop();
    }
  }
  getButton() {
    // return which button to display; gameStart, continue, retry, ...
    return this.buttonImg;
  }

  drawStageInfo() {
    // draw basic stage info at the top of the screen
    textFont('Silkscreen');
    textSize(25);
    textAlign(CENTER, TOP);

    fill(255);
    noStroke();

    // about how many lives are left, out of total
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

    // about which stage is the player in, out of total
    text(
      `STAGE\t${this.curStage} / ${TOTAL_STAGES}`,
      CANVAS_WIDTH / 2,
      HALF_TILE_SIZE
    );

    // about how many trials the player has done
    text(`TRIAL\t${this.trials}`, CANVAS_WIDTH - TILE_SIZE * 2, HALF_TILE_SIZE);
  }

  drawEnding({ x, y }) {
    // draw the masked circle focusing on Mario, when the stage ends
    noFill();
    stroke(0);
    strokeWeight(ENDCIRCLE_WEIGHT);
    ellipseMode(CENTER);
    ellipse(x, y, this.gameoverCircle.size, this.gameoverCircle.size);
  }
  animateEndingMotion() {
    // change the masked circles size according to time
    setTimeout(() => {
      this.gameoverInterval = setInterval(() => {
        this.gameoverCircle.size =
          this.gameoverCircle.size - ENDCIRCLE_SIZE_STEP > ENDCIRCLE_SIZE
            ? this.gameoverCircle.size - ENDCIRCLE_SIZE_STEP
            : ENDCIRCLE_SIZE;
      }, ENDCIRCLE_INTERVAL);
    }, ENDCIRCLE_TIMEOUT);
  }

  setGameSummaryStartingPoint() {
    // set the top y coordinate of the ending credits according to time
    this.yStartingPoint = CANVAS_HEIGHT / 1.5;

    setInterval(() => {
      if (this.yStartingPoint > 0) this.yStartingPoint--;
    }, 10);
  }

  goNextStage(isSuccessful) {
    // check which stage to go according to
    // i. whether previous trial was successful and ii. which stage is the player in
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
        // if there is any stage remaininging to go
        this.curStage = nextStage;
        this.setupStage();
        this.status = STATUS.ready;

        // update total trials if the previous trial was not succeessful
        if (!isSuccessful) {
          this.trials++;
          // if the trial count exceed the total lives given, it is gameover completely
          if (this.trials > TOTAL_LIVES) {
            this.sounds['theEnd'].play();
            this.buttonImg = this.buttons['gameover'];
            this.status = STATUS.theEnd;
            this.setGameSummaryStartingPoint();
          }
        }
      } else {
        // if there is no any stage remaininging to go, it is gameclear completely
        this.sounds['allClear'].play();
        this.buttonImg = this.buttons['congratulations'];
        this.status = STATUS.allCleared;
        this.setGameSummaryStartingPoint();
      }
    }, ENDCIRCLE_TIMEOUT * 2 + TIMEBUFFER);
  }

  drawEndingCredits() {
    // black out the screen
    fill(0);
    noStroke();
    rect(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);

    // show message with jittering; gameover or congratulations
    const btnImg = this.buttonImg;
    const btnRatio = btnImg.width / btnImg.height;
    const jitter = { x: random(-1, 1), y: random(-1, 1) };
    image(
      btnImg,
      CANVAS_WIDTH / 2 + jitter.x,
      CANVAS_HEIGHT / 2 + jitter.y - TILE_SIZE * 1.5 + this.yStartingPoint,
      Math.floor(BTN_HEIGHT * btnRatio),
      BTN_HEIGHT
    );

    fill(255);
    noStroke();

    // show the game play summary texts
    textAlign(LEFT, TOP);
    text(
      `UPTO STAGE\t ${this.curStage} / ${TOTAL_STAGES}`,
      CANVAS_WIDTH / 2.75,
      CANVAS_HEIGHT / 2 + HALF_TILE_SIZE + this.yStartingPoint
    );
    text(
      `TRIAL\t ${this.trials - Number(this.status == STATUS.theEnd)}`,
      CANVAS_WIDTH / 2.75,
      CANVAS_HEIGHT / 2 + TILE_SIZE * 1.5 + this.yStartingPoint
    );
    text(
      `LIFE`,
      CANVAS_WIDTH / 2.75,
      CANVAS_HEIGHT / 2 + TILE_SIZE * 2.5 + this.yStartingPoint
    );

    // draw lives left with drawing hearts
    const heartOnCnt = Math.min(TOTAL_LIVES - this.trials + 1, TOTAL_LIVES);
    for (let i = 1; i <= TOTAL_LIVES; i++) {
      image(
        i <= heartOnCnt ? this.hearts['on'] : this.hearts['off'],
        CANVAS_WIDTH / 2.3 + TILE_SIZE * i * 0.75,
        CANVAS_HEIGHT / 2 + TILE_SIZE * 2.75 + this.yStartingPoint,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }

  update(source, ...args) {
    if (source.includes('gameover') && this.getStatus() != STATUS.gameover) {
      // if any obstacle said that the player failed this stage
      this.status = STATUS.gameover;
      this.buttonImg = this.buttons['retryButton'];

      // play gameover sounds
      this.sounds['titleTheme'].stop();
      this.sounds['gameOver'].play();
      // show ending motion of masked circle
      this.animateEndingMotion();
      // make the player to retry
      this.goNextStage(false);
    } else if (
      source.includes('succeed') &&
      this.getStatus() != STATUS.succeed
    ) {
      // if star-related-object said that the player succeeded this stage
      this.status = STATUS.succeed;
      this.buttonImg = this.buttons['continueButton'];

      // play courseClear sounds
      this.sounds['titleTheme'].stop();
      this.sounds['courseClear'].play();

      // show ending motion of masked circle
      this.animateEndingMotion();
      // make the player to go to the next stage
      this.goNextStage(true);
    }
  }
}

export { GameManager };
